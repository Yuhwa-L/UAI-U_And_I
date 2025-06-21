window.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("snapshot");
    const idPreview = document.getElementById("idPreview");
    const selfiePreview = document.getElementById("selfiePreview");
    const idFileInput = document.getElementById("idFileInput");
    const selfieFileInput = document.getElementById("selfieFileInput");
    const submitButton = document.getElementById("submitButton");

    const form = document.getElementById("registerForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const phone = document.getElementById("phone");
    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    let idCaptured = false;
    let selfieCaptured = false;

    // Enable camera
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (error) {
            alert("Camera access is required to register.");
        }
    }

    // Capture and assign photo
    function capturePhoto(type) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], `${type}_photo.png`, { type: "image/png" });
            const objectURL = URL.createObjectURL(file);
            const dt = new DataTransfer();
            dt.items.add(file);

            if (type === "id") {
                idPreview.src = objectURL;
                idFileInput.files = dt.files;
                idCaptured = true;
            } else {
                selfiePreview.src = objectURL;
                selfieFileInput.files = dt.files;
                selfieCaptured = true;
            }

            validateForm(); // trigger check
        }, "image/png");
    }

    // Validate email format
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // Combined live form validation
    function validateForm() {
        let valid = true;

        // Email validation
        if (!isValidEmail(email.value)) {
            emailError.textContent = "Please enter a valid email address.";
            valid = false;
        } else {
            emailError.textContent = "";
        }

        // Password match validation
        if (password.value !== confirmPassword.value) {
            passwordError.textContent = "Passwords do not match.";
            valid = false;
        } else {
            passwordError.textContent = "";
        }

        // Enable or disable the button
        submitButton.disabled = !(valid && idCaptured && selfieCaptured);
    }

    // Real-time listeners
    email.addEventListener("input", validateForm);
    password.addEventListener("input", validateForm);
    confirmPassword.addEventListener("input", validateForm);

    document.getElementById("captureIDBtn").addEventListener("click", () => capturePhoto("id"));
    document.getElementById("captureSelfieBtn").addEventListener("click", () => capturePhoto("selfie"));



    startCamera();
});


const emergencyInput = document.getElementById("emergency");
const emergencyError = document.getElementById("emergencyError");

emergencyInput.addEventListener("input", () => {
    const emergencyValue = emergencyInput.value;
    const isValid = /^\d{0,10}$/.test(emergencyValue);
    emergencyInput.value = emergencyValue.replace(/\D/g, "").slice(0, 10);

    if (!isValid || emergencyValue.length !== 10) {
        emergencyError.textContent = "Emergency contact must be a 10-digit US number.";
    } else {
        emergencyError.textContent = "";
    }
});

const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");


phoneInput.addEventListener("input", () => {
    const phoneValue = phoneInput.value;
    const isValid = /^\d{0,10}$/.test(phoneValue);
    phoneInput.value = phoneValue.replace(/\D/g, "").slice(0, 10);

    if (!isValid || phoneValue.length !== 10) {
        phoneError.textContent = "Phone number must be a 10-digit US number.";
    } else {
        phoneError.textContent = "";
    }
});



document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  // Collect values from input fields
  const fullName = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const contactNumber = document.getElementById('phone').value;
  const emergencyContactNumber = document.getElementById('emergency').value;
  const idImageBase64 = document.getElementById('idPreview').src;
  const selfieImageBase64 = document.getElementById('selfiePreview').src;

  const person = {
    fullName,
    email,
    password,
    contactNumber,
    emergencyContactNumber,
    idImageBase64,
    selfieImageBase64
  };


  try {
    const response = await fetch('http://localhost:8080/api/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person)
    });

    if (response.ok) {
      window.location.href = 'register-success.html';
    } else {
      const errorText = await response.text();
      alert(`Registration failed: ${errorText}`);
    }
  } catch (err) {
    alert('Could not connect to the server. Please try again later.');
    console.error('Network error:', err);
  } finally {
    submitBtn.disabled = false;
  }
});
