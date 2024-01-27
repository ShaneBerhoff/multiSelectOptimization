import { Combination } from "./solver.js";
class SingleSolver {
    constructor() {
        // Initialize elements
        this.optionsSliderIn = document.getElementById("options");
        this.optionsSliderOut = document.getElementById("optionsValue");
        this.correctAnsSliderIn = document.getElementById("correctAns");
        this.correctAnsSliderOut = document.getElementById("correctAnsValue");
        this.guessesSliderIn = document.getElementById("guesses");
        this.guessesSliderOut = document.getElementById("guessesValue");
        this.form = document.getElementById("singleSolveForm");
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    addEventListeners() {
        this.optionsSliderIn.oninput = () => {
            const n = this.optionsSliderIn.value;
            this.optionsSliderOut.innerHTML = n;
            this.correctAnsSliderIn.max = n;
            this.correctAnsSliderOut.innerHTML = this.correctAnsSliderIn.value;
            this.guessesSliderIn.max = n;
            this.guessesSliderOut.innerHTML = this.guessesSliderIn.value;
        };
        this.correctAnsSliderIn.oninput = () => { this.correctAnsSliderOut.innerHTML = this.correctAnsSliderIn.value; };
        this.guessesSliderIn.oninput = () => { this.guessesSliderOut.innerHTML = this.guessesSliderIn.value; };
        this.form.addEventListener('submit', this.handleSubmit);
    }
    removeEventListeners() {
        this.optionsSliderIn.oninput = null;
        this.correctAnsSliderIn.oninput = null;
        this.guessesSliderIn.oninput = null;
        this.form.removeEventListener('submit', this.handleSubmit);
    }
    handleSubmit(event) {
        event.preventDefault();
        // Get numbers and implement the logic for solving the problem
        const options = parseInt(this.optionsSliderIn.value);
        const correctAns = parseInt(this.correctAnsSliderIn.value);
        const guesses = parseInt(this.guessesSliderIn.value);
        // Set result
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '';
        // EV Section
        const combination = new Combination(options, correctAns, guesses);
        const EVP = document.createElement('h2');
        EVP.innerText = `Expected EV: ${combination.findEV()}`;
        resultDiv.appendChild(EVP);
    }
}
class FullSolver {
    constructor() {
        // Initialize elements
        this.optionsSliderIn = document.getElementById("fullSolveOptions");
        this.optionsSliderOut = document.getElementById("fullSolveOptionsValue");
        this.showEVTable = document.getElementById("EVTable");
        this.showWeightedAVG = document.getElementById("weightedAVG");
        this.showProbDist = document.getElementById("showProbDist");
        // Probability distrabutions
        this.probabilityDist = document.getElementById("probabilityDist");
        this.uniformDist = document.getElementById("uniformDist");
        this.degenDist = document.getElementById("degenDist");
        this.normalDist = document.getElementById("normalDist");
        this.customDist = document.getElementById("customDist");
        //inputs
        this.degenDistNum = document.getElementById("degenDistNum");
        this.normalDistMean = document.getElementById("normalDistMean");
        this.normalDistSTD = document.getElementById("normalDistSTD");
        this.customProbs = document.getElementById("customProbs");
        // Form
        this.form = document.getElementById("fullSolveForm");
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProbDivs = this.handleProbDivs.bind(this);
        // Result
        this.resultDiv = document.getElementById('result');
    }
    addEventListeners() {
        this.optionsSliderIn.oninput = () => {
            const n = this.optionsSliderIn.value;
            this.optionsSliderOut.innerHTML = n;
            this.degenDistNum.max = n;
            this.normalDistMean.max = n;
            this.normalDistMean.value = ((parseInt(n) + 1) / 2).toString();
        };
        this.probabilityDist.addEventListener('change', this.handleProbDivs);
        this.form.addEventListener('submit', this.handleSubmit);
    }
    removeEventListeners() {
        this.optionsSliderIn.oninput = null;
        this.probabilityDist.removeEventListener('change', this.handleProbDivs);
        this.form.removeEventListener('submit', this.handleSubmit);
    }
    // Handles the visibility of the different probability distributions
    handleProbDivs() {
        const distributions = ['uniformDist', 'degenDist', 'normalDist', 'customDist'];
        distributions.forEach(dist => {
            this[dist].style.display = dist === this.probabilityDist.value ? 'block' : 'none';
        });
        this.resultDiv.innerHTML = '';
    }
    handleSubmit(event) {
        event.preventDefault();
        // Get numbers and implement the logic for solving the problem
        const options = parseInt(this.optionsSliderIn.value);
        // Set result
        this.resultDiv.style.display = 'block';
        this.resultDiv.innerHTML = '';
        //get prob dist or show issue
        const prob = this.generateProbDist(options);
        if (prob == null) {
            this.resultDiv.innerText = "Invalid probabilities input.";
            return;
        }
        //Create and add full EV table
        const totalEV = this.totalEV(options);
        if (this.showEVTable.checked) {
            this.resultDiv.appendChild(document.createElement('h2')).innerText = "EV Table";
            this.resultDiv.appendChild(document.createElement('p')).innerText = "This represents the expected value of every possible combination. Where each row is the number of options selected and each column is the number of correct answers.";
            const EVTable = this.resultDiv.appendChild(this.generateTable(totalEV));
        }
        //Create and add the probability table
        if (this.showProbDist.checked) {
            this.resultDiv.appendChild(document.createElement('h2')).innerText = "Probability Distribution";
            this.resultDiv.appendChild(document.createElement('p')).innerText = "This shows the proability of each number of correct options occuring under the selected distribution.";
            const probDistTable = this.resultDiv.appendChild(document.createElement("table"));
            probDistTable.innerHTML = `<tr><th>#</th>${prob.map((_, index) => `<th>${index + 1}</th>`).join('')}</tr>` + `<tr><th>P</th>${prob.map(value => `<td>${value.toFixed(2)}</td>`).join('')}</tr>`;
        }
        // Calculate weigted averages
        const weightedAVG = this.weightedAVG(totalEV, prob);
        if (this.showWeightedAVG.checked) {
            this.resultDiv.appendChild(document.createElement('h2')).innerText = "Weighted Averages";
            this.resultDiv.appendChild(document.createElement('p')).innerText = "This represents the expected value of each number of options guessed based on a weighted average on the probability distrabution of number of correct answers.";
            //Create and add weighted averages table based on prob distrabution
            const WATable = this.resultDiv.appendChild(document.createElement("table"));
            WATable.innerHTML += `<tr>
                                    <th>#</th>
                                    <th>Weighted Average</th>
                                    <th>Percentage</th>
                                  </tr>`;
            weightedAVG.map((item, index) => {
                return `<tr>
                            <th>${index + 1}</th>
                            <td>${item.toFixed(2)}</td>
                            <td>${(item * 100).toFixed(2)}%</td>
                        </tr>`;
            }).forEach(rowHtml => WATable.innerHTML += rowHtml);
        }
        //Most Optimal
        const mostOptimalIndex = weightedAVG.reduce((maxIdx, currentVal, currentIdx) => currentVal > weightedAVG[maxIdx] ? currentIdx : maxIdx, 0);
        const mostOptimalEV = weightedAVG[mostOptimalIndex].toFixed(4);
        this.resultDiv.appendChild(document.createElement('h2')).innerText = `Most Optimal: ${mostOptimalIndex + 1} guesses with an EV of ${mostOptimalEV}`;
        this.resultDiv.appendChild(document.createElement('p')).innerText = `This means that in a multi-select question with ${options} options, where the number of correct options follows the provided probability distrabution, if you always guess ${mostOptimalIndex + 1} of the options you can expect to get ${parseFloat(mostOptimalEV) * 100}% of available points.`;
    }
    //Creates a 2d array of EV based on number of options for all possible correctAns and guesses
    //rows: guesses by player
    //cols: number of correct answers
    totalEV(options) {
        const totalEV = Array.from({ length: options }, () => Array(options).fill(0));
        for (let row = 1; row <= options; row++) {
            for (let col = 1; col <= options; col++) {
                const combo = new Combination(options, col, row);
                totalEV[row - 1][col - 1] = combo.findEV();
            }
        }
        return totalEV;
    }
    //Turns a 2d array into a table
    generateTable(data) {
        const table = document.createElement('table');
        // Generate the header row with column numbers
        const headerCells = '<th>#</th>' + data[0].map((_, colIndex) => `<th>${colIndex + 1}</th>`).join('');
        const headerRow = `<tr>${headerCells}</tr>`;
        // Generate the data rows
        const dataRows = data.map((rowData, rowIndex) => `<tr><th>${rowIndex + 1}</th>${rowData.map(cellData => `<td>${cellData.toFixed(2)}</td>`).join('')}</tr>`).join('');
        // Combine header and data rows and set as innerHTML
        table.innerHTML = headerRow + dataRows;
        return table;
    }
    //Gets weighted average from 2d array based an an arr of probabilites
    weightedAVG(data, prob) {
        if (data.length != prob.length) {
            return [];
        }
        const result = new Array(data.length).fill(0);
        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data.length; col++) {
                result[row] += data[row][col] * prob[col];
            }
        }
        return result;
    }
    //Gives prob dist as an arr based on selection or null if issue
    generateProbDist(options) {
        const selectedDist = this.probabilityDist.value;
        //produces distribution
        let result;
        switch (selectedDist) {
            case "uniformDist":
                return Array(options).fill(1 / options);
            case "degenDist":
                result = Array(options).fill(0);
                result[parseInt(this.degenDistNum.value) - 1] = 1;
                return result;
            case "normalDist":
                let mean = parseFloat(this.normalDistMean.value);
                let std = parseFloat(this.normalDistSTD.value);
                result = Array.from({ length: options }, (_, i) => i + 1).map(x => normalPDF(x, mean, std)); //Gets the prob density of each
                result = result.map(density => density / result.reduce((sum, density) => sum + density, 0)); //normalizes it
                return result;
            case "customDist":
                if (this.customProbs == null) {
                    return null;
                }
                result = this.customProbs.value.split(',').map(n => parseFloat(n.trim()));
                if (result.length !== options || result.some(isNaN)) { //TODO check that prob equals 1
                    return null;
                }
                return result;
            default:
                return null;
        }
        function normalPDF(x, mean, stdDeviation) {
            return (1 / (stdDeviation * Math.sqrt(2 * Math.PI)))
                * Math.exp(-0.5 * Math.pow((x - mean) / stdDeviation, 2));
        }
    }
}
const singleSolver = new SingleSolver();
const fullSolver = new FullSolver();
// Change solver type based on dropdown
const dropdown = document.getElementById('dropdown');
const singleSolveDiv = document.getElementById('singleSolve');
const fullSolveDiv = document.getElementById('fullSolve');
const result = document.getElementById('result');
dropdown.addEventListener('change', () => {
    if (dropdown.value === 'singleSolve') {
        singleSolver.addEventListeners();
        fullSolver.removeEventListeners();
        singleSolveDiv.style.display = 'block';
        fullSolveDiv.style.display = 'none';
    }
    else if (dropdown.value === 'fullSolve') {
        singleSolver.removeEventListeners();
        fullSolver.addEventListeners();
        singleSolveDiv.style.display = 'none';
        fullSolveDiv.style.display = 'block';
    }
    result.style.display = 'none';
    result.innerHTML = '';
});
dropdown.dispatchEvent(new Event('change'));
