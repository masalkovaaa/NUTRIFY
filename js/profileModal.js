const client = document.getElementById('client');
const modal = document.getElementById('modal');
const logout = document.getElementById('logout');

const clientCollapsed = document.getElementById('clientCollapsed');
const modalCollapsed = document.getElementById('modalCollapsed');
const logoutCollapsed = document.getElementById('logoutCollapsed');

const clientName = client.querySelector('.name')
const clientNameCollapsed = clientCollapsed.querySelector('.name')
console.log(client);
const fetchUser = () => {
    fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/users`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            'Auth': 'Bearer ' + localStorage.getItem('user_token')
        }
    })
        .then(ans => ans.json())
        .then(ans => {
            clientNameCollapsed.textContent=ans.name
            clientName.textContent=ans.name
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error);
        });
}

fetchUser()

client.addEventListener('click', () => {
    modal.classList.toggle('active');
    client.classList.toggle('active');
});

clientCollapsed.addEventListener('click', () => {
    modalCollapsed.classList.toggle('active');
    clientCollapsed.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!client.contains(event.target) && !modal.contains(event.target)) {
        modal.classList.remove('active');
        client.classList.remove('active');
    }

    if (!clientCollapsed.contains(event.target) && !modal.contains(event.target)) {
        modalCollapsed.classList.remove('active');
        clientCollapsed.classList.remove('active');
    }
});

logout.addEventListener('click', () => {
    modal.classList.remove('active');
    client.classList.remove('active');

    localStorage.removeItem('user_token')
    window.location.href = 'authorization.html' || '404.html';
});

logoutCollapsed.addEventListener('click', () => {
    modalCollapsed.classList.remove('active');
    clientCollapsed.classList.remove('active');

    localStorage.removeItem('user_token')
    window.location.href = 'authorization.html' || '404.html';
});
