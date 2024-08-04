from flask import Blueprint, render_template

bp = Blueprint("main", __name__, url_prefix="")


@bp.route("/login", methods=["GET"])
def login():
    return render_template("auth/login.html")


@bp.route("/register", methods=["GET"])
def register():
    return render_template("auth/register.html")


@bp.route("/project", methods=["GET"])
def project():
    return render_template("project.html")


@bp.route("/", methods=["GET"])
def index():
    return render_template("index.html")