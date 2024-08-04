from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    jwt_required,
)
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from app import db, jwt
from app.models import User, TokenBlocklist

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/register", methods=["POST"])
def register():
    # get request
    data = request.get_json()
    username = data.get("username", None)
    email = data.get("email", None)
    password = data.get("password", None)

    # validation fields
    if not username or not email or not password:
        return jsonify({"message": "Username or Email or Password is required!"}), 400

    # try push data to database
    try:
        user = User(
            username=username, email=email, password=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        return (
            jsonify(
                {
                    "message": f"Email {email} already exists!, please use another Email! "
                }
            ),
            422,
        )

    return (
        jsonify({"message": f"Congratulations {email}, your account has been created"}),
        200,
    )
