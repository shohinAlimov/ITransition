const crypto = require("crypto");

class SecurityManagement {
  static generateSecretKey() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generateRandomNumber(max) {
    return crypto.randomInt(1, parseInt(max) + 1);
  }

  static getHmac(secretKey, message) {
    return crypto
      .createHmac("sha256", secretKey)
      .update(message.toString())
      .digest("hex");
  }
}

module.exports = SecurityManagement;
