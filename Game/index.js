const ArgumentProcessing = require("./components/ArgumentProcessing");
const GameEngine = require("./components/GameEngine");
const Statistics = require("./components/Statistics");

const args = process.argv.slice(2);
const { numBoxes, mortyType } = ArgumentProcessing(args);
const statistics = new Statistics(numBoxes);
const game = new GameEngine(numBoxes, mortyType, statistics);
game.start();
