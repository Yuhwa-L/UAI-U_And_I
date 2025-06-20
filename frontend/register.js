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

        // U.S. phone number validation: exactly 10 digits, no symbols
        const rawPhone = phone.value.replace(/\D/g, ''); // remove non-digits

        if (rawPhone.length !== 10) {
            phoneError.textContent = "Please enter a valid 10-digit U.S. phone number.";
            valid = false;
        } else {
            phoneError.textContent = "";
        }



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

    /*
    res.redirect('/register-success.html');

    This should be here if I use interaction with back end 
    backend should send a redirect*/

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Final check in case JS changes
        if (submitButton.disabled) return;

        submitButton.disabled = true;
        submitButton.innerText = "Submitting...";

        // Simulate delay then redirect
        setTimeout(() => {
            window.location.href = "register-success.html";
        }, 1500);
    });

    startCamera();
});

phone.addEventListener("input", () => {
    // Keep only digits and limit to 10
    const digitsOnly = phone.value.replace(/\D/g, "").slice(0, 10);
    phone.value = digitsOnly;
    validateForm();
});



