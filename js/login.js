let email = document.querySelector("#email")
let password = document.querySelector("#password")
let name = document.querySelector("#name")

async function onSubmit(){
    const errorTextElement = document.getElementById('login-error')

    const textError = 'Ошибка при авторизации. Неверный пароль или почта!';
    errorTextElement.textContent = ''

    validateAll(email, password, name)

    const validate = validateFormBeforeSubmit(email, password, name);

    if (!validate) {
        return
    }

    let loginBody = {
        name: name.value,
        email: email.value,
        password: password.value,
    }

    try {
        const response = await fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/auth/login", {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                loginBody
            )
        })

        if (!response.ok) {
            console.log(response);
            errorTextElement.textContent = textError
            throw new Error(response.status)
        }

        const jsonResponse = await response.json()

        localStorage.setItem('user_token', jsonResponse.accessToken)
        window.location.href="plan.html"

        return await response.json()
    } catch (e) {
        console.error(e)
    }
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

    if (id === 'name') {
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/; // Только буквы, пробел и дефис
        if (!nameRegex.test(value)) {
            isValid = false;
            errorText = 'Имя должно содержать только буквы';
        }
    }

    if (id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorText = 'Некорректная почта'
        }
    }

    if (id === 'password') {
        if (value.length < 6) {
            isValid = false;
            errorText = 'Пароль должен быть длиннее 6 символов'
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
[email, password, name].forEach(field => {
    field.addEventListener('blur', onBlurHandler);
});

function validateAll(email, password, name) {

    const allFields = [email, password, name]

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
        if (field.id === 'name') {
            const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
            if (!nameRegex.test(field.value.trim())) {
                isValid = false;
                errorText = 'Имя должно содержать только буквы, пробелы или дефис';
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

function validateFormBeforeSubmit(email, password, name) {
    let hasError = false;

    [email, password, name].forEach(field => {
        if (field.classList.contains('input-error')) {
            hasError = true;
        }
    });

    return !hasError;
}