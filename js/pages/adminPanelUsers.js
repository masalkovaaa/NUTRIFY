const token = localStorage.getItem('user_token');

fetch('https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/admin/users', {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        'Auth': 'Bearer ' + token
    }
})
    .then(res => res.json())
    .then(users => {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        users.forEach((user, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
        `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        console.error('Ошибка при получении пользователей:', err);
    });