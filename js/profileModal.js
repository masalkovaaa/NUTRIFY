const client = document.getElementById('client');
const modal = document.getElementById('modal');
const logout = document.getElementById('logout');
const adminPanel = document.getElementById('adminPanel');
const adminPanelCollapsed = document?.getElementById('adminPanelCollapsed');

const clientCollapsed = document?.getElementById('clientCollapsed');
const modalCollapsed = document?.getElementById('modalCollapsed');
const logoutCollapsed = document?.getElementById('logoutCollapsed');


const clientName = client.querySelector('.name')
const clientNameCollapsed = clientCollapsed?.querySelector('.name')

const fetchUser = () => {
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
            clientNameCollapsed.textContent=ans.name
            clientName.textContent=ans.name
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error);
        });
}
const user_role = localStorage.getItem('user_role')
if (user_role) {
  if (user_role === 'ADMIN') {
      if (clientNameCollapsed) clientNameCollapsed.textContent='Администратор';
      clientName.textContent='Администратор'
  }  else {
      if (adminPanel) adminPanel.classList.add('disabledItem')
      if (adminPanelCollapsed) adminPanelCollapsed.classList.add('disabledItem')
      fetchUser()
  }
}

client.addEventListener('click', () => {
    modal.classList.toggle('active');
    client.classList.toggle('active');
});

if (clientCollapsed) {
    clientCollapsed.addEventListener('click', () => {
        modalCollapsed.classList.toggle('active');
        clientCollapsed.classList.toggle('active');
    });
}

document.addEventListener('click', (event) => {
    if (!client.contains(event.target) && !modal.contains(event.target)) {
        modal.classList.remove('active');
        client.classList.remove('active');
    }

    if (!clientCollapsed.contains(event.target) && !modalCollapsed.contains(event.target)) {
        modalCollapsed.classList.remove('active');
        clientCollapsed.classList.remove('active');
    }
});

logout.addEventListener('click', () => {
    modal.classList.remove('active');
    client.classList.remove('active');

    localStorage.removeItem('user_token')
    window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
});

if (logoutCollapsed) {
    logoutCollapsed.addEventListener('click', () => {
        modalCollapsed.classList.remove('active');
        clientCollapsed.classList.remove('active');

        localStorage.removeItem('user_token')
        window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
    });
}

if (adminPanel) {
    adminPanel.addEventListener('click', () => {
        window.location.href = window.location.origin + '/NUTRIFY/pages/admin/admin_receipe.html';
    });
}

if (adminPanelCollapsed) {
    adminPanelCollapsed.addEventListener('click', () => {
        window.location.href = window.location.origin + '/NUTRIFY/pages/admin/admin_receipe.html';
    });
}