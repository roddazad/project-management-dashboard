// 🔐 Login Form Handling
const loginForm = document.getElementById("login-form");

// Dummy localStorage-based login (simulate real user check)
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  // Retrieve user from localStorage
  const users = JSON.parse(localStorage.getItem("taskflowUsers")) || [];

  const matchedUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (matchedUser) {
    // Save current user to localStorage (session simulation)
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid email or password. Please try again.");
  }
});