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
        const response = await fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/food`, {
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

        const uploadResponse = await fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/food/${data.id}`, {
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

// EDIT RECIPE
function openEditModal(recipe) {
    document.getElementById('edit-pop-up-body').dataset.id = recipe.id;

    document.getElementById('editPopup').style.display = 'flex';

    document.getElementById('edit-recipe-name').value = recipe.name || '';
    document.getElementById('edit-recipe-description').value = recipe.description || '';

    const mealTypes = document.querySelectorAll('input[name="editMealType"]');
    mealTypes.forEach(checkbox => {
        checkbox.checked = recipe.mealTypes?.includes(checkbox.value);
    });

    const container = document.getElementById('edit-ingredients');
    container.innerHTML = ''; // очистим перед вставкой
    recipe.ingredients?.forEach(ingredient => {
        const row = document.createElement('div');
        row.dataset.id = String(ingredient.id);
        row.classList.add('ingredient_row');
        row.innerHTML = `
      <input class="ingredient-name" type="text" placeholder="Ингредиент" required value="${ingredient.name}">
      <input class="ingredient-count" type="number" placeholder="Количество" required value="${ingredient.weight}">
      <select class="ingredient-measure">
        <option value="GRAM" ${ingredient.weightType === 'GRAM' ? 'selected' : ''}>граммы</option>
        <option value="COUNT" ${ingredient.weightType === 'COUNT' ? 'selected' : ''}>штуки</option>
      </select>
    `;
        container.appendChild(row);
    });

    document.getElementById('edit-recipe-calories').value = recipe.calories || 0;
    document.getElementById('edit-recipe-protein').value = recipe.protein || 0;
    document.getElementById('edit-recipe-fats').value = recipe.fats || 0;
    document.getElementById('edit-recipe-carbs').value = recipe.carbs || 0;
}

const closeEditModal = () => {
    document.getElementById('editPopup').style.display = 'none';
}

document.getElementById('editPopupClose').addEventListener('click', closeEditModal);

document.getElementById('editAddIngredient').addEventListener('click', function () {
    const ingredientsContainer = document.getElementById('edit-ingredients');

    const newRow = document.createElement('div');
    newRow.classList.add('ingredient_row');

    newRow.innerHTML = `
    <input class="ingredient-name" type="text" placeholder="Ингредиент" required>
    <input class="ingredient-count" type="number" placeholder="Количество" required>
    <select class="ingredient-measure">
      <option value="GRAM">граммы</option>
      <option value="COUNT">штуки</option>
    </select>
  `;

    ingredientsContainer.appendChild(newRow);
});

document.getElementById('editRecipeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const recipeId = document.getElementById('edit-pop-up-body').dataset.id

    const name = document.getElementById('edit-recipe-name').value.trim();
    const description = document.getElementById('edit-recipe-description').value.trim();
    const calories = parseFloat(document.getElementById('edit-recipe-calories').value);
    const protein = parseFloat(document.getElementById('edit-recipe-protein').value);
    const fats = parseFloat(document.getElementById('edit-recipe-fats').value);
    const carbs = parseFloat(document.getElementById('edit-recipe-carbs').value);

    const mealTypes = Array.from(document.querySelectorAll('input[name="editMealType"]:checked')).map(el => el.value);

    const ingredients = Array.from(document.querySelectorAll('#edit-ingredients .ingredient_row')).map(row => ({
        id: +row.dataset.id,
        name: row.querySelector('.ingredient-name').value.trim(),
        weight: parseFloat(row.querySelector('.ingredient-count').value),
        weightType: row.querySelector('.ingredient-measure').value
    }));

    const updatedRecipe = {
        id: +recipeId,
        name,
        description,
        calories,
        protein,
        fats,
        carbs,
        mealTypes,
    };

    console.log(updatedRecipe);

    try {
        const recipeUpdatePromise = fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/recipes`, {
            method: 'PUT',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            },
            body: JSON.stringify(updatedRecipe)
        });

        const ingredientUpdatePromises = ingredients.map(ingredient => {
            console.log(ingredient);
                fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/recipes`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        'Auth': 'Bearer ' + localStorage.getItem('user_token')
                    },
                    body: JSON.stringify(ingredient)
                })
        });

        await Promise.all([recipeUpdatePromise, ...ingredientUpdatePromises])
            .then(_ => {
                loadReceipes();
                closeEditModal()
            });

    } catch (error) {
        console.log(error?.message || error);
    }
});
// --------------


async function loadReceipes() {

    try {
        const response = await fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/food`, {
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
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('receipe');
            recipeDiv.dataset.recipeId = recipe.id;

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

            recipeDiv.addEventListener('click', () => openEditModal(recipe));
            receipesContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }

}
const receipesContainer = document.querySelector('.receipes');
loadReceipes();



