"use strict";
var _a;
const optionsSliderIn = document.getElementById("options");
const optionsSliderOut = document.getElementById("optionsValue");
const correctAnsSliderIn = document.getElementById("correctAns");
const correctAnsSliderOut = document.getElementById("correctAnsValue");
const guessesSliderIn = document.getElementById("guesses");
const guessesSliderOut = document.getElementById("guessesValue");
//Adjusts options slider and max values of correctAns/guesses
optionsSliderIn.oninput = () => {
    const n = optionsSliderIn.value;
    optionsSliderOut.innerHTML = n;
    correctAnsSliderIn.max = n;
    correctAnsSliderOut.innerHTML = correctAnsSliderIn.value;
    guessesSliderIn.max = n;
    guessesSliderOut.innerHTML = guessesSliderIn.value;
};
//Adjusts correctAns/guesses slider
correctAnsSliderIn.oninput = () => { correctAnsSliderOut.innerHTML = correctAnsSliderIn.value; };
guessesSliderIn.oninput = () => { guessesSliderOut.innerHTML = guessesSliderIn.value; };
//form submission
(_a = document.getElementById('solverForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Get numbers
    const options = parseInt(optionsSliderIn.value);
    const correctAns = parseInt(correctAnsSliderIn.value);
    const guesses = parseInt(guessesSliderIn.value);
    // Set result
    const resultDiv = document.getElementById('result');
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
});
