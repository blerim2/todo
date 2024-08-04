from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError, NoResultFound
from app import db
from app.models import Project, Task

bp = Blueprint("project", __name__, url_prefix="/api/projects")


@bp.route("/", methods=["POST"])
@jwt_required()
def create_project():
    # get request
    data = request.get_json()
    title = data.get("title", None)
    description = data.get("description", None)
    user_id = get_jwt_identity()

    # validation fields
    if not title:
        return jsonify({"message": "Title is required!"}), 400

    # insert into db
    project = Project(title=title, description=description, user_id=user_id)
    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project created successfully"}), 201


@bp.route("/", methods=["GET"])
@jwt_required()
def get_all_project():
    # get user_id
    user_id = get_jwt_identity()

    # query db and filter by user_id
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # convert object to json (serialize)
    data = [project.serialize() for project in projects]

    return jsonify({"data": data}), 200


@bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_project(id):
    # get request
    data = request.get_json()
    title = data.get("title", None)
    description = data.get("description", None)
    user_id = get_jwt_identity()

    # handle err when project not found
    try:
        project = db.session.execute(db.select(Project).filter_by(id=id)).scalar_one()
    except NoResultFound:
        return jsonify({"message": "Project not found!"}), 404

    # validation fields and parameter
    if not title:
        return jsonify({"message": "Title is required"}), 400
    if project.user_id is not user_id:
        return jsonify({"message": "Don't have permission to modify this Project"}), 403

    # updating data in db
    project.title = title
    project.description = description
    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project updated successfully"}), 200


@bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_project(id):
    # get request
    user_id = get_jwt_identity()

    # handle err when project not found
    try:
        project = db.session.execute(db.select(Project).filter_by(id=id)).scalar_one()
    except NoResultFound:
        return jsonify({"message": "Project not found!"}), 404

    # validation fields and parameter
    if project.user_id is not user_id:
        return jsonify({"message": "Don't have permission to modify this Project"}), 403

    # delete data in db
    try:
        db.session.delete(project)
        db.session.commit()
    except IntegrityError:
        return jsonify({"message": "Project is used! cannot be deleted"}), 422

    return jsonify({"message": "Project deleted successfully!"}), 200


@bp.route("/<int:id>/tasks")
@jwt_required()
def task_filtered(id):
    # get user_id
    user_id = get_jwt_identity()

    """
        Logika untuk mendapatkan filter project dengan current user
        & filter task dengan project yang sudah di filter
        - Query Project filter_by user yang login (user_id)
        - Buat array untuk menampung semua Project yang difilter
          ambil hanya id saja
        - validasi, user hanya dapat melihat task dari project yang dibuatnya
    """

    # get all projects generated from user
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # get all ids from projects
    project_arr = [project.serialize() for project in projects]
    project_id_all = []
    for i in range(0, len(project_arr)):
        project_id_all.append(project_arr[i]["id"])

    # validation, user can only see task of project has created
    if id not in project_id_all:
        return jsonify({"message": "Don't have permission to show this Task!"}), 403

    # filter Task by project_id
    tasks = db.session.execute(db.select(Task).filter_by(project_id=id)).scalars()
    data = [task.serialize() for task in tasks]

    return jsonify({"data": data}), 200