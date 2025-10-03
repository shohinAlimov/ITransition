const SecurityManagement = require("../SecurityManagement");

class LazyMorty {
  static chooseBoxes(totalBoxes, rickChoice, portalGunBox) {
    const secretKey2 = SecurityManagement.generateSecretKey();
    const allBoxes = Array.from({ length: totalBoxes }, (_, i) => i);
    let safeBoxes = allBoxes.filter(
      (n) => n !== rickChoice && n !== portalGunBox
    );
    let forOpening;
    let toSave;

    if (rickChoice === portalGunBox) {
      const lowestSafeBox = Math.min(...safeBoxes);
      forOpening = safeBoxes.filter((n) => n !== lowestSafeBox);
      toSave = [portalGunBox, lowestSafeBox];
    } else {
      forOpening = safeBoxes;
      toSave = [rickChoice, portalGunBox];
    }
    const mortyValue2 =
      forOpening.length > 0 ? Math.min(...forOpening) : Math.min(...safeBoxes);
    const hmac2 = SecurityManagement.getHmac(
      secretKey2,
      mortyValue2.toString()
    );
    console.log(`HMAC2=\x1b[35m${hmac2}\x1b[0m`);

    return { forOpening, toSave, secretKey2, mortyValue2 };
  }
}

module.exports = LazyMorty;
