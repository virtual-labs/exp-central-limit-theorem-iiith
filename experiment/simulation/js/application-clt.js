// --- SCRIPT FOR CLT DEMONSTRATION (application-clt.js) ---

// Chart instances
let populationChart, lastSampleChart, samplingDistChart;

// Data stores
const POPULATION_PROPORTIONS = [0.45, 0.35, 0.20]; // True proportions for 3 candidates
const POPULATION_MEAN = POPULATION_PROPORTIONS[0]; // Focusing on Candidate 1
let sampleMeans = []; // To store the mean (proportion) of each sample

// DOM Elements
const sampleSizeSlider = document.getElementById("sampleSize");
const sampleSizeValue = document.getElementById("sampleSizeValue");
const observationsEl = document.getElementById("observations");

// --- INITIALIZATION ---
window.onload = () => {
    initializeAllCharts();
    setupEventListeners();
    updateStats();
    observationsEl.textContent = "Welcome! Use the controls to draw samples from the population and observe the distribution of their means.";
};

function initializeAllCharts() {
    // 1. Population Chart
    const popCtx = document.getElementById('populationChart').getContext('2d');
    populationChart = new Chart(popCtx, {
        type: 'bar',
        data: {
            labels: ['Cand. 1', 'Cand. 2', 'Cand. 3'],
            datasets: [{
                label: 'Proportion of Votes',
                data: POPULATION_PROPORTIONS,
                backgroundColor: '#4481c2',
            }]
        },
        options: createChartOptions('True Population Distribution', true, 0, 1)
    });

    // 2. Last Sample Chart
    const lastSampleCtx = document.getElementById('lastSampleChart').getContext('2d');
    lastSampleChart = new Chart(lastSampleCtx, {
        type: 'bar',
        data: {
            labels: ['Cand. 1', 'Cand. 2', 'Cand. 3'],
            datasets: [{
                label: 'Number of Votes',
                data: [0, 0, 0],
                backgroundColor: '#f8a557',
            }]
        },
        options: createChartOptions('Most Recent Sample', false)
    });

    // 3. Sampling Distribution Chart
    const samplingCtx = document.getElementById('samplingDistChart').getContext('2d');
    samplingDistChart = new Chart(samplingCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Frequency', data: [], backgroundColor: '#64c2a9' }] },
        options: createChartOptions("Sampling Distribution of Candidate 1's Proportion", false, 0)
    });
}

function createChartOptions(title, displayLegend, minY = undefined, maxY = undefined) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: title, font: { size: 14 } },
            legend: { display: displayLegend }
        },
        scales: { y: { beginAtZero: true, min: minY, max: maxY } }
    };
}

function setupEventListeners() {
    sampleSizeSlider.oninput = () => {
        sampleSizeValue.innerHTML = sampleSizeSlider.value;
        updateStats(); // Recalculate theoretical SE
    };
    document.getElementById('drawOneSample').addEventListener('click', () => drawSamples(1));
    document.getElementById('drawHundredSamples').addEventListener('click', () => drawSamples(100));
    document.getElementById('resetSimulation').addEventListener('click', resetSimulation);
}

// --- SIMULATION LOGIC ---

function drawSamples(num) {
    const sampleSize = parseInt(sampleSizeSlider.value);
    let lastSample;

    for (let i = 0; i < num; i++) {
        const sample = generateOneSample(sampleSize);
        const sampleProportion = sample[0] / sampleSize; // Proportion for Candidate 1
        sampleMeans.push(sampleProportion);
        lastSample = sample;
    }

    updateLastSampleChart(lastSample);
    updateSamplingDistributionChart();
    updateStats();
    updateObservations(num);
}

function generateOneSample(sampleSize) {
    const sampleVotes = [0, 0, 0];
    for (let i = 0; i < sampleSize; i++) {
        const rand = Math.random();
        if (rand < POPULATION_PROPORTIONS[0]) {
            sampleVotes[0]++;
        } else if (rand < POPULATION_PROPORTIONS[0] + POPULATION_PROPORTIONS[1]) {
            sampleVotes[1]++;
        } else {
            sampleVotes[2]++;
        }
    }
    return sampleVotes;
}

function resetSimulation() {
    sampleMeans = [];
    // Reset charts
    lastSampleChart.data.datasets[0].data = [0, 0, 0];
    lastSampleChart.update();
    updateSamplingDistributionChart();
    // Reset stats and observations
    updateStats();
    observationsEl.textContent = "Simulation reset. Draw new samples to begin again.";
}

// --- CHART & STATS UPDATES ---

function updateLastSampleChart(sampleData) {
    lastSampleChart.data.datasets[0].data = sampleData;
    lastSampleChart.update();
}

function updateSamplingDistributionChart() {
    if (sampleMeans.length === 0) {
        samplingDistChart.data.labels = [];
        samplingDistChart.data.datasets[0].data = [];
        samplingDistChart.update();
        return;
    }
    const bins = createHistogramBins(sampleMeans);
    samplingDistChart.data.labels = bins.map(b => b.label);
    samplingDistChart.data.datasets[0].data = bins.map(b => b.count);
    samplingDistChart.update();
}

function updateStats() {
    const n = parseInt(sampleSizeSlider.value);
    document.getElementById('true-mean').textContent = POPULATION_MEAN.toFixed(3);
    document.getElementById('num-samples').textContent = sampleMeans.length;
    
    // Theoretical Standard Error = sqrt(p*(1-p)/n)
    const theoreticalSE = Math.sqrt(POPULATION_MEAN * (1 - POPULATION_MEAN) / n);
    document.getElementById('theoretical-se').textContent = theoreticalSE.toFixed(4);

    if (sampleMeans.length > 1) {
        const meanOfMeans = sampleMeans.reduce((a, b) => a + b) / sampleMeans.length;
        document.getElementById('mean-of-means').textContent = meanOfMeans.toFixed(4);

        const seOfMeans = calculateSD(sampleMeans);
        document.getElementById('se-of-means').textContent = seOfMeans.toFixed(4);
    } else {
        document.getElementById('mean-of-means').textContent = 'N/A';
        document.getElementById('se-of-means').textContent = 'N/A';
    }
}

function updateObservations(numDrawn) {
     if (sampleMeans.length < 2) {
        observationsEl.textContent = "You've drawn your first sample. Notice its proportions may differ from the true population. Draw more samples to see a pattern emerge.";
        return;
    }
    if (numDrawn > 1 && sampleMeans.length > 100) {
        observationsEl.textContent = "Notice how the sampling distribution is becoming bell-shaped? This is the Central Limit Theorem! The distribution is centered near the true population proportion for Candidate 1.";
    } else {
        observationsEl.textContent = "Keep drawing samples. The more you draw, the more the sampling distribution on the right will resemble a normal (bell) curve.";
    }

    const meanOfMeans = parseFloat(document.getElementById('mean-of-means').textContent);
    if (Math.abs(meanOfMeans - POPULATION_MEAN) < 0.01) {
         observationsEl.textContent += " The mean of your sample proportions is now very close to the true population proportion!";
    }
}

// --- HELPER FUNCTIONS ---

function calculateSD(arr) {
    const n = arr.length;
    if (n < 2) return 0;
    const mean = arr.reduce((a, b) => a + b) / n;
    return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1));
}

function createHistogramBins(data, numBins = 20) {
    if (data.length === 0) return [];
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);

    // Handle edge case where all data points are the same
    if (minVal === maxVal) {
        return [{ label: minVal.toFixed(2), count: data.length }];
    }
    
    const binWidth = (maxVal - minVal) / numBins;
    let bins = [];
    for (let i = 0; i < numBins; i++) {
        const binMin = minVal + i * binWidth;
        const binMax = binMin + binWidth;
        bins.push({
            label: `${((binMin + binMax) / 2).toFixed(2)}`,
            count: 0,
            min: binMin,
            max: binMax
        });
    }

    data.forEach(point => {
        let binFound = false;
        for (let bin of bins) {
            if (point >= bin.min && point < bin.max) {
                bin.count++;
                binFound = true;
                break;
            }
        }
        if (!binFound) { // Add to the last bin if it's the max value
            bins[bins.length-1].count++;
        }
    });

    return bins;
}