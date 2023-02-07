const forge = require('node-forge')
const { PUBLIC_KEY, PRIVATE_KEY } = require('./constant')
let CryptoJS = require('crypto-js')

const cypherUtil = {
  rsaEncrypt: str => {
    let encryptedData = ''
    try {
      const rsa = forge.pki.publicKeyFromPem(PUBLIC_KEY)
      encryptedData = btoa(rsa.encrypt(forge.util.encodeUtf8(str)))
    } catch (e) {
      console.log(e)
    }
    return encryptedData
  },
  rsaDecrypt: (str, privateKey) => {
    let decrypted = ''
    try {
      const rsa = forge.pki.privateKeyFromPem(privateKey)
      decrypted = forge.util.decodeUtf8(rsa.decrypt(atob(str)))
    } catch (e) {
      console.log(e)
    }
    return decrypted
  },
  aesEncrypt: (str, inputKey, inputIv) => {
    let decrypted = ''
    try {
      let key = CryptoJS.enc.Utf8.parse(inputKey)
      let iv = CryptoJS.enc.Utf8.parse(inputIv)
      decrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(str), key,
        {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString()
    } catch (e) {
      console.log(e)
    }
    return decrypted
  },
  base64Encrypt: (data) => {
    return btoa(encodeURI(JSON.stringify(data)))
  },
  base64Decrypt: (data) => {
    return JSON.parse(decodeURI(atob(data)))
  },
}

export default cypherUtil