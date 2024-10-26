const viewScoresButton = document.getElementById("viewScores");
const scoreList = document.getElementById("scoreList");
const deleteSelectedButton = document.getElementById("deleteSelected");

// Event listener for the view scores button
viewScoresButton.addEventListener("click", () => {
    const difficulty = document.getElementById("difficulty").value;
    displayScores(difficulty);
});

// Function to display scores based on selected difficulty
const displayScores = (difficulty) => {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    scoreList.innerHTML = ""; // Clear previous scores

    // Sort highScores alphabetically by name
    highScores.sort((a, b) => {
        const nameA = a.name.toLowerCase(); // Convert to lower case for case insensitive comparison
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1; // Sort ascending
        if (nameA > nameB) return 1;
        return 0;
    });

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

// Event listener for the delete selected button
deleteSelectedButton.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".delete-checkbox:checked");
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    
    checkboxes.forEach((checkbox) => {
        const index = checkbox.getAttribute("data-index");
        highScores.splice(index, 1); // Remove selected scores
    });

    localStorage.setItem("highScores", JSON.stringify(highScores)); // Update local storage
    const difficulty = document.getElementById("difficulty").value;
    displayScores(difficulty); // Refresh the displayed scores
});

// Load scores on initial page load (optional)
window.onload = () => {
    displayScores("any"); // Display all scores by default on load
};
