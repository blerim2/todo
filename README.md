# TODO APP FLASK API

## Background

This our final project, create a simple todo app using a minimalis frontend (html, css, js and bootstrap framework) with minimalis backend (flask framework).

And for deployment is use Docker and Docker Compose.

## Requirements

- Web Browser (Chrome, Firefox etc.)
- Text Editor (VSCode, Neovim, Nano, etc.)
- Python 3.8 or higher
- Sqlite3
- Docker
- Docker Compose

## Objective

- Apply my skills to create a simple frontend app using html, css, js and bootstrap framework
- Apply my skills to create a simple backend using flask framework
- Apply my skills to consume API use AJAX
- Using Dockerfile to create a custome images for flask app
- Compose service using Docker Compose
- Create a scheduling job using crontab

## Folder Structure

```
.
├── app (main package for flask)
│   ├── auth.py (API endpoints for auth)
│   ├── config.py (config for database and jwt token)
│   ├── __init__.py (initialization flask app)
│   ├── models.py (contains table structures and relationships)
│   ├── projects.py (API endpoints for projects)
│   ├── static (contains the static file (css/js))
│   │   └── js
│   │       ├── script-index.js
│   │       ├── script-login.js
│   │       ├── script-project.js
│   │       └── script-register.js
│   ├── tasks.py (API endpoints for tasks)
│   ├── templates (contains the html files)
│   │   ├── auth
│   │   │   ├── base.html
│   │   │   ├── login.html
│   │   │   └── register.html
│   │   ├── base.html
│   │   ├── index.html
│   │   └── project.html
│   └── views.py (route for rendering templates)
├── docker-compose.yml (deploy flask and postgres services)
├── Dockerfile (create a flask custom images)
├── images (list images for documentation)
│   ├── login-page.png
│   ├── project-add.png
│   ├── project-delete.png
│   ├── project-edit.png
│   ├── projects-list.png
│   ├── registration-page.png
│   ├── task-add.png
│   ├── task-delete.png
│   ├── task-edit.png
│   ├── tasks-filter.png
│   └── tasks-list.png
├── README.md (documentation file for github)
├── requirements.txt (list third party packages used by flask app)
├── run.py (python file for running flask app)
└── script (contains script for backup, copy and restore file from container)
    ├── backup.sh
    ├── copy.sh
    └── restore.sh
```

## Features

#### Registration Page

![Registration Page](images/registration-page.png?raw=true "Registration Page")

#### Login Page

![Login Page](images/login-page.png?raw=true "Login Page")

#### Project Page

- List of projects
  ![List of project](images/projects-list.png?raw=true "List of project")
- Added new project
  ![Added new project](images/project-add.png?raw=true "Added new project")
- Edit project
  ![Edit Project](images/project-edit.png?raw=true "Edit Project")
- Delete project
  ![Delete Project](images/project-delete.png?raw=true "Delete Project")

#### Todo Page (Home)

- List of tasks
  ![List of tasks](images/tasks-list.png?raw=true "List of tasks")
- Added new task
  ![Added new task](images/task-add.png?raw=true "Added new task")
- Delete task
  ![Delete task](images/task-delete.png?raw=true "Delete task")

## Setup Project

- Clone this repository

```
# clone using ssh
git clone git@github.com:blerim2/todo.git

#clone using https
git clone https://github.com/blerim2/todo.git
```

- Change directory to this repository

```
cd todo-flask
```

## Running Project

##### Without Container

- Create virtual environment

```
python -m venv .venv
```

- Use the virtual environment

```
source .venv/bin/activate
```

- Install third party packages from requirements.txt

```
pip install -r requirements.txt
```

- Run this project

```
python run.py
```

##### With Docker Compose

- Run docker compose

```
docker compose up -d
```
