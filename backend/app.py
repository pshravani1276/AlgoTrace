import re

import bcrypt
import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS

from db import get_db_connection


app = Flask(__name__)
CORS(app)

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ALLOWED_PHONE_CHARS = set("0123456789+ -()")


@app.get("/")
def home():
    return jsonify({
        "success": True,
        "message": "AlgoTrace backend is running",
    })


@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"success": False, "message": "Invalid request."}), 400

    name = str(data.get("name", "")).strip()
    institution = str(data.get("institution", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    phone = str(data.get("phone", "")).strip()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    if not name:
        return jsonify({"success": False, "message": "Full name is required."}), 400
    if not institution:
        return jsonify({"success": False, "message": "Institution is required."}), 400
    if not EMAIL_PATTERN.fullmatch(email):
        return jsonify({"success": False, "message": "Please enter a valid email."}), 400
    if not phone or any(char not in ALLOWED_PHONE_CHARS for char in phone):
        return jsonify({"success": False, "message": "Invalid phone number."}), 400

    phone_digits = "".join(char for char in phone if char.isdigit())
    if len(phone_digits) < 7 or len(phone_digits) > 15:
        return jsonify({"success": False, "message": "Please enter a valid phone number."}), 400
    if not isinstance(password, str) or len(password) < 8:
        return jsonify({"success": False, "message": "Password must contain at least 8 characters."}), 400
    if password != confirm_password:
        return jsonify({"success": False, "message": "Passwords do not match."}), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "message": "An account with this email already exists.",
            }), 409

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
        connection.commit()

        return jsonify({
            "success": True,
            "message": "Account profile saved successfully.",
            "user": {
                "id": cursor.lastrowid,
                "name": name,
                "institution": institution,
                "email": email,
                "phone": phone,
            },
        }), 201

    except mysql.connector.IntegrityError as error:
        print("Registration integrity error:", error)
        if connection:
            connection.rollback()
        return jsonify({
            "success": False,
            "message": "An account with this email already exists.",
        }), 409
    except mysql.connector.Error as error:
        print("Registration database error:", error)
        if connection:
            connection.rollback()
        return jsonify({"success": False, "message": "Database error."}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"success": False, "message": "Invalid request."}), 400

    email = str(data.get("email", "")).strip().lower()
    password = data.get("password", "")

    if not email or not isinstance(password, str) or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required.",
        }), 400

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
            return jsonify({
                "success": False,
                "message": "Invalid email or password.",
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "institution": user["institution"],
                "email": user["email"],
                "phone": user["phone"],
            },
        }), 200
    except mysql.connector.Error as error:
        print("Login database error:", error)
        return jsonify({"success": False, "message": "Database error."}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
