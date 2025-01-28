let voteCounts = [];
let voteChart = null;
let sampleSize = 0;
let std = 0;

// Assume std and sampleSize are global variables
function displayStats() {
    const statsDiv = document.getElementById("stats-display");
    
    // Update the content dynamically
    statsDiv.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center;">
        <p style="margin: 0; font-size: 16px; color: #555;">
            <strong>Total Votes:</strong> ${sampleSize}
        </p>
        <p style="margin: 0; font-size: 16px; color: #555;">
            <strong>Standard Deviation:</strong> ${std.toFixed(2)}
        </p>
    </div>
`;
}


function displayVoteCounts(voteCounts) {
    const numCandidates = parseInt(document.getElementById("numCandidates").value);
    
    // Dynamically generate the candidates list
    const candidates = [];
    for (let i = 1; i <= numCandidates; i++) {
        candidates.push(`${i}`);
    }

    // Create the table
    const table = document.createElement('table');
    table.classList.add('vote-table'); // Ensure this line is present

    // Create the first row (candidate names)
    const row1 = document.createElement('tr');
    candidates.forEach(candidate => {
        const cell = document.createElement('td');
        cell.textContent = candidate;
        row1.appendChild(cell);
    });
    table.appendChild(row1);

    // Create the second row (vote counts)
    const row2 = document.createElement('tr');
    voteCounts.forEach(vote => {
        const cell = document.createElement('td');
        cell.textContent = vote;
        row2.appendChild(cell);
    });
    table.appendChild(row2);

    // Append the table to the div with id "vote-table"
    const div = document.getElementById("vote-table");
    div.innerHTML = '';  // Clear the div before appending the new table
    div.appendChild(table);
}


function initializeElection() {
    const numCandidates = parseInt(document.getElementById("numCandidates").value);
    // const numVoters = parseInt(document.getElementById("numVoters").value);

    // Reset votes
    voteCounts = new Array(numCandidates).fill(0);

    // Generate candidate buttons
    const container = document.getElementById("candidate-buttons");
    container.innerHTML = "";
    for (let i = 0; i < numCandidates; i++) {
        const button = document.createElement("button");
        button.textContent = `Vote Candidate ${i + 1}`;
        button.className = "option-btn";
        button.onclick = () => castVote(i);
        container.appendChild(button);
    }

    // Initialize chart
    if (voteChart) voteChart.destroy();
    const ctx = document.getElementById("voteChart").getContext("2d");
    voteChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Array.from({ length: numCandidates }, (_, i) => `Candidate ${i + 1}`),
            datasets: [
                {
                    label: "Votes",
                    data: voteCounts,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            maintainAspectRatio: false, // Disable automatic resizing
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    const totalVotes = voteCounts.reduce((sum, vote) => sum + vote, 0); // Calculate the total votes
    const voteFractions = voteCounts.map(vote => (vote / totalVotes).toFixed(2)); // Calculate and round to 2 decimal places
    sampleSize = totalVotes;
    displayVoteCounts(voteFractions);
    const mean = voteCounts.reduce((sum, vote) => sum + vote, 0) / voteCounts.length;
    const variance = voteCounts.reduce((sum, vote) => sum + Math.pow(vote - mean, 2), 0) / voteCounts.length;
    std = Math.sqrt(variance);
    displayStats();

}


function validateInput(input) {
    const value = parseInt(input.value, 10);
    const errorMessage = document.getElementById('input-error');

    if (value <= 0 || value >= 100 || isNaN(value)) {
        errorMessage.style.display = "block"; // Show error message
        input.value = ""; // Clear invalid input
    } else {
        errorMessage.style.display = "none"; // Hide error message
    }
}


function castVote(candidateIndex) {
    voteCounts[candidateIndex]++;
    voteChart.data.datasets[0].data = voteCounts;
    voteChart.update();
    const totalVotes = voteCounts.reduce((sum, vote) => sum + vote, 0); // Calculate the total votes
    sampleSize = totalVotes;
    const voteFractions = voteCounts.map(vote => (vote / totalVotes).toFixed(3)); // Calculate and round to 2 decimal places
    displayVoteCounts(voteFractions);
    const mean = voteCounts.reduce((sum, vote) => sum + vote, 0) / voteCounts.length;
    const variance = voteCounts.reduce((sum, vote) => sum + Math.pow(vote - mean, 2), 0) / voteCounts.length;
    std = Math.sqrt(variance);
    displayStats();

}

function checkCriticalValue() {
    console.log("counts : ",voteCounts[0])
    const confidence = document.getElementById("input-field-confidence").value
    const critical = document.getElementById("input-field-critical").value

    // console.log("confidence = ",confidence)
    // console.log("critical = ",critical)

    const criticalTable = {
        50: 0.6745,
        75: 1.150,
        90: 1.645,
        95: 1.960,
        99: 2.576,
        99.9: 3.291
    };
    
    const desiredCritical = criticalTable[confidence];
    const observations = document.getElementById("observations");
    flag = 0;
    
    if (desiredCritical) {
        const errorMargin = 0.02;  // 5% error margin
        const lowerBound = desiredCritical * (1 - errorMargin);
        const upperBound = desiredCritical * (1 + errorMargin);
        if (critical === undefined || critical === null || critical === '') {
            observations.textContent = `Please enter critical value.`;
            observations.style.color = "red";
            flag = -1;
        }
        else if (critical >= lowerBound && critical <= upperBound) {
            observations.textContent = `Critical value is correct.`;
            observations.style.color = "green";
            flag = 1;
        } else {
            observations.textContent = `Critical value is incorrect.`;
            observations.style.color = "red";
            flag = 0;
        }
    } else {
        observations.textContent = "Invalid confidence level: " + confidence;
        observations.style.color = "red";
        flag = -2;
    }
    
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    return flag;
}

function checkStandardError(){
    const desiredse = std/Math.sqrt(sampleSize);
    const se = document.getElementById("input-field-se").value

    const flag = checkCriticalValue();
    let ff = 0;
    if (flag==1) {
        const errorMargin = 0.07;  // error margin
        const lowerBound = desiredse * (1 - errorMargin);
        const upperBound = desiredse * (1 + errorMargin);
        if (se === undefined || se === null || se === '') {
            observations.textContent = `Please enter Standard Error value.`;
            observations.style.color = "red";
            ff = -1;
        }
        else if (se >= lowerBound && se <= upperBound) {
            observations.textContent = `Standard Error value is correct.`;
            observations.style.color = "green";
            ff = 1;
        } else {
            observations.textContent = `Standard Error value is incorrect.`;
            observations.style.color = "red";
            ff = 0;
        }
    } else {
        observations.textContent = "Enter correct critical value first.";
        observations.style.color = "red";
        ff = -2;
    }
    
    // Scroll to the top of the page
    window.scrollTo(0, 0);
    return ff;
}


function checkME(){
    const desiredme = document.getElementById("input-field-critical").value * document.getElementById("input-field-se").value;
    const me = document.getElementById("input-field-me").value

    const ff = checkStandardError();
    if (ff==1) {
        const errorMargin = 0.05;  // 5% error margin
        const lowerBound = desiredme * (1 - errorMargin);
        const upperBound = desiredme * (1 + errorMargin);
        if (me === undefined || me === null || me === '') {
            observations.textContent = `Please enter Margin of Error.`;
            observations.style.color = "red";
        }
        else if (me >= lowerBound && me <= upperBound) {
            observations.textContent = `Margin of Error is correct.`;
            observations.style.color = "green";
        } else {
            observations.textContent = `Margin of Error is incorrect.`;
            observations.style.color = "red";
        }
    } else {
        observations.textContent = "Enter correct Standard Error First.";
        observations.style.color = "red";
    }
    
    // Scroll to the top of the page
    window.scrollTo(0, 0);

}

// Initialize simulation on dropdown change
document.getElementById("numCandidates").addEventListener("change", initializeElection);
// document.getElementById("numVoters").addEventListener("change", initializeElection);

// Load initial setup
window.onload = initializeElection;
