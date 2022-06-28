// export const BaseURL = "https://apid.ezeelink.co.id/mobile-demo/mobile1"
export const BaseURL = "https://api.ezeelink.co.id/ezpaygateway/portal"

export const authorization = "Basic ZXplZWxpbms6ZXplZWxpbms="

// export const authBearer = "Basic ZXplZWxpbms6ZXplZWxpbms="

export const setUserSession = (token) => {
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token)
}

export const getToken = () => {
    return localStorage.getItem("token") || null
}

export const removeUserSession = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}