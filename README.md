# README for Multi-Select Optimization

## Description

A tool meant to be used for determining the most optimal guessing strategy on a multi-select question based on different conditions.

## Usage

1. **Basic Solve:** Input how many options the question has, the number of correct options, and the number of options selected (guessed). It will then calulate the expected value in points (out of 1) for this combination.
2. **Full Solver:** Input just the number of options. It will then calcuate the most optimal number of options to select (guesses). It also comes with options to view different parts of the calculations.

## How It Works

1. **Basic Solve:**
   - **Combinatorics for Scenarios**: Employs combinatorics to examine all possible scenarios, calculating the probability of each.
   - **Balancing Choices**: Considers both correct and incorrect guesses, balancing them against each other. The system ensures that scores do not go negative, regardless of the number of incorrect guesses.
   - **Score Normalization**: Adjusts the final score to a standard scale, making it consistent and comparable regardless of the number of guesses or options.

2. **Full Solve:**
   - **Integrating the Basic Solve**: Utilizes the approach of the basic solve to explicitly display a matrix. This matrix illustrates all possible combinations of correct options against the options selected and thier expected values.
   - **Applying Weighted Averages**: Processes the matrix data using a weighted average approach. This is based on a probability distribution of the correct options, simplifying the matrix into clear expected values of options selected.
   - **Optimal Selection Analysis**: Determines which number of options selected yields the highest expected value in points for the question. Then provides the overall expected value (EV) for this optimal choice.

## Future Improvements

Currently the full solver is only equipped with some predetermined distributions none of which are the true distribution. Eventually I want to try and determine a real world distribution for number of correct options in multi-select questions. Most likely targeting questions that have 4 or 5 options as this tends to be standard used by teacher and professors. Then attempt to abstract this distribution to any N option question. Through this I hope the true answer for most optimal number of guesses for any N option question can be determined.
