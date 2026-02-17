import numpy as np
import matplotlib.pyplot as plt

# Parameters
np.random.seed(42)
population = np.random.uniform(0, 50, 10000)  # Original population
sample_sizes = [5, 30, 100]  # Sample sizes to test

# Plotting
fig, axes = plt.subplots(1, len(sample_sizes) + 1, figsize=(16, 5))

# Original distribution
axes[0].hist(population, bins=30, color='blue', alpha=0.7, edgecolor='black')
axes[0].set_title("Original Distribution (Uniform)")
axes[0].set_xlabel("Value")
axes[0].set_ylabel("Frequency")

# Sample mean distributions
for i, n in enumerate(sample_sizes):
    sample_means = [np.mean(np.random.choice(population, n, replace=True)) for _ in range(1000)]
    axes[i + 1].hist(sample_means, bins=30, color='green', alpha=0.7, edgecolor='black')
    axes[i + 1].set_title(f"Sample Means (n={n})")
    axes[i + 1].set_xlabel("Sample Mean")
    axes[i + 1].set_ylabel("Frequency")

plt.tight_layout()
plt.show()
