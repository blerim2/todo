const BASE_URL = "http://127.0.0.1:5000";
const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // get value fields
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Initialize danger toast
  const toastLiveDanger = document.getElementById("toastLiveDanger");
  const toastBodyDanger = document.getElementById("toastBodyDanger");
  const toastBootstrapDanger =
    bootstrap.Toast.getOrCreateInstance(toastLiveDanger);

  // validation fileds
  if (!username || !email || !password || !confirmPassword) {
    toastBodyDanger.innerHTML = "All fields cannot be empty!";
    toastBootstrapDanger.show();
    return;
  } else if (password != confirmPassword) {
    toastBodyDanger.innerHTML = "Password and Confirm Password does not match!";
    toastBootstrapDanger.show();
    return;
  }
  // get data and turn to json
  const data = JSON.stringify({
    username: username,
    email: email,
    password: password,
  });
  // Initialize ajax
  const xhr = new XMLHttpRequest();
  xhr.open("POST", BASE_URL + "/api/auth/register");

  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      // Initialize success toast
      const toastLiveSuccess = document.getElementById("toastLiveSuccess");
      const toastBodySuccess = document.getElementById("toastBodySuccess");
      const toastBootstrapSuccess =
        bootstrap.Toast.getOrCreateInstance(toastLiveSuccess);

      // show success toast
      const response = JSON.parse(xhr.responseText);
      toastBodySuccess.innerHTML = response.message;
      toastBootstrapSuccess.show();
    } else {
      // show danger toast
      const response = JSON.parse(xhr.responseText);
      toastBodyDanger.innerHTML = response.message;
      toastBootstrapDanger.show();
    }
  });

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
});