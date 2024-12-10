const checkGuestFun = () => {
    if (localStorage.getItem('user_token')) {
        if (window.location.href.split('/').includes('pages')) {
            window.location.href = 'plan.html' || '404.html';
        } else {
            window.location.href =  './pages/plan.html' || '404.html';
        }
    }
}

checkGuestFun()