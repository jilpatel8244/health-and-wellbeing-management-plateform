document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);

    let formDataObj = {};

    for (var [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }

    if (!validateForm(formDataObj)) {
        return false;
    }

    try {
        const data = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json();
        console.log(response);

        if (response.success) {
            let url = window.origin + '/home';
            window.location.href = url;
        } else {
            if (response.toast) {
                triggerToast(response.message, response.toastType, response.toastBtnText, response.redirectionUrl, 'login');
            }
        }
    } catch (error) {
        console.log(error);
    }
});