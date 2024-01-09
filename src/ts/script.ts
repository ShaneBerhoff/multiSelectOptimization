import { Combination } from "./solver.js";

const optionsSliderIn = document.getElementById("options") as HTMLInputElement;
const optionsSliderOut = document.getElementById("optionsValue") as HTMLElement;
const correctAnsSliderIn = document.getElementById("correctAns") as HTMLInputElement;
const correctAnsSliderOut = document.getElementById("correctAnsValue") as HTMLElement;
const guessesSliderIn = document.getElementById("guesses") as HTMLInputElement;
const guessesSliderOut = document.getElementById("guessesValue") as HTMLElement;

//Adjusts options slider and max values of correctAns/guesses
optionsSliderIn.oninput = () => {
    const n = optionsSliderIn.value;
    optionsSliderOut.innerHTML = n;
    correctAnsSliderIn.max = n;
    correctAnsSliderOut.innerHTML = correctAnsSliderIn.value;
    guessesSliderIn.max = n;
    guessesSliderOut.innerHTML = guessesSliderIn.value;
}

//Adjusts correctAns/guesses slider
correctAnsSliderIn.oninput = () => {correctAnsSliderOut.innerHTML = correctAnsSliderIn.value;}
guessesSliderIn.oninput = () => {guessesSliderOut.innerHTML = guessesSliderIn.value;}

 
//form submission
document.getElementById('solverForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get numbers
    const options = parseInt(optionsSliderIn.value);
    const correctAns = parseInt(correctAnsSliderIn.value);
    const guesses = parseInt(guessesSliderIn.value);
    

    // Set result
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    
    resultDiv.innerHTML = '';

    // Create sections for questions/correct/guesses
    const optionsP = document.createElement('p');
    const correctAnsP = document.createElement('p');
    const guessesP = document.createElement('p');
    optionsP.innerText = `Number of options: ${options}`;
    correctAnsP.innerText = `Number of correct answers: ${correctAns}`;
    guessesP.innerText = `Number of guesses: ${guesses}`;
    resultDiv.appendChild(optionsP);
    resultDiv.appendChild(correctAnsP);
    resultDiv.appendChild(guessesP);

    // EV Section
    const combination = new Combination(options, correctAns, guesses);
    const EVP = document.createElement('p');
    EVP.innerText = `Expected EV: ${combination.findEV()}`;
    resultDiv.appendChild(EVP);

    const totalEV2D = totalEV(options);
    resultDiv.appendChild(generateTable(totalEV2D));
    console.log(weightedAVG(totalEV2D));

});

//Creates a 2d array of EV based on number of options for all possible correctAns and guesses
function totalEV(options: number): number[][] {
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
function generateTable(data: number[][]): HTMLTableElement {
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
function weightedAVG(data: number[][], prob: number[] = Array(data.length).fill(1 / data.length)): number[] {
    if(data.length != prob.length){return [];}

    const result = new Array(data.length).fill(0);
    for(let row = 0; row < data.length; row++){
        for(let col = 0; col < data.length; col++){
            result[col] += data[row][col] * prob[row]
        }
    }
    return result;
}