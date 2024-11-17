const sections = [
    {
        title: 'Section 1',
        question: '?',
        options: ['opt1', 'optb', 'optc'],
    },
    {
        title: 'Section 2',
        question: '?',
        options: ['opt1', 'optb', 'optc'],
    },
    {
        title: 'Section 3',
        question: '?',
        options: ['opt1', 'optb', 'optc'],
    },
];

let currentSection = 0;

// Function to update the section content
function updateSection() {
    const sectionContent = document.querySelector('.box-question');
    const questionContainer = sectionContent.querySelector('.question-container');
    const optionsContainer = sectionContent.querySelector('.options-container');

    // Clear previous content
    questionContainer.innerHTML = `<h2>${sections[currentSection].question}</h2>`;

    // Create buttons for options
    optionsContainer.innerHTML = ''; // Clear previous options
    sections[currentSection].options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        optionsContainer.appendChild(button);
    });

    // Disable the previous button on the first section
    document.getElementById('prevBtn').disabled = currentSection === 0;
    // Disable the next button on the last section
    document.getElementById('nextBtn').disabled = currentSection === sections.length - 1;
}

// Function to handle Next and Previous buttons
function changeSection(direction) {
    if (direction === 'next' && currentSection < sections.length - 1) {
        currentSection++;
    } else if (direction === 'prev' && currentSection > 0) {
        currentSection--;
    }
    updateSection();
}

// Initialize section on page load
window.onload = updateSection;
