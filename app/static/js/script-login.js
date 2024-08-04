const BASE_URL = "http://127.0.0.1:5000";
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // get value fields
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Initialize danger toast
  const toastLiveDanger = document.getElementById("toastLiveDanger");
  const toastBodyDanger = document.getElementById("toastBodyDanger");
  const toastBootstrapDanger =
    bootstrap.Toast.getOrCreateInstance(toastLiveDanger);

  // fields validation
  if (!email || !password) {
    toastBodyDanger.innerHTML = "Email and Password is required!";
    toastBootstrapDanger.show();
    return;
  }

  const data = JSON.stringify({
    email: email,
    password: password,
  });

  const xhr = new XMLHttpRequest();
  xhr.open("POST", BASE_URL + "/api/auth/login");

  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      // get access token and store to local storage
      const response = JSON.parse(xhr.responseText);
      localStorage.setItem("accessToken", response.access_token);
      window.location.replace(BASE_URL);
    } else {
      const response = JSON.parse(xhr.responseText);
      toastBodyDanger.innerHTML = response.message;
      toastBootstrapDanger.show();
    }
  });

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
});