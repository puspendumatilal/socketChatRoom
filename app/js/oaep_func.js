const crypto = require("crypto")

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
})

console.log(
	publicKey.export({
		type: "pkcs1",
		format: "pem",
	}),

	privateKey.export({
		type: "pkcs1",
		format: "pem",
	})
)

// const privateKey = `-----BEGIN RSA PRIVATE KEY-----
// MIIEpAIBAAKCAQEAzueo45gibMttnXn1F7ve9rGBzFSpCBoYY9ahUoaSmdVBvYeF
// pIX4z6EWnH7aluLfwl1OWXHeCHkM20qgS2Y3ouALAwEYFF7psCzC2i3/NB16oJi+
// AKh2GDfAHvsryJoPfNn2gIdHFlICw8Dxi4X/z18gHCUxdITVxewcH5d46QADe+aC
// xIbfjrj6AR57I6rJskmDt6D5zhto6dhN4u4CgApFKVSpkwHorRY5NsKQycICBLUN
// MyZJqAX6fr4/2hUGRcuJ4lYZtnS6ciJyGpz3+VLvLLFU5s2FZKZMOarWb02UT0xd
// EjMZEYk8KKfCJHbpcma9Ny569zntZ6VKG0hpXwIDAQABAoIBADXpzWtIuCerNmvj
// XIcLsESN6mmI4ea3jgVt5ulvIYIuPIwbZSqCslu/+PlcYK8SfQXTdFgAQL/qcvwt
// TOl4wCSTxqrIvTKJrND4SOm7NJWq3Mo+IrxfKS6UUF6CSl1iL4jz7rR9C3v4cLn7
// a7VUfFzXx7Ety941wtJo/McKnDnyC+8pFsAKCoHH/KJ4ctd+81R4yxOmUyv7MFlO
// CuMPkRucPZXZXb05fTxdAyOeHMUsF7J1Ohz5pjb34QuX2V3jZ4WIERfU+5RX8p1k
// giHvDxal3RjEKTnCtDD3k7+EEHQHOHFbyRb6ErEEfgRB7E8IlFacv2TLfAEUy7AK
// gq1xwhECgYEA7xjQ9M3RlG7PxgkwD932Rt43KoklT02mSXFp2hSvy2PIw1ZWl7hh
// iim1eBc3NBwLTt1A4iJFG4KRdoBE0TXjcLMLOPmDvQetyxfEKPUB+xrmyI9xfTmo
// fIGJCIcNa/WYDlJDtkBsS/Dd9xYhClvwaPltqBmjetnDlsY12B+PU7kCgYEA3Yg7
// OmMrrv8xf3xjzur0A+TYPD4RTt9nlMgxOf/EKBoP3obW3BKdNtWdS5HoB7Sr6IdO
// j/tXWdIS/9th1krlbJqgrQPk6iWtXG/VXaIDIR8MjrtVEdt3ubHuvKShlXfPZAKj
// EQDzWCMYRK+0/IRwNGu0aLJYPoOJ2FWjZJywYdcCgYAygbeCPwgKpu3VE5PHhkfD
// 6KUWoynyeqCp2v9VRhFskYOTX+Wi3xwbp3viBmVu6I2q9yoBmuOmUAqSUb43w35s
// DCZOvsaJY9nekQKq9Daa6K/fpg1/OnLQ+jwMRRsctyCLxezvzuQRlqwMyevo2EsM
// ocP8Qo46IU4jx3MQWHpaYQKBgQDKFeQxtxW6ZYE50rcZoqtGghPfoJ8ZXCKZTqXZ
// SsAd9OhVDpwh1bkktGjw7wDDRsUrMYMxRQ7CGSjLzczKNzhiggvgyJSiJAypLjtt
// VsWUCUbjTXClAZeOBgrKe0QLnWfKy70FXeCeniUdQ0vOruHMcBP7DfYB0OyGNFkB
// Bw6/sQKBgQCcW0oLPH8mwKnSgNjFgQUoqb1325iXniK9vusX88YsUjfLzPTCXOx5
// CVtFMhkbaXCP5BG4v+F9oAfa8B0xK5RwJZu0RseahkYASzuQqGy1y2nrvvJ2vY7r
// 4VYr5pkQ09Toc4pUtVoG/tcQibel82pDQ4EKks402GK5OC24cGOHXQ==
// -----END RSA PRIVATE KEY-----`

// const publicKey = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzueo45gibMttnXn1F7ve
// 9rGBzFSpCBoYY9ahUoaSmdVBvYeFpIX4z6EWnH7aluLfwl1OWXHeCHkM20qgS2Y3
// ouALAwEYFF7psCzC2i3/NB16oJi+AKh2GDfAHvsryJoPfNn2gIdHFlICw8Dxi4X/
// z18gHCUxdITVxewcH5d46QADe+aCxIbfjrj6AR57I6rJskmDt6D5zhto6dhN4u4C
// gApFKVSpkwHorRY5NsKQycICBLUNMyZJqAX6fr4/2hUGRcuJ4lYZtnS6ciJyGpz3
// +VLvLLFU5s2FZKZMOarWb02UT0xdEjMZEYk8KKfCJHbpcma9Ny569zntZ6VKG0hp
// XwIDAQAB
// -----END PUBLIC KEY-----`

// This is the data we want to encrypt
const data = "my secret data"
module.exports.encryptValue = (data) => {
    console.log(data);
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
    console.log(encryptedData);
    console.log(crypto.constants.RSA_PKCS1_OAEP_PADDING)
	const decryptedData = crypto.privateDecrypt(
		{
			key: privateKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		encryptedData
	)

	// The decrypted data is of the Buffer type, which we can convert to a
	// string to reveal the original data
	// console.log("decrypted data: ", decryptedData.toString());
	return decryptedData.toString();
}
