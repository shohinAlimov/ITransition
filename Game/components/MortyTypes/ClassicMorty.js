const SecurityManagement = require("../SecurityManagement");

class ClassicMorty {
  static chooseBoxes(totalBoxes, rickChoice, portalGunBox, secretKey) {
    const allBoxes = Array.from({ length: totalBoxes }, (_, i) => i);
    let forOpening;
    let toSave;
    let mortyValue;

    if (rickChoice === portalGunBox) {
      const safeBoxes = allBoxes.filter((n) => n !== portalGunBox);
      const randomNumber =
        safeBoxes[
          SecurityManagement.generateRandomNumber(safeBoxes.length - 1)
        ];
      forOpening = safeBoxes.filter((n) => n !== randomNumber);
      toSave = [portalGunBox, randomNumber];
      mortyValue = randomNumber;
    } else {
      forOpening = allBoxes.filter(
        (n) => n !== rickChoice && n !== portalGunBox
      );
      toSave = [portalGunBox, rickChoice];
      mortyValue = portalGunBox;
    }

    const hmac2 = SecurityManagement.getHmac(secretKey, mortyValue.toString());
    console.log(`HMAC2=\x1b[4m\x1b[33m${hmac2}\x1b[0m`);

    return { forOpening, toSave };
  }
}

module.exports = ClassicMorty;
