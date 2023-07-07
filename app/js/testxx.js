const crypto = require('crypto');
let key = "df78f3b9e638400a5448df9438379a7380a3b332ee7c8eb984fe175bf178452d"; // hex key
key = hexToBuffer(key);
let iv = "381ad9d0b680c70225442b808fbe8aa7"; // hex iv
iv = hexToBuffer(iv);
function hexToBytes(hexString) {
	const bytes = new Uint8Array(hexString.length / 2);
	for (let i = 0; i < hexString.length; i += 2) {
		bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
	}
	return bytes;
}
// Convert Base64 to Buffer
function hexToBuffer(base64String) {
	return Buffer.from(base64String, 'hex');
}
function encryptWithAES(plaintext, key) {
  // Generate a random initialization vector (IV)
//   const iv = crypto.randomBytes(16);
//   console.log(iv.toString('hex'));

  // Create a new AES cipher using the provided key and IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  // Encrypt the plaintext
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Combine the IV and the encrypted data
  const combinedData = iv.toString('base64') + encrypted;

  // Encode the combined data in Base64UrlSafe format
  const encodedData = base64UrlSafeEncode(combinedData);

  return encodedData;
}

function base64UrlSafeEncode(data) {
  let encoded = Buffer.from(data, 'utf8').toString('base64');
  encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return encoded;
}

function base64UrlSafeDecode(data) {
  let decoded = data.replace(/-/g, '+').replace(/_/g, '/');
  while (decoded.length % 4 !== 0) {
    decoded += '=';
  }
  return Buffer.from(decoded, 'base64').toString('utf8');
}

// Example usage
const plaintext = "{\"name\":\"pulu\",\"age\":3}";
// const key = crypto.randomBytes(32); // Generate a random 256-bit key
// console.log("=======", key);

const encryptedData = encryptWithAES(plaintext, key);
console.log('Encrypted data (Base64UrlSafe):', encryptedData);

// Decoding and decrypting the data
const decodedData = base64UrlSafeDecode(encryptedData);

// Separate the IV and the encrypted data
// const iv = Buffer.from(decodedData.slice(0, 24), 'base64');
const encrypted = decodedData.slice(24);

// Create a new AES decipher using the key and IV
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

// Decrypt the data
let decrypted = decipher.update(encrypted, 'base64', 'utf8');
decrypted += decipher.final('utf8');

console.log('Decrypted data:', decrypted);
