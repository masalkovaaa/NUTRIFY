let selectedDate = null;

function calendar(id, year, month) {
    const Dlast = new Date(year, month + 1, 0).getDate();
    const D = new Date(year, month, Dlast);
    const DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay();
    const DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay();
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    let calendar = '<tr>';

    if (DNfirst !== 0) {
        for (let i = 1; i < DNfirst; i++) calendar += '<td>';
    } else {
        for (let i = 0; i < 6; i++) calendar += '<td>';
    }

    for (let i = 1; i <= Dlast; i++) {
        let dayClass = '';
        if (i === new Date().getDate() && D.getFullYear() === new Date().getFullYear() && D.getMonth() === new Date().getMonth()) {
            dayClass = 'class="today"';
            selectedDate = new Date(D.getFullYear(), D.getMonth(), i);
        }

        calendar += `<td ${dayClass} data-day="${i}" data-month="${D.getMonth()}" data-year="${D.getFullYear()}">${i}</td>`;
        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() === 0) {
            calendar += '<tr>';
        }
    }

    for (let i = DNlast; i < 7; i++) calendar += '<td>';

    document.querySelector(`#${id} tbody`).innerHTML = calendar;
    document.querySelector(`#${id} thead td:nth-child(2)`).textContent = `${monthNames[D.getMonth()]} ${D.getFullYear()}`;
    document.querySelector(`#${id} thead td:nth-child(2)`).dataset.month = D.getMonth();
    document.querySelector(`#${id} thead td:nth-child(2)`).dataset.year = D.getFullYear();

    if (document.querySelectorAll(`#${id} tbody tr`).length < 6) {
        document.querySelector(`#${id} tbody`).innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td>';
    }

    if (!selectedDate) {
        selectedDate = new Date();
    }
    document.querySelector(`#${id}`).dataset.selectedDate = selectedDate.toLocaleDateString('ru-RU');

    document.querySelectorAll(`#${id} tbody td[data-day]`).forEach(td => {
        td.onclick = function() {
            document.querySelectorAll(`#${id} tbody td.today`).forEach(cell => cell.classList.remove('today'));
            selectedDate = new Date(this.dataset.year, this.dataset.month, this.dataset.day);
            this.classList.add('today');
            document.querySelector(`#${id}`).dataset.selectedDate = selectedDate.toLocaleDateString('ru-RU');
            document.querySelector(`#${id} thead td:nth-child(2)`).textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
            fetchRecipes();
        };
    });

    document.querySelector(`#${id} thead td:nth-child(2)`).textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
}

calendar("calendar", new Date().getFullYear(), new Date().getMonth());

document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) - 1);
};

document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1);
};


// plan recipes

const getSelectedDate = () => {
    const selectedDateString = document.querySelector('#calendar').dataset.selectedDate;
    if (selectedDateString) {
        const splittedSelectedDate = selectedDateString.split('.')
        return `${splittedSelectedDate[2]}-${splittedSelectedDate[1]}-${splittedSelectedDate[0]}`;
    } else {
        return null;
    }
}

const fetchRecipes = () => {
    const selectedDate = getSelectedDate();
    if (!selectedDate) {
        console.log('Дата не выбрана!');
        return;
    }

    fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/food/diet?date=${selectedDate}`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            'Auth': 'Bearer ' + localStorage.getItem('user_token')
        }
    })
        .then(ans => ans.json())
        .then(ans => {
            if (Array.isArray(ans) && ans.length === 0) {
                setTimeout(fetchRecipes, 2000);
            } else {
                displayRecipes(ans);
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error);
        });
}

const mealTypes = {
    'LAUNCH': 'Обед',
    'BREAKFAST': 'Завтрак',
    'DINNER': 'Ужин',
    'PART_MEAL': 'Перекус'
}

const displayRecipes = (recipes) => {
    const mainElement = document.querySelector('.main_1');
    const mainTitle = mainElement.querySelector('.main_title');
    const mainGoal = mainElement.querySelector('.main_goal');
    const recipesContainer = document.createElement('div');

    recipesContainer.classList.add('recipes-container');

    const totalCalories = recipes.reduce((sum, recipe) => sum + recipe.recipe.calories, 0);

    mainGoal.querySelector('.goal_text').querySelector('span').textContent = totalCalories + ' Ккал'

    mainElement.innerHTML = '';
    mainElement.appendChild(mainTitle);
    mainElement.appendChild(mainGoal);
    mainElement.appendChild(recipesContainer);

    recipes.forEach(recipe => {
        const recipeInfo = recipe.recipe
        const mealType = recipe.mealType

        const dishDiv = document.createElement('div');
        dishDiv.classList.add('dish');
        dishDiv.setAttribute('data-id', recipeInfo.id);

        const dishImageContainer = document.createElement('div')
        dishImageContainer.classList.add('dish_image_container')

        if (recipeInfo.image) {
            const dishImage = document.createElement('img');
            dishImage.src = recipeInfo.image;
            dishImage.alt = recipeInfo.name;
            dishImage.classList.add('dish_image');

            dishImageContainer.appendChild(dishImage)
        } else {
            const dishImage = document.createElement('div');
            dishImage.classList.add('dish_image');

            dishImageContainer.appendChild(dishImage)
        }

        dishDiv.appendChild(dishImageContainer);

        const dishInfoDiv = document.createElement('div');
        dishInfoDiv.classList.add('dish_info');

        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal');
        mealDiv.textContent = mealTypes[mealType];
        dishInfoDiv.appendChild(mealDiv);

        const dishNameDiv = document.createElement('div');
        dishNameDiv.classList.add('dish_name');
        dishNameDiv.textContent = recipeInfo.name;
        dishInfoDiv.appendChild(dishNameDiv);

        const caloriesDiv = document.createElement('div');
        caloriesDiv.classList.add('callory_dish');
        caloriesDiv.textContent = `${recipeInfo.calories} ккал`;
        dishInfoDiv.appendChild(caloriesDiv);

        dishDiv.appendChild(dishInfoDiv);
        recipesContainer.appendChild(dishDiv);

        dishDiv.addEventListener('click', () => {
            console.log(13131);
            const recipeId = recipeInfo.id;
            window.location.href = `receipe_information.html?id=${recipeId}`;
        });
    });
}


fetchRecipes();
