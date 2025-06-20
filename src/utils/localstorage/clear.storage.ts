export const ClearUserLogin = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
}