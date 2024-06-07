document.getElementById('verifyOtpForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const enteredOtp = formData.getAll('otp[]').join('');

    if (enteredOtp.length !== 6) {
        document.getElementById('otp_error').innerHTML = 'please enter valid data'
        document.getElementById('otp_error').classList.remove('hidden');
        return false;
    } else {
        document.getElementById('otp_error').classList.add('hidden');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    try {
        const data = await fetch('/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ otp: enteredOtp, email: email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json();
        console.log(response);
        let redirectedAt = document.getElementById('redirectedAt').value;

        if (response.success) {
            let url = window.origin + '/' + redirectedAt + `?email=${email}`;
            window.location.href = url;
        } else {
            if (response.toast) {
                triggerToast(response.message, response.toastType, response.toastBtnText, response.redirectionUrl, redirectedAt);
            }
        }
    } catch (error) {
        console.log(error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const otpInputs = document.querySelectorAll("#otp input");

    otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            e.target.value = value;

            if (value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});
