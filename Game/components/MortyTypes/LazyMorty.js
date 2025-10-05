const SecurityManagement = require("../SecurityManagement");

class LazyMorty {
  constructor(rickInitialChoice, numBoxes, prizeBox) {
    this.rickInitialChoice = rickInitialChoice;
    this.numBoxes = numBoxes;
    this.prizeBox = prizeBox;

    this.secretKey2 = null;
    this.mortyValue2 = null;
    this.hmac2 = null;
  }

  generateHmac2() {
    this.secretKey2 = SecurityManagement.generateSecretKey();

    // LazyMorty НЕ генерирует случайное число, использует 0
    this.mortyValue2 = 0;

    this.hmac2 = SecurityManagement.getHmac(
      this.secretKey2,
      this.mortyValue2.toString()
    );

    console.log(`Morty: HMAC2=${this.hmac2}`);

    return {
      hmac2: this.hmac2,
      mortyValue2: this.mortyValue2,
      secretKey2: this.secretKey2,
    };
  }

  revealBox(rickValue2) {
    const fairIndex = (this.mortyValue2 + rickValue2) % (this.numBoxes - 1);

    const boxesExceptRick = Array.from({ length: this.numBoxes }, (_, i) => i)
      .filter((n) => n !== this.rickInitialChoice)
      .sort((a, b) => a - b);

    const boxToKeep = boxesExceptRick[fairIndex];

    return boxToKeep;
  }
}

module.exports = LazyMorty;
