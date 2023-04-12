if(sessionStorage.getItem('jwtToken') == null)
{
    window.location.href = 'http://127.0.0.1:5500/unauthorized.html';
}