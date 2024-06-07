function validateForm(formObj) {
    let numberFields = ['phoneNumber', 'age', 'otp'];
    let stringFields = ['firstName', 'lastName'];
    let passwordFields = ['password', 'confirmPassword'];
    // dateFields

    let formDataArr = Object.entries(formObj);

    if (checkRequiredFields(formDataArr) && checkEmail(formDataArr)) {
        return true;
    } else {
        return false;
    }
    
}

function checkRequiredFields(formDataArr) {
    let requireFields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'password', 'confirmPassword', 'otp'];

    let validate = true;

    for ([key, value] of formDataArr) {
        let errorSpan = document.getElementById(`${key}_error`);
        
        if (requireFields.includes(key) && !value.trim().length) {
            validate = false;
            errorSpan.innerHTML = `please fill the details`;
            errorSpan.classList.remove('hidden');
        }
    }

    return validate;
}

function checkEmail(formDataArr) {
    let validate = true;

    for ([key, value] of formDataArr) {
        if (key === 'email' && !String(value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            let errorSpan = document.getElementById(`${key}_error`);
            validate = false;
            errorSpan.innerHTML = `please enter valid email`;
            errorSpan.classList.remove('hidden');
        }
    }

    return validate;
}

let allInputTags = Array.from(document.getElementsByTagName('input'));
allInputTags.forEach((element) => {
    element.addEventListener('focusout', () => {
        document.getElementById(`${element.id}_error`).classList.add('hidden');
    })
})