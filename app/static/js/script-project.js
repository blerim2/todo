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

// get all projects list from api
const cardWrapper = document.getElementById("cardWrapper");
window.addEventListener("load", function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", BASE_URL + "/api/projects");
  xhr.addEventListener("load", function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
      const response = JSON.parse(xhr.responseText);

      // looping data from response
      for (let i = 0; i < response.data.length; i++) {
        // create element
        const col = document.createElement("div");
        const card = document.createElement("div");
        const cardHeader = document.createElement("h5");
        const cardBody = document.createElement("div");
        const cardText = document.createElement("p");
        const cardFooter = document.createElement("div");
        const btnEdit = document.createElement("button");
        const btnDelete = document.createElement("button");

        // set setAttribute
        col.setAttribute("class", "col");
        card.setAttribute("class", "card h-100");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.innerHTML = response.data[i].title;
        cardBody.setAttribute("class", "card-body");
        cardText.setAttribute("class", "card-text");
        cardText.innerHTML = response.data[i].description;
        cardFooter.setAttribute("class", "card-footer");
        btnEdit.setAttribute("class", "btn btn-primary mx-1");
        btnEdit.setAttribute("type", "button");
        btnEdit.setAttribute("data-bs-toggle", "modal");
        btnEdit.setAttribute("data-bs-target", "#modalProjectEdit");
        btnEdit.setAttribute("data-title", response.data[i].title);
        btnEdit.setAttribute("data-description", response.data[i].description);
        btnEdit.setAttribute("data-id", response.data[i].id);
        btnEdit.innerHTML = "EDIT";
        btnDelete.setAttribute("class", "btn btn-danger mx-1");
        btnDelete.setAttribute("type", "button");
        btnDelete.setAttribute("data-bs-toggle", "modal");
        btnDelete.setAttribute("data-bs-target", "#modalProjectDelete");
        btnDelete.setAttribute("data-id", response.data[i].id);
        btnDelete.innerHTML = "DELETE";

        // append
        cardFooter.appendChild(btnEdit);
        cardFooter.appendChild(btnDelete);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardFooter);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        col.appendChild(card);
        cardWrapper.appendChild(col);
      }
    }
  });
  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("accessToken")
  );
  xhr.send();
});

// create new project
const formAddProject = document.getElementById("formAddProject");
formAddProject.addEventListener("submit", function (event) {
  event.preventDefault();
  const addProjectTitle = document.getElementById("addProjectTitle").value;
  const addProjectDesc = document.getElementById("addProjectDesc").value;

  const toastLiveAdd = document.getElementById("toastLiveAdd");
  const toastBodyAdd = document.getElementById("toastBodyAdd");
  const toastBootstrapAdd = bootstrap.Toast.getOrCreateInstance(toastLiveAdd);

  if (!addProjectTitle) {
    toastBodyAdd.innerHTML = "Title is required!";
    toastBootstrapAdd.show();
    return;
  }

  const data = JSON.stringify({
    title: addProjectTitle,
    description: addProjectDesc,
  });

  const xhr = new XMLHttpRequest();
  xhr.open("POST", BASE_URL + "/api/projects");
  xhr.addEventListener("load", function () {
    if (xhr.status === 201) {
      // reset form, hide modal and reload
      const modalProjectAdd = document.getElementById("modalProjectAdd");
      const modalBoostrapAdd =
        bootstrap.Modal.getOrCreateInstance(modalProjectAdd);

      formAddProject.reset();
      modalBoostrapAdd.toggle();
      window.location.reload();
    } else {
      const response = JSON.parse(xhr.responseText);
      toastBodyAdd.innerHTML = response.message;
      toastBootstrapAdd.show();
    }
  });
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("accessToken")
  );
  xhr.send(data);
});

// variable to storage id from data-id
let projectId;

// get value from button edit
const modalProjectEdit = document.getElementById("modalProjectEdit");
modalProjectEdit.addEventListener("shown.bs.modal", function (event) {
  event.preventDefault();
  const editProjectTitle = document.getElementById("editProjectTitle");
  const editProjectDesc = document.getElementById("editProjectDesc");

  editProjectTitle.value = event.relatedTarget.attributes["data-title"].value;
  editProjectDesc.value =
    event.relatedTarget.attributes["data-description"].value;
  projectId = event.relatedTarget.attributes["data-id"].value;
});

// edit project
const formEditProject = document.getElementById("formEditProject");
formEditProject.addEventListener("submit", function (event) {
  event.preventDefault();
  const editProjectTitle = document.getElementById("editProjectTitle").value;
  const editProjectDesc = document.getElementById("editProjectDesc").value;

  const toastLiveEdit = document.getElementById("toastLiveEdit");
  const toastBodyEdit = document.getElementById("toastBodyEdit");
  const toastBootstrapEdit = bootstrap.Toast.getOrCreateInstance(toastLiveEdit);

  if (!editProjectTitle) {
    toastBodyEdit.innerHTML = "Title is required!";
    toastBootstrapEdit.show();
    return;
  }

  const data = JSON.stringify({
    title: editProjectTitle,
    description: editProjectDesc,
  });

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `${BASE_URL}/api/projects/${projectId}`);

  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      const modalBoostrapEdit =
        bootstrap.Modal.getOrCreateInstance(modalProjectEdit);
      modalBoostrapEdit.toggle();
      window.location.reload();
    } else {
      const response = JSON.parse(xhr.responseText);
      toastBodyEdit.innerHTML = response.message;
      toastBootstrapEdit.show();
    }
  });

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("accessToken")
  );
  xhr.send(data);
});

// get value from button delete
const modalProjectDelete = document.getElementById("modalProjectDelete");
modalProjectDelete.addEventListener("shown.bs.modal", function (event) {
  event.preventDefault();
  projectId = event.relatedTarget.attributes["data-id"].value;
});

// delete project
const btnProjectDelete = document.getElementById("btnProjectDelete");
btnProjectDelete.addEventListener("click", function (event) {
  event.preventDefault();

  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${BASE_URL}/api/projects/${projectId}`);
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      const modalBoostrapDelete =
        bootstrap.Modal.getOrCreateInstance(modalProjectDelete);
      modalBoostrapDelete.toggle();
      window.location.reload();
    } else {
      const response = JSON.parse(xhr.responseText);
      const toastLiveDelete = document.getElementById("toastLiveDelete");
      const toastBodyDelete = document.getElementById("toastBodyDelete");
      const toastBootstrapDelete =
        bootstrap.Toast.getOrCreateInstance(toastLiveDelete);

      toastBodyDelete.innerHTML = response.message;
      toastBootstrapDelete.show();
    }
  });
  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("accessToken")
  );
  xhr.send();
});

// display time in footer
timeDisplay = document.getElementById("time");
function refreshTime() {
  let dateString = new Date().toLocaleTimeString([], {
    hour12: false,
  });
  timeDisplay.innerHTML = dateString;
}

setInterval(refreshTime, 1000);