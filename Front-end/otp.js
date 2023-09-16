// Get a reference to the email and OTP input fields
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');

// Function to populate the email input field with the email from the URL
function setEmailFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    console.log(email);

    if (!email) {
        alert('Email not found in URL.');
        return;
    }

    if (email) {
        emailInput.value = email;
    }

    

}

// Add an event listener to call setEmailFromURL when the page loads
window.addEventListener('load', setEmailFromURL);

// Function to handle OTP form submission
function handleOTPSubmit(event) {
    event.preventDefault();

    const email = emailInput.value;
    const otp = otpInput.value;

    if (!otp) {
        alert('Please fill in OTP field.');
        return;
    }
    // You can now use the 'email' and 'otp' variables for further processing
    // For example, you can send a request to your server to verify the OTP

    // Example: Sending a request to verify OTP
    axios.post(
        'http://localhost:4500/users/verifyotp',
        {
            otp: otp,
            userEmail: email
        },
        {
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
        }
    )
        .then((res) => {
            id = res.data.id;
            localStorage.setItem('id', id);
            token = res.data.token;
            localStorage.setItem('token', token);
            // Handle success (e.g., redirect to a success page)
            window.location.href = '/Front-end/index.html';
            alert('OTP verification successful.');
        })
        .catch((error) => {
            // Handle error (e.g., show an error message to the user)
            console.error('Error verifying OTP:', error);
            alert(error.response.data.message);
        });
}

// Add an event listener to the OTP form for form submission
const otpForm = document.getElementById('otplogin');
otpForm.addEventListener('submit', handleOTPSubmit);