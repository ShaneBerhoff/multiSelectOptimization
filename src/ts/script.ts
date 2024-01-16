import { Combination } from "./solver.js";

class SingleSolver {
    // Define necessary properties
    optionsSliderIn: HTMLInputElement;
    optionsSliderOut: HTMLElement;
    correctAnsSliderIn: HTMLInputElement;
    correctAnsSliderOut: HTMLElement;
    guessesSliderIn: HTMLInputElement;
    guessesSliderOut: HTMLElement;
    form: HTMLFormElement;

    constructor() {
        // Initialize elements
        this.optionsSliderIn = document.getElementById("options") as HTMLInputElement;
        this.optionsSliderOut = document.getElementById("optionsValue") as HTMLElement;
        this.correctAnsSliderIn = document.getElementById("correctAns") as HTMLInputElement;
        this.correctAnsSliderOut = document.getElementById("correctAnsValue") as HTMLElement;
        this.guessesSliderIn = document.getElementById("guesses") as HTMLInputElement;
        this.guessesSliderOut = document.getElementById("guessesValue") as HTMLElement;
        this.form = document.getElementById("singleSolveForm") as HTMLFormElement;
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

    handleSubmit(event: Event) {
        event.preventDefault();
        
        // Get numbers and implement the logic for solving the problem
        const options = parseInt(this.optionsSliderIn.value);
        const correctAns = parseInt(this.correctAnsSliderIn.value);
        const guesses = parseInt(this.guessesSliderIn.value);

        // Set result
        const resultDiv = document.getElementById('result') as HTMLDivElement;
        
        resultDiv.innerHTML = '';
    
        // EV Section
        const combination = new Combination(options, correctAns, guesses);
        const EVP = document.createElement('h2');
        EVP.innerText = `Expected EV: ${combination.findEV()}`;
        resultDiv.appendChild(EVP);
    }
}

class FullSolver {
    // Define necessary properties
    optionsSliderIn: HTMLInputElement;
    optionsSliderOut: HTMLElement;
    showEVTable: HTMLInputElement;
    showWeightedAVG: HTMLInputElement;
    probabilityDist: HTMLInputElement;
    uniformDist: HTMLDivElement;
    degenDist: HTMLDivElement;
    benfordDist: HTMLDivElement;
    customDist: HTMLDivElement;
    degenDistNum: HTMLInputElement;
    customProbs: HTMLInputElement;
    form: HTMLFormElement;
    resultDiv: HTMLDivElement;

    constructor() {
        // Initialize elements
        this.optionsSliderIn = document.getElementById("fullSolveOptions") as HTMLInputElement;
        this.optionsSliderOut = document.getElementById("fullSolveOptionsValue") as HTMLElement;
        this.showEVTable = document.getElementById("EVTable") as HTMLInputElement;
        this.showWeightedAVG = document.getElementById("weightedAVG") as HTMLInputElement;
        // Probability distrabutions
        this.probabilityDist = document.getElementById("probabilityDist") as HTMLInputElement;
        this.uniformDist = document.getElementById("uniformDist") as HTMLDivElement;
        this.degenDist = document.getElementById("degenDist") as HTMLDivElement;
        this.benfordDist = document.getElementById("benfordDist") as HTMLDivElement;
        this.customDist = document.getElementById("customDist") as HTMLDivElement;
        this.degenDistNum = document.getElementById("degenDistNum") as HTMLInputElement;
        this.customProbs = document.getElementById("probabilities") as HTMLInputElement;
        // Form
        this.form = document.getElementById("fullSolveForm") as HTMLFormElement;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProbDivs = this.handleProbDivs.bind(this);
        // Result
        this.resultDiv = document.getElementById('result') as HTMLDivElement;
    }

    addEventListeners() {
        this.optionsSliderIn.oninput = () => { 
            const n = this.optionsSliderIn.value
            this.optionsSliderOut.innerHTML = n;
            this.degenDistNum.max = n;
        }
        this.probabilityDist.addEventListener('change', this.handleProbDivs);      
        this.form.addEventListener('submit', this.handleSubmit);
    }

    removeEventListeners() {
        this.optionsSliderIn.oninput = null;
        this.probabilityDist.removeEventListener('change', this.handleProbDivs);
        this.form.removeEventListener('submit', this.handleSubmit);
    }

    // Handles the visibility of the different probability distributions
    handleProbDivs(){
        const distributions = ['uniformDist', 'degenDist', 'benfordDist', 'customDist'];
        distributions.forEach(dist => {
            (this as any)[dist].style.display = dist === this.probabilityDist.value ? 'block' : 'none';
        });
        this.resultDiv.innerHTML = '';
    }

    handleSubmit(event: Event) {
        event.preventDefault();
        
        // Get numbers and implement the logic for solving the problem
        const options = parseInt(this.optionsSliderIn.value);

        // Set result
        this.resultDiv.innerHTML = '';

        //get prob dist or show issue
        const prob: number[] | null = this.generateProbDist(options);
        if(prob==null){
            this.resultDiv.innerText = "Invalid probabilities input."
            return;
        }

        //Create and add full EV table
        const totalEV = this.totalEV(options);
        if(this.showEVTable.checked){
            this.resultDiv.appendChild(document.createElement('h2')).innerText = "EV Table";
            this.resultDiv.appendChild(document.createElement('p')).innerText = "This represents the expected EV of every possible combination. Where each row is the number of correct answers and each column is the number of guesses.";
            const EVTable = this.resultDiv.appendChild(this.generateTable(totalEV));
        }

        const weightedAVG = this.weightedAVG(totalEV,prob);
        //Create and add weighted averages table based on prob distrabution
        if(this.showWeightedAVG.checked){
            this.resultDiv.appendChild(document.createElement('h2')).innerText = "Weighted Averages";
            this.resultDiv.appendChild(document.createElement('p')).innerText = "This represents the expected value of each number of guesses based on a weighted average on the probability of number of correct answers.";
            const WATable = this.resultDiv.appendChild(document.createElement("table"));
            WATable.insertRow(-1).insertCell(0).outerHTML = `<th colspan="${options}">Weighted Average</th>`;
            WATable.insertRow(-1).innerHTML = weightedAVG.map(item => `<td>${item.toFixed(2)}</td>`).join('');
            //As a percentage
            WATable.insertRow(-1).insertCell(0).outerHTML = `<th colspan="${options}">As A Percentage</th>`;
            WATable.insertRow(-1).innerHTML = weightedAVG.map(item => `<td>${(item*100).toFixed(2)}%</td>`).join('');
        }

        //Most Optimal
        this.resultDiv.appendChild(document.createElement('h2')).innerText = `Most Optimal: ${
            weightedAVG.reduce((maxIdx, currentVal, currentIdx) => 
            currentVal > weightedAVG[maxIdx] ? currentIdx : maxIdx, 0) + 1
        } guesses`;
    }

    //Creates a 2d array of EV based on number of options for all possible correctAns and guesses
    //rows: number of correct answers
    //cols: guesses by player
    totalEV(options: number): number[][] {
        const totalEV: number[][] = Array.from({ length: options }, () => Array(options).fill(0));
        for(let row = 1; row <= options; row++){
            for(let col = 1; col <= options; col++){
                const combo = new Combination(options, row, col);
                totalEV[row-1][col-1] = combo.findEV();
            }
        }
        return totalEV;
    }
    //Turns a 2d array into a table
    generateTable(data: number[][]): HTMLTableElement {
        const table = document.createElement('table');
        table.setAttribute('border', '1');

        // Generate the header row with column numbers
        const headerCells = '<th></th>' + data[0].map((_, colIndex) => `<th>${colIndex + 1}</th>`).join('');
        const headerRow = `<tr>${headerCells}</tr>`;

        // Generate the data rows
        const dataRows = data.map((rowData, rowIndex) => 
            `<tr><th>${rowIndex + 1}</th>${rowData.map(cellData => `<td>${cellData}</td>`).join('')}</tr>`
        ).join('');

        // Combine header and data rows and set as innerHTML
        table.innerHTML = headerRow + dataRows;

        return table;
    }

    //Gets weighted average from 2d array based an an arr of probabilites (defaults to even distrabution)
    weightedAVG(data: number[][], prob: number[]): number[] {
        if(data.length != prob.length){return [];}

        const result = new Array(data.length).fill(0);
        for(let row = 0; row < data.length; row++){
            for(let col = 0; col < data.length; col++){
                result[col] += data[row][col] * prob[row]
            }
        }
        return result;
    }

    //Gives prob dist as an arr based on selection or null if issue
    generateProbDist(options: number): number[] | null {
        const selectedDist: string = this.probabilityDist.value;
        
        //produces distribution
        let result: number[];
        switch(selectedDist){
            case "uniformDist":
                return Array(options).fill(1 / options);
            case "degenDist":
                result = Array(options).fill(0);
                result[parseInt(this.degenDistNum.value)-1] = 1;
                return result;
            case "customDist":
                if(this.customProbs == null){return null;}
                result = this.customProbs.value.split(',').map(n => parseFloat(n.trim()));
                if(result.length !== options || result.some(isNaN)){ //TODO check that prob equals 1
                    return null;
                }
                return result;
            default:
                return null;
        }
    }
}

const singleSolver = new SingleSolver();
const fullSolver = new FullSolver();
// Change solver type based on dropdown
const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
const singleSolveDiv = document.getElementById('singleSolve') as HTMLDivElement;
const fullSolveDiv = document.getElementById('fullSolve') as HTMLDivElement;
const result = document.getElementById('result') as HTMLDivElement;

dropdown.addEventListener('change', () =>{
    if(dropdown.value === 'singleSolve'){
        singleSolver.addEventListeners();
        fullSolver.removeEventListeners();
        singleSolveDiv.style.display = 'block';
        fullSolveDiv.style.display = 'none';
    } else if (dropdown.value === 'fullSolve'){
        singleSolver.removeEventListeners();
        fullSolver.addEventListeners();
        singleSolveDiv.style.display = 'none';
        fullSolveDiv.style.display = 'block';
    }
    result.innerHTML = '';
});
dropdown.dispatchEvent(new Event('change'));


