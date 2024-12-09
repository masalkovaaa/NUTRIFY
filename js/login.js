let email = document.querySelector("#email")
let password = document.querySelector("#password")

function onSubmit(){
    validateAll(email, password)
    const validate = validateFormBeforeSubmit(email, password);
    if (!validate){
        return
    }

    let loginBody = {
        email: email.value,
        password: password.value,
    }

    fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/auth/login", {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            loginBody
        )
    }).then(ans => ans.json()).then(ans => {
        localStorage.setItem('user_token', ans.accessToken)
        window.location.href="plan.html"
    })
}

const errorClass = 'input-error';
function onBlurHandler(e) {
    const id = e.target.id;
    const value = e.target.value.trim();
    const errorClass = 'input-error';
    let isValid = true;
    let errorText = ''

    if (e.target.hasAttribute('required') && value === '') {
        isValid = false;
        errorText = 'Обязательное поле'
    }

    if (id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorText = 'Некорректная почта'
        }
    }

    if (id === 'password') {
        if (value.length < 5) {
            isValid = false;
            errorText = 'Пароль должен быть длиннее 5 символов'
        }
    }

    if (isValid) {
        e.target.nextElementSibling.textContent = '';
        e.target.classList.remove(errorClass);
    } else {
        e.target.nextElementSibling.textContent = errorText;
        e.target.classList.add(errorClass);
    }
}
[email, password].forEach(field => {
    field.addEventListener('blur', onBlurHandler);
});

function validateAll(email, password) {

    const allFields = [email, password]

    allFields.forEach(field => {
        let isValid = true;
        let errorText = ''

        if (field.hasAttribute('required') && field.value.trim() === '') {
            isValid = false;
            errorText = 'Обязательное поле'
        }

        if (field.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    errorText = 'Некорректная почта'
            }
        }

        if (field.id === 'password') {
            if (field.value.trim().length < 6) {
                    isValid = false;
                    errorText = 'Пароль должен быть длиннее 6 символов'
            }
        }

            if (isValid) {
                field.nextElementSibling.textContent = '';
                field.classList.remove(errorClass);
            } else {
                field.nextElementSibling.textContent = errorText;
                field.classList.add(errorClass);
            }
        }
    )
}

function validateFormBeforeSubmit(email, password) {
    let hasError = false;

    [email, password].forEach(field => {
        if (field.classList.contains('input-error')) {
            hasError = true;
        }
    });

    return !hasError;
}