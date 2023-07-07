const crypto = require("crypto")

// let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
// 	modulusLength: 2048,
// })

// module.exports.publicKey = publicKey.export({
// 	type: "pkcs1",
// 	format: "pem",
// });

// module.exports.privateKey = privateKey.export({
// 	type: "pkcs1",
// 	format: "pem",
// });

module.exports.publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAxhIWyPxc3V6d2cZqhSu5C5tnAUg71ny1H0Qh7ad9PqukeXFoTu+i
7KHViIxjI7MyMs01oex+mIp9QiAwo2x/9cz/jVdeqAa+EqC1I7sZXPF5Zfk3FFJK
yG1DrDrtQY+UXUmZ57ZsFmx7r8iMcq+nAQ5yQwR83EWqJFNXWibUDlFQKWdnKOrJ
u+LeQoArGhLz/0wkSQ6z6F7bDKn5CZ6i32J7VMZ9ki3DIwe2jnMaMkXGoZnB3iOB
Zv4r4nWRO02ZbNIXOhpyYZphZbWJfPayr/nVcao49eRFvQgFeaI1frAncxwyj0xm
GpXRZZT1NndjvL7iKB3kjlotOR4GDEvl3QIDAQAB
-----END RSA PUBLIC KEY-----`;

module.exports.privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAxhIWyPxc3V6d2cZqhSu5C5tnAUg71ny1H0Qh7ad9PqukeXFo
Tu+i7KHViIxjI7MyMs01oex+mIp9QiAwo2x/9cz/jVdeqAa+EqC1I7sZXPF5Zfk3
FFJKyG1DrDrtQY+UXUmZ57ZsFmx7r8iMcq+nAQ5yQwR83EWqJFNXWibUDlFQKWdn
KOrJu+LeQoArGhLz/0wkSQ6z6F7bDKn5CZ6i32J7VMZ9ki3DIwe2jnMaMkXGoZnB
3iOBZv4r4nWRO02ZbNIXOhpyYZphZbWJfPayr/nVcao49eRFvQgFeaI1frAncxwy
j0xmGpXRZZT1NndjvL7iKB3kjlotOR4GDEvl3QIDAQABAoIBABeRU3C6xnn4piOh
fk82MqB07z6xz5zn3c1ImBjlEvwABGQG4Hhz/xjU8Ml8mtdGnTR6QmVv9GhGIj1a
Ay+O23Lt34J74OFxW/Bvet4zhwMOIHnHu4wJdqh+h8zYfh6M7QRkm5F8nUPVyKnT
3RJQYDi59VKQGCNFjscfu4cYk6bYREYNlkxpPM5CbPpqlgdlm7GXSpF+DqIqYtZf
IkI1F60e4llClkmk+kq42Gqj6EE7pu2KkrTnZD1GfoMCqz/96IVa7B2w+RP++wzq
KJybAnyknLdjKmCtUhFjGZnRD9zexVXDmQEY/8PPebylxaG3myN0Bo2yBw4XMPmV
yxUobMECgYEA87+PypDUTGxK7/AbaugbLRgQcGrxOW83GZQ+s5jRYidMC69QOnyJ
wXZRsuPX9gF3DPYlNUGvqBGlgu7sw5Gjhri6tRFxjqURlB85copd/vS99IuoVbUV
MCZ4IKAgxmKgvK4YHRFj6H5p8PTLjHm5zEcA/FOfHRrGX/+b0vrSxBUCgYEA0AbE
4z30cFPBUgdLltTPsJsaeXjZplNNiq/V0DKDhdmOBDmvyw3qya2olS5e51qid3KL
2YN/06o3xbnISTWLENLWZkZuwdNABMJ5BO6rYPK+jwXrxMsHVCMIFL/xZCWgHskv
+9zInkf1EThnHDJsrE3qN3OyS7+JEH+bIKcfpKkCgYEA70vdiuzsv6qBV1XOVQJR
y8+YNAWJlO1OltonRIJ+7XHPApm2lfS1+SyDwLBW0LlXe24b0VEPdlz8tLKD1uwg
Mp8hDap2ZahAvb55061r4mW8J10EgkAo8QCTZtRN2PXy/8ma+s6b2yBgOaLaQqsu
cRI0MYSW7SfgIVb8UADW8pECgYEAzZ0zNE0Dc5dFaJevXglAs5XLCC+sKVsDNMZx
ttSG7WDIn2KJYFGENQ2BqNppkZEjLp84naj9SrBfaf8keUAEEX/jzLlnNgtgppO1
3GsvV6b3NRSsIhpvRvlNPn0t0kfiSSugUvi6DsCe+QNf3x30DicBDwg7PeW2S2ll
YlPt0ekCgYEAlbrMacT1UQLTDFsWCOQVuiWFEmIelYl79qCRZuYJ8r6PkFl9Q7Sg
7qacrYkBQPG4ue/UdJ5K5HW4eXZ6cR2719Omgvy3pNfBSaPAETHGjSHC3VhX1bvN
iVC9IzJrpkfI0t9HM2ZqC3NBNpqrAZ4ScQAYHur20/GXb//XSVYVxrw=
-----END RSA PRIVATE KEY-----`;



// This is the data we want to encrypt
module.exports.encryptValue = (data, publicKey = this.publicKey) => {
	let encryptedData = crypto.publicEncrypt(
		{
			key: publicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		// We convert the data string to a buffer using `Buffer.from`
		Buffer.from(data)
	)

	console.log("encypted data: ", encryptedData.toString('hex'))
	encryptedData = bufferToUrlSafeBase64(encryptedData);
	return encryptedData;
}

module.exports.decryptValue = (encryptedData) => {
	encryptedData = urlSafeBase64ToBuffer(encryptedData);
	// return this.privateKey;
	const decryptedData = crypto.privateDecrypt(
		{
			key: this.privateKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		encryptedData
	)
	return decryptedData.toString();
}

// Convert Buffer to Base64
function bufferToBase64(buffer) {
	return buffer.toString('base64');
}

// Convert Base64 to Buffer
function base64ToBuffer(base64String) {
	return Buffer.from(base64String, 'base64');
}

// Convert Buffer to Base64
function bufferTohex(buffer) {
	return buffer.toString('hex');
}

// Convert Base64 to Buffer
function hexToBuffer(base64String) {
	return Buffer.from(base64String, 'hex');
}

module.exports.getBase64EncodeData = (data) => {
	const buffer = Buffer.from(data, "utf8");
	const base64String = buffer.toString("base64");
	return base64String;
}

module.exports.getBase64DecodeData = (data) => {
	const buffer = Buffer.from(data, "base64");
	const normalString = buffer.toString("utf8");
	return normalString;
}

module.exports.generateAESKeys = () => {
	// Generate AES key (32 bytes)
	let aesKey = crypto.randomBytes(32);
	aesKey = aesKey.toString('hex');
	console.log('AES Key:', aesKey.toString('hex'));
	return aesKey;
}

module.exports.generateIVKeys = () => {
	// Generate IV (16 bytes)
	let iv = crypto.randomBytes(16);
	iv = iv.toString('hex')
	console.log('IV:', iv.toString('hex'));
	return iv;
}

function hexToBytes(hexString) {
	const bytes = new Uint8Array(hexString.length / 2);
	for (let i = 0; i < hexString.length; i += 2) {
		bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
	}
	return bytes;
}

// Convert Buffer to URL-safe Base64
function bufferToUrlSafeBase64(buffer) {
	let base64 = buffer.toString('base64');
	base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	return base64;
}

// Convert URL-safe Base64 to Buffer
function urlSafeBase64ToBuffer(base64String) {
	base64String = base64String.replace(/-/g, '+').replace(/_/g, '/');
	while (base64String.length % 4 !== 0) {
		base64String += '=';
	}
	return Buffer.from(base64String, 'base64');
}

module.exports.base64UrlSafeEncode = (data) => {
	let encoded = Buffer.from(data, 'utf8').toString('base64');
	encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	return encoded;
}

module.exports.base64UrlSafeDecode = (data) => {
	let decoded = data.replace(/-/g, '+').replace(/_/g, '/');
	while (decoded.length % 4 !== 0) {
		decoded += '=';
	}
	return Buffer.from(decoded, 'base64').toString('utf8');
}

module.exports.encryptWithAES = (plaintext = "", key = "", iv = "") => {
	// key is 32 byte aes key
	// Generate a random initialization vector (IV)
	if (!plaintext) {
		plaintext = "{\"name\":\"pulu\",\"age\":3}";
	}
	if (key === "") {
		key = crypto.randomBytes(32);
		key = key.toString('hex');
		key = hexToBuffer(key);
	} else {
		key = hexToBuffer(key);
	}
	console.log(key);
	if (iv === "") {
		iv = crypto.randomBytes(16);
		iv = iv.toString('hex');
		iv = hexToBuffer(iv);
	} else {
		iv = hexToBuffer(iv);
	}

	// Create a new AES cipher using the provided key and IV
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

	// Encrypt the plaintext
	let encrypted = cipher.update(plaintext, 'utf8', 'base64');
	encrypted += cipher.final('base64');

	// Combine the IV and the encrypted data
	const combinedData = iv.toString('base64') + encrypted;

	// Encode the combined data in Base64UrlSafe format
	const encodedData = this.base64UrlSafeEncode(combinedData);

	return encodedData;
}

module.exports.decryptWithAES1 = (encodedbody, client_aes_key, client_iv) => {

	// encodedbody = this.base64UrlSafeDecode(encodedbody);
	const decodedData = this.base64UrlSafeDecode(encodedbody);

	// Separate the IV and the encrypted data
	const iv = Buffer.from(decodedData.slice(0, 24), 'base64');
	// return iv;
	const encrypted = decodedData.slice(24);
	// encodedbody = decodedData;
	client_aes_key = hexToBuffer(client_aes_key);
	// return client_iv;
	client_iv = hexToBuffer(client_iv);
	// Create a new AES decipher using the key and IV
	console.log(client_aes_key);
	console.log(crypto.randomBytes(32))

	const decipher = crypto.createDecipheriv('aes-256-cbc', client_aes_key, client_iv);

	// Decrypt the data
	let decryptedData = decipher.update(encrypted, 'base64', 'utf8');
	decryptedData += decipher.final('utf8');

	return decryptedData
}

module.exports.decryptWithAES = (encodedbody, client_aes_key, client_iv) => {

	// encodedbody = this.base64UrlSafeDecode(encodedbody);
	const decodedData = this.base64UrlSafeDecode(encodedbody);

	// Separate the IV and the encrypted data
	const iv = Buffer.from(decodedData.slice(0, 24), 'base64');
	// return iv;
	const encrypted = decodedData.slice(24);
	// encodedbody = decodedData;
	client_aes_key = hexToBuffer(client_aes_key);
	// return client_iv;
	client_iv = hexToBuffer(client_iv);
	// Create a new AES decipher using the key and IV
	console.log(client_aes_key);
	console.log(crypto.randomBytes(32))

	const decipher = crypto.createDecipheriv('aes-256-cbc', client_aes_key, iv);

	// Decrypt the data
	let decryptedData = decipher.update(encrypted, 'base64', 'utf8');
	decryptedData += decipher.final('utf8');

	return decryptedData
}

module.exports.serverSideDecriptionProcess = (encodedBody, crypto_key_data, crypto_IV_data) => {
	/*
	// X-E2E-CRYPTO-KEY : encrypt AES key with Server's RSA PublicKey. And then encoded base64 string.
	1. decode base64
	2. decript with server private key to get CLIENT AES token

	// X-E2E-CRYPTO-IV: encoding Base64 string.
	1. decode base64 to get client crypto iv key

	NOTE: by using this AES and IV key decode the client request body
	*/

	// const base64DecodedAES = (crypto_key_data); // is it is urlsafe encode then use urlsafe decode.
	const clientAES = this.decryptValue(crypto_key_data);
	// return clientAES;
	const clientIV = this.base64UrlSafeDecode(crypto_IV_data);
	// return clientIV;
	const decryptedData = this.decryptWithAES(encodedBody, clientAES, clientIV);
	return decryptedData;

}