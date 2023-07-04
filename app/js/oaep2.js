const crypto = require('crypto');

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Function to encrypt data using RSA-OAEP
module.exports.encryptData = (data) => {
  // Generate a random symmetric key for AES
  const symmetricKey = crypto.randomBytes(32); // 32 bytes = 256 bits

  // Encrypt the data using AES symmetric encryption
  const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, crypto.randomBytes(16));
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');

  // Encrypt the symmetric key using RSA-OAEP with the public key
  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    symmetricKey
  );

  return {
    encryptedKey: encryptedKey.toString('base64'),
    encryptedData,
  };
}

// Function to decrypt data using RSA-OAEP
module.exports.decryptData = (encryptedKey, encryptedData) => {
  // Decrypt the symmetric key using RSA-OAEP with the private key
  const decryptedKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encryptedKey, 'base64')
  );

  // Decrypt the data using the decrypted symmetric key
  const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedKey, crypto.randomBytes(16));
  let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}

// Example usage
// const originalData = 'Hello, World!';

// // Encrypt the data using the recipient's public key
// const { encryptedKey, encryptedData } = encryptData(originalData, publicKey);

// // Transmit the encryptedKey and encryptedData to the recipient

// // Recipient's code
// const decryptedData = decryptData(encryptedKey, encryptedData, privateKey);

// console.log(decryptedData); // Output: Hello, World!
