// export const BaseURL = "https://apid.ezeelink.co.id/mobile-demo/mobile1"
export const BaseURL = "https://api.ezeelink.co.id/ezpaygateway/portal"

export const authorization = "Basic ZXplZWxpbms6ZXplZWxpbms="

// export const authBearer = "Basic ZXplZWxpbms6ZXplZWxpbms="

export const setUserSession = (token) => {
    localStorage.setItem("token", token)
    sessionStorage.setItem("token", token);
}

export const getToken = () => {
    return localStorage.getItem("token") || null
}

export const removeUserSession = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}

export function convertToRupiah(money) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(money)
}

export function errorCatch(statusCode) {
    const code = {
        "401": "/login",
        "403": "/404",
    }
    return code[statusCode]
}