const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = signupForm.name.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;

  // ✅ Password match check
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // ✅ Check if user already exists
  const users = JSON.parse(localStorage.getItem("taskflowUsers")) || [];

  const alreadyExists = users.find((user) => user.email === email);
  if (alreadyExists) {
    alert("An account with this email already exists.");
    return;
  }

  // ✅ Create new user
  const newUser = {
    name,
    email,
    password, // Not hashed because it's localStorage, but in real life: always hash!
  };

  users.push(newUser);
  localStorage.setItem("taskflowUsers", JSON.stringify(users));

  // ✅ Ask user where to go next
  const goToDashboard = confirm("Signup successful! Go to your dashboard now?");

  if (goToDashboard) {
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "index.html";
  }
});