// import CryptoES from "crypto-es";
import * as CryptoES from 'crypto-js'
import {JSDOM} from 'jsdom'
const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const {window} = jsdom
;(global as any).window = window
;(global as any).document = window.document
;(global as any).navigator = {userAgent: 'node.js'}
import JSEncrypt from 'jsencrypt'
import * as cryptHelper from './crypto_helper'

let tempAESKey = ''
let tempIv = '' //base64 encoded 16byte string
let tempIvObj = '' ///16byte wordarray

// const crypt = new JSEncrypt({default_key_size: '1024'})
// export const PublicKey = crypt.getPublicKey();
// export const PrivateKey = crypt.getPrivateKey();

export const PublicKey = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHFfMF9qzPbxmOjwDnXXLk7Yxu\niJ+oGTRueeJ/Um5hSF7rVGdcDPeP/62+eQQhuto3ueya0ffolhac6pKt2kKv4y80\nnlLGGQ1aYosuSgih5Bz23iNVJclXxbYBkulS0SjJj/QRW1dmdnC7j2HgsrVSnxx6\n0rkwe3ZEDCg19GpQcQIDAQAB\n-----END PUBLIC KEY-----`
export const PrivateKey = `-----BEGIN RSA PRIVATE KEY-----\nMIICXgIBAAKBgQCHFfMF9qzPbxmOjwDnXXLk7YxuiJ+oGTRueeJ/Um5hSF7rVGdc\nDPeP/62+eQQhuto3ueya0ffolhac6pKt2kKv4y80nlLGGQ1aYosuSgih5Bz23iNV\nJclXxbYBkulS0SjJj/QRW1dmdnC7j2HgsrVSnxx60rkwe3ZEDCg19GpQcQIDAQAB\nAoGBAISf6RyGxb1Wr3nGLrX4im/2RXTUECQCsvZwFg65CIPcgMx87olyda/b72Hd\nAFB5WftyP7j0wneIu6TNrLqhWexWKFHvgUBETcXwwPy2zP6qTlagBfo+d8IhPY7l\nbvlin5/TX2u2rvwczPiPmWSkQGrpJPFqUsUqy9HIaUkLSsd9AkEAwXqlelp3GnwP\nYFqT1pCrtEyP9aLlEOmI92WeJ3T1/sblj3gHXXEP5+VXG7QrxWSqu2O5IWw1KGks\nDDVUSnjnHwJBALK8xlVaQKgywjg0ZKTuw1qf5vXiMmLrgr7csR6OIRRgbLie5VgC\nkVCUi7861VvOgTPfa052MOAKIqJGRtfgpm8CQQCuvo3sZv6BfiEJHmW9+eYKrseq\nzBflYXdiMnZYHqv7EzrMjFTikTYTdLBrBhwuaRBGtPfE9w0/1VWCJTxfErlzAkBv\nBwCUqHmdgdpPm4whQAet1cJcXuQ5ul3/PYvwlQ1LYRJoJJwGbaHi0kN0yJEcdEyh\n8ljv5k85/FHDR7BeDTiVAkEAp23rWiApdH7xKrRm7lEE3tYgfUHTcEDtk6Oja4PW\nCcPNll2J6zaSKwJgVtGdm0TZgklPqNR9YqSf0fTD7Y0sHQ==\n-----END RSA PRIVATE KEY-----`

export const REACT_APP_CLIENT_AES_KEY = 'rpdxHpIj2Gc108Chp639wMrkTRVEdD8G'
const REACT_APP_CLIENT_IV_KEY = 'NRhY6sVXqkxrEMry'
const REACT_APP_CLIENT_RSA_KEY =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRSQY7vJFDDejWCGn5WtSX+6dR\nGP0mN0hySnnFUgfXsyDboFZNlmKfUvSFxpuO2M3KeGrSFFfjP1kue6EjrXinkuls\nC8EYSE9Htb9R+Is+KmAYda2jRwaYIty1QpBClziRR5/eqVkSi/zVQkRegA6/y66z\nt4JkPVRALfVQFXVXSQIDAQAB\n-----END PUBLIC KEY-----'

const generateRandomCrypto = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

// AES 암호화 함수
export const getEncryptionValue = (secretKey: any, input: any) => {
  const key = CryptoES.enc.Utf8.parse(secretKey)
  const iv = CryptoES.lib.WordArray.random(16)
  const encrypted = CryptoES.AES.encrypt(input, key, {
    iv: iv,
    padding: CryptoES.pad.Pkcs7,
    mode: CryptoES.mode.CBC, // [cbc 모드 선택]
  })
  return iv.concat(encrypted.ciphertext).toString(CryptoES.enc.Base64)
}

export const encryptionHelper = (input: any, aesKey: any, ivObj: any) => {
  const encrypted = CryptoES.AES.encrypt(input, aesKey, {
    iv: ivObj,
    padding: CryptoES.pad.Pkcs7,
    mode: CryptoES.mode.CBC, // [cbc 모드 선택]
  })
  console.log('encrypted', encrypted)
  return encrypted.ciphertext.toString(CryptoES.enc.Base64)
}

// AES 복호화 함수
export const getDecryptionValue = (secretKey: any, input: any) => {
  const key = CryptoES.enc.Utf8.parse(secretKey)
  let ciphertext = CryptoES.enc.Base64.parse(input)
  const iv = ciphertext.clone()
  iv.sigBytes = 16
  iv.clamp()
  ciphertext.words.splice(0, 4) // delete 4 words = 16 bytes
  ciphertext.sigBytes -= 16

  const decrypted = CryptoES.AES.decrypt(
    ciphertext.toString(CryptoES.enc.Base64),
    key,
    {
      iv: iv,
    },
  )

  return decrypted.toString(CryptoES.enc.Utf8)
}

export const rsaPublicKey = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRSQY7vJFDDejWCGn5WtSX+6dR\nGP0mN0hySnnFUgfXsyDboFZNlmKfUvSFxpuO2M3KeGrSFFfjP1kue6EjrXinkuls\nC8EYSE9Htb9R+Is+KmAYda2jRwaYIty1QpBClziRR5/eqVkSi/zVQkRegA6/y66z\nt4JkPVRALfVQFXVXSQIDAQAB\n-----END PUBLIC KEY-----`
export const newRsaPublicKey = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/z1wGwqDjweYeVDeKEoMkg5Np\nUF+Oe7kSpnuaaX5isynIpaNV37Aoz1JtF759xLQOf/Vl+ut0Jb+XnQ+ZKwvr3VUv\noNpQkb2l7qvCkiBG9B53HO6HchPTeDxGyofitb7lLFYLbODcll6f81Cn3RbIaD/f\na6q77CQGNjnq8r1AGQIDAQAB\n-----END PUBLIC KEY-----`

// api 명세를 확인하고 encKey 파라미터가 있을시 키셋을 생성한뒤 사용
export const makeRsaKeys = () => {
  const crypt = new JSEncrypt({default_key_size: '1024'})
  const PublicPrivateKey = {
    PublicKey: crypt.getPublicKey(),
    PrivateKey: crypt.getPrivateKey(),
  }
  const encryptedKeys = encryptAESKey(PublicPrivateKey)
  return encryptedKeys
}

export const encryptAESKey = (keys: any) => {
  const stringifiedKeys = JSON.stringify(keys)
  const aesToken = CryptoES.AES.encrypt(
    stringifiedKeys,
    REACT_APP_CLIENT_RSA_KEY,
  ).toString()
  return aesToken
}

export const decryptAESKey = (keys: any) => {
  const decryptToken = CryptoES.AES.decrypt(keys, REACT_APP_CLIENT_RSA_KEY)
  const parsed = JSON.parse(decryptToken.toString(CryptoES.enc.Utf8))
  return parsed
}

export const genrateAESKeyAndIv = () => {
  const aesKey = tempAESKey //getting values from variable
  const iv = tempIvObj //getting values from variable

  if (aesKey && iv) {
    return {aesKey, iv: iv}
  } else {
    const newAesKey = generateRandomCrypto(32)
    const newIvKey = generateRandomCrypto(16)
    tempAESKey = newAesKey
    tempIvObj = newIvKey
    return {aesKey: newAesKey, iv: newIvKey}
  }
}

export const rsaEnc = (input: any, serverPublicKey: any) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(serverPublicKey)
  return encrypt.encrypt(input).toString()
}

export const encodeByAES256 = (data: any) => {
  const keyarr = tempAESKey
  const iv = tempIvObj
  if (keyarr && iv) {
    const cipher = CryptoES.AES.encrypt(data, CryptoES.enc.Utf8.parse(keyarr), {
      iv: CryptoES.enc.Utf8.parse(iv),
      padding: CryptoES.pad.Pkcs7,
      mode: CryptoES.mode.CBC,
    })
    return cipher.toString()
  }
  return ''
}

export const rsaEncryptionWithServerKey = (input: any) => {
  const encrypted = encodeByAES256(input)
    .replace(/=+$/, '') // Remove padding characters
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_')

  return encrypted
}

export const rsaEncryption = (input: any, public_key = '') => {
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(public_key)
  const encrypted = encrypt.encrypt(input)
  return encrypted
}

export const rsaDecryption = (key: string, value: any): any => {
  let decrypt = new JSEncrypt()
  decrypt.setPublicKey(key)
  const encrypted = decrypt.decrypt(value)
  return encrypted
}

export const serverSideDecriptionProcessforAPI = (
  encodedBody: any,
  crypto_key_data: any,
  crypto_IV_data: any,
) => {
  /*
    // X-E2E-CRYPTO-KEY : encrypt AES key with Server's RSA PublicKey. And then encoded base64 string.
    1. decode base64
    2. decript with server private key to get CLIENT AES token

    // X-E2E-CRYPTO-IV: encoding Base64 string.
    1. decode base64 to get client crypto iv key

    NOTE: by using this AES and IV key decode the client request body
    */

  const base64DecodedAES = cryptHelper.base64UrlSafeDecode(crypto_key_data) // is it is urlsafe encode then use urlsafe decode.
  // return base64DecodedAES;
  const clientAES = rsaDecryption(PrivateKey, base64DecodedAES)
  const decryptedData = getDecryptionValue(clientAES, encodedBody)
  return decryptedData
}
