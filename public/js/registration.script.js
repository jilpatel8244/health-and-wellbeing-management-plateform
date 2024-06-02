document.getElementById('registrationForm').addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(event.target);

    let formData = new FormData(event.target);

    let formDataObj = {};

    for (var [key, value] of formData.entries()) { 
        formDataObj[key] = value;
    }

    console.log(formDataObj);

    try {
        const data = await fetch('/registration', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json();
        console.log(response);

        if (response.success) {
            let url = window.origin + `/verify-otp?email=${formDataObj.email}`
            window.location.href = url;
        }
    } catch (error) {
        console.log(error);
    }
});