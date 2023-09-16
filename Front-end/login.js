const loginpassword = document.getElementById('password'); // Select by ID
const loginemail = document.getElementById('email'); // Select by ID
const loginForm = document.getElementById('login');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');

function showToast(message) {
    toast.style.display = 'block';
    toastText.textContent = message;
    toast.style.right = '20px';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

let token = '';
let id = '';

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let userlogin =
        loginemail.value !== '' &&
        loginpassword.value !== '';

    if (!userlogin) {
        showToast('Please fill in all the input fields.');
        return;
    }

    if (userlogin) {
        axios
            .post(
                'http://localhost:4500/users/login',
                {
                    email: loginemail.value,
                    password: loginpassword.value,
                },
                
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                    },
                }
            )
            .then((res) => {
                console.log(res.data);
                showToast('OTP HAS BEEN SENT TO YOUR EMAIL, PLEASE CHECK YOUR EMAIL');

                // Extract the email from the response
                const email = loginemail.value;

                // Redirect to the OTP page with the email in the URL
                console.log(email);
                window.location.href = `/Front-end/otp.html?email=${encodeURIComponent(email)}`;
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    if (error.response.data.message === 'Account is deactivated') {
                        showToast(
                            'Account is deactivated. Please contact support at 0707451644'
                        );
                    } else {
                        showToast(error.response.data.message);
                    }
                } else {
                    console.error('An error occurred:', error);
                    showToast('An unknown error occurred.');
                }
            });
    }
});
