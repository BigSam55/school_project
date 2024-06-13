
document.addEventListener('DOMContentLoaded', () => {
    const cancelBtnResult = document.querySelector('#cancelBtnResult');
  
    // Define a function to calculate total score
    function calculateTotalScore() {
      const subjects = ['math', 'eng', 'chem', 'phy', 'bio'];
      const totalScoreElements = document.querySelectorAll('.totalScore');
  
      totalScoreElements.forEach((element, index) => {
        const total = subjects.reduce((acc, subject) => {
          const score = parseInt(document.querySelector(`.scoreshit .${subject}`).textContent);
          return acc + score;
        }, 0);
  
        element.textContent = total;
      });
    }
  
    // Define a function to calculate average score
    function calculateAverageScore() {
      const subjects = ['math', 'eng', 'chem', 'phy', 'bio'];
      const averageScoreElements = document.querySelectorAll('.averageScore');
  
      averageScoreElements.forEach((element, index) => {
        const total = subjects.reduce((acc, subject) => {
            const score = parseInt(document.querySelector(`.scoreshit .${subject}`).textContent);
            return acc + score;
          }, 0);
        const average = total / subjects.length;
  
        element.textContent = average;
      });
    }
  
    // Define a function to get grade based on average
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
  
    // Define a function to calculate and display grades
    function displayGrades() {
      const averageScoreElements = document.querySelectorAll('.averageScore');
      const gradeElements = document.querySelectorAll('.grade');
  
      averageScoreElements.forEach((element, index) => {
        const average = parseFloat(element.textContent);
        const grade = getGrade(average);
        gradeElements[index].textContent = grade;
      });
    }
  
    // Add event listener to cancel button
    cancelBtnResult.addEventListener('click', () => {
      const modal = document.querySelector('.modal');
      modal.style.display = 'none';
    });
  
    // Calculate total score
    calculateTotalScore();
  
    // Calculate average score
    calculateAverageScore();
  
    // Display grades
    displayGrades();
  });
  