const SecurityManagement = require("../SecurityManagement");

class ClassicMorty {
  static chooseBoxes(totalBoxes, rickChoice, portalGunBox) {
    const secretKey2 = SecurityManagement.generateSecretKey();
    const allBoxes = Array.from({ length: totalBoxes }, (_, i) => i);
    let forOpening;
    let toSave;
    let mortyValue2;

    if (rickChoice === portalGunBox) {
      const safeBoxes = allBoxes.filter((n) => n !== portalGunBox);
      const randomNumber =
        safeBoxes[
          SecurityManagement.generateRandomNumber(safeBoxes.length - 1)
        ];
      forOpening = safeBoxes.filter((n) => n !== randomNumber);
      toSave = [portalGunBox, randomNumber];
      mortyValue2 = randomNumber;
    } else {
      forOpening = allBoxes.filter(
        (n) => n !== rickChoice && n !== portalGunBox
      );
      toSave = [portalGunBox, rickChoice];
      mortyValue2 = portalGunBox;
    }

    const hmac2 = SecurityManagement.getHmac(
      secretKey2,
      mortyValue2.toString()
    );
    console.log(`HMAC2=\x1b[4m\x1b[33m${hmac2}\x1b[0m`);

    return { forOpening, toSave, secretKey2, mortyValue2 };
  }
}

module.exports = ClassicMorty;
