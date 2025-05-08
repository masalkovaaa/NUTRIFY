
const closePopup= document.getElementById("pop_up_close");
const popup = document.getElementById("pop_up");
const addIngredientBtn = document.getElementById('addIngredient');
const ingredientsContainer = document.getElementById('ingredients');


addIngredientBtn.onclick = () => {
    const row = document.createElement('div');
    row.classList.add('ingredient_row');
    row.innerHTML = `
        <input class="ingredient-name" type="text" placeholder="Ингредиент" required>
        <input class="ingredient-count" type="number" placeholder="Количество" required>
        <select class="ingredient-measure">
            <option value="GRAM">граммы</option>
            <option value="COUNT">штуки</option>
        </select>
  `;
    ingredientsContainer.appendChild(row);
};

const recipeForm = document.getElementById('recipeForm')
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const recipeName = recipeForm.querySelector('#recipe-name').value;
    const recipePhoto = recipeForm.querySelector('#recipe-photo').files[0];

    const recipeTypes = recipeForm.querySelector('.mealTypes').querySelectorAll('input[name="mealType"]:checked');
    const recipeTypesArray = Array.from(recipeTypes).map(recipeType => recipeType.value);

    const recipeDescription = recipeForm.querySelector('#recipe-description').value.replace(/\n/g, ' ');

    const recipeIngredients = ingredientsContainer.querySelectorAll('.ingredient_row');
    const recipeIngredientArray = Array.from(recipeIngredients);
    const recipeIngredientsArrayFormatted = recipeIngredientArray.map((ingredient, index) => {
        const recIngName = ingredient.querySelector('.ingredient-name').value;
        const recIngCount = ingredient.querySelector('.ingredient-count').value;
        const recIngMeasure = ingredient.querySelector('.ingredient-measure')
            .querySelector('option:checked').value;

        return {
            id: index,
            name: recIngName,
            weight: recIngCount,
            weightType: recIngMeasure
        };
    });

    const recipeCalories = document.querySelector('#recipe-calories').value;
    const recipeProtein = document.querySelector('#recipe-protein').value;
    const recipeFats = document.querySelector('#recipe-fats').value;
    const recipeCarbs = document.querySelector('#recipe-carbs').value;

    const formattedRecipeObject = {
        name: recipeName,
        description: recipeDescription,
        calories: recipeCalories,
        protein: recipeProtein,
        fats: recipeFats,
        carbs: recipeCarbs
    };

    const preparedRecipeBody = {
        recipe: formattedRecipeObject,
        mealTypes: recipeTypesArray,
        ingredients: recipeIngredientsArrayFormatted
    };

    // Add new recipe
    try {
        const response = await fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/food`, {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            },
            body: JSON.stringify(preparedRecipeBody)
        });

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();

        const formData = new FormData();
        formData.append('file', recipePhoto);

        const uploadResponse = await fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/food/${data.id}`, {
            method: 'POST',
            headers: {
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Ошибка загрузки фото: ${uploadResponse.status}`);
        }

        alert('Рецепт успешно добавлен');
        popup.classList.remove("active");
        loadReceipes()
    } catch (error) {
        alert(`Ошибка: ${error.message}`);
        console.error(error);
    }
});

async function loadReceipes() {

    try {
        const response = await fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/food`, {
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

        receipesContainer.innerHTML = `
            <button id="open_pop_up" class="open_pop_up">
                        <span class="plus-sign">+</span>
            </button>
        `;
        const openPopup=document.getElementById("open_pop_up");
        openPopup.addEventListener("click", function (e){
            e.preventDefault();
            popup.classList.add("active");
        })
        closePopup.addEventListener("click", ()=>{
            popup.classList.remove("active");
        })

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
                <img src="../../img/cal.svg" alt="калории">
                <div class="cal">${recipe.calories} ккал</div>
            </div>
        `;
            receipesContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }

}
const receipesContainer = document.querySelector('.receipes');
loadReceipes();


