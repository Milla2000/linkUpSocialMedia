document.addEventListener("DOMContentLoaded", () => {
    const sendResetEmailButton = document.getElementById("sendResetEmail");
    const resetTokenInput = document.getElementById("resetToken");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("newPassword1");
    const resetPasswordButton = document.getElementById("resetPassword");
    const emailInput = document.getElementById("email");
    const resetForm = document.getElementById("resetForm");
    // const emailSentMessage = document.getElementById("emailSentMessage");

    sendResetEmailButton.addEventListener("click", async () => {
        const email = emailInput.value;
        if (email === "") {
            alert("Please enter your email.");
            return;
        }

        if (email) {
            try {
                const response = await axios.post("http://localhost:4500/reset/resetPassword", { email });
                emailInput.style.display = "none";
                sendResetEmailButton.style.display = "none";
                resetForm.style.display = "block";

                alert(response.data.message);
            } catch (error) {
                console.error("An error occurred:", error);
                alert(error.response.data.message);
            }
        } else {
            alert("Please enter your email.");
        }
    });

    resetPasswordButton.addEventListener("click", async () => {
        const resetToken = resetTokenInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (resetToken && newPassword && confirmPassword) {
            if (newPassword === confirmPassword) { // Check if passwords match
                try {
                    const response = await axios.post("http://localhost:4500/reset/updatePassword", { resetToken, newPassword });
                    alert(response.data.message);
                    window.location.href = "http://127.0.0.1:5500/Frontend/login.html";
                } catch (error) {
                    // console.error("An error occurred:", error);
                    // alert("Invalid token or token expired. You can request another reset email by clicking the 'Send Reset Email' button. ");
                    emailSentMessage.innerText = `Invalid token or token expired. You can request another by entering your email and click the 'Send Reset Email' button. `;
                    emailSentMessage.style.color = "red";

                    setTimeout(() => {
                        emailSentMessage.innerText = "";
                        emailSentMessage.style.color = "";
                    }, 5000);
                }
            } else {
                // alert("Passwords do not match. Please make sure your passwords match.");
                emailSentMessage.innerText = `Passwords do not match. Please make sure your passwords match.`;
                emailSentMessage.style.color = "red";

                setTimeout(() => {
                    emailSentMessage.innerText = "";
                    emailSentMessage.style.color = ""; 
                }, 5000);
            }
        } else {
            alert("Please enter the reset token, new password, and confirm the password.");
        }
    });
});
