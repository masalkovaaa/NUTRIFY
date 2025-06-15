let selectedDate = null;

function calendar(id, year, month) {
    const Dlast = new Date(year, month + 1, 0).getDate();
    const D = new Date(year, month, Dlast);
    const DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay();
    const DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay();
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    let calendarHtml = '<tr>';

    if (DNfirst !== 0) {
        for (let i = 1; i < DNfirst; i++) calendarHtml += '<td>';
    } else {
        for (let i = 0; i < 6; i++) calendarHtml += '<td>';
    }

    for (let i = 1; i <= Dlast; i++) {
        let dayClass = '';
        if (i === new Date().getDate() && D.getFullYear() === new Date().getFullYear() && D.getMonth() === new Date().getMonth()) {
            dayClass = 'class="today"';
            selectedDate = new Date(D.getFullYear(), D.getMonth(), i);
        }

        calendarHtml += `<td ${dayClass} data-day="${i}" data-month="${D.getMonth()}" data-year="${D.getFullYear()}">${i}</td>`;
        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() === 0) {
            calendarHtml += '<tr>';
        }
    }

    for (let i = DNlast; i < 7; i++) calendarHtml += '<td>';

    const calendarElem = document.querySelector(`#${id}`);
    calendarElem.querySelector('tbody').innerHTML = calendarHtml;
    const header = calendarElem.querySelector('thead td:nth-child(2)');
    header.textContent = `${monthNames[D.getMonth()]} ${D.getFullYear()}`;
    header.dataset.month = D.getMonth();
    header.dataset.year = D.getFullYear();

    if (calendarElem.querySelectorAll('tbody tr').length < 6) {
        calendarElem.querySelector('tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td>';
    }

    if (!selectedDate) {
        selectedDate = new Date();
    }

    calendarElem.dataset.selectedDate = selectedDate.toLocaleDateString('ru-RU');

    calendarElem.querySelectorAll('tbody td[data-day]').forEach(td => {
        td.onclick = function () {
            calendarElem.querySelectorAll('tbody td.today').forEach(cell => cell.classList.remove('today'));
            selectedDate = new Date(this.dataset.year, this.dataset.month, this.dataset.day);
            this.classList.add('today');
            calendarElem.dataset.selectedDate = selectedDate.toLocaleDateString('ru-RU');
            header.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
            fetchRecipes();
        };
    });
}

// Инициализация обоих календарей
calendar("calendar", new Date().getFullYear(), new Date().getMonth());
calendar("calendarNewVersion", new Date().getFullYear(), new Date().getMonth());

// Навигация для calendar
document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year,
        parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) - 1);
};

document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year,
        parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1);
};

// Навигация для calendarNewVersion
document.querySelector('#calendarNewVersion thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
    calendar("calendarNewVersion", document.querySelector('#calendarNewVersion thead td:nth-child(2)').dataset.year,
        parseFloat(document.querySelector('#calendarNewVersion thead td:nth-child(2)').dataset.month) - 1);
};

document.querySelector('#calendarNewVersion thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
    calendar("calendarNewVersion", document.querySelector('#calendarNewVersion thead td:nth-child(2)').dataset.year,
        parseFloat(document.querySelector('#calendarNewVersion thead td:nth-child(2)').dataset.month) + 1);
};

const getSelectedDate = () => {
    const oldCalendar = document.querySelector('#calendar');
    const newCalendar = document.querySelector('#calendarNewVersion');

    // Проверка видимости старого календаря
    const isOldCalendarVisible = oldCalendar && oldCalendar.offsetParent !== null;

    const sourceCalendar = isOldCalendarVisible ? oldCalendar : newCalendar;

    if (sourceCalendar?.dataset.selectedDate) {
        const [day, month, year] = sourceCalendar.dataset.selectedDate.split('.');
        return `${year}-${month}-${day}`;
    } else {
        return null;
    }
};


const fetchRecipes = () => {
    const selectedDate = getSelectedDate();
    if (!selectedDate) {
        console.log('Дата не выбрана!');
        return;
    }

    fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/food/diet?date=${selectedDate}`, {
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
    const calendarToggle = document.getElementById('calendarToggle');
    const newCalendar = document.getElementById('newCalendar');
    const getOutButton = document.getElementById('getOutButton');
    const position_menu = document.getElementById('position_menu');

    recipesContainer.classList.add('recipes-container');

    const totalCalories = recipes.reduce((sum, recipe) => sum + recipe.recipe.calories, 0);

    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('title-wrapper');
    titleWrapper.appendChild(mainTitle);
    titleWrapper.appendChild(getOutButton);
    getOutButton.classList.remove('getout_button');

    const goalWithCalendar = document.createElement('div');
    goalWithCalendar.classList.add('goalWithCalendar');
    goalWithCalendar.appendChild(mainGoal);
    goalWithCalendar.appendChild(calendarToggle);

    mainElement.appendChild(goalWithCalendar);

    mainGoal.querySelector('.goal_text').querySelector('span')
        .textContent = totalCalories + ' Ккал'

    mainElement.innerHTML = '';
    mainElement.appendChild(titleWrapper);
    mainElement.appendChild(goalWithCalendar);
    mainElement.appendChild(newCalendar);
    mainElement.appendChild(recipesContainer);
    mainElement.appendChild(position_menu);

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
            const recipeId = recipeInfo.id;
            window.location.href = `receipe_information.html?id=${recipeId}`;
        });
    });
}

fetchRecipes();

const calendarToggleBtn = document.getElementById('calendarToggle');
const newCalendar = document.getElementById('newCalendar');

calendarToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    newCalendar.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (
        newCalendar.classList.contains('active') &&
        !newCalendar.contains(event.target) &&
        !calendarToggleBtn.contains(event.target)
    ) {
        newCalendar.classList.remove('active');
    }
});


// weight alert

async function checkWeightChangeNeeded()  {
    const weightUpdateNeeded = await fetch("https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/personal_data/is_possible_to_update", {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Auth": 'Bearer ' + localStorage.getItem('user_token'),
        }
    })
        .then(response => response.json())
        .catch(() => false);

    if (weightUpdateNeeded) {
        document
            .querySelector('.weight-alert-wrapper').classList
            .remove('weight-alert-is-closed')
    }
}

checkWeightChangeNeeded()

