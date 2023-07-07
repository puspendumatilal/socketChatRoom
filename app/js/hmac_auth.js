const crypto = require("crypto");

async function generateHmac(key, message) {
  // Create a new HMAC object with the provided key and SHA256 hash function
  const hmac = await crypto.createHmac("sha256", key);
  // Update the HMAC object with the message
  hmac.update(message);
  // Get the digest (the authentication code) in hexadecimal format
  const digest = hmac.digest("hex");
  return digest;
}

const verifyHmac = async(key, message, receivedDigest)=>{
  // Generate a new digest based on the provided key and message
  const expectedDigest = await generateHmac(key, message);
  // Compare the expected digest with the received digest
  if (
    crypto.timingSafeEqual(
      Buffer.from(expectedDigest),
      Buffer.from(receivedDigest)
    )
  ) {
    console.log("HMAC verification successful. The message is authentic.");
  } else {
    console.log(
      "HMAC verification failed. The message may have been tampered with."
    );
  }
};

module.exports = { generateHmac, verifyHmac};
