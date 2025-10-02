const ClassicMorty = require("./MortyTypes/ClassicMorty");
const LazyMorty = require("./MortyTypes/LazyMorty");
const SecurityManagement = require("./SecurityManagement");
const readline = require("readline");

class GameEngine {
  constructor(numBoxes, mortyType, statistics) {
    this.numBoxes = numBoxes;
    this.mortyType = mortyType;
    this.statistics = statistics;

    this.secretKey = SecurityManagement.generateSecretKey();
    this.mortyValue = SecurityManagement.generateRandomNumber(numBoxes) - 1;
    this.hmac1 = SecurityManagement.getHmac(
      this.secretKey,
      this.mortyType.toString()
    );

    this.rickValue = null;
    this.prizeBox = null;
    this.rickInitialChoice = null;
    this.rickFinalChoice = null;
    this.toSave = null;
  }

  start() {
    console.log("\n===============================");
    console.log("Ohh, Rick… hahahaha! Are you searching for your portal gun?");
    console.log("I hid it in these boxes. Can you find it, uh?");
    console.log("===============================\n");
    console.log(`HMAC1=\x1b[4m\x1b[33m${this.hmac1}\x1b[0m\n`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.askRickValue(rl);
  }

  askRickValue(rl) {
    rl.question(
      `Enter your value (0 to ${this.numBoxes - 1}):\nRick: `,
      (answer) => {
        this.rickValue = parseInt(answer);

        if (
          isNaN(this.rickValue) ||
          this.rickValue < 0 ||
          this.rickValue >= this.numBoxes
        ) {
          console.log(
            `\x1b[1m\x1b[31mInvalid! Must be 0 to ${this.numBoxes - 1}\x1b[0m`
          );
          return this.askRickValue(rl);
        }
        this.prizeBox = (this.mortyValue + this.rickValue) % this.numBoxes;
        this.askRickChoice(rl);
      }
    );
  }

  askRickChoice(rl) {
    const boxNumbers = Array.from({ length: this.numBoxes }, (_, i) => i).join(
      ", "
    );
    console.log(
      `\nAvailable boxes: \x1b[48;2;255;165;0m\x1b[30m[ ${boxNumbers} ]\x1b[0m`
    );

    /* _____________________ */
    // console.log(this.prizeBox);
    rl.question(
      `Which box do you choose (0 to ${this.numBoxes - 1})?\nRick: `,
      (answer) => {
        this.rickInitialChoice = parseInt(answer);
        if (
          isNaN(this.rickInitialChoice) ||
          this.rickInitialChoice < 0 ||
          this.rickInitialChoice >= this.numBoxes
        ) {
          console.log(`\x1b[1m\x1b[31mInvalid box number!\x1b[0m`);
          return this.askRickChoice(rl);
        }
        this.mortyRevealsBox(rl);
      }
    );
  }

  mortyRevealsBox(rl) {
    let mortyInstance;

    if (this.mortyType === "ClassicMorty") {
      mortyInstance = ClassicMorty;
    } else if (this.mortyType === "LazyMorty") {
      mortyInstance = LazyMorty;
    } else {
      console.log("\x1b[31mUnknown Morty type!\x1b[0m");
      rl.close();
      return;
    }
    const { forOpening, toSave } = mortyInstance.chooseBoxes(
      this.numBoxes,
      this.rickInitialChoice,
      this.prizeBox,
      this.secretKey
    );
    this.toSave = toSave;

    const openedBoxes = forOpening.join(", ");
    console.log(
      `\nMorty opened: \x1b[48;2;255;165;0m\x1b[30m[ ${openedBoxes} ]\x1b[0m - empty!`
    );
    console.log(
      `\nAvailable boxes: \x1b[48;2;255;165;0m\x1b[30m[ ${toSave} ]\x1b[0m`
    );
    this.askSwitch(rl);
  }

  askSwitch(rl) {
    rl.question(
      "Do you want to switch your choice? (yes/no)\nRick: ",
      (answer) => {
        const response = answer.toLowerCase().trim();

        if (response === "yes" || response === "y") {
          const otherBox = this.toSave.find(
            (box) => box !== this.rickInitialChoice
          );
          this.rickFinalChoice = otherBox;
          console.log(`\n🔄 Rick switched to box: ${this.rickFinalChoice}`);
        } else {
          this.rickFinalChoice = this.rickInitialChoice;
          console.log(`\n✋ Rick stays with box: ${this.rickFinalChoice}`);
        }

        this.revealResult(rl);
      }
    );
  }

  revealResult(rl) {
    const hasWon = this.rickFinalChoice === this.prizeBox;
    const hasSwitched = this.rickFinalChoice !== this.rickInitialChoice;

    if (this.rickFinalChoice === this.prizeBox) {
      console.log(
        "🎉 \x1b[32mCONGRATULATIONS! You found the portal gun!\x1b[0m 🎉"
      );
    } else {
      console.log(
        "💀 \x1b[1m\x1b[31mOh no! Wrong box! The portal gun was in box " +
          this.prizeBox +
          "\x1b[0m"
      );
    }

    this.statistics.recordRound(hasSwitched, hasWon);

    console.log("\n======= VERIFICATION =======");
    console.log("\n✅ You can verify the HMAC to confirm the game was fair!");
    console.log(`Morty's value: ${this.mortyValue}`);
    console.log(`Rick's value: ${this.rickValue}`);
    console.log(
      `Prize box: (${this.mortyValue} + ${this.rickValue}) % ${this.numBoxes} = ${this.prizeBox}`
    );
    console.log(`Secret key: ${this.secretKey}`);
    console.log(`HMAC1: ${this.hmac1}`);
    console.log(
      `Verify: HMAC(${this.secretKey}, ${this.mortyValue}) = ${this.hmac1}`
    );

    this.askPlayAgain(rl);
  }

  askPlayAgain(rl) {
    rl.question(
      "\nMorty: Do you want to play another round (y/n)?\nRick: ",
      (answer) => {
        const response = answer.toLowerCase().trim();

        if (response === "y" || response === "yes") {
          console.log("\nMorty: Okay Rick, let's go again!\n");
          rl.close();

          // Создать новую игру с теми же параметрами и статистикой
          const newGame = new GameEngine(
            this.numBoxes,
            this.mortyType,
            this.statistics
          );
          newGame.start();
        } else {
          console.log("\nMorty: Okay… uh, bye!\n");

          // ✅ Показать финальную статистику
          this.statistics.display();

          rl.close();
        }
      }
    );
  }
}

module.exports = GameEngine;
