export class Combination {
    private totalOptions: number; // number of options in the question
    private guesses: number; // number of guesses made by player
    private correctAns: number; // number of correct answers in the question

    constructor(totalOptions: number, correctAns: number, guesses: number) {
        this.totalOptions = totalOptions;
        this.guesses = guesses;
        this.correctAns = correctAns;
    }

    // Finds the expected value of all combinations
    public findEV(): number {
        let totalScore: number = 0.0;
        // Loop through possible correct guesses
        for (let correctGuesses: number = 0; correctGuesses <= Math.min(this.guesses, this.correctAns); correctGuesses++) {
            let incorrectGuesses: number = this.guesses - correctGuesses; // num of incorrect guesses
            /* finds the scenario score based on these scoring rules
                correctGuess +1 point
                incorrectGuess -1 point
                score >= 0
                score is normalized to 'correctAns' amount of points */
            let score: number = Math.max(correctGuesses - incorrectGuesses, 0) / this.correctAns;

            // num ways to choose correctGuesses from correctAns options
            let combinationsCorrect: number = this.combinations(this.correctAns, correctGuesses);
            // num ways to choose incorrectGuesses from incorrectOptions
            let combinationsIncorrect: number = this.combinations(this.totalOptions - this.correctAns, incorrectGuesses);
            // probability of this particular scenario (both correctGuesses and incorrectGuesses)
            let probability: number = combinationsCorrect * combinationsIncorrect / this.combinations(this.totalOptions, this.guesses);

            // accumulate weighted score
            totalScore += score * probability;
        }
        return parseFloat(totalScore.toFixed(2));
    }

    // Calculates combinations of nCk
    private combinations(n: number, k: number): number {
        let result: number = 1;
        for (let i: number = 0; i < k; i++) {
            result *= (n - i) / (i + 1);
        }
        return result;
    }
}
