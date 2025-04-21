# Number Guessing Game

A CLI-based number guessing game built with TypeScript where the computer randomly selects a number and the user has to guess it.

## Features

- Random number generation between 1 and 100
- Three difficulty levels (Easy, Medium, Hard)
- Hints about whether your guess is too high or too low
- Optional hint system when you're struggling
- Timer to track how long it takes to guess the number
- High score tracking system
- Multiple game rounds

## Requirements

- Node.js (v14 or higher recommended)
- npm or yarn

## Installation

1. Clone this repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## How to Play

1. Start the game:

```bash
npm start
```

2. Follow the on-screen instructions to select a difficulty level:

   - Easy: 10 guesses
   - Medium: 5 guesses
   - Hard: 3 guesses

3. Enter your guesses when prompted. The game will tell you if your guess is too high or too low.

4. If you're having trouble, the game might offer you a hint when you're running low on attempts.

5. Try to guess the number in as few attempts as possible!

6. After each game, you can choose to play again or exit.

## Game Rules

- The computer randomly selects a number between 1 and 100.
- You need to guess the number within the allowed number of attempts based on your chosen difficulty level.
- After each guess, the game will tell you if the number is greater or less than your guess.
- If you guess correctly, you win! The game will show how many attempts it took and how much time you spent.
- If you run out of attempts, you lose, and the game reveals the correct number.
- High scores are saved for each difficulty level based on the fewest attempts and fastest time.

## Development

- Build the project:

```bash
npm run build
```

- Run in development mode with auto-restart:

```bash
npm run dev
```

## License

This project is licensed under the MIT License.
