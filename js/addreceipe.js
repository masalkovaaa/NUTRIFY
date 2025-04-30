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
    <input type="text" placeholder="Ингредиент" required>
    <input type="number" placeholder="Количество" required>
    <select>
      <option value="граммы">граммы</option>
      <option value="штуки">штуки</option>
    </select>
  `;
    ingredientsContainer.appendChild(row);
};

// document.getElementById('recipeForm').addEventListener('submit', async function (e) {
//     e.preventDefault();
//
//     const form = e.target;
//
//     // Название блюда
//     const title = form.querySelector('input[type="text"]').value.trim();
//
//     // Пошаговый рецепт (описание)
//     const description = form.querySelector('textarea').value.trim();
//
//     // Типы блюда (checkbox)
//     const mealTypes = Array.from(form.querySelectorAll('input[name="mealType"]:checked'))
//         .map(input => {
//             switch (input.value.toLowerCase()) {
//                 case 'Завтрак': return 'BREAKFAST';
//                 case 'Обед': return 'LAUNCH';
//                 case 'Ужин': return 'DINNER';
//                 case 'Перекус': return 'PART_MEAL';
//                 default: return '';
//             }
//         }).filter(type => type !== '');
//
//     // Ингредиенты
//     const ingredientRows = form.querySelectorAll('#ingredients .ingredient_row');
//     const ingredients = Array.from(ingredientRows).map(row => {
//         const inputs = row.querySelectorAll('input, select');
//         return {
//             id: 0,
//             name: inputs[0].value.trim(),
//             weight: Number(inputs[1].value),
//             weightType: inputs[2].value.toUpperCase() === 'ГРАММЫ' ? 'GRAM' : 'PIECE'
//         };
//     });
//
//     // КБЖУ
//     const kbjuInputs = form.querySelectorAll('.kbju input');
//     const calories = Number(kbjuInputs[0].value);
//     const protein = Number(kbjuInputs[1].value);
//     const fats = Number(kbjuInputs[2].value);
//     const carbs = Number(kbjuInputs[3].value);
//
//     // Собираем общий объект
//     const recipeData = {
//         recipe: {
//             id: 0,
//             name: title,
//             description: description,
//             calories: calories,
//             protein: protein,
//             fats: fats,
//             carbs: carbs
//         },
//         mealTypes: mealTypes,
//         ingredients: ingredients
//     };
//
//     try {
//         const response = await fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/food`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(recipeData)
//         });
//
//         if (!response.ok) {
//             throw new Error(`Ошибка сервера: ${response.status}`);
//         }
//
//         const result = await response.json();
//         console.log('Рецепт успешно сохранён:', result);
//
//         form.reset();
//         alert('Рецепт успешно добавлен!');
//     } catch (error) {
//         console.error('Ошибка отправки:', error);
//         alert('Не удалось сохранить рецепт.');
//     }
// });


