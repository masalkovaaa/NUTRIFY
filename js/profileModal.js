const client = document.getElementById('client');
const modal = document.getElementById('modal');
const logout = document.getElementById('logout');

const clientName = client.querySelector('.name')

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

document.addEventListener('click', (event) => {
    if (!client.contains(event.target) && !modal.contains(event.target)) {
        modal.classList.remove('active');
        client.classList.remove('active');
    }
});

logout.addEventListener('click', () => {
    modal.classList.remove('active');
    client.classList.remove('active');

    localStorage.removeItem('user_token')
    window.location.href = 'authorization.html' || '404.html';
});
