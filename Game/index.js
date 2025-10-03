const ArgumentProcessing = require("./components/ArgumentProcessing");
const GameEngine = require("./components/GameEngine");

const Statistics = require("./components/Statistics");
const statistics = new Statistics();

const args = process.argv.slice(2);
const { numBoxes, mortyType } = ArgumentProcessing(args);

const game = new GameEngine(numBoxes, mortyType, statistics);

game.start();
