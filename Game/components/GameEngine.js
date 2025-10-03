const ClassicMorty = require("./MortyTypes/ClassicMorty");
const LazyMorty = require("./MortyTypes/LazyMorty");
const SecurityManagement = require("./SecurityManagement");
const readline = require("readline");

class GameEngine {
  constructor(numBoxes, mortyType, statistics) {
    this.numBoxes = numBoxes;
    this.mortyType = mortyType;
    this.statistics = statistics;

    this.secretKey1 = null;
    this.secretKey2 = null;

    this.mortyValue1 = null;
    this.mortyValue2 = null;

    this.rickValue1 = null;
    this.rickValue2 = null;

    this.hmac1 = null;
    this.prizeBox = null;

    this.rickValue2 = null;
    this.rickFinalChoice = null;

    this.toSave = null;
  }

  start() {
    console.log("\n===============================");
    console.log(
      `Ohh, Rick… hahahaha! I'm gonna hide your portal gun in one of the ${this.numBoxes} boxes!`
    );
    console.log("===============================\n");

    this.secretKey1 = SecurityManagement.generateSecretKey();
    this.mortyValue1 = SecurityManagement.generateRandomNumber(this.numBoxes);
    this.hmac1 = SecurityManagement.getHmac(
      this.secretKey1,
      this.mortyValue1.toString()
    );

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(
      `Morty: My number - HMAC1=\x1b[4m\x1b[33m${this.hmac1}\x1b[0m\n`
    );

    this.askrickValue1(rl);
  }

  askrickValue1(rl) {
    rl.question(
      `Morty: Rick, enter your number [0,${
        this.numBoxes - 1
      }] so you don’t whine later that I cheated, alright?\nRick: `,
      (answer) => {
        this.rickValue1 = parseInt(answer);

        if (
          isNaN(this.rickValue1) ||
          this.rickValue1 < 0 ||
          this.rickValue1 >= this.numBoxes
        ) {
          console.log(
            `\x1b[1m\x1b[31mInvalid! Must be [0 to ${this.numBoxes - 1}]\x1b[0m`
          );
          return this.askrickValue1(rl);
        }

        this.prizeBox = (this.mortyValue1 + this.rickValue1) % this.numBoxes;
        console.log(
          `\nRick's value accepted: ${this.rickValue1}. We randomly generated the prizeBox together. Now... Find it!`
        );

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

    rl.question(
      `Which box do you choose [0 to ${this.numBoxes - 1}]?\nRick: `,
      (answer) => {
        this.rickValue2 = parseInt(answer);

        if (
          isNaN(this.rickValue2) ||
          this.rickValue2 < 0 ||
          this.rickValue2 >= this.numBoxes
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
    }

    const { forOpening, toSave, secretKey2, mortyValue2 } =
      mortyInstance.chooseBoxes(this.numBoxes, this.rickValue2, this.prizeBox);

    this.secretKey2 = secretKey2;
    this.mortyValue2 = mortyValue2;
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
          const otherBox = this.toSave.find((box) => box !== this.rickValue2);
          this.rickFinalChoice = otherBox;
          console.log(`\n🔄 Rick switched to box: ${this.rickFinalChoice}`);
        } else {
          this.rickFinalChoice = this.rickValue2;
          console.log(`\n✋ Rick stays with box: ${this.rickFinalChoice}`);
        }

        this.revealResult(rl);
      }
    );
  }

  revealResult(rl) {
    const hasWon = this.rickFinalChoice === this.prizeBox;
    const hasSwitched = this.rickFinalChoice !== this.rickValue2;

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

    const openedBox =
      (this.mortyValue2 + this.rickValue2) % (this.numBoxes - 1);

    console.log(
      "\n======= VERIFICATION =======",
      `\nMy 1st random number was: ${this.mortyValue1}`,
      `\nKEY1=\x1b[4m\x1b[34m${this.secretKey1}\x1b[0m`,
      `\nSo the 1st fair number is - (${this.mortyValue1} + ${this.rickValue1}) % ${this.numBoxes} = ${this.prizeBox}`,

      `\nMy 2nd random number was: ${this.mortyValue2}`,
      `\nKEY1=\x1b[4m\x1b[34m${this.secretKey2}\x1b[0m`,
      `\nSo the 2nd fair number (opened box) - (${this.mortyValue2} + ${
        this.rickValue2
      }) % ${this.numBoxes - 1} = ${openedBox}`
    );

    this.statistics.recordRound(hasSwitched, hasWon);

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

          this.statistics.display();

          rl.close();
        }
      }
    );
  }
}

module.exports = GameEngine;
