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

@bp.route("/login", methods=["POST"])
def login():
    # get request
    data = request.get_json()
    email = data.get("email", None)
    password = data.get("password", None)

    # validation fields
    if not email or not password:
        return jsonify({"message": "Email and Password is required!"}), 400

    user = User.query.filter_by(email=email).first()

    # validation, request exists in database
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Incorrect Email or Password!"}), 422

    access_token = create_access_token(identity=user.id)
    # refresh_token = create_refresh_token(identity=user.id)

    return jsonify({"access_token": access_token}), 200

@bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    token = get_jwt()
    jti = token["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"message": "Successfully logout"}), 200


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None