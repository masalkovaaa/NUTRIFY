"use strict"

async function loadReceipes(type) {

    const params = type === 'ALL' ? '' :`?type=${type}`

    try {
        const response = await fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/food${params}`, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }

        const recipes = await response.json();

        receipesContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('a');
            recipeDiv.href = `receipe_information.html?id=${recipe.id}`;
            recipeDiv.classList.add('receipe');

            const imgContent = recipe.image
                ? `<img src="${recipe.image}" class="img_dish" alt="${recipe.name}">`
                : `<div class="img_dish"></div>`;

            recipeDiv.innerHTML = `
            <div class="img_dish_wrapper">
                ${imgContent}
            </div>
            <div class="receipe_name">${recipe.name}</div>
            <div class="receipe_cal">
                <img src="../img/cal.svg" alt="калории">
                <div class="cal">${recipe.calories} ккал</div>
            </div>
        `;
            receipesContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }

}

const recipeMenu = document.querySelector('.receipe_menu');
const receipesContainer = document.querySelector('.receipes');

recipeMenu.addEventListener('click', (event) => {
    const clickedElement = event.target.closest('.receipe_menu_position, .receipe_menu_position_green');

    if (clickedElement) {
        document.querySelectorAll('.receipe_menu_position, .receipe_menu_position_green')
            .forEach(button => {
                button.classList.remove('receipe_menu_position_green');
                button.classList.add('receipe_menu_position');
            });

        clickedElement.classList.remove('receipe_menu_position');
        clickedElement.classList.add('receipe_menu_position_green');

        const type = clickedElement.id;

        loadReceipes(type);
    }
});

loadReceipes(document.querySelector('.receipe_menu_position_green').id)