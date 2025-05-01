const checkAuthFun = () => {
    const token = localStorage.getItem('user_token')
    if (!token) {
        console.log('--')
        window.location.href = 'authorization.html' || '404.html';
    } else {

    }
}

checkAuthFun()

// const token = localStorage.getItem(LOCAL_STORAGE_USER_TOKEN);
// if (token) {
//     const tokenInfo: tokenInfoTypes = jwtDecode(token || '')
//
//     if (tokenInfo.exp) {
//         const currentDate = new Date()
//         const expTokenDate = new Date(tokenInfo.exp * 1000)
//
//         if (currentDate > expTokenDate) {
//             state.role = undefined;
//             state.isAuth = false;
//             localStorage.removeItem(LOCAL_STORAGE_USER_TOKEN)
//         } else {
//             state.role = tokenInfo.role as UserRoles;
//             state.isAuth = true;
//         }
//     }
// }