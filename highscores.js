
// Element Selection
// retrieves specific HTML elements from the DOM (Document Object Model) by their IDs and stores them in variables for later use.

const viewScoresButton = document.getElementById("viewScores");
const scoreList = document.getElementById("scoreList");
const deleteSelectedButton = document.getElementById("deleteSelected");

// Event listener for the view scores button
// Sets up a click event for the "View Scores" button. When clicked, 
// It retrieves the selected difficulty level and calls a function to display scores.

viewScoresButton.addEventListener("click", () => {
    const difficulty = document.getElementById("difficulty").value;
    displayScores(difficulty);
});

// Function to display scores based on selected difficulty
// responsible for displaying the high scores based on the selected difficulty. 
// It retrieves scores from local storage, sorts them, and displays them.

const displayScores = (difficulty) => {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    scoreList.innerHTML = ""; // Clear previous scores

    // Sort highScores alphabetically by name
    // Sorts the scores alphabetically by player names, ensuring that the display is organized.
    highScores.sort((a, b) => {
        const nameA = a.name.toLowerCase(); // Convert to lower case for case insensitive comparison
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1; // Sort ascending
        if (nameA > nameB) return 1;
        return 0;
    });
    // Repeats over the sorted high scores, filtering them by the selected difficulty and generating HTML to display each score.
    highScores.forEach((scoreObj, index) => {
        const displayDifficulty = scoreObj.difficulty || "Any Category"; // Default to "Any Category"
        const displayCategory = scoreObj.category || "Any Category"; // Default to "Any Category"

        // Display only scores that match the selected difficulty
        if (difficulty === "any" || displayDifficulty === difficulty) {
            scoreList.innerHTML += `
                <div class="score-item">
                    <input type="checkbox" class="delete-checkbox" data-index="${index}">
                    Name: <strong>${scoreObj.name || "Any Name"}</strong> | 
                    Score: <strong>${scoreObj.score || "0"}</strong> | 
                    Category: <strong>${displayCategory}</strong> | 
                    Difficulty: <strong>${displayDifficulty}</strong>
                </div>
            `;
        }
    });
};


// sets up the functionality to delete selected scores when the "Delete Selected" button is clicked.
// Event listener for the delete selected button
deleteSelectedButton.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".delete-checkbox:checked");
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    
    checkboxes.forEach((checkbox) => {
        const index = checkbox.getAttribute("data-index");
        highScores.splice(index, 1); // Remove selected scores
    });
    // updates the local storage and refreshes the displayed scores after deletion.
    localStorage.setItem("highScores", JSON.stringify(highScores)); // Update local storage
    const difficulty = document.getElementById("difficulty").value;
    displayScores(difficulty); // Refresh the displayed scores
});

// Load scores on initial page load
window.onload = () => {
    displayScores("any"); // Display all scores by default on load
};
