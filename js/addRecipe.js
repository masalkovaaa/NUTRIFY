const openPopup=document.getElementById("open_pop_up");
const closePopup= document.getElementById("pop_up_close");
const popup = document.getElementById("pop_up");
const addIngredientBtn = document.getElementById('addIngredient');
const ingredientsContainer = document.getElementById('ingredients');

openPopup.addEventListener("click", function (e){
    e.preventDefault();
    popup.classList.add("active");
})
closePopup.addEventListener("click", ()=>{
    popup.classList.remove("active");
})

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
    e.preventDefault()

    const recipeName = recipeForm.querySelector('#recipe-name').value;

    const recipePhoto = recipeForm.querySelector('#recipe-photo').files[0];

    const recipeTypes = recipeForm.querySelector('.mealTypes').querySelectorAll('input[name="mealType"]:checked')
    const recipeTypesArray = Array.from(recipeTypes).map(recipeType => recipeType.value);

    const recipeDescription = recipeForm.querySelector('#recipe-description').value.replace(/\n/g, ' ');

    const recipeIngredients = ingredientsContainer.querySelectorAll('.ingredient_row')
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
        }
    })

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
    }

    const preparedRecipeBody = {
        recipe: formattedRecipeObject,
        mealTypes: recipeTypesArray,
        ingredients: recipeIngredientsArrayFormatted
    }

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

        if (response.status !== 201) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        alert('Рецепт успешно добавлен')
        console.log('Рецепт успешно сохранён:');

        popup.classList.remove("active");
    } catch (error) {
        alert(`Ошибка отправки: ${error}`)
        console.error('Ошибка отправки:', error);
    }

    // add photo for new recipe
    // process
})


