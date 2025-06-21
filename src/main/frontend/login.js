document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const loginButton = document.querySelector(".login-button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    const loginData = { email, password };

    try {
      const response = await fetch("http://<your-backend-domain>/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        // Login success — redirect to home or dashboard
        window.location.href = "home.html";
      } else {
        const errorText = await response.text();
        alert("Login failed: " + errorText);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server. Try again later.");
    }
  });
});
