const checkAuthFun = () => {
    if (!localStorage.getItem('user_token')) {
        window.location.href = 'authorization.html' || '404.html';
    }
}

checkAuthFun()