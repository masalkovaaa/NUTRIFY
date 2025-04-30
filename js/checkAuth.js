const checkAuthFun = () => {
    if (!localStorage.getItem('user_token')) {
        console.log('--')
        window.location.href = 'authorization.html' || '404.html';
    }
}

checkAuthFun()