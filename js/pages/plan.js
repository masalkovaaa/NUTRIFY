let selectedDate = null;

function calendar(id, year, month) {
    var Dlast = new Date(year, month + 1, 0).getDate(),
        D = new Date(year, month, Dlast),
        DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
        DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
        calendar = '<tr>',
        month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    if (DNfirst != 0) {
        for (var i = 1; i < DNfirst; i++) calendar += '<td>';
    } else {
        for (var i = 0; i < 6; i++) calendar += '<td>';
    }

    for (var i = 1; i <= Dlast; i++) {
        let dayClass = '';
        if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
            dayClass = 'class="today"';
            selectedDate = new Date(D.getFullYear(), D.getMonth(), i); // Устанавливаем текущую дату
        }

        calendar += `<td ${dayClass} data-day="${i}" data-month="${D.getMonth()}" data-year="${D.getFullYear()}">${i}</td>`;
        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
            calendar += '<tr>';
        }
    }

    for (var i = DNlast; i < 7; i++) calendar += '<td>';

    document.querySelector('#' + id + ' tbody').innerHTML = calendar;
    document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = month[D.getMonth()] + ' ' + D.getFullYear();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();

    if (document.querySelectorAll('#' + id + ' tbody tr').length < 6) {
        document.querySelector('#' + id + ' tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td> ';
    }

    if (!selectedDate) {
        selectedDate = new Date();
    }
    document.querySelector('#' + id).dataset.selectedDate = selectedDate.toISOString(); // Сохраняем выбранную дату

    document.querySelectorAll('#' + id + ' tbody td[data-day]').forEach(td => {
        td.onclick = function() {
            document.querySelectorAll(`#${id} tbody td.today`).forEach(cell => {
                cell.classList.remove('today');
            });
            selectedDate = new Date(this.dataset.year, this.dataset.month, this.dataset.day);
            this.classList.add('today');
            document.querySelector('#' + id).dataset.selectedDate = selectedDate.toISOString();
            document.querySelector('#' + id + ' thead td:nth-child(2)').textContent = `${month[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

            fetchRecipes()
        };
    });

    document.querySelector('#' + id + ' thead td:nth-child(2)').textContent = `${month[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
}

calendar("calendar", new Date().getFullYear(), new Date().getMonth());

document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) - 1);
}

document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1);
}

// plan recipes

const getSelectedDate = () => {
    const selectedDateString = document.querySelector('#calendar').dataset.selectedDate;
    if (selectedDateString) {
        return new Date(selectedDateString).toISOString().split('T')[0]; // Форматируем дату в ISO
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
            displayRecipes(ans);
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error);
        });
}



const displayRecipes = (recipes) => {
    const mainElement = document.querySelector('.main_1');
    const mainTitle = mainElement.querySelector('.main_title');
    const mainGoal = mainElement.querySelector('.main_goal');
    const recipesContainer = document.createElement('div');

    recipesContainer.classList.add('recipes-container');

    const totalCalories = recipes.reduce((sum, recipe) => sum + recipe.calories, 0);

    mainGoal.querySelector('.goal_text').querySelector('span').textContent = totalCalories + ' Ккал'

    mainElement.innerHTML = '';
    mainElement.appendChild(mainTitle);
    mainElement.appendChild(mainGoal);
    mainElement.appendChild(recipesContainer);

    recipes.forEach(recipe => {
        const dishDiv = document.createElement('div');
        dishDiv.classList.add('dish');

        const dishImage = document.createElement('img');
        dishImage.src = recipe.image;
        dishImage.alt = recipe.name;
        dishImage.classList.add('dish_image');
        dishDiv.appendChild(dishImage);

        const dishInfoDiv = document.createElement('div');
        dishInfoDiv.classList.add('dish_info');

        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal');
        mealDiv.textContent = 'Завтрак'; // Пример: можно добавить динамическое определение приема пищи
        dishInfoDiv.appendChild(mealDiv);

        const dishNameDiv = document.createElement('div');
        dishNameDiv.classList.add('dish_name');
        dishNameDiv.textContent = recipe.name;
        dishInfoDiv.appendChild(dishNameDiv);

        const caloriesDiv = document.createElement('div');
        caloriesDiv.classList.add('callory_dish');
        caloriesDiv.textContent = `${recipe.calories} ккал`;
        dishInfoDiv.appendChild(caloriesDiv);

        dishDiv.appendChild(dishInfoDiv);
        recipesContainer.appendChild(dishDiv);
    });
}


fetchRecipes();