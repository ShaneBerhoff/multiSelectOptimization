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
        const EVP = document.createElement('p');
        EVP.innerText = `Expected EV: ${combination.findEV()}`;
        resultDiv.appendChild(EVP);
    }
}

class FullSolver {
    // Define necessary properties
    optionsSliderIn: HTMLInputElement;
    optionsSliderOut: HTMLElement;
    form: HTMLFormElement;

    constructor() {
        // Initialize elements
        this.optionsSliderIn = document.getElementById("fullSolveOptions") as HTMLInputElement;
        this.optionsSliderOut = document.getElementById("fullSolveOptionsValue") as HTMLElement;
        this.form = document.getElementById("fullSolveForm") as HTMLFormElement;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    addEventListeners() {
        this.optionsSliderIn.oninput = () => { this.optionsSliderOut.innerHTML = this.optionsSliderIn.value; };
        this.form.addEventListener('submit', this.handleSubmit);
    }

    removeEventListeners() {
        this.optionsSliderIn.oninput = null;
        this.form.removeEventListener('submit', this.handleSubmit);
    }

    handleSubmit(event: Event) {
        event.preventDefault();
        
        // Get numbers and implement the logic for solving the problem
        const options = parseInt(this.optionsSliderIn.value);

        // Set result
        const resultDiv = document.getElementById('result') as HTMLDivElement;
        
        resultDiv.innerHTML = '';
        
        const EV2D = this.totalEV(options);
        resultDiv.appendChild(this.generateTable(EV2D));

        const weightedAverageP = document.createElement('p');
        weightedAverageP.innerText = `Weighted Average\n${this.weightedAVG(EV2D).map(num => num.toFixed(2)).toString()}`;
        resultDiv.appendChild(weightedAverageP);
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
    weightedAVG(data: number[][], prob: number[] = Array(data.length).fill(1 / data.length)): number[] {
        if(data.length != prob.length){return [];}

        const result = new Array(data.length).fill(0);
        for(let row = 0; row < data.length; row++){
            for(let col = 0; col < data.length; col++){
                result[col] += data[row][col] * prob[row]
            }
        }
        return result;
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


