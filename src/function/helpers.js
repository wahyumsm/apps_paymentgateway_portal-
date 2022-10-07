// export const BaseURL = "https://api.ezeelink.co.id/mobile-demo/mobile3"
// export const BaseURL = "https://apid.ezeelink.co.id/snap/api2"
export const BaseURL = "https://api.ezeelink.co.id/ezpaygateway/portal"

export const authorization = "Basic ZXplZWxpbms6ZXplZWxpbms=";

// export const authBearer = "Basic ZXplZWxpbms6ZXplZWxpbms="

export const setUserSession = (token) => {
  localStorage.setItem("token", token);
  sessionStorage.setItem("token", token);
};

export const setRoleSession = (role) => {
  localStorage.setItem("role", role);
  sessionStorage.setItem("role", role);
};

export const getToken = () => {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
};

export const getRole = () => {
  return localStorage.getItem("role") || sessionStorage.getItem("role") || null;
};

export const removeUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
};

export function convertToRupiah(money) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(money);
}

export function convertToCurrency(money) {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    currency: "IDR",
    maximumFractionDigits: 2,
    currencyDisplay: "symbol",
  })
    .format(money)
    .replace(/\B(?=(\d{4})+(?!\d))/g, ".");
}

export const convertFormatNumber = (num) => {
  let rupiah = "";
  let angkaRev = num.toString().split("").reverse().join("");
  for (var i = 0; i < angkaRev.length; i++)
    if (i % 3 === 0) rupiah += angkaRev.substr(i, 3) + ".";
  return rupiah
    .split("", rupiah.length - 1)
    .reverse()
    .join("");
};

export function errorCatch(statusCode) {
  const code = {
    401: "/login",
    403: "/404",
  };
  return code[statusCode];
}

export function convertSimpleTimeStamp(time) {
  const date = new Date(time * 1000);
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const days = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const months =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const years = date.getFullYear();
  return `${hours}:${minutes}, ${days}/${months}/${years}`;
}

export const convertDateTimeStamp = (time) => {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(time * 1000));
};

export const convertTimeDigit = (num) => {
  return (num < 10 ? "0" : "") + num;
};

export const styleStatusPaylink = {
  normal: {
    background: "#EBF8EC",
    color: "#3DB54A",
  },
  hover: {
    background: "#3DB54A",
    color: "#FFFFFF",
  },
};

export function isNotEnableButton(minutes, hour) {
  var now = new Date();
  var user = new Date();
  var nowMinutes = now.getMinutes();
  var nowHour = now.getHours();
  var value_now = `${nowHour}:${nowMinutes+5}:00`.split(":");
  var value_user = `${hour}:${minutes}:00`.split(":");

  now.setHours(value_now[0], value_now[1], value_now[2], 0);
  user.setHours(value_user[0], value_user[1], value_user[2], 0);

  const diff = Math.abs(now - user);
  if (diff < 300000 && diff > 0) {
    return true;
  } else {
    return false;
  }
}
