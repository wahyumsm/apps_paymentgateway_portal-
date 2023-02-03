// export const BaseURL = "https://api.ezeelink.co.id/mobile-demo/mobile3"
export const BaseURL = "https://apid.ezeelink.co.id/mobile-demo/mobile2"
// export const BaseURL = "https://apid.ezeelink.co.id/snap/api2"
// export const BaseURL = "https://api.ezeelink.co.id/ezpaygateway/portal"

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

export function convertToRupiah(money, isRupiah, fractionDigits) {
  return new Intl.NumberFormat("id-ID", {
    style: isRupiah === undefined || isRupiah === true ? "currency" : "decimal",
    currency: "IDR",
    maximumFractionDigits: fractionDigits === undefined ? 0 : fractionDigits,
  }).format((fractionDigits === undefined ? Math.floor(money) : money));
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

export function convertDateAndTimeInfoDanSaldo(time) {
	const tanggal = new Date(time * 1000).toLocaleDateString("id-ID", {day: "2-digit", month: "long", year: "numeric"})
	const jam = new Date(time * 1000).toLocaleTimeString("en-US", {hour12: false, hour: "2-digit", minute: "2-digit"})
	return `${tanggal}, ${jam} WIB`
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

export function isNotEnableButton(minutes, hour, date) {
  var now = new Date();
  var user = new Date();
  var nowMinutes = now.getMinutes();
  var nowHour = now.getHours();
  var nowDate = now.getDate()
  var value_now = `${nowHour}:${nowMinutes+5}:00`.split(":");
  var value_user = `${hour}:${minutes}:00`.split(":");

  now.setHours(value_now[0], value_now[1], value_now[2], 0);
  user.setHours(value_user[0], value_user[1], value_user[2], 0);
  // console.log(now.setHours(value_now[0], value_now[1], value_now[2], 0), 'value now');
  // console.log(now,'its now');
  // console.log(user, 'its user');

  if (now > user) {
    if (nowDate === date) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }

  // const diff = (now - user);
  // console.log(diff, 'its diff');
  // if (diff < 300000 && diff > 0) {
  //   return true;
  // } else {
  //   return false;
  // }
}

export function terbilangVA(a){
	var bilangan = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas'];

	// 1 - 11
	if(a < 12){
		var kalimat = bilangan[a];
	}
	// 12 - 19
	else if(a < 20){
		var kalimat = bilangan[a-10]+' Belas';
	}
	// 20 - 99
	else if(a < 100){
		var utama = a/10;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%10;
		var kalimat = bilangan[depan]+' Puluh '+bilangan[belakang];
	}
	// 100 - 199
	else if(a < 200){
		var kalimat = 'Seratus '+ terbilangVA(a - 100);
	}
	// 200 - 999
	else if(a < 1000){
		var utama = a/100;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%100;
		var kalimat = bilangan[depan] + ' Ratus '+ terbilangVA(belakang);
	}
	// 1,000 - 1,999
	else if(a < 2000){
		var kalimat = 'Seribu '+ terbilangVA(a - 1000);
	}
	// 2,000 - 9,999
	else if(a < 10000){
		var utama = a/1000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%1000;
		var kalimat = bilangan[depan] + ' Ribu '+ terbilangVA(belakang);
	}
	// 10,000 - 99,999
	else if(a < 100000){
		var utama = a/100;
		var depan = parseInt(String(utama).substr(0,2));
		var belakang = a%1000;
		var kalimat = terbilangVA(depan) + ' Ribu '+ terbilangVA(belakang);
	}
	// 100,000 - 999,999
	else if(a < 1000000){
		var utama = a/1000;
		var depan = parseInt(String(utama).substr(0,3));
		var belakang = a%1000;
		var kalimat = terbilangVA(depan) + ' Ribu '+ terbilangVA(belakang);
	}
	// 1,000,000 - 	99,999,999
	else if(a < 100000000){
		var utama = a/1000000;
		var depan = parseInt(String(utama).substr(0,4));
		var belakang = a%1000000;
		var kalimat = terbilangVA(depan) + ' Juta '+ terbilangVA(belakang);
	}
	else if(a < 1000000000){
		var utama = a/1000000;
		var depan = parseInt(String(utama).substr(0,4));
		var belakang = a%1000000;
		var kalimat = terbilangVA(depan) + ' Juta '+ terbilangVA(belakang);
	}
	else if(a < 10000000000){
		var utama = a/1000000000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%1000000000;
		var kalimat = terbilangVA(depan) + ' Milyar '+ terbilangVA(belakang);
	}
	else if(a < 100000000000){
		var utama = a/1000000000;
		var depan = parseInt(String(utama).substr(0,2));
		var belakang = a%1000000000;
		var kalimat = terbilangVA(depan) + ' Milyar '+ terbilangVA(belakang);
	}
	else if(a < 1000000000000){
		var utama = a/1000000000;
		var depan = parseInt(String(utama).substr(0,3));
		var belakang = a%1000000000;
		var kalimat = terbilangVA(depan) + ' Milyar '+ terbilangVA(belakang);
	}
	else if(a < 10000000000000){
		var utama = a/10000000000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%10000000000;
		var kalimat = terbilangVA(depan) + ' Triliun '+ terbilangVA(belakang);
	}
	else if(a < 100000000000000){
		var utama = a/1000000000000;
		var depan = parseInt(String(utama).substr(0,2));
		var belakang = a%1000000000000;
		var kalimat = terbilangVA(depan) + ' Triliun '+ terbilangVA(belakang);
	}

	else if(a < 1000000000000000){
		var utama = a/1000000000000;
		var depan = parseInt(String(utama).substr(0,3));
		var belakang = a%1000000000000;
		var kalimat = terbilangVA(depan) + ' Triliun '+ terbilangVA(belakang);
	}

	else if(a < 10000000000000000){
		var utama = a/1000000000000000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%1000000000000000;
		var kalimat = terbilangVA(depan) + ' Kuadriliun '+ terbilangVA(belakang);
	}

	var pisah = kalimat.split(' ');
	var full = [];
	for(var i=0;i<pisah.length;i++){
		if(pisah[i] != ""){full.push(pisah[i]);}
	}
	return full.join(' ');
}

//============================================================================================================
function terb_depan(uang){
	var sub = '';
	if (uang == 1) { sub='Satu '} else
	if (uang == 2) { sub='Dua '} else
	if (uang == 3) { sub='Tiga '} else
	if (uang == 4) { sub='Empat '} else
	if (uang == 5) { sub='Lima '} else
	if (uang == 6) { sub='Enam '} else
	if (uang == 7) { sub='Tujuh '} else
	if (uang == 8) { sub='Delapan '} else
	if (uang == 9) { sub='Sembilan '} else
	if (uang == 0) { sub='  '} else
	if (uang == 10) { sub='Sepuluh '} else
	if (uang == 11) { sub='Sebelas '} else
	if ((uang >= 11) && (uang<=19)) { sub = terb_depan(uang % 10)+'Belas ';} else
	if ((uang >= 20) && (uang<=99)) { sub = terb_depan(Math.floor(uang / 10))+'Puluh '+terb_depan(uang % 10);} else
	if ((uang >= 100) && (uang<=199)) { sub = 'Seratus '+terb_depan(uang-100);} else
	if ((uang >= 200) && (uang<=999)) { sub = terb_depan(Math.floor(uang/100)) + 'Ratus '+terb_depan(uang % 100);} else
	if ((uang >= 1000) && (uang<=1999)) { sub = 'Seribu '+terb_depan(uang-1000);} else
	if ((uang >= 2000) && (uang<=999999)) { sub = terb_depan(Math.floor(uang/1000)) + 'Ribu '+terb_depan(uang % 1000);} else
	if ((uang >= 1000000) && (uang<=999999999)) { sub = terb_depan(Math.floor(uang/1000000))+'Juta '+terb_depan(uang%1000000);} else
	if ((uang >= 100000000) && (uang<=999999999999)) { sub = terb_depan(Math.floor(uang/1000000000))+'Milyar '+terb_depan(uang%1000000000);} else
	if ((uang >= 1000000000000)) { sub = terb_depan(Math.floor(uang/1000000000000))+'Triliun '+terb_depan(uang%1000000000000);}
	return sub;
}
function terb_belakang(t){
	if (t.length==0){
		return 'Kosong';
	}
	return t
		.split('0').join('Kosong ')
		.split('1').join('Satu ')
		.split('2').join('Dua ')
		.split('3').join('Tiga ')
		.split('4').join('Empat ')
		.split('5').join('Lima ')
		.split('6').join('Enam ')
		.split('7').join('Tujuh ')
		.split('8').join('Delapan ')
		.split('9').join('Sembilan ');
}

export function terbilangDisbursement(nAngka) {
	var 
		v = 0,
		sisa = 0,
		tanda = '',
		tmp = '',
		sub = '',
		subkoma = '',
		p1 = '',
		p2 = '',
		pkoma = 0;
	if (nAngka>999999999999999999){
		return 'Unidentified';
	}
	v = nAngka;	
	if (v<0){
		tanda = 'Minus ';
	}
	v = Math.abs(v);
	tmp = v.toString().split('.');
	p1 = tmp[0];
	p2 = '';
	if (tmp.length > 1) {		
		p2 = tmp[1];
	}
	v = parseFloat(p1);
	sub = terb_depan(v);
	/* sisa = parseFloat('0.'+p2);
	subkoma = terb_belakang(sisa); */
	// console.log(p2, 1, 'p2');
	subkoma = terb_belakang(p2);
	sub = tanda + sub.replace('  ',' ') +'Koma '+ subkoma.replace('  ',' ');
	return sub.replace('  ', ' ');
}