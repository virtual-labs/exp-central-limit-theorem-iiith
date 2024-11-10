// Poisson random number generator
function poissonRandom(lambda) {
    let L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
}

// Function to generate random numbers from different distributions
function generateSamples(distType, sampleSize, numSamples) {
    const samples = [];
    const sampleMeans = [];

    for (let i = 0; i < numSamples; i++) {
        const currentSample = [];
        
        for (let j = 0; j < sampleSize; j++) {
            let value;
            switch (distType) {
                case 'Uniform':
                    value = Math.random();
                    break;
                case 'Exponential':
                    value = -Math.log(1 - Math.random());
                    break;
                case 'Normal':
                    // Box-Muller transform
                    const u1 = Math.random();
                    const u2 = Math.random();
                    value = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                    break;
                case 'Poisson':
                    value = poissonRandom(5); // lambda = 5
                    break;
            }
            currentSample.push(value);
        }
        
        // Calculate mean of current sample
        const mean = currentSample.reduce((a, b) => a + b) / sampleSize;
        sampleMeans.push(mean);
        samples.push(...currentSample);
    }

    return { samples, sampleMeans };
}

// Function to calculate normal distribution parameters
function calculateNormalParams(data) {
    const mean = data.reduce((a, b) => a + b) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    return { mean, std: Math.sqrt(variance) };
}

// Function to create histogram data
function createHistogram(data, bins = 30) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    
    const histogram = new Array(bins).fill(0);
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[binIndex]++;
    });
    
    // Normalize histogram
    const totalCount = data.length * binWidth;
    const normalizedHistogram = histogram.map(count => count / totalCount);
    
    // Generate bin centers for x-axis
    const binCenters = Array.from({length: bins}, 
        (_, i) => parseFloat((min + (i + 0.5) * binWidth).toFixed(2)));
    
    return { x: binCenters, y: normalizedHistogram };
}

// Function to generate normal distribution curve points
function generateNormalCurve(mean, std, data, bins = 30) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    
    const x = [];
    const y = [];
    
    for (let i = 0; i < bins; i++) {
        const xVal = min + (i + 0.5) * binWidth;
        const yVal = (1 / (std * Math.sqrt(2 * Math.PI))) * 
                     Math.exp(-0.5 * Math.pow((xVal - mean) / std, 2));
        x.push(xVal.toFixed(2));
        y.push(yVal);
    }
    
    return { x, y };
}

let originalDistChart, sampleMeansChart;

function createChartConfig(title, color) {
    return {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: title,
                data: [],
                backgroundColor: color,
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: false, // Disable animations for better performance
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        callback: function(value) {
                            return parseFloat(value).toFixed(2);
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                }
            }
        }
    };
}

function initializeCharts() {
    const originalCtx = document.getElementById('originalDist').getContext('2d');
    const sampleMeansCtx = document.getElementById('sampleMeansDist').getContext('2d');

    originalDistChart = new Chart(originalCtx, createChartConfig('Original Distribution', 'rgba(0, 0, 255, 0.6)'));

    sampleMeansChart = new Chart(sampleMeansCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Sample Means',
                data: [],
                backgroundColor: 'rgba(0, 255, 0, 0.6)',
                borderColor: 'black',
                borderWidth: 1
            }, {
                label: 'Normal Fit',
                data: [],
                type: 'line',
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            animation: false, // Disable animations for better performance
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        callback: function(value) {
                            return parseFloat(value).toFixed(2);
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Sample Means Distribution (CLT)',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

function updateVisualization() {
    const distType = document.getElementById('distType').value;
    const sampleSize = parseInt(document.getElementById('sampleSize').value);
    const numSamples = parseInt(document.getElementById('numSamples').value);

    // Generate new data
    const { samples, sampleMeans } = generateSamples(distType, sampleSize, numSamples);
    
    // Create histograms
    const originalHist = createHistogram(samples);
    const meansHist = createHistogram(sampleMeans);
    
    // Calculate normal fit for sample means
    const { mean, std } = calculateNormalParams(sampleMeans);
    const normalCurve = generateNormalCurve(mean, std, sampleMeans);

    // Destroy existing charts and recreate them
    if (originalDistChart) originalDistChart.destroy();
    if (sampleMeansChart) sampleMeansChart.destroy();

    initializeCharts();

    // Update charts with new data
    originalDistChart.data.labels = originalHist.x;
    originalDistChart.data.datasets[0].data = originalHist.y;
    originalDistChart.update('none'); // Update without animation

    sampleMeansChart.data.labels = meansHist.x;
    sampleMeansChart.data.datasets[0].data = meansHist.y;
    sampleMeansChart.data.datasets[1].data = normalCurve.y;
    sampleMeansChart.data.labels = normalCurve.x;
    sampleMeansChart.update('none'); // Update without animation
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    
    // Add event listeners for immediate updates
    ['sampleSize', 'numSamples'].forEach(id => {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(`${id}Value`);
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
            requestAnimationFrame(updateVisualization); // Use requestAnimationFrame for smoother updates
        });
    });
    
    document.getElementById('distType').addEventListener('change', updateVisualization);
    
    // Initial visualization
    updateVisualization();
});
