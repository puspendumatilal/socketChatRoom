const crypto = require("crypto")

let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
})

module.exports.publicKey = publicKey.export({
	type: "pkcs1",
	format: "pem",
});

privateKey = privateKey.export({
	type: "pkcs1",
	format: "pem",
});



// This is the data we want to encrypt
module.exports.encryptValue = (data, publicKey = this.publicKey) => {
	console.log(data);
	console.log(publicKey);
	console.log(typeof publicKey)
	const encryptedData = crypto.publicEncrypt(
		{
			key: publicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		// We convert the data string to a buffer using `Buffer.from`
		Buffer.from(data)
	)

	// console.log("encypted data: ", encryptedData.toString("base64"))
	return encryptedData;
}

module.exports.decryptValue = (encryptedData) => {
	const decryptedData = crypto.privateDecrypt(
		{
			key: privateKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		encryptedData
	)
	return decryptedData.toString();
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
	const aesKey = crypto.randomBytes(32);
	console.log('AES Key:', aesKey.toString('hex'));
	return aesKey;
}

module.exports.generateIVKeys = () => {
	// Generate IV (16 bytes)
	const iv = crypto.randomBytes(16);
	console.log('IV:', iv.toString('hex'));
	return iv;
}

module.exports.encryptWithAES = (plaintext, key) => {
	// key is 32 byte aes key
	// Generate a random initialization vector (IV)
	if (key === "") {
		key = this.generateAESKeys();
	}
	const iv = crypto.randomBytes(16);

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

module.exports.decryptWithAES = (encodedbody, client_aes_key, client_iv) => {

	// Create a new AES decipher using the key and IV
	const decipher = crypto.createDecipheriv('aes-256-cbc', client_aes_key, client_iv);

	// Decrypt the data
	let decryptedData = decipher.update(encodedbody, 'base64', 'utf8');
	decryptedData += decipher.final('utf8');

	return decryptedData
}

module.exports.serverSideDecriptionProcess = (encodedBody,crypto_key_data, crypto_IV_data) => {
	/*
	// X-E2E-CRYPTO-KEY : encrypt AES key with Server's RSA PublicKey. And then encoded base64 string.
	1. decode base64
	2. decript with server private key to get CLIENT AES token

	// X-E2E-CRYPTO-IV: encoding Base64 string.
	1. decode base64 to get client crypto iv key

	NOTE: by using this AES and IV key decode the client request body
	*/

	const base64DecodedAES = this.base64UrlSafeDecode(crypto_key_data); // is it is urlsafe encode then use urlsafe decode.
	const clientAES = this.decryptValue(base64DecodedAES);
	const clientIV = this.base64UrlSafeDecode(crypto_IV_data);

	const decryptedData = this.decryptValue(encodedBody, clientAES, clientIV);
	return decryptedData;

}