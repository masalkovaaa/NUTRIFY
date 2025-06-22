const checkAuthFun = () => {
    console.log(1231331);
    const token = localStorage.getItem('user_token')

    if (!token) {
        console.log('--')
        localStorage.removeItem('user_role')
        window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
    } else {
        fetch(`https://bbauqjhj0cs4r7i0grq1.containers.yandexcloud.net/auth/check`, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Auth': 'Bearer ' + localStorage.getItem('user_token')
            }
        })
            .then(response => {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                if (!response.ok) {
                    throw new Error(`Error ${response.status}`);
                }
                return response.text();
            })
            .then(ans => {
                localStorage.setItem('user_role', ans)
            })
            .catch(error => {
                if (error.name === 'TypeError') {
                    return;
                }

                console.error('Ошибка при запросе:', error);
                localStorage.removeItem('user_token')
                localStorage.removeItem('user_role')
                window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
            });
    }
}

checkAuthFun()