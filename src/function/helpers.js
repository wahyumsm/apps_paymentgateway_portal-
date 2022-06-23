export const BaseURL = "https://apid.ezeelink.co.id/mobile-demo/mobile1"

export const authorization = "Basic ZXplZWxpbms6ZXplZWxpbms="

export const setUserSession = (token) => {
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token)
}
// export const authBearer = "Basic ZXplZWxpbms6ZXplZWxpbms="