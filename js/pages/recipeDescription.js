"use strict"

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (!recipeId) {
        window.location.href = 'plan.html';
    }

    fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/recipes/${recipeId}`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            'Auth': 'Bearer ' + localStorage.getItem('user_token')
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при загрузке рецепта");
            }
            return response.json();
        })
        .then((data) => {
            renderRecipe(data);
        })
        .catch((error) => {
            console.error("Ошибка:", error);
        });
});

function renderRecipe(data) {
    const titleElement = document.querySelector(".main_title");
    if (titleElement) titleElement.textContent = data.name;

    const imageWrapper = document.querySelector(".recipe_img_wrapper");
    if (imageWrapper) {
        const img = document.createElement('img')
        img.classList.add('img_receipe')
        img.src = data.image;
        img.alt = data.name
        imageWrapper.appendChild(img)
    }

    if (data.description.trim()) {
        // Подробный рецепт
        document.querySelector('.step_receipe').classList.remove('step_hidden')

        const stepsContainer = document.querySelector(".steps");
        if (stepsContainer) {
            stepsContainer.innerHTML = "";
            const stepsArray = data.description
                .split('.')
                .filter(description => description.length >= 1)
                .map(description => {
                    if (description.length >= 1) return description.trim() + '.'})
            console.log(stepsArray);

            stepsArray.forEach((step, index) => {
                const stepDiv = document.createElement("div");
                stepDiv.classList.add("step");

                const stepCounter = document.createElement('span')

                const stepNumber = index + 1 < 10 ? `0${index + 1}` : index + 1

                stepCounter.textContent = String(stepNumber);
                stepCounter.classList.add('step_counter')

                const stepText = document.createElement('p')
                stepText.textContent = step
                stepText.classList.add('step_text')

                stepDiv.appendChild(stepCounter)
                stepDiv.appendChild(stepText)

                stepsContainer.appendChild(stepDiv);
            });
        }
    }

    // Ингредиенты
    const ingredientsContainers = document.querySelectorAll(".ingredient_positions");

    const weightTypeMapper = {
        GRAM: " г",
        COUNT: " шт",
    };

    if (ingredientsContainers) {
        ingredientsContainers.forEach(ingredientsContainer => {
            ingredientsContainer.innerHTML = "";
            data.ingredients.forEach((ingredient) => {
                const ingredientDiv = document.createElement("div");
                ingredientDiv.classList.add("position");
                ingredientDiv.innerHTML = `
                <div class="position_name">${ingredient.name}</div>
                <div class="quantity">${ingredient.weight}${weightTypeMapper[ingredient.weightType]}</div>
            `;
                ingredientsContainer.appendChild(ingredientDiv);
            });
        })
    }

    // Нутриенты
    const nutrientCals = document.querySelectorAll(".cal");
    if (nutrientCals) {
        nutrientCals.forEach(nutrientCal => {
            nutrientCal.textContent = `${data.calories} ккал`;
        })
    }

    const nutrients = [
        { selector: ".flex_nutrient_position:nth-child(1) .number", value: data.calories },
        { selector: ".flex_nutrient_position:nth-child(2) .number", value: data.protein },
        { selector: ".flex_nutrient_position:nth-child(3) .number", value: data.fats },
        { selector: ".flex_nutrient_position:nth-child(4) .number", value: data.carbs },
    ];
    nutrients.forEach(({ selector, value }) => {
        const nutrientElements = document.querySelectorAll(selector);
        if (nutrientElements) {
            nutrientElements.forEach(nutrientElement => {
                nutrientElement.textContent = value;
            })
        }
    });
}
