function ArgumentProcessing(args) {
  const numBoxes = args[0];
  const mortyType = args[1];

  if (isNaN(numBoxes) || numBoxes < 3) {
    console.log(
      "\x1b[1m\x1b[31mPlease provide a valid number of boxes (> 2).\x1b[0m\x1b[0m"
    );
    process.exit();
  }

  if (mortyType !== "ClassicMorty" && mortyType !== "LazyMorty") {
    console.log(
      "\x1b[1m\x1b[31mPlease provide a valid name for Morty type (ClassicMorty & LazyMorty).\x1b[0m\x1b[0m"
    );
    process.exit();
  }

  return { numBoxes, mortyType };
}

module.exports = ArgumentProcessing;
