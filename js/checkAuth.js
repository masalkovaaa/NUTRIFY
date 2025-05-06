const checkAuthFun = () => {
    const token = localStorage.getItem('user_token')
    if (!token) {
        console.log('--')
        window.location.href = window.location.origin + '/NUTRIFY/pages/authorization.html';
    } else {

    }
}

checkAuthFun()
