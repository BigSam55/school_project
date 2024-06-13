// Assuming you have already defined the functions calculateTotalScore, calculateAverageScore, and getGrade

// Calculate total score and update element
function calculateTotalScore() {
    const subjects = ['math', 'eng', 'chem', 'phy', 'bio'];
    const totalScoreElements = document.querySelectorAll('.totalScore');

    totalScoreElements.forEach((element, index) => {
        const total = subjects.reduce((acc, subject) => {
            const score = parseInt(document.querySelector(`#scoreshit .${subject}`).textContent);
            return acc + score;
        }, 0);

        element.textContent = total;
    });
}

// Calculate average score and update element
function calculateAverageScore() {
    const subjects = ['math', 'eng', 'chem', 'phy', 'bio'];
    const averageScoreElements = document.querySelectorAll('.averageScore');

    averageScoreElements.forEach((element, index) => {
        const total = subjects.reduce((acc, subject) => {
            const score = parseInt(document.querySelector(`#scoreshit .${subject}`).textContent);
            return acc + score;
        }, 0);
        const average = total / subjects.length;

        element.textContent = average.toFixed(2);
    });
}

// Get grade based on average and update element
function getGrade(average) {
    if (average >= 70) {
        return 'A';
    } else if (average >= 60 && average <= 69.9) {
        return 'B';
    } else if (average >= 50 && average <= 59.9) {
        return 'C';
    } else if (average >= 40 && average <= 49.9) {
        return 'D';
    } else {
        return 'F';
    }
}

// Display grades
function displayGrades() {
    const averageScoreElements = document.querySelectorAll('.averageScore');
    const gradeElements = document.querySelectorAll('.grade');

    averageScoreElements.forEach((element, index) => {
        const average = parseFloat(element.textContent);
        const grade = getGrade(average);
        gradeElements[index].textContent = grade;
    });
}



// Calculate total score
calculateTotalScore();

// Calculate average score
calculateAverageScore();

// Display grades
displayGrades();



