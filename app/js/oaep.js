// Import the 'crypto' module for cryptographic operations
const crypto = require('crypto');

const publicKeyValue = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBZ2f+1lkbi6lHma+yz02vb
G9sPVUB9IFmb/new1S6XyOJUkNZbTnioyMmAJiS92wxsCuGLM4qM0qelN6unskZH
pg6FGl8dbxCOVXF0EZN3PbAewKboMLbQy3uGMUl6axZ0z4QhNfuXQqU1d+dDV0X8
5AmovhE3BY6BKyn3MCPVGyddPEsLA0sjGAR2kLngXzrvn4COSKswemuxIAuTqGTd
3j3niymoXxFut8HGhUgSkvYEVnRJspAOK4tTIdozZcyFJetp+i6ZbqMXEtMfP1lM
TiqWg6PcF43gKkrcUPg8LYWACv2Id9zq8MpdYORQOLycaCaY8PZyvJFarViU3CPB
AgMBAAE=
-----END PUBLIC KEY-----`;

const privateKeyValue = `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQBZ2f+1lkbi6lHma+yz02vbG9sPVUB9IFmb/new1S6XyOJUkNZb
TnioyMmAJiS92wxsCuGLM4qM0qelN6unskZHpg6FGl8dbxCOVXF0EZN3PbAewKbo
MLbQy3uGMUl6axZ0z4QhNfuXQqU1d+dDV0X85AmovhE3BY6BKyn3MCPVGyddPEsL
A0sjGAR2kLngXzrvn4COSKswemuxIAuTqGTd3j3niymoXxFut8HGhUgSkvYEVnRJ
spAOK4tTIdozZcyFJetp+i6ZbqMXEtMfP1lMTiqWg6PcF43gKkrcUPg8LYWACv2I
d9zq8MpdYORQOLycaCaY8PZyvJFarViU3CPBAgMBAAECggEAKgUaYhiydAJzZNhK
LVsNkL25N7V94EaVwa9C2G8KSC/JMRU/Oho7sWudWJH+Es/zQj/gdNIY1HzbrBeZ
7mYgGffdyH+pxcEgNABfe5GQrm4qBGfCZsoJZSIUVZCNNXQJX32A5Gsziuy/CH9X
pxWUhI08uy6QLHQrzdqa2KAp0co+yKg8Ry7dDLCpNPSmRtMtfa5UVDXaZJGMAQxM
ggtLBCmIzD8pEX+qu8Z0aooa8xdm9r8SUAci9cIZncoYXoMGJwyxQYbm8Vcg/pMY
2amHnGHeKiBVjPyCBZihq6N9ZwnnS/+wBxENl2sh1SI69uTgZ3B7WqHT5K8fRe11
tEGDtQKBgQCvTYw1F8IWcEZjmy0m8HXN6BuBL4DDoA8msNr+hx3yFGAbxEzZqksa
nah+5f/C0AZAiCxwIw5q2I1EaFLOWNAPwkPCDGGJJpjG30FvzQah7p6lNUjM2svt
Gi/No+K3IOlJS5gsJcgrEKAzpmvGBGDPuHqUoxNKJ9grni9tKw6jOwKBgQCDNn54
u73s7ZLgNwbmRpvAiCf1sYD+dIeydzvbwdhHG3pEM5klEBJgDD6tdO1IAif+CwtH
K/MgxEfkErHtfKf9nEupRIl7eXvGM/VPIoZaDQ/dN1h2BRhq/Wav3lrAJU3JrKBb
NMElcOYByPCwzO0sBnm4hgoN9soR++YjdjztMwKBgFzGcbl3hWRSry3v5gmBoRcE
C+pmtYLSprIXTw79ez+uwN5xGSrpES5Y2d+u4Zi8d1KXvszqAKtTSBA4FfrWzeZJ
LYr4+nWXU6uMZBlDLItuuc89T/X6pYoqHbp7TXUVmeEMfNCAflssRVyQauE1V/cW
7ujTFVZdl+4dnYPtEaYZAoGAePCjhbjWCCm59TwC+gEe0kktO8LOOLtDz/UikR2M
sY3cFjzQ7V5w8WKX6t0ZUAPcxMV9Ma6KvCrucIPiyBjb5mBHRM9NQSfqM/f0JWqX
Fy1u7+FxgeaUaRkDqxpx3yUDG94nN6naVR5IgmCpqOxZtviI/NFfNxu/iO/7Ybg7
1A0CgYBiakgR1v0Tr+qljUXzD71Ql33F3IAlHth3eUWJgUOO7PyFQqST5ifB4QHk
lkqgMjy8lvr+yZYT2BvKvebYwLn1rJiDEBo4z3F1llyQIrc9TY67Jp8sVDycegzC
WxSg3iNz32x90JLPxq8MW2icmwW4YxXYhFmhvuATH3qUxoAMxw==
-----END RSA PRIVATE KEY-----`;


// OAEP encryption function
module.exports.oaepEncrypt = (plainText) => {
  // Generate a random buffer for the padding
  const padding = crypto.randomBytes(publicKey.modulusLength - 2 * crypto.constants.RSA_PKCS1_OAEP_PADDING);

  // Create the encoded message
  const encodedMessage = Buffer.concat([
    Buffer.alloc(1, 0x00),
    padding,
    Buffer.alloc(1, 0x01),
    Buffer.from(plainText, 'utf8')
  ]);

  // Encrypt the encoded message using the public key
  const encryptedMessage = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, encodedMessage);

  return encryptedMessage.toString('base64');
}

// OAEP decryption function
module.exports.oaepDecrypt = (encryptedText) => {
  // Decrypt the encrypted message using the private key
  const decryptedMessage = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(encryptedText, 'base64'));

  // Find the position of the delimiter
  const delimiterIndex = decryptedMessage.indexOf(0x01);

  // Extract the plain text from the decrypted message
  const plainText = decryptedMessage.slice(delimiterIndex + 1).toString('utf8');

  return plainText;
}

// Example usage
const publicKey = {
  modulusLength: 2048,
  key: publicKeyValue
};

const privateKey = {
  modulusLength: 2048,
  key: privateKeyValue
};

const plainText = 'Hello, OAEP!';

// Encrypt the plain text
const encryptedText = oaepEncrypt(plainText);
console.log('Encrypted text:', encryptedText);

// Decrypt the encrypted text
const decryptedText = oaepDecrypt(encryptedText);
console.log('Decrypted text:', decryptedText);
