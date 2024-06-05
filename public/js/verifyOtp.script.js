document.getElementById('verifyOtpForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const enteredOtp = formData.getAll('otp[]').join('');

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    console.log(enteredOtp);
    console.log(email);

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
        console.log(redirectedAt);

        if (response.success) {
            let url = window.origin + '/' + redirectedAt + `?email=${email}`;
            window.location.href = url;
        } else {
            if (response.toast) {
                let result = await Swal.fire({
                    text: response.message,
                    showCancelButton: true,
                    confirmButtonText: "Regenerate",
                });

                if (result.value) {
                    console.log("redirected at verify otp script : ", redirectedAt);
                    let url = window.origin + `/verify-email?redirectedAt=${redirectedAt}`
                    window.location.href = url;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});