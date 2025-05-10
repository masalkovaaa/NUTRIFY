const goalMap = {
    "LOSS": "Похудение",
    "GAIN": "Набор мышечной массы",
    "RETAIN": "Поддержание"
};

const activityMap = {
    "MINIMAL": "Минимальный уровень активности (отсутствие нагрузок)",
    "WEAK": "Слабый уровень активности",
    "MIDDLE": "Умеренный уровень активности",
    "HARD": "Тяжелая активность",
    "EXTREME": "Экстремальный уровень активности"
};

async function fetchUserData() {
    try {
        const response = await fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/users`, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            }
        })
        const data = await response.json();

        document.getElementById("name").textContent = data.name;
        document.getElementById("email").textContent = data.email;
        document.getElementById("age").textContent = data.personalData.age;
        document.getElementById("height").textContent = `${data.personalData.height} см`;
        document.getElementById("weight").textContent = `${data.personalData.weight} кг`;
        document.getElementById("target").textContent = goalMap[data.personalData.target];
        document.getElementById("target").setAttribute('data-key', data.personalData.target)

        document.getElementById("activity").textContent = activityMap[data.personalData.activity]
        document.getElementById("activity").setAttribute('data-key', data.personalData.activity)
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

fetchUserData()

function toggleEditUserInfo() {
    const editButtonWrapper = document.querySelector('.edit_button_wrapper')
    const userInfoBlock = document.getElementById("user_info");
    const editButton = userInfoBlock.querySelector(".edit_button");
    const confirmButton = userInfoBlock.querySelector(".confirm_button");
    const inputs = userInfoBlock.querySelectorAll("input");
    const divs = userInfoBlock.querySelectorAll(".info_values .values > div:not(.values_name)");

    // Переключение в режим редактирования
    editButton.addEventListener("click", () => {
        inputs.forEach((input, index) => {
            input.classList.remove("hidden");
            input.value = divs[index].textContent.trim();
            if (input.id === 'password_input') input.value = ''
            divs[index].classList.add("hidden");
        });

        editButton.classList.add("hidden");
        confirmButton.classList.remove("hidden");
        editButtonWrapper.classList.add('confirm_button_active')
    });

    // Завершение редактирования
    confirmButton.addEventListener("click", async () => {
        const body = {};

        inputs.forEach((input, index) => {
            const newValue = input.value.trim();
            if (newValue) {
                const fieldId = input.id.replace("_input", "");
                body[fieldId] = newValue;
                divs[index].textContent = newValue;
            }
        });


        try {
            const response = await fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/users", {
                method: "PUT",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    'Auth': 'Bearer ' + localStorage.getItem('user_token')
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error(response.status)
            }

            editButtonWrapper.classList.remove('confirm_button_active')
            editButton.classList.remove('hidden')

            inputs.forEach((input, index) => {
                input.classList.add("hidden");
                divs[index].classList.remove("hidden");
            });
            const jsonResponce = await response.json()
            document.getElementById('client').querySelector('.name').textContent=jsonResponce.name

            return jsonResponce
        } catch (e) {
            console.error(e)
        }

        confirmButton.classList.add("hidden");
        editButton.classList.remove("hidden");
    });
}

toggleEditUserInfo()

async function toggleEditUserParams() {
    const editButtonWrapper = document.querySelector('#user_params .edit_button_wrapper');
    const userParamsBlock = document.getElementById("user_params");
    const editButton = userParamsBlock.querySelector(".edit_button");
    const confirmButton = userParamsBlock.querySelector(".confirm_button");
    const inputs = userParamsBlock.querySelectorAll("input, select");
    const divs = userParamsBlock.querySelectorAll(".info_values .values > div:not(.values_name)");

    const isEditable = await fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/personal_data/is_possible_to_update", {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Auth": 'Bearer ' + localStorage.getItem('user_token'),
        }
    })
        .then(response => response.json())
        .catch(() => false);

    if (isEditable) {
        document
            .querySelector('#user_params')
            .querySelector('.edit_button_wrapper').classList
            .remove('hidden_edit_button')
    }

    // Переключение в режим редактирования
    editButton.addEventListener("click", () => {
        inputs.forEach((input, index) => {
            input.classList.remove("hidden");
            if (input.tagName === "INPUT") {
                input.value = divs[index].textContent.split(' ')[0].trim();
            } else if (input.tagName === "SELECT") {
                input.value = divs[index].textContent === "мужской" ? "MALE" : "FEMALE";
            }
            divs[index].classList.add("hidden");
        });

        editButton.classList.add("hidden");
        confirmButton.classList.remove("hidden");
        editButtonWrapper.classList.add('confirm_button_active');
    });

    // Завершение редактирования
    confirmButton.addEventListener("click", async () => {
        const body = {};

        body['target'] = document.getElementById("target").getAttribute('data-key')
        body['activity'] = document.getElementById("activity").getAttribute('data-key')

        inputs.forEach((input, index) => {
            const newValue = input.value.trim();
            if (newValue) {
                const fieldId = input.id.replace("_input", "").replace("_select", "");
                body[fieldId] = +newValue;
                divs[index].textContent = input.tagName === "SELECT" ?
                    (newValue === "MALE" ? "Мужской" : "Женский") :
                    newValue;
            }
        });

        try {
            const response = await fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/personal_data", {
                method: "PUT",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    'Auth': 'Bearer ' + localStorage.getItem('user_token')
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            editButtonWrapper.classList.remove('confirm_button_active');
            confirmButton.classList.add("hidden");
            editButton.classList.remove("hidden");

            inputs.forEach((input, index) => {
                input.classList.add("hidden");
                divs[index].classList.remove("hidden");
            });

            console.log("Параметры обновлены");
            return response.json();
        } catch (e) {
            console.error("Ошибка при обновлении параметров:", e);
        }
    });
}

toggleEditUserParams();

async function toggleEditUserAdditional() {
    const editButtonWrapper = document.querySelector('#user_additional .edit_button_wrapper');
    const userAdditionalBlock = document.getElementById("user_additional");
    const editButton = userAdditionalBlock.querySelector(".edit_button");
    const confirmButton = userAdditionalBlock.querySelector(".confirm_button");
    const selects = userAdditionalBlock.querySelectorAll("select");
    const divs = userAdditionalBlock.querySelectorAll(".info_values .values > div:not(.values_name)");

    const isEditable = await fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/personal_data/is_possible_to_update", {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Auth": 'Bearer ' + localStorage.getItem('user_token'),
        }
    })
        .then(response => response.json())
        .catch(() => false);

    if (isEditable) {
        document
            .querySelector('#user_additional')
            .querySelector('.edit_button_wrapper').classList
            .remove('hidden_edit_button')
    }

    editButton.addEventListener("click", () => {
        selects.forEach((select, index) => {
            select.classList.remove("hidden");
            const divText = divs[index].textContent.trim();
            if (select.id === "target_select") {
                select.value = document.getElementById("target").getAttribute('data-key');
            } else if (select.id === "activity_select") {
                select.value = document.getElementById("activity").getAttribute('data-key');
            }
            divs[index].classList.add("hidden");
        });

        editButton.classList.add("hidden");
        confirmButton.classList.remove("hidden");
        editButtonWrapper.classList.add('confirm_button_active');
    });

    confirmButton.addEventListener("click", async () => {
        const body = {};

        body['age'] = +document.getElementById("age").textContent.trim();
        body['height'] = +document.getElementById("height").textContent.split(' ')[0].trim();
        body['weight'] = +document.getElementById("weight").textContent.trim().split(' ')[0].trim();
        // body['gender'] = document.getElementById("gender").textContent === 'Мужской' ? 'MALE' : 'FEMALE';

        selects.forEach((select, index) => {
            const newValue = select.value.trim();
            console.log(newValue);
            if (newValue) {
                const fieldId = select.id.replace("_select", "");
                body[fieldId] = newValue;

                divs[index].textContent = select.id === "target_select" ?
                    (newValue === "LOSS" ? "Похудение" :
                        newValue === "GAIN" ? "Набор мышечной массы" : "Поддержание") :
                    (newValue === "MINIMAL" ? "Минимальный уровень активности" :
                        newValue === "WEAK" ? "Слабый уровень активности" :
                            newValue === "MIDDLE" ? "Умеренный уровень активности" :
                                newValue === "HARD" ? "Тяжелая активность" : "Экстремальный уровень активности");
            }
        });

        if (Object.keys(body).length < 2) {
            console.warn("Заполните все поля");
            return;
        }

        try {
            const response = await fetch("https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/personal_data", {
                method: "PUT",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    'Auth': 'Bearer ' + localStorage.getItem('user_token')
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            editButtonWrapper.classList.remove('confirm_button_active');
            confirmButton.classList.add("hidden");
            editButton.classList.remove("hidden");

            selects.forEach((select, index) => {
                select.classList.add("hidden");
                divs[index].classList.remove("hidden");
            });

            console.log("Информация обновлена");
            return response.json();
        } catch (e) {
            console.error("Ошибка при обновлении информации:", e);
        }
    });
}

toggleEditUserAdditional();




