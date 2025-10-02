const SecurityManagement = require("../SecurityManagement");

class LazyMorty {
  static chooseBoxes(totalBoxes, rickChoice, portalGunBox, secretKey) {
    const allBoxes = Array.from({ length: totalBoxes }, (_, i) => i);
    const safeBoxes = allBoxes.filter(
      (n) => n !== rickChoice && n !== portalGunBox
    );
    const forOpening = safeBoxes.slice(0, -1);
    let toSave;

    if (rickChoice === portalGunBox) {
      toSave = [rickChoice, safeBoxes[safeBoxes.length - 1]];
    } else {
      toSave = [rickChoice, portalGunBox].sort((a, b) => a - b);
    }
    const mortyValue = forOpening.length > 0 ? forOpening[0] : safeBoxes[0];

    const hmac2 = SecurityManagement.getHmac(secretKey, mortyValue.toString());
    console.log(`HMAC2=\x1b[35m${hmac2}\x1b[0m`);

    return { forOpening, toSave };
  }
}

module.exports = LazyMorty;
