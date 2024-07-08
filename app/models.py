from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), nullable=False)  # User's username
    email = db.Column(db.String(128), unique=True, nullable=False)  # User's email address
    password = db.Column(db.String(128), nullable=False)  # User's hashed password
    projects = db.relationship("Project", backref="user")  # Relationship with user's projects
    # User model: Represents user data in the application.

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for the project
    title = db.Column(db.String(64), nullable=False)  # Title of the project (required)
    description = db.Column(db.String(1024))  # Optional description of the project
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)  # ID of the associated user
    tasks = db.relationship("Task", backref="project")  # Relationship with tasks related to this project

    
    # Converts a Project object to a dictionary for serialization.
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "user_id": self.user_id,
        }


# Represents a task within a project.
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique task identifier
    title = db.Column(db.String(64), nullable=False)  # Title of the task (required)
    description = db.Column(db.String(1024))  # Optional description of the task
    is_done = db.Column(db.Boolean, default=False)  # Indicates task completion status
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)  # ID of the associated project

    
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "is_done": self.is_done,
            "project_id": self.project_id,
        }


# Represents invalidated or revoked tokens stored in the database.
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for the token entry
    jti = db.Column(db.String(36), nullable=False)  # JWT (JSON Web Token) identifier
