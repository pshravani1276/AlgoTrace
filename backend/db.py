import os
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))


class DatabaseConfigurationError(RuntimeError):
    pass


def get_db_connection():
    required_settings = ("DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME")
    missing_settings = [
        setting for setting in required_settings if not os.getenv(setting)
    ]
    if missing_settings:
        raise DatabaseConfigurationError(
            "Missing database configuration: " + ", ".join(missing_settings)
        )

    configuration = {
        "host": os.environ["DB_HOST"],
        "port": int(os.getenv("DB_PORT", "3306")),
        "user": os.environ["DB_USER"],
        "password": os.environ["DB_PASSWORD"],
        "database": os.environ["DB_NAME"],
        "connection_timeout": 10,
    }
    ssl_ca = os.getenv("DB_SSL_CA")
    if ssl_ca:
        configuration.update(
            ssl_ca=ssl_ca,
            ssl_verify_cert=True,
            ssl_verify_identity=True,
        )
    elif os.getenv("APP_ENV") == "production":
        raise DatabaseConfigurationError(
            "DB_SSL_CA is required for production MySQL connections."
        )

    return mysql.connector.connect(**configuration)
