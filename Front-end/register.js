// Get references to the form and input fields
const registerForm = document.querySelector("form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const full_nameInput = document.getElementById("profession");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const imageInput = document.getElementById("image-upload");


// Define a variable to store the profile picture URL
let profileUrl = '';

// Add an event listener to the image input to handle file upload
imageInput.addEventListener('change', async (event) => {
    const target = event.target;
    const files = target.files;

    if (files) {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("upload_preset", "Shoppie");
        formData.append("cloud_name", "dhgs8thzx");

        try {
            // Upload the image to Cloudinary
            const response = await fetch('https://api.cloudinary.com/v1_1/dhgs8thzx/image/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                profileUrl = data.url;
                console.log("Image uploaded to Cloudinary:", profileUrl);
            } else {
                console.error("Failed to upload image to Cloudinary");
            }
        } catch (error) {
            console.error("An error occurred while uploading the image:", error);
        }
    }
});

// Get a reference to the toast element
const toast = document.getElementById("toast");

// Function to show a toast message
function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
        showToast("Passwords do not match");
        return;
    }


    try {
        // Send a POST request to the registration endpoint
        const response = await axios.post(
            "http://localhost:4500/users/register",
            {
                username: usernameInput.value,
                email: emailInput.value,
                password: emailInput.value,
                full_name: full_nameInput.value,
                profile_picture: profileUrl,
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            showToast("Registration successful");
            // console.log("Registration successful");
            // Redirect to the login page or perform other actions
            window.location.href = "/Front-end/login.html";
        } else {
            showToast("Registration failed");
            // console.error(response, "Registration failed");
        }
    } catch (error) {
        // Handle registration errors
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.error || "Registration failed";
            // console.error(errorMessage);
            showToast(errorMessage);
        } else {
            // console.error(error);
            showToast("An error occurred during registration");
        }
    }
}

// Add a form submit event listener
registerForm.addEventListener("submit", handleFormSubmit);