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
        
    # validate fields, can't use another user project's
    if project_id not in project_id_all:
        return jsonify({"message": "Don't have permission to use the project_id"}), 403

    # insert into db
    task = Task(title=title, description=description, project_id=project_id)
    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task successfully created"}), 201


@bp.route("/", methods=["GET"])
@jwt_required()
def get_all_task():
    # get user_id
    user_id = get_jwt_identity()


    # get all projects generated from user
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # get all ids from projects
    project_arr = [project.serialize() for project in projects]
    project_id_all = []
    for i in range(0, len(project_arr)):
        project_id_all.append(project_arr[i]["id"])

    # get all tasks from filtered project id
    task_by_project = []
    for i in range(0, len(project_id_all)):
        tasks = db.session.execute(
            db.select(Task).filter_by(project_id=project_id_all[i])
        ).scalars()
        for task in tasks:
            task_by_project.append(task.serialize())

    return jsonify({"data": task_by_project}), 200

@bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_task(id):
    # get request
    data = request.get_json()
    title = data.get("title", None)
    description = data.get("description", None)
    project_id = data.get("project_id")
    user_id = get_jwt_identity()

    # validate fileds
    if not title or not project_id:
        return jsonify({"message": "Title and Project_ID is required!"}), 400

    # handle err when task not found
    try:
        task = db.session.execute(db.select(Task).filter_by(id=id)).scalar_one()
    except NoResultFound:
        return jsonify({"message": "Task not found!"}), 404

    # get all projects generated from user
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # get all ids from projects
    project_arr = [project.serialize() for project in projects]
    project_id_all = []
    for i in range(0, len(project_arr)):
        project_id_all.append(project_arr[i]["id"])

    # validate fields, can't use another user project's
    if project_id not in project_id_all:
        return jsonify({"message": "Don't have permission to use the project_id"}), 403
    
    # get all tasks from filtered project id
    task_by_project = []
    for i in range(0, len(project_id_all)):
        tasks = db.session.execute(
            db.select(Task).filter_by(project_id=project_id_all[i])
        ).scalars()
        for task_ in tasks:
            task_by_project.append(task_.serialize())

    # get all id of tasks generated from current
    task_id_all = []
    for i in range(0, len(task_by_project)):
        task_id_all.append(task_by_project[i]["id"])

    # validate url paramter, can't modify the task when the user doesn't have it
    if id not in task_id_all:
        return jsonify({"message": "Don't have permission to modify this Task"}), 403

    # updating data in db
    task.title = title
    task.description = description
    task.project_id = project_id
    db.session.commit()

    return jsonify({"message": "Task updated successfully"}), 200

@bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_project(id):
    # get identity
    user_id = get_jwt_identity()

    # handle err when task not found
    try:
        task = db.session.execute(db.select(Task).filter_by(id=id)).scalar_one()
    except NoResultFound:
        return jsonify({"message": "Task not found!"}), 404



    # get all projects generated from user
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # get all ids from projects
    project_arr = [project.serialize() for project in projects]
    project_id_all = []
    for i in range(0, len(project_arr)):
        project_id_all.append(project_arr[i]["id"])

    # get all tasks from filtered project id
    task_by_project = []
    for i in range(0, len(project_id_all)):
        tasks = db.session.execute(
            db.select(Task).filter_by(project_id=project_id_all[i])
        ).scalars()
        for task_ in tasks:
            task_by_project.append(task_.serialize())
    # get all id of tasks generated from current
    task_id_all = []
    for i in range(0, len(task_by_project)):
        task_id_all.append(task_by_project[i]["id"])

    # validate url paramter, can't modify the task when the user doesn't have it
    if id not in task_id_all:
        return jsonify({"message": "Don't have permission to modify this Task"}), 403

    # delete data in db
    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task successfully deleted!"}), 200


@bp.route("/status/<int:id>", methods=["PUT"])
@jwt_required()
def update_status(id):
    # get request
    data = request.get_json()
    is_done = data.get("is_done", None)
    user_id = get_jwt_identity()

    # handle err when task not found
    try:
        task = db.session.execute(db.select(Task).filter_by(id=id)).scalar_one()
    except NoResultFound:
        return jsonify({"message": "Task not found!"}), 404



    # get all projects generated from user
    projects = db.session.execute(
        db.select(Project).filter_by(user_id=user_id)
    ).scalars()

    # get all ids from projects
    project_arr = [project.serialize() for project in projects]
    project_id_all = []
    for i in range(0, len(project_arr)):
        project_id_all.append(project_arr[i]["id"])

    # get all tasks from filtered project id
    task_by_project = []
    for i in range(0, len(project_id_all)):
        tasks = db.session.execute(
            db.select(Task).filter_by(project_id=project_id_all[i])
        ).scalars()
        for task_ in tasks:
            task_by_project.append(task_.serialize())

    # get all id of tasks generated from current
    task_id_all = []
    for i in range(0, len(task_by_project)):
        task_id_all.append(task_by_project[i]["id"])

    # validate url paramter, can't modify the task when the user doesn't have it
    if id not in task_id_all:
        return jsonify({"message": "Don't have permission to modify this Task"}), 403

    # updating task.is_done in db
    task.is_done = is_done
    db.session.commit()

    return jsonify({"message": "Status updated successfully"}), 200
