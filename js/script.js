document.getElementById('solverForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let width = document.getElementById('width').value;
    let probabilities = document.getElementById('probabilities').value.split(',').map(p => parseFloat(p.trim()));

    // Validate probabilities array
    // Each element in array coresponds to probability of position+1 answers being correct in the question
    if (probabilities.length !== parseInt(width) || probabilities.some(isNaN) || probabilities.reduce((a, b) => a + b, 0) != 1) {
        document.getElementById('result').innerText = 'Invalid probabilities input.';
        return;
    }

    // Example output (replace with actual result)
    document.getElementById('result').innerText = 'Result will be displayed here.';
});
