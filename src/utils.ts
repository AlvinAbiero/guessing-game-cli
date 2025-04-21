import fs from "fs";
import path from "path";

export interface HighScore {
  difficulty: number;
  attempts: number;
  time: number;
  date: string;
}

// Clear the console screen
export function clearScreen(): void {
  // Process.stdout.write('\x1Bc'); // For Unix-like systems
  console.clear(); // Cross-platform solution
}

// Get high scores file path
function getHighScoresPath(): string {
  return path.join(process.cwd(), "highscores.json");
}

// Load high scores from file
function loadHighScores(): HighScore[] {
  try {
    if (fs.existsSync(getHighScoresPath())) {
      const data = fs.readFileSync(getHighScoresPath(), "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading high scores:", error);
  }
  return [];
}

// Save high scores to file
function saveHighScores(highScores: HighScore[]): void {
  try {
    fs.writeFileSync(getHighScoresPath(), JSON.stringify(highScores, null, 2));
  } catch (error) {
    console.error("Error saving  high scores:", error);
  }
}

// Save a new high score
export function saveHighScore(
  difficulty: number,
  attempts: number,
  time: number
): void {
  const highScores = loadHighScores();
  const currentDate = new Date().toISOString();

  // Add new score
  const newScore: HighScore = { difficulty, attempts, time, date: currentDate };

  // Find if there's an existing high score for this difficulty
  const existingIndex = highScores.findIndex(
    (score) => score.difficulty === difficulty
  );

  if (existingIndex !== -1) {
    const existingScore = highScores[existingIndex];

    // Replace only if the new score is better (fewer attempts or same attempts but faster time)
    if (
      attempts < existingScore.attempts ||
      (attempts === existingScore.attempts && time < existingScore.time)
    ) {
      highScores[existingIndex] = newScore;
      console.log("New high score achieved!");
    }
  } else {
    // No existing score for this difficulty
    highScores.push(newScore);
    console.log("First score for this difficulty level!");
  }

  saveHighScores(highScores);
}

// Get the high score for a specific difficulty
export function getHighScore(difficulty: number): HighScore | null {
  const highScores = loadHighScores();
  return highScores.find((score) => score.difficulty === difficulty) || null;
}
