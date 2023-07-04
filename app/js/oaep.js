// Import the 'crypto' module for cryptographic operations
const crypto = require('crypto');

const publicKeyValue = `-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAZSwXc2b+7JPGT6pCfYYWb0LC2oz7xVEP
P02+jysCZeuRMqAkFXNJK6EUNCpa9BTWzyyr7DjJYK4ijwSUN0+VcQIDAQAB
-----END PUBLIC KEY-----`;

const privateKeyValue = `-----BEGIN RSA PRIVATE KEY-----
MIIBOAIBAAJAZSwXc2b+7JPGT6pCfYYWb0LC2oz7xVEPP02+jysCZeuRMqAkFXNJ
K6EUNCpa9BTWzyyr7DjJYK4ijwSUN0+VcQIDAQABAkAoPmqxn/Wle3617771GWJR
LZg+wTfhHEZZYv57CpuwmIyngAEadgdRrAewcN4eLIIADona+bQ9AUJ8zkpESlEF
AiEAoTSF2/qlblxAYqbMHMrWghXExpAkYgxe8uv8HT3xQUMCIQCgqlczGE77NaGD
L9sSAnKuHu40yhQx/8/2QeUXkPIZOwIgITWNwfSPsf2FMg2EjQXoTOIpKHK3XA+K
W+briCajlbsCIEXNW+81+3KGvXIag4oSiDJ/+6vxs855PqfVvyt67MPrAiBAjZsR
25Fm1+u+fYEzP1H6kGh0RWlNobG3F27opqA/vA==
-----END RSA PRIVATE KEY-----`;

const publicKey = {
  modulusLength: 2048,
  key: publicKeyValue
};

const privateKey = {
  modulusLength: 2048,
  key: privateKeyValue
};


// OAEP encryption function
module.exports.oaepEncrypt = (plainText) => {
  // Generate a random buffer for the padding
  const padding = crypto.randomBytes(publicKey.modulusLength - 2 * crypto.constants.RSA_PKCS1_OAEP_PADDING);
  console.log("puspendu")

  // Create the encoded message
  const encodedMessage = Buffer.concat([
    Buffer.alloc(1, 0x00),
    padding,
    Buffer.alloc(1, 0x01),
    Buffer.from(plainText, 'utf8')
  ]);

  console.log(encodedMessage)

  // Encrypt the encoded message using the public key
  const encryptedMessage = crypto.publicEncrypt({
    key: publicKey.key,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, encodedMessage);

  return encryptedMessage.toString('base64');
}

// OAEP decryption function
module.exports.oaepDecrypt = (encryptedText) => {
  // Decrypt the encrypted message using the private key
  const decryptedMessage = crypto.privateDecrypt({
    key: privateKey.key,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(encryptedText, 'base64'));

  // Find the position of the delimiter
  const delimiterIndex = decryptedMessage.indexOf(0x01);

  // Extract the plain text from the decrypted message
  const plainText = decryptedMessage.slice(delimiterIndex + 1).toString('utf8');

  return plainText;
}

