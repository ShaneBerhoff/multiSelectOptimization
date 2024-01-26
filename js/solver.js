export class Combination {
    constructor(totalOptions, correctAns, guesses) {
        this.totalOptions = totalOptions;
        this.guesses = guesses;
        this.correctAns = correctAns;
    }
    // Finds the expected value of all combinations
    findEV() {
        let totalScore = 0.0;
        // Loop through possible correct guesses
        for (let correctGuesses = 0; correctGuesses <= Math.min(this.guesses, this.correctAns); correctGuesses++) {
            let incorrectGuesses = this.guesses - correctGuesses; // num of incorrect guesses
            /* finds the scenario score based on these scoring rules
                correctGuess +1 point
                incorrectGuess -1 point
                score >= 0
                score is normalized to 'correctAns' amount of points */
            let score = Math.max(correctGuesses - incorrectGuesses, 0) / this.correctAns;
            // num ways to choose correctGuesses from correctAns options
            let combinationsCorrect = this.combinations(this.correctAns, correctGuesses);
            // num ways to choose incorrectGuesses from incorrectOptions
            let combinationsIncorrect = this.combinations(this.totalOptions - this.correctAns, incorrectGuesses);
            // probability of this particular scenario (both correctGuesses and incorrectGuesses)
            let probability = combinationsCorrect * combinationsIncorrect / this.combinations(this.totalOptions, this.guesses);
            // accumulate weighted score
            totalScore += score * probability;
        }
        return totalScore;
    }
    // Calculates combinations of nCk
    combinations(n, k) {
        let result = 1;
        for (let i = 0; i < k; i++) {
            result *= (n - i) / (i + 1);
        }
        return result;
    }
}
