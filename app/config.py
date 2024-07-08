import os
from datetime import timedelta

# Determine the current directory and its parent directory
CURRENT_DIR = os.path.dirname(__file__)
PARENT_DIR = os.path.abspath(os.path.dirname(CURRENT_DIR))

# Construct the SQLite database URI based on the parent directory
DB_URI = "sqlite:///" + os.path.join(PARENT_DIR, "data.db")

class Config:
    # Application configuration settings
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev")  # Secret key for session management
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev")  # Secret key for JWT
    SQLALCHEMY_DATABASE_URI = os.environ.get("DB_URL", DB_URI)  # Database connection URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable modification tracking
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)  # JWT access token expiration time
# End of configuration settings
