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
});

