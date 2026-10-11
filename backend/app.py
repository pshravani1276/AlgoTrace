import hashlib
import os
import re
import secrets
from datetime import timedelta
from functools import wraps

import bcrypt
import mysql.connector
from flask import Flask, g, jsonify, request
from flask_cors import CORS

from db import DatabaseConfigurationError, get_db_connection


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

SESSION_COOKIE = "algotrace_session"
SESSION_DURATION = timedelta(days=30)
SESSION_MAX_AGE = int(SESSION_DURATION.total_seconds())
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ALLOWED_PHONE_CHARS = set("0123456789+ -()")
ALLOWED_ACTIVITIES = {
    "bubble-sort",
    "merge-sort",
    "binary-search",
    "linear-search",
    "jump-search",
    "interpolation-search",
    "exponential-search",
    "fibonacci-search",
    "hash-search",
}
FRONTEND_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5174,http://127.0.0.1:5174,"
        "http://localhost:4173,http://127.0.0.1:4173",
    ).split(",")
    if origin.strip()
]
if os.getenv("APP_ENV") == "production" and not os.getenv("FRONTEND_ORIGINS"):
    raise RuntimeError("FRONTEND_ORIGINS must be explicitly configured in production.")
COOKIE_SECURE = os.getenv(
    "COOKIE_SECURE",
    "true" if os.getenv("APP_ENV") == "production" else "false",
).lower() in {"1", "true", "yes"}
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "Lax")

if COOKIE_SAMESITE not in {"Lax", "Strict", "None"}:
    raise RuntimeError("COOKIE_SAMESITE must be Lax, Strict, or None.")
if COOKIE_SAMESITE == "None" and not COOKIE_SECURE:
    raise RuntimeError("COOKIE_SECURE must be enabled when COOKIE_SAMESITE=None.")

CORS(
    app,
    resources={r"/api/.*": {"origins": FRONTEND_ORIGINS}},
    supports_credentials=True,
)


@app.after_request
def set_response_security_headers(response):
    response.headers.setdefault("Cache-Control", "no-store")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return response


def error_response(message, status):
    return jsonify({"success": False, "message": message}), status


def close_database(cursor, connection):
    if cursor:
        cursor.close()
    if connection and connection.is_connected():
        connection.close()


def issue_session(cursor, user_id):
    cursor.execute(
        "DELETE FROM auth_sessions WHERE expires_at <= UTC_TIMESTAMP()"
    )
    raw_token = secrets.token_urlsafe(48)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    cursor.execute(
        """
        INSERT INTO auth_sessions (user_id, token_hash, expires_at)
        VALUES (%s, %s, UTC_TIMESTAMP() + INTERVAL 30 DAY)
        """,
        (user_id, token_hash),
    )
    return raw_token


def set_session_cookie(response, raw_token):
    response.set_cookie(
        SESSION_COOKIE,
        raw_token,
        max_age=SESSION_MAX_AGE,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )
    return response


def clear_session_cookie(response):
    response.delete_cookie(
        SESSION_COOKIE,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )
    return response


def request_origin_is_allowed():
    origin = request.headers.get("Origin")
    return origin is None or origin in FRONTEND_ORIGINS


def authenticated(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        token = request.cookies.get(SESSION_COOKIE)
        if not token:
            return error_response("Authentication required.", 401)
        if request.method not in {"GET", "HEAD", "OPTIONS"} and not request_origin_is_allowed():
            return error_response("Request origin is not allowed.", 403)

        connection = None
        cursor = None
        try:
            token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT users.id, users.name, users.institution, users.email, users.phone
                FROM auth_sessions
                JOIN users ON users.id = auth_sessions.user_id
                WHERE auth_sessions.token_hash = %s
                  AND auth_sessions.expires_at > UTC_TIMESTAMP()
                """,
                (token_hash,),
            )
            user = cursor.fetchone()
            if not user:
                return error_response("Your session has expired. Please sign in again.", 401)
            g.current_user = user
        except (mysql.connector.Error, DatabaseConfigurationError):
            app.logger.exception("Unable to validate the authenticated session.")
            return error_response("The service is temporarily unavailable.", 503)
        finally:
            close_database(cursor, connection)

        return view(*args, **kwargs)

    return wrapped


@app.get("/")
def home():
    return jsonify({"success": True, "message": "AlgoTrace backend is running"})


@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return error_response("Invalid request.", 400)

    name = str(data.get("name", "")).strip()
    institution = str(data.get("institution", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    phone = str(data.get("phone", "")).strip()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    if not name:
        return error_response("Full name is required.", 400)
    if not institution:
        return error_response("Institution is required.", 400)
    if not EMAIL_PATTERN.fullmatch(email):
        return error_response("Please enter a valid email.", 400)
    if not phone or any(char not in ALLOWED_PHONE_CHARS for char in phone):
        return error_response("Invalid phone number.", 400)
    phone_digits = "".join(char for char in phone if char.isdigit())
    if len(phone_digits) < 7 or len(phone_digits) > 15:
        return error_response("Please enter a valid phone number.", 400)
    if not isinstance(password, str) or len(password) < 8:
        return error_response("Password must contain at least 8 characters.", 400)
    if len(password.encode("utf-8")) > 72:
        return error_response("Password must be no longer than 72 bytes.", 400)
    if password != confirm_password:
        return error_response("Passwords do not match.", 400)
    if not request_origin_is_allowed():
        return error_response("Request origin is not allowed.", 403)

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")
        cursor.execute(
            """
            INSERT INTO users (name, institution, email, phone, password_hash)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (name, institution, email, phone, password_hash),
        )
        user_id = cursor.lastrowid
        raw_token = issue_session(cursor, user_id)
        connection.commit()
        response = jsonify(
            {
                "success": True,
                "message": "Account profile saved successfully.",
                "user": {
                    "id": user_id,
                    "name": name,
                    "institution": institution,
                    "email": email,
                    "phone": phone,
                },
            }
        )
        return set_session_cookie(response, raw_token), 201
    except mysql.connector.IntegrityError:
        if connection:
            connection.rollback()
        return error_response("An account with this email already exists.", 409)
    except (mysql.connector.Error, DatabaseConfigurationError):
        app.logger.exception("Registration failed due to a database error.")
        if connection:
            connection.rollback()
        return error_response("Unable to create your account right now.", 503)
    finally:
        close_database(cursor, connection)


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return error_response("Invalid request.", 400)
    email = str(data.get("email", "")).strip().lower()
    password = data.get("password", "")
    if not email or not isinstance(password, str) or not password:
        return error_response("Email and password are required.", 400)
    if not request_origin_is_allowed():
        return error_response("Request origin is not allowed.", 403)

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, name, institution, email, phone, password_hash
            FROM users
            WHERE email = %s
            """,
            (email,),
        )
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(
            password.encode("utf-8"),
            user["password_hash"].encode("utf-8"),
        ):
            return error_response("Invalid email or password.", 401)

        raw_token = issue_session(cursor, user["id"])
        connection.commit()
        response = jsonify(
            {
                "success": True,
                "message": "Login successful.",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "institution": user["institution"],
                    "email": user["email"],
                    "phone": user["phone"],
                },
            }
        )
        return set_session_cookie(response, raw_token), 200
    except (mysql.connector.Error, DatabaseConfigurationError):
        app.logger.exception("Login failed due to a database error.")
        if connection:
            connection.rollback()
        return error_response("Unable to sign in right now.", 503)
    finally:
        close_database(cursor, connection)


@app.get("/api/auth/session")
@authenticated
def session():
    return jsonify({"success": True, "user": g.current_user})


@app.post("/api/auth/logout")
@authenticated
def logout():
    token = request.cookies.get(SESSION_COOKIE)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM auth_sessions WHERE token_hash = %s",
            (token_hash,),
        )
        connection.commit()
        return clear_session_cookie(
            jsonify({"success": True, "message": "Signed out."})
        )
    except (mysql.connector.Error, DatabaseConfigurationError):
        app.logger.exception("Unable to revoke the authenticated session.")
        if connection:
            connection.rollback()
        return clear_session_cookie(
            error_response("Unable to sign out securely. Please try again.", 503)[0]
        ), 503
    finally:
        close_database(cursor, connection)


@app.get("/api/progress")
@authenticated
def get_progress():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        user_id = g.current_user["id"]
        cursor.execute(
            """
            SELECT activity_id
            FROM activity_completions
            WHERE user_id = %s
            GROUP BY activity_id
            ORDER BY MAX(completed_at) DESC
            """,
            (user_id,),
        )
        activities = [row["activity_id"] for row in cursor.fetchall()]
        cursor.execute(
            """
            SELECT DISTINCT completion_date
            FROM activity_completions
            WHERE user_id = %s
            ORDER BY completion_date
            """,
            (user_id,),
        )
        activity_days = [row["completion_date"].isoformat() for row in cursor.fetchall()]
        cursor.execute(
            """
            SELECT activity_id, completed_at
            FROM activity_completions
            WHERE user_id = %s
            ORDER BY completed_at DESC, id DESC
            LIMIT 1
            """,
            (user_id,),
        )
        last_row = cursor.fetchone()
        last_activity = (
            {
                "id": last_row["activity_id"],
                "completedAt": last_row["completed_at"].isoformat(),
            }
            if last_row
            else None
        )
        return jsonify(
            {
                "success": True,
                "completedActivities": activities,
                "activityDays": activity_days,
                "lastActivity": last_activity,
            }
        )
    except (mysql.connector.Error, DatabaseConfigurationError):
        app.logger.exception("Unable to load learner progress.")
        return error_response("Unable to load your learning progress.", 503)
    finally:
        close_database(cursor, connection)


@app.post("/api/progress/completions")
@authenticated
def complete_activity():
    data = request.get_json(silent=True)
    activity_id = data.get("activityId") if isinstance(data, dict) else None
    if not isinstance(activity_id, str) or activity_id not in ALLOWED_ACTIVITIES:
        return error_response("That learning activity is not supported.", 400)

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT IGNORE INTO activity_completions
                (user_id, activity_id, completion_date, completed_at)
            VALUES (%s, %s, UTC_DATE(), UTC_TIMESTAMP())
            """,
            (g.current_user["id"], activity_id),
        )
        connection.commit()
        return jsonify({"success": True, "activityId": activity_id})
    except (mysql.connector.Error, DatabaseConfigurationError):
        app.logger.exception("Unable to save learner activity completion.")
        if connection:
            connection.rollback()
        return error_response("Unable to save your progress. Please retry.", 503)
    finally:
        close_database(cursor, connection)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "5000")), debug=False)
