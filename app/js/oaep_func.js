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
   // console.log(data);
    //console.log(publicKey);
    //console.log(typeof publicKey)
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
