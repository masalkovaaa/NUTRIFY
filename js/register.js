let name = document.querySelector("#name")
let email = document.querySelector("#email")
let gender = document.querySelector("#gender")
let age = document.querySelector("#age")
let height = document.querySelector("#height")
let weight = document.querySelector("#weight")
let goal = document.querySelector("#goal")
let activity = document.querySelector("#activity")
let password = document.querySelector("#password")

function nextStep(stepNumber) {
    validateAll(name, email, password, age, height, weight, goal, activity, stepNumber)
    const validate = validateFormBeforeSubmit(name, email, password, age, height, weight, goal, activity);
    if (!validate){
        return
    }

    document.getElementById(`step-${stepNumber}`).style.display = "none";
    document.getElementById(`step-${stepNumber + 1}`).style.display = "block";
    changeImg(stepNumber)

}

function changeImg(stepNumber) {
    let image = document.getElementById(`img_${stepNumber}`);
    if(image.src.match ('img/vector.png')){
        image.src = '../img/vector_2.png'
    } else {
        image.src = '../img/vector.png';
    }
}

function previousStep(stepNumber) {
    document.getElementById(`step-${stepNumber}`).style.display = "none";
    document.getElementById(`step-${stepNumber - 1}`).style.display = "block";

    changeImg(stepNumber - 1)
}

document.getElementById("step-1").style.display = "block";

function onSubmit(){
    validateAll(name, email, password, age, height, weight, goal, activity, 3)
    const validate = validateFormBeforeSubmit(name, email, password, age, height, weight, goal, activity);
    if (!validate){
        return
    }

    let registerRequest = {
        name: name.value,
        email: email.value,
        password: password.value,
        age: age.value,
        height: height.value,
        weight: weight.value,
        sex: gender.value,
        target: goal.value,
        activity: activity.value,
    }
    fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/auth/register", {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            registerRequest
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
[name, email, password, age, height, weight, goal, activity].forEach(field => {
    field.addEventListener('blur', onBlurHandler);
});

function validateAll(name, email, password, age, height, weight, goal, activity, stepNumber) {

    const allFields = [name, email, password, age, height, weight, goal, activity]

    allFields.forEach(field => {
        let isValid = true;
        let errorText = ''

        if (field.parentElement.id === `step-${stepNumber}` || field.parentElement.parentElement.parentElement.id === `step-${stepNumber}`) {
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
    })
}

function validateFormBeforeSubmit(name, email, password, age, height, weight, goal, activity) {
    let hasError = false;

    [name, email, password, age, height, weight, goal, activity].forEach(field => {
        if (field.classList.contains('input-error')) {
            hasError = true;
        }
    });

    return !hasError;
}