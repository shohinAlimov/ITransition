const Table = require("cli-table3");

class Statistics {
  constructor() {
    this.rounds = 0;
    this.switchedWins = 0;
    this.switchedGames = 0;
    this.stayedWins = 0;
    this.stayedGames = 0;
  }

  recordRound(hasSwitched, hasWon) {
    this.rounds++;

    if (hasSwitched) {
      this.switchedGames++;
      if (hasWon) {
        this.switchedWins++;
      }
    } else {
      this.stayedGames++;
      if (hasWon) {
        this.stayedWins++;
      }
    }
  }

  getSwitchWinRate() {
    if (this.switchedGames === 0) return 0;
    return this.switchedWins / this.switchedGames;
  }

  getStayWinRate() {
    if (this.stayedGames === 0) return 0;
    return this.stayedWins / this.stayedGames;
  }

  display() {
    console.log(
      "\n\x1b[36m==================== GAME STATS ====================\x1b[0m\n"
    );

    const table = new Table({
      head: [
        "\x1b[33mGame results\x1b[0m",
        "\x1b[32mRick switched\x1b[0m",
        "\x1b[31mRick stayed\x1b[0m",
      ],
      colWidths: [20, 20, 20],
    });

    // Строка 1: Количество раундов
    table.push(["Rounds", this.switchedGames, this.stayedGames]);

    // Строка 2: Количество побед
    table.push(["Wins", this.switchedWins, this.stayedWins]);

    // Строка 3: Процент (оценка)
    const switchEstimate = this.switchedGames > 0 ? "?" : "?";
    const stayEstimate = this.stayedGames > 0 ? "?" : "?";

    table.push(["P (estimate)", switchEstimate, stayEstimate]);

    // Строка 4: Процент (точный)
    const switchExact = this.getSwitchWinRate().toFixed(3);
    const stayExact = this.getStayWinRate().toFixed(3);

    table.push(["P (exact)", switchExact, stayExact]);

    console.log(table.toString());
    console.log(
      "\n\x1b[36m====================================================\x1b[0m\n"
    );
  }

  reset() {
    this.rounds = 0;
    this.switchedWins = 0;
    this.switchedGames = 0;
    this.stayedWins = 0;
    this.stayedGames = 0;
  }
}

module.exports = Statistics;
