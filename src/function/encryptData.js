import CryptoJS from 'crypto-js';

function encryptData(parameter) {
    let key = CryptoJS.enc.Utf8.parse('cIC7KNUL3Ulb1Q5y');
    let iv  = CryptoJS.enc.Utf8.parse('YjVs62lfbALK8I9I');
    let text = parameter
    
    
    let encryptedCP = CryptoJS.AES.encrypt(text, key, { iv: iv });
    let cryptText = encryptedCP.toString();
    return cryptText;
}

export default encryptData