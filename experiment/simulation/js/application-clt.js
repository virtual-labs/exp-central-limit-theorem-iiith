// --- SCRIPT FOR CLT DEMONSTRATION (application-clt.js) ---

let populationChart, lastSampleChart, samplingDistChart;
let POPULATION_PROPORTIONS = [];
let POPULATION_MEAN = 0;
let POPULATION_STD_DEV = 0;
let standardizedMeans = [];

const sampleSizeSlider = document.getElementById("sampleSize");
const sampleSizeValue = document.getElementById("sampleSizeValue");
const observationsEl = document.getElementById("observations");

window.onload = () => {
    initializeAllCharts();
    setupEventListeners();
    resetSimulation();
};

function initializeAllCharts() {
    const popCtx = document.getElementById('populationChart').getContext('2d');
    populationChart = new Chart(popCtx, {
        type: 'bar',
        data: { labels: ['Cand. 1', 'Cand. 2', 'Cand. 3'], datasets: [{ label: 'Proportion of Votes', data: [], backgroundColor: '#4481c2' }] },
        options: createChartOptions('True Population Distribution', true, 0, 1)
    });

    const lastSampleCtx = document.getElementById('lastSampleChart').getContext('2d');
    lastSampleChart = new Chart(lastSampleCtx, {
        type: 'bar',
        data: { labels: ['Cand. 1', 'Cand. 2', 'Cand. 3'], datasets: [{ label: 'Number of Votes', data: [0, 0, 0], backgroundColor: '#f8a557' }] },
        options: createChartOptions('Most Recent Sample', false)
    });

    const samplingCtx = document.getElementById('samplingDistChart').getContext('2d');
    samplingDistChart = new Chart(samplingCtx, {
        type: 'bar', 
        data: { labels: [], datasets: [
            { type: 'bar', label: 'Frequency of Z-scores', data: [], backgroundColor: 'rgba(100, 194, 169, 0.7)', barPercentage: 1.0, categoryPercentage: 1.0, order: 2 },
            { type: 'line', label: 'Standard Normal PDF', data: [], borderColor: '#e53935', borderWidth: 2.5, pointRadius: 0, fill: false, order: 1 },
            { type: 'line', label: '±1σ, ±2σ', data: [], borderColor: 'rgba(40, 40, 40, 0.4)', borderWidth: 1.5, borderDash: [6, 6], fill: false, order: 0 }
        ]},
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { title: { display: true, text: "Sampling Distribution of the Standardized Mean (Z)", font: { size: 14 } }, legend: { display: true, position: 'bottom', labels: { boxWidth: 15 } } },
            scales: { x: { type: 'linear', min: -4, max: 4 }, y: { beginAtZero: true } }
        }
    });
}

function createChartOptions(title, displayLegend, minY, maxY) {
    return {
        responsive: true, maintainAspectRatio: false,
        plugins: { title: { display: true, text: title, font: { size: 14 } }, legend: { display: displayLegend } },
        scales: { y: { beginAtZero: true, min: minY, max: maxY } }
    };
}

function setupEventListeners() {
    sampleSizeSlider.oninput = () => { sampleSizeValue.innerHTML = sampleSizeSlider.value; updateStats(); };
    document.getElementById('drawHundredSamples').addEventListener('click', () => drawSamples(100));
    document.getElementById('resetSimulation').addEventListener('click', resetSimulation);
}

function generateRandomPopulation() {
    let r1 = Math.random(), r2 = Math.random(), r3 = Math.random();
    const sum = r1 + r2 + r3;
    POPULATION_PROPORTIONS = [r1 / sum, r2 / sum, r3 / sum];
    POPULATION_MEAN = POPULATION_PROPORTIONS[0];
    POPULATION_STD_DEV = Math.sqrt(POPULATION_MEAN * (1 - POPULATION_MEAN));
}

function drawSamples(num) {
    const sampleSize = parseInt(sampleSizeSlider.value);
    const theoreticalSE = POPULATION_STD_DEV / Math.sqrt(sampleSize);
    let lastSample;
    if (theoreticalSE === 0) {
        alert("Population standard deviation is zero. Please reset the simulation to get a new population.");
        return;
    }

    for (let i = 0; i < num; i++) {
        const sample = generateOneSample(sampleSize);
        const sampleProportion = sample[0] / sampleSize;
        const standardizedMean = (sampleProportion - POPULATION_MEAN) / theoreticalSE;
        standardizedMeans.push(standardizedMean);
        lastSample = sample;
    }

    updateLastSampleChart(lastSample);
    updateSamplingDistributionChart();
    updateStats();
    updateObservations();
}

function generateOneSample(sampleSize) {
    const sampleVotes = [0, 0, 0];
    const p1 = POPULATION_PROPORTIONS[0];
    const p12 = p1 + POPULATION_PROPORTIONS[1];
    for (let i = 0; i < sampleSize; i++) {
        const rand = Math.random();
        if (rand < p1) sampleVotes[0]++;
        else if (rand < p12) sampleVotes[1]++;
        else sampleVotes[2]++;
    }
    return sampleVotes;
}

function resetSimulation() {
    standardizedMeans = [];
    generateRandomPopulation();
    
    populationChart.data.datasets[0].data = POPULATION_PROPORTIONS;
    populationChart.update();
    lastSampleChart.data.datasets[0].data = [0, 0, 0];
    lastSampleChart.update();
    
    updateSamplingDistributionChart();
    updateStats();
    observationsEl.innerHTML = "A new random population has been generated. Draw samples to observe the CLT.";
    document.getElementById('within-1-sigma').textContent = 'N/A';
    document.getElementById('within-2-sigma').textContent = 'N/A';
}

function updateLastSampleChart(sampleData) {
    lastSampleChart.data.datasets[0].data = sampleData;
    lastSampleChart.update();
}

function updateSamplingDistributionChart() {
    const numBins = 40;
    const bins = createHistogramBins(standardizedMeans, -4, 4, numBins);
    
    samplingDistChart.data.datasets[0].data = bins;

    const maxY = standardizedMeans.length > 0 ? Math.max(...bins.map(b => b.y), 1) : 1;
    const binWidth = 8 / numBins;

    const gaussianData = generateGaussianData(bins, standardizedMeans.length, binWidth);
    samplingDistChart.data.datasets[1].data = gaussianData;

    const sigmaLineData = [
        {x: -2, y: 0}, {x: -2, y: maxY * 1.05}, {x: NaN, y: NaN},
        {x: -1, y: 0}, {x: -1, y: maxY * 1.05}, {x: NaN, y: NaN},
        {x: 1, y: 0}, {x: 1, y: maxY * 1.05}, {x: NaN, y: NaN},
        {x: 2, y: 0}, {x: 2, y: maxY * 1.05}
    ];
    samplingDistChart.data.datasets[2].data = sigmaLineData;
    samplingDistChart.options.scales.y.max = maxY * 1.1;

    samplingDistChart.update();
}

function updateStats() {
    const n = parseInt(sampleSizeSlider.value);
    document.getElementById('true-mean').textContent = POPULATION_MEAN.toFixed(4);
    document.getElementById('true-std-dev').textContent = POPULATION_STD_DEV.toFixed(4);
    
    const theoreticalSE = POPULATION_STD_DEV / Math.sqrt(n);
    document.getElementById('theoretical-se').textContent = isNaN(theoreticalSE) ? 'N/A' : theoreticalSE.toFixed(4);
    document.getElementById('num-samples').textContent = standardizedMeans.length;

    if (standardizedMeans.length > 1) {
        const within1Sigma = standardizedMeans.filter(z => z >= -1 && z <= 1).length / standardizedMeans.length * 100;
        const within2Sigma = standardizedMeans.filter(z => z >= -2 && z <= 2).length / standardizedMeans.length * 100;
        document.getElementById('within-1-sigma').textContent = `${within1Sigma.toFixed(1)}%`;
        document.getElementById('within-2-sigma').textContent = `${within2Sigma.toFixed(1)}%`;
    } else {
        document.getElementById('within-1-sigma').textContent = 'N/A';
        document.getElementById('within-2-sigma').textContent = 'N/A';
    }
}

function updateObservations() {
    if (standardizedMeans.length < 100) {
        observationsEl.innerHTML = "";
        return;
    };

    const mean = standardizedMeans.reduce((a, b) => a + b) / standardizedMeans.length;
    const std = calculateSD(standardizedMeans);
    observationsEl.innerHTML = `With a sufficient number of samples, the histogram of Z-scores is closely matching the Standard Normal curve. <br><br>Your distribution's mean is <strong>${mean.toFixed(3)}</strong> (vs. theory of 0) and its standard deviation is <strong>${std.toFixed(3)}</strong> (vs. theory of 1).`;
}

function calculateSD(arr) {
    if (arr.length < 2) return 0;
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (arr.length - 1));
}

function createHistogramBins(data, min, max, numBins) {
    const binWidth = (max - min) / numBins;
    let bins = Array(numBins).fill(0).map((_, i) => ({ x: min + (i + 0.5) * binWidth, y: 0 }));
    if (data.length === 0) return bins;
    
    data.forEach(point => {
        const binIndex = Math.floor((point - min) / binWidth);
        if (binIndex >= 0 && binIndex < numBins) bins[binIndex].y++;
    });
    return bins;
}

function generateGaussianData(bins, totalSamples, binWidth) {
    return bins.map(bin => {
        const x = bin.x;
        const pdfValue = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
        return { x: x, y: pdfValue * totalSamples * binWidth };
    });
}