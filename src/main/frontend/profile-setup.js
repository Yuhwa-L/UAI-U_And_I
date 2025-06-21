const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const bioInput = document.getElementById("bioInput");
const submitBtn = document.getElementById("submitBtn");

const email = localStorage.getItem('registeredEmail');

let base64Photo = "";

function checkValidity() {
  const photoSelected = base64Photo.length > 0;
  const bioFilled = bioInput.value.trim().length > 0 && bioInput.value.trim().length <= 200;

  if (photoSelected && bioFilled) {
    submitBtn.disabled = false;
    submitBtn.classList.add("enabled");
  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("enabled");
  }
}

// Preview & Convert to base64
photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    base64Photo = e.target.result;
    photoPreview.src = base64Photo;
    photoPreview.style.display = "block";
    checkValidity();
  };
  reader.readAsDataURL(file);
});

bioInput.addEventListener("input", checkValidity);

submitBtn.addEventListener("click", async () => {
  const bio = bioInput.value.trim();

  const profileData = {
    email: email,
    photoBase64: base64Photo,
    bio: bio
  };

  try {
    const response = await fetch("http://<your-backend-domain>/profile-setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      alert("Profile setup completed!");
      const email = document.getElementById('email').value;
      localStorage.setItem('registeredEmail', email);  // save to localStorage
      window.location.href = "mcq-question.html";
    } else {
      alert("Something went wrong. Try again.");
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Failed to connect to server.");
  }
});
