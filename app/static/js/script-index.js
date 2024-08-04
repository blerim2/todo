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