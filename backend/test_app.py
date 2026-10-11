import hashlib
import unittest
from datetime import date, datetime
from unittest.mock import patch

from app import SESSION_COOKIE, app


SESSION_TOKEN = "test-session-token"
SESSION_HASH = hashlib.sha256(SESSION_TOKEN.encode("utf-8")).hexdigest()
SESSION_USER = {
    "id": 41,
    "name": "Test Learner",
    "institution": "Test University",
    "email": "test@example.com",
    "phone": "+10000000000",
}


class FakeCursor:
    def __init__(self, database):
        self.database = database
        self.result = None

    def execute(self, query, params=None):
        self.database.queries.append((query, params))
        if "FROM auth_sessions" in query:
            self.result = (
                SESSION_USER
                if params == (SESSION_HASH,)
                else None
            )
        elif "GROUP BY activity_id" in query:
            self.result = [{"activity_id": "merge-sort"}]
        elif "SELECT DISTINCT completion_date" in query:
            self.result = [{"completion_date": date(2026, 10, 7)}]
        elif "ORDER BY completed_at DESC" in query:
            self.result = {
                "activity_id": "merge-sort",
                "completed_at": datetime(2026, 10, 7, 12, 30),
            }
        elif "INSERT IGNORE INTO activity_completions" in query:
            self.database.insert_params = params
            self.result = None
        else:
            self.result = None

    def fetchone(self):
        return self.result

    def fetchall(self):
        return self.result

    def close(self):
        pass


class FakeConnection:
    def __init__(self, database):
        self.database = database

    def cursor(self, dictionary=False):
        return FakeCursor(self.database)

    def commit(self):
        self.database.committed = True

    def rollback(self):
        self.database.rolled_back = True

    def is_connected(self):
        return True

    def close(self):
        pass


class FakeDatabase:
    def __init__(self):
        self.queries = []
        self.insert_params = None
        self.committed = False
        self.rolled_back = False

    def connect(self):
        return FakeConnection(self)


class LearnerProgressApiTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.database = FakeDatabase()
        self.connection_patch = patch(
            "app.get_db_connection",
            side_effect=self.database.connect,
        )
        self.connection_patch.start()
        self.addCleanup(self.connection_patch.stop)
        self.client = app.test_client()
        self.client.set_cookie(SESSION_COOKIE, SESSION_TOKEN)

    def test_progress_is_read_from_authenticated_user(self):
        response = self.client.get("/api/progress?userId=99")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json(),
            {
                "success": True,
                "completedActivities": ["merge-sort"],
                "activityDays": ["2026-10-07"],
                "lastActivity": {
                    "id": "merge-sort",
                    "completedAt": "2026-10-07T12:30:00",
                },
            },
        )
        self.assertTrue(
            any(
                "WHERE user_id = %s" in query and params == (SESSION_USER["id"],)
                for query, params in self.database.queries
            )
        )

    def test_completion_write_uses_authenticated_user_not_request_user_id(self):
        response = self.client.post(
            "/api/progress/completions",
            json={"activityId": "bubble-sort", "userId": 99},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            self.database.insert_params,
            (SESSION_USER["id"], "bubble-sort"),
        )
        self.assertTrue(self.database.committed)

    def test_progress_requires_a_valid_session(self):
        self.client.delete_cookie(SESSION_COOKIE)

        response = self.client.get("/api/progress")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_progress_rejects_an_unknown_session_token(self):
        self.client.set_cookie(SESSION_COOKIE, "not-a-valid-session")

        response = self.client.get("/api/progress")

        self.assertEqual(response.status_code, 401)

    def test_unknown_activity_is_rejected(self):
        response = self.client.post(
            "/api/progress/completions",
            json={"activityId": "not-an-algorithm"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIsNone(self.database.insert_params)

    def test_cross_origin_completion_is_rejected(self):
        response = self.client.post(
            "/api/progress/completions",
            json={"activityId": "bubble-sort"},
            headers={"Origin": "https://attacker.example"},
        )

        self.assertEqual(response.status_code, 403)
        self.assertIsNone(self.database.insert_params)

    def test_preview_origin_receives_credentialed_cors_headers(self):
        response = self.client.get(
            "/api/auth/session",
            headers={"Origin": "http://127.0.0.1:4173"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers["Access-Control-Allow-Origin"],
            "http://127.0.0.1:4173",
        )
        self.assertEqual(response.headers["Access-Control-Allow-Credentials"], "true")


if __name__ == "__main__":
    unittest.main()
