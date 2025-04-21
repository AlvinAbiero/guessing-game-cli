import readline from "readline";
import { performance } from "perf_hooks";
import { clearScreen, saveHighScore, getHighScore } from "./utils";

// create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Game configuration
enum Difficulty {
  Easy = 10,
  Medium = 5,
  Hard = 3,
}

interface GameState {
  targetNumber: number;
  remainingAttempts: number;
  attempts: number;
  difficulty: Difficulty;
  startTime: number;
  playing: boolean;
  hasUsedHint: boolean;
}

// Initialize a new game state
function initGameState(difficulty: Difficulty): GameState {
  return {
    targetNumber: Math.floor(Math.random() * 100) + 1,
    remainingAttempts: difficulty,
    attempts: 0,
    difficulty,
    startTime: performance.now(),
    playing: true,
    hasUsedHint: false,
  };
}

// Game state
let gameState: GameState;

// Display welcome message and game rules
function displayWelcome(): void {
  clearScreen();
  console.log("=".repeat(50));
  console.log("    Welcome to the Number Guessing Game!");
  console.log("=".repeat(50));
  console.log("\nI'm thinking of a number between 1 and 100.");
  console.log("Try to guess it with the fewest attempts possible!\n");
}

// Select difficulty  level
function selectDifficulty(): void {
  console.log("Please select the difficulty level:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");
  console.log();

  rl.question("Enter your choice: ", (choice) => {
    let difficulty: Difficulty;

    switch (choice) {
      case "1":
        difficulty = Difficulty.Easy;
        break;
      case "2":
        difficulty = Difficulty.Medium;
        break;
      case "3":
        difficulty = Difficulty.Hard;
        break;
      default:
        console.log("Invalid choice. Defaulting to Medium difficulty.");
        difficulty = Difficulty.Medium;
    }

    console.log(
      `\nGreat! You have selected the ${Difficulty[difficulty]} difficulty level.`
    );
    const highScore = getHighScore(difficulty);
    if (highScore) {
      console.log(
        `The best score for this difficulty is ${
          highScore.attempts
        } attempts in ${(highScore.time / 1000).toFixed(2)} seconds.`
      );
    }
    console.log("Let's start the game!\n");

    gameState = initGameState(difficulty);
    promptGuess();
  });
}

// Ask for a hint
function getHint(): string {
  const { targetNumber } = gameState;

  // Determine the range where the number falls
  if (targetNumber <= 25) {
    return "The number is in the range 1-25.";
  } else if (targetNumber <= 50) {
    return "The number is in the range 26-50.";
  } else if (targetNumber <= 75) {
    return "The number is in the range 51-75.";
  } else {
    return "the number is in the range 76-100.";
  }
}

// Prompt the user for a guess
function promptGuess(): void {
  if (gameState.remainingAttempts <= 0) {
    endGame(false);
    return;
  }

  const remainingText =
    gameState.remainingAttempts === 1
      ? "This is your last chance!"
      : `You have ${gameState.remainingAttempts} chances remaining.`;

  console.log(remainingText);

  if (
    !gameState.hasUsedHint &&
    gameState.remainingAttempts <= Math.ceil(gameState.difficulty / 2)
  ) {
    rl.question("Would you like a hint? (y/n): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        gameState.hasUsedHint = true;
        console.log(`HINT: ${getHint()}`);
      }
      getGuess();
    });
  } else {
    getGuess();
  }
}

function getGuess(): void {
  rl.question('Enter your guess (or "q" to quit): ', (input) => {
    if (input.toLowerCase() === "q") {
      console.log("Thanks for playing! Goodbye.");
      rl.close();
      process.exit(0);
    }

    const guess = parseInt(input);

    if (isNaN(guess) || guess < 1 || guess > 100) {
      console.log("Please enter a valid number between 1 and 100.");
      promptGuess();
      return;
    }

    gameState.attempts++;
    gameState.remainingAttempts--;

    if (guess === gameState.targetNumber) {
      endGame(true);
    } else {
      const hint =
        guess < gameState.targetNumber ? "greater than" : "less than";
      console.log(`Incorrect! The number is ${hint} ${guess}.\n`);
      promptGuess();
    }
  });
}

// End the game and prompt to play again
function endGame(won: boolean): void {
  const endTime = performance.now();
  const timeElapsed = endTime - gameState.startTime;
  const timeInSeconds = (timeElapsed / 1000).toFixed(2);

  if (won) {
    console.log(
      `\nCongratulations! You guessed the correct number (${gameState.targetNumber}) in ${gameState.attempts} attempts!`
    );
    console.log(`Time taken: ${timeInSeconds} seconds.`);

    // Save high score
    saveHighScore(gameState.difficulty, gameState.attempts, timeElapsed);
  } else {
    console.log(
      `\nGame over! You've run out of chances. The number was ${gameState.targetNumber}.`
    );
    console.log(`Time taken: ${timeInSeconds} seconds.`);
  }

  rl.question("\nDo you want to play again? (y/n): ", (answer) => {
    if (answer.toLowerCase() === "y") {
      displayWelcome();
      selectDifficulty();
    } else {
      console.log("Thanks for playing! Goodbye.");
      rl.close();
    }
  });
}

// Start the game
function startGame(): void {
  displayWelcome();
  selectDifficulty();
}

// Run the game
startGame();
