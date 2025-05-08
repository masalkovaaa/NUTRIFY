const checkAdminAuth = () => {
    const token = localStorage.getItem('user_token')

    if (!token) {
        window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
    } else {
        fetch(`https://bbaacidek4p8ta9ovmn1.containers.yandexcloud.net/auth/check`, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            }
        })
            .then(ans => ans.text())
            .then(ans => {
                if (ans !== 'ADMIN') window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
                localStorage.setItem('user_role', ans)
            })
            .catch(error => {
                console.error('Ошибка при запросе:', error);
                localStorage.removeItem('user_token')
                localStorage.removeItem('user_role')
                window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
            });
    }
}

checkAdminAuth()