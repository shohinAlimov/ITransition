const crypto = require("crypto");

class SecurityManagement {
  static generateSecretKey() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generateRandomNumber(max) {
    const randomBytes = crypto.randomBytes(4);
    const randomValue = randomBytes.readUInt32BE(0);
    return (randomValue % max) + 1;
  }

  static getHmac(secretKey, message) {
    return crypto
      .createHmac("sha256", secretKey)
      .update(message.toString())
      .digest("hex");
  }
}

module.exports = SecurityManagement;
