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
