export const BaseURL = "https://apid.ezeelink.co.id/mobile-demo/mobile1"
// export const BaseURL = "https://api.ezeelink.co.id/ezpaygateway/portal"

export const authorization = "Basic ZXplZWxpbms6ZXplZWxpbms="

// export const authBearer = "Basic ZXplZWxpbms6ZXplZWxpbms="

export const setUserSession = (token) => {
    localStorage.setItem("token", token)
    sessionStorage.setItem("token", token);
}

export const setRoleSession = (role) => {
    localStorage.setItem("role", role)
    sessionStorage.setItem("role", role);
}

export const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token") || null
}

export const getRole = () => {
    return localStorage.getItem("role") || sessionStorage.getItem("role") || null
}

export const removeUserSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
}

export function convertToRupiah(money) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(money)
}

export function convertToCurrency(money) {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', currency: 'IDR', maximumFractionDigits: 2, currencyDisplay: "symbol"}).format(money).replace(/\B(?=(\d{4})+(?!\d))/g, ".")
}

export const convertFormatNumber = (num) => {
    let rupiah = "";
    let angkaRev = num.toString().split("").reverse().join("");
    for (var i = 0; i < angkaRev.length; i++) if (i % 3 === 0) rupiah += angkaRev.substr(i, 3) + ".";
    return rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("");
};

export function errorCatch(statusCode) {
    const code = {
        "401": "/login",
        "403": "/404",
    }
    return code[statusCode]
}