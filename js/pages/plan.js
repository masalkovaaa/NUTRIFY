let selectedDate = null;
let lastUpdateGlobal = null;

function toDateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calendar(id, year, month, lastUpdate) {
    if (lastUpdate) {
        lastUpdateGlobal = lastUpdate;
    } else if (lastUpdateGlobal) {
        lastUpdate = lastUpdateGlobal;
    }

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfMonth = new Date(year, month, totalDaysInMonth);
    const weekDayOfLastDate = lastDayOfMonth.getDay();
    const weekDayOfFirstDate = new Date(year, month, 1).getDay();

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    let calendarHtml = '<tr>';

    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;
    const lastAvailableDate = lastUpdateDate ? new Date(lastUpdateDate.getTime() + 13 * 24 * 60 * 60 * 1000) : null;

    if (weekDayOfFirstDate !== 0) {
        for (let i = 1; i < weekDayOfFirstDate; i++) {
            calendarHtml += '<td>';
        }
    } else {
        for (let i = 0; i < 6; i++) {
            calendarHtml += '<td>';
        }
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDayDate = new Date(year, month, day);
        let isSelectable = false;
        let isCurrentDay = false;

        if (lastUpdateDate) {
            const dayOnly = toDateOnly(currentDayDate);
            const startOnly = toDateOnly(lastUpdateDate);
            const endOnly = toDateOnly(lastAvailableDate);

            if (dayOnly >= startOnly && dayOnly <= endOnly) {
                isSelectable = true;
            }
        }

        const today = new Date();
        if (
            day === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
        ) {
            isCurrentDay = true;
            selectedDate = currentDayDate;
        }

        const tdClasses = [];
        if (isCurrentDay) tdClasses.push('today');
        if (!isSelectable) tdClasses.push('disabled');

        const classAttr = tdClasses.length ? ` class="${tdClasses.join(' ')}"` : '';

        calendarHtml += `<td${classAttr} data-day="${day}" data-month="${month}" data-year="${year}">${day}</td>`;

        if (currentDayDate.getDay() === 0) {
            calendarHtml += '<tr>';
        }
    }

    for (let i = weekDayOfLastDate; i < 7; i++) {
        calendarHtml += '<td>';
    }

    const calendarElement = document.querySelector(`#${id}`);
    calendarElement.querySelector('tbody').innerHTML = calendarHtml;

    const headerCell = calendarElement.querySelector('thead td:nth-child(2)');
    headerCell.textContent = `${monthNames[lastDayOfMonth.getMonth()]} ${lastDayOfMonth.getFullYear()}`;
    headerCell.dataset.month = lastDayOfMonth.getMonth();
    headerCell.dataset.year = lastDayOfMonth.getFullYear();

    const rowCount = calendarElement.querySelectorAll('tbody tr').length;
    if (rowCount < 6) {
        calendarElement.querySelector('tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td>';
    }

    if (!selectedDate) {
        selectedDate = new Date();
    }

    calendarElement.dataset.selectedDate = selectedDate.toLocaleDateString('ru-RU');

    calendarElement.querySelectorAll('tbody td[data-day]').forEach(td => {
        if (!td.classList.contains('disabled')) {
            td.onclick = function () {
                calendarElement.querySelectorAll('tbody td.today').forEach(cell => cell.classList.remove('today'));
                selectedDate = new Date(this.dataset.year, this.dataset.month, this.dataset.day);
                this.classList.add('today');
                calendarElement.dataset.selectedDate = selectedDate.toLocaleDateString('ru-RU');
                headerCell.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
                fetchRecipes();
            };
        }
    });
}


(function() {
    fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/users`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            'Auth': 'Bearer ' + localStorage.getItem('user_token')
        }
    })
        .then(ans => ans.json())
        .then(ans => {
            calendar("calendar", new Date().getFullYear(), new Date().getMonth(), ans.personalData.updatedAt);
            calendar("calendarNewVersion", new Date().getFullYear(), new Date().getMonth(), ans.personalData.updatedAt);

            fetchRecipes();
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error);
        });
})()

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

let countOfExecutes = 0
const fetchRecipes = () => {
    const selectedDate = getSelectedDate();
    if (!selectedDate) {
        console.log('Дата не выбрана!');
        return;
    }

    countOfExecutes++
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
                const delay = countOfExecutes < 3 ? 2500 : 15000;
                setTimeout(fetchRecipes, delay);
            } else {
                countOfExecutes = 0
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
    // getOutButton.classList.remove('getout_button');

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

