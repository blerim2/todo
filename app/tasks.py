from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import NoResultFound
from app import db
from app.models import Task, Project

bp = Blueprint("task", __name__, url_prefix="/api/tasks")


@bp.route("/", methods=["POST"])
@jwt_required()
def create_task():
    # get request
    data = request.get_json()
    title = data.get("title", None)
    description = data.get("description", None)
    project_id = data.get("project_id", None)
    user_id = get_jwt_identity()
    
    # validate fileds
    if not title or not project_id:
        return jsonify({"message": "Title and Project_ID is required!"}), 400

   

    # get all projects generated from user
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # get all ids from projects
    project_arr = [project.serialize() for project in projects]
    project_id_all = []
    for i in range(0, len(project_arr)):
        project_id_all.append(project_arr[i]["id"])