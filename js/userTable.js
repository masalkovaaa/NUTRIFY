// const fetchUsers = () => {
//     fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/users`, {
//         method: 'GET',
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Content-Type": "application/json",
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Ошибка запроса: ${response.statusText}`);
//             }
//             return response.json();
//         })
//         .then(users => {
//             const tbody = document.querySelector('#usersTable tbody');
//             tbody.innerHTML = '';
//
//             users.forEach((user, index) => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                 <td>${index + 1}</td>
//                 <td>${user.name || '—'}</td>
//                 <td>${user.email || '—'}</td>
//             `;
//                 tbody.appendChild(row);
//             });
//         })
//         .catch(error => {
//             console.error('Ошибка при загрузке данных:', error);
//         });
// };
//
// fetchUsers();
