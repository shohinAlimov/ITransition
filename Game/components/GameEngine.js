const SecurityManagement = require("./SecurityManagement");
const ClassicMorty = require("./MortyTypes/ClassicMorty");
const LazyMorty = require("./MortyTypes/LazyMorty");
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
    this.mortyInstance = null;

    this.hmac1 = null;
    this.hmac2 = null;

    this.rickValue1 = null;
    this.rickValue2 = null;
    this.rickInitialChoice = null;
    this.rickFinalChoice = null;

    this.prizeBox = null;
    this.boxToKeep = null;
  }

  validation(trimmed) {
    // Проверка что строка состоит ТОЛЬКО из цифр
    if (!/^\d+$/.test(trimmed)) {
      console.log(`\x1b[1m\x1b[31mInvalid! Enter a valid number\x1b[0m`);
      return false;
    }
    return true;
  }

  start() {
    this.secretKey1 = SecurityManagement.generateSecretKey();
    this.mortyValue1 = SecurityManagement.generateRandomNumber(this.numBoxes);
    this.hmac1 = SecurityManagement.getHmac(this.secretKey1, this.mortyValue1);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(
      `Morty: Oh geez, Rick, I'm gonna hide your portal gun in one of the ${this.numBoxes} boxes, okay?`,
      `\nMorty: HMAC1=${this.hmac1}`
    );

    this.askRickValue1(rl);
  }

  askRickValue1(rl) {
    rl.question(
      `Morty: Rick, enter your number [0,${this.numBoxes}) so you don't whine later that I cheated, alright?\nRick: `,
      (answer) => {
        const trimmed = answer.trim();

        if (!this.validation(trimmed)) {
          return this.askRickValue1(rl);
        }

        this.rickValue1 = parseInt(trimmed);

        if (this.rickValue1 < 0 || this.rickValue1 >= this.numBoxes) {
          console.log(
            `\x1b[1m\x1b[31mInvalid! Must be [0 to ${this.numBoxes - 1}]\x1b[0m`
          );
          return this.askRickValue1(rl);
        }

        this.prizeBox = (this.mortyValue1 + this.rickValue1) % this.numBoxes;
        this.askRickBoxChoice(rl);
      }
    );
  }

  askRickBoxChoice(rl) {
    rl.question(
      `Morty: Okay, okay, I hid the gun. What's your guess [0,${this.numBoxes})?\nRick: `,
      (answer) => {
        const trimmed = answer.trim();

        if (!this.validation(trimmed)) {
          return this.askRickBoxChoice(rl);
        }

        this.rickInitialChoice = parseInt(trimmed);

        if (
          this.rickInitialChoice < 0 ||
          this.rickInitialChoice >= this.numBoxes
        ) {
          console.log(
            `\x1b[1m\x1b[31mInvalid! Must be [0 to ${this.numBoxes - 1}]\x1b[0m`
          );
          return this.askRickBoxChoice(rl);
        }

        console.log(
          "Morty: Let's, uh, generate another value now, I mean, to select a box to keep in the game."
        );

        if (this.mortyType === "ClassicMorty") {
          this.mortyInstance = new ClassicMorty(
            this.rickInitialChoice,
            this.numBoxes,
            this.prizeBox
          );
        } else if (this.mortyType === "LazyMorty") {
          this.mortyInstance = new LazyMorty(
            this.rickInitialChoice,
            this.numBoxes,
            this.prizeBox
          );
        }

        const { hmac2, mortyValue2, secretKey2 } =
          this.mortyInstance.generateHmac2();
        this.hmac2 = hmac2;
        this.mortyValue2 = mortyValue2;
        this.secretKey2 = secretKey2;

        this.askRickValue2(rl);
      }
    );
  }

  askRickValue2(rl) {
    rl.question(
      `Morty: Rick, enter your number [0,${
        this.numBoxes - 1
      }), and, uh, don't say I didn't play fair, okay?\nRick: `,
      (answer) => {
        const trimmed = answer.trim();

        if (!this.validation(trimmed)) {
          return this.askRickValue2(rl);
        }

        this.rickValue2 = parseInt(trimmed);

        if (this.rickValue2 < 0 || this.rickValue2 >= this.numBoxes - 1) {
          console.log(
            `\x1b[1m\x1b[31mInvalid! Must be [0 to ${this.numBoxes - 2}]\x1b[0m`
          );
          return this.askRickValue2(rl);
        }

        this.boxToKeep = this.mortyInstance.revealBox(this.rickValue2);

        const boxesToOpen = Array.from(
          { length: this.numBoxes },
          (_, i) => i
        ).filter((n) => n !== this.rickInitialChoice && n !== this.boxToKeep);

        console.log(
          `\nMorty opened boxes [${boxesToOpen.join(", ")}] - empty!\n`
        );
        console.log(
          `Morty: I'm keeping the box you chose, I mean ${this.rickInitialChoice}, and the box ${this.boxToKeep}.`
        );

        this.askSwitch(rl, this.boxToKeep);
      }
    );
  }

  askSwitch(rl, boxToKeep) {
    const remainingBoxes = [this.rickInitialChoice, boxToKeep];
    const otherBox = remainingBoxes.find((b) => b !== this.rickInitialChoice);

    rl.question(
      `Morty: You can switch your box to ${otherBox} (enter 0), or, you know, stick with ${this.rickInitialChoice} (enter 1).\nRick: `,
      (answer) => {
        const trimmed = answer.trim();

        if (!this.validation(trimmed)) {
          return this.askSwitch(rl, boxToKeep);
        }

        const choice = parseInt(trimmed);

        if (choice !== 0 && choice !== 1) {
          console.log(`\x1b[1m\x1b[31mInvalid! Enter 0 or 1\x1b[0m`);
          return this.askSwitch(rl, boxToKeep);
        }

        if (choice === 0) {
          this.rickFinalChoice = otherBox;
          console.log(`Rick switched to box ${this.rickFinalChoice}`);
        } else {
          this.rickFinalChoice = this.rickInitialChoice;
          console.log(`Rick stays with box ${this.rickInitialChoice}`);
        }

        this.revealResult(rl);
      }
    );
  }

  revealResult(rl) {
    const hasWon = this.rickFinalChoice === this.prizeBox;
    const hasSwitched = this.rickFinalChoice !== this.rickInitialChoice;

    if (hasWon) {
      console.log(
        "\n🎉 \x1b[32mCONGRATULATIONS! You found the portal gun!\x1b[0m 🎉"
      );
    } else {
      console.log(
        `\n💀 \x1b[1m\x1b[31mAww man, you lost, Rick. Now we gotta go on one of *my* adventures! The portal gun was in box ${this.prizeBox}\x1b[0m`
      );
    }

    const fairIndex =
      (this.mortyValue2 + this.rickValue2) % (this.numBoxes - 1);

    console.log(
      "\n======= VERIFICATION =======",
      `\nMorty: Aww man, my 1st random value is ${this.mortyValue1}.`,
      `\nMorty: KEY1=\x1b[4m\x1b[34m${this.secretKey1}\x1b[0m`,
      `\nMorty: So the 1st fair number is (${this.mortyValue1} + ${this.rickValue1}) % ${this.numBoxes} = ${this.prizeBox}`,
      `\nMorty: Aww man, my 2nd random value is ${this.mortyValue2}.`,
      `\nMorty: KEY2=\x1b[4m\x1b[34m${this.secretKey2}\x1b[0m`,
      `\nMorty: Uh, okay, the 2nd fair number is (${this.mortyValue2} + ${
        this.rickValue2
      }) % ${this.numBoxes - 1} = ${fairIndex}`,
      `\nMorty: Your portal gun is in the box ${this.prizeBox}.`
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
