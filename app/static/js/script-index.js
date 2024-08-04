const BASE_URL = "http://127.0.0.1:5000";

// get access when have accessToken
window.addEventListener("load", function () {
  if (!localStorage.getItem("accessToken")) {
    window.location.replace(BASE_URL + "/login");
  }
});

// handle logout and remove accessToken
const logout = document.getElementById("logout");
logout.addEventListener("click", function (event) {
  event.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", BASE_URL + "/api/auth/logout");
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      localStorage.removeItem("accessToken");
      window.location.replace(BASE_URL + "/login");
    } else {
      const toastLive = document.getElementById("toastLive");
      const toastBody = document.getElementById("toastBody");
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

      toastBody.innerHTML = "Oops! Something went wrong";
      toastBootstrap.show();
    }
  });
  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("accessToken")
  );
  xhr.send();
});

// handle api for get all projects and storage to localStorage
window.addEventListener("load", function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", BASE_URL + "/api/projects");
  xhr.addEventListener("load", function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
      const response = JSON.parse(xhr.responseText).data;
      const selectProject = document.getElementById("selectProject");
      const option = document.createElement("option");
      option.setAttribute("value", "all");
      option.text = "All Project";
      selectProject.options.add(option);

      // refresh localStorage for item projects
      localStorage.removeItem("projects");
      localStorage.setItem("projects", JSON.stringify(response));

      for (let i = 0; i < response.length; i++) {
        const option = document.createElement("option");
        option.setAttribute("value", response[i].id);
        option.text = response[i].title;

        selectProject.options.add(option);
      }

      selectProject.addEventListener("change", function (event) {
        event.preventDefault();
        const id = event.target.value;

        if (id == "all") {
          localStorage.removeItem("projectFilter");
          window.location.reload();
        } else {
          localStorage.removeItem("projectFilter");
          localStorage.setItem("projectFilter", id);
          window.location.reload();
        }
      });
    }
  });

  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("accessToken")
  );
  xhr.send();
});

// handle api for get all tasks
const todoItem = document.getElementById("todoItem");
const doneItem = document.getElementById("doneItem");
window.addEventListener("load", function () {
  if (!localStorage.getItem("projectFilter")) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", BASE_URL + "/api/tasks");
    xhr.addEventListener("load", function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        const response = JSON.parse(xhr.responseText).data;
        for (let i = 0; i < response.length; i++) {
          const cardWrap = document.createElement("div");
          const card = document.createElement("div");
          const cardHeader = document.createElement("div");
          const cardTitle = document.createElement("h5");
          const selectProject = document.createElement("h5");
          const cardBody = document.createElement("div");
          const cardText = document.createElement("p");
          const btnWrap = document.createElement("div");
          const btnEdit = document.createElement("button");
          const btnDelete = document.createElement("button");
          const btnDone = document.createElement("button");

          // Set Attribute
          cardWrap.setAttribute("class", "d-flex flex-column");
          card.setAttribute("class", "card mb-3");
          cardHeader.setAttribute(
            "class",
            "card-header d-flex justify-content-between"
          );
          cardTitle.setAttribute("class", "mb-0");
          cardTitle.innerHTML = response[i].title;
          selectProject.setAttribute("class", "badge text-bg-info mb-0");
          cardBody.setAttribute("class", "card-body");
          cardText.setAttribute("class", "card-text");
          cardText.innerHTML = response[i].description;
          btnWrap.setAttribute("class", "d-grid gap-2 d-md-block");
          btnEdit.setAttribute("class", "btn btn-primary mx-1");
          btnEdit.setAttribute("type", "button");
          btnEdit.setAttribute("data-bs-toggle", "modal");
          btnEdit.setAttribute("data-bs-target", "#modalTaskEdit");
          btnEdit.setAttribute("data-title", response[i].title);
          btnEdit.setAttribute("data-description", response[i].description);
          btnEdit.setAttribute("data-id", response[i].id);
          btnEdit.innerHTML = "EDIT";
          btnDelete.setAttribute("class", "btn btn-danger mx-1");
          btnDelete.setAttribute("type", "button");
          btnDelete.setAttribute("data-bs-toggle", "modal");
          btnDelete.setAttribute("data-bs-target", "#modalTaskDelete");
          btnDelete.setAttribute("data-id", response[i].id);
          btnDelete.innerHTML = "DELETE";
          btnDone.setAttribute("type", "button");
          btnDone.setAttribute("data-id", response[i].id);
          btnDone.setAttribute("data-task-done", response[i].is_done);

          // Append Child
          btnWrap.appendChild(btnEdit);
          btnWrap.appendChild(btnDelete);
          btnWrap.appendChild(btnDone);
          cardBody.appendChild(cardText);
          cardBody.appendChild(btnWrap);
          cardHeader.appendChild(cardTitle);
          cardHeader.appendChild(selectProject);
          card.appendChild(cardHeader);
          card.appendChild(cardBody);
          cardWrap.appendChild(card);

          // get project title from localStorage
          const projects = JSON.parse(localStorage.getItem("projects"));
          for (let x = 0; x < projects.length; x++) {
            if (response[i].project_id == projects[x].id) {
              selectProject.innerHTML = projects[x].title;
            }
          }

          // logic for finish and unfinish the task
          if (response[i].is_done) {
            btnDone.setAttribute("class", "btn btn-warning mx-1 btn-done");
            btnDone.innerHTML = "UNFINISH";
            doneItem.append(cardWrap);
          } else {
            btnDone.setAttribute("class", "btn btn-success mx-1 btn-done");
            btnDone.innerHTML = "FINISH";
            todoItem.append(cardWrap);
          }
        }

        const btnDone = document.getElementsByClassName("btn-done");
        for (let i = 0; i < btnDone.length; i++) {
          btnDone[i].addEventListener("click", function (event) {
            event.preventDefault();
            const id = JSON.parse(this.dataset.id);
            const taskDone = this.dataset.taskDone === "true";

            const data = JSON.stringify({
              is_done: !taskDone,
            });
