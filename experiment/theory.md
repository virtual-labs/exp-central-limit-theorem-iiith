<!-- # Theory

The **Central Limit Theorem (CLT)** is a fundamental concept in probability and statistics. It states that the sampling distribution of the sample mean will approximate a normal (Gaussian) distribution as the sample size becomes larger, regardless of the shape of the original population distribution. 

## Key Points of the CLT:
1. The sample size must be sufficiently large (typically $ n \geq 30 $).
2. The population's variance should be finite.
3. The theorem holds true regardless of whether the original population is normally distributed.

---

## Mathematical Statement of the CLT:
Let $ X_1, X_2, \ldots, X_n $ be a random sample of size $ n $ drawn from a population with mean $ \mu $ and standard deviation $ \sigma $. The sample mean $ \bar{X} $ is given by:

$
\bar{X} = \frac{1}{n} \sum_{i=1}^n X_i
$

According to the CLT, as $ n \to \infty $, the distribution of $ \bar{X} $ approaches a normal distribution:

$
\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)
$

This means:
- The mean of the sample means $ \bar{X} $ is $ \mu $ (the population mean).
- The variance of the sample means is $ \frac{\sigma^2}{n} $ (population variance divided by sample size).

---

## Example: Rolling a Die
Imagine rolling a fair six-sided die:
- Population: $ \{1, 2, 3, 4, 5, 6\} $
- Population mean ($ \mu $): $ \frac{1+2+3+4+5+6}{6} = 3.5 $
- Population variance ($ \sigma^2 $): $ \frac{(1-3.5)^2 + \ldots + (6-3.5)^2}{6} = 2.92 $

### Small Sample (n=2):
- Draw two random numbers, e.g., $ X_1 = 3 $ and $ X_2 = 5 $.
- Sample mean: $ \bar{X} = \frac{3+5}{2} = 4.0 $.

### Large Sample (n=50):
- Draw 50 random numbers and compute their mean.
- Repeating this many times results in a histogram of sample means that approximates a normal distribution.

---

## Why the CLT is Important:
The CLT allows statisticians to:
1. Make inferences about population parameters using sample statistics.
2. Apply statistical methods (like hypothesis testing and confidence intervals) even when the original population distribution is unknown.

---

## Visualization of the CLT
| Sample Size ($ n $) | Shape of Sample Means Distribution |
|------------------------|------------------------------------|
| 2                      | Slight resemblance to normal      |
| 10                     | More bell-shaped                  |
| 50                     | Clearly normal                    |

---

## Real-World Application:
### Example: Average Waiting Time at a Bank
- Suppose waiting times at a bank follow an exponential distribution (skewed).
- If you take samples of 50 customers' waiting times and calculate their averages, the distribution of these averages will approximate a normal distribution due to the CLT.

---

## Interactive Understanding:
1. **Experiment:** Try generating sample means for different sample sizes and plot the distribution.
2. **Observation:** As the sample size increases, the variance of the sample means decreases, and the shape becomes bell-shaped.

---

## Conclusion:
The CLT is powerful because it justifies the use of normal distribution methods in many real-world scenarios, even when the population distribution is unknown. It is a cornerstone of statistical theory and applications. -->


<!-- # Central Limit Theorem (CLT)

The **Central Limit Theorem (CLT)** is one of the most important theorems in probability and statistics. It explains how, under certain conditions, the distribution of the sample mean becomes approximately normal, even if the population distribution is not normal.

---

## Core Idea of the CLT
The CLT states that:
1. If we repeatedly take samples of size $ n $ from a population with any distribution (e.g., uniform, exponential, skewed), the distribution of the sample means ($ \bar{X} $) will tend to a normal distribution as $ n $ increases.
2. This approximation improves as the sample size $ n $ becomes larger.

---

## Key Properties
1. **Mean of the Sample Means ($ \mu_{\bar{X}} $)**:
   - Equal to the population mean ($ \mu $).
   - $ \mu_{\bar{X}} = \mu $.
   
2. **Variance of the Sample Means ($ \sigma^2_{\bar{X}} $)**:
   - Equal to the population variance divided by the sample size.
   - $ \sigma^2_{\bar{X}} = \frac{\sigma^2}{n} $.

3. **Normality**:
   - The distribution of $ \bar{X} $ approaches normality as $ n $ increases, regardless of the population's original distribution.

---

## Mathematical Representation
Let $ X_1, X_2, \ldots, X_n $ be a random sample of size $ n $ from a population with mean $ \mu $ and variance $ \sigma^2 $. Then, the sample mean $ \bar{X} $ is given by:

$
\bar{X} = \frac{1}{n} \sum_{i=1}^n X_i
$

As $ n \to \infty $:
$
\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)
$

---

## Example: Rolling a Die
### Population Information
- Die faces: $ \{1, 2, 3, 4, 5, 6\} $
- Population mean ($ \mu $): $ \frac{1+2+3+4+5+6}{6} = 3.5 $
- Population variance ($ \sigma^2 $): $ \frac{1}{6}\sum_{i=1}^6 (i - 3.5)^2 = 2.92 $

### Sampling Process
- Take $ n = 5 $ rolls at a time, calculate the mean, and repeat this process many times.
- Plot the distribution of these sample means.

---

## Conclusion:
The CLT is powerful because it justifies the use of normal distribution methods in many real-world scenarios, even when the population distribution is unknown. It is a cornerstone of statistical theory and applications. -->

# Theory


## Central Limit Theorem (CLT)

The **Central Limit Theorem (CLT)** is one of the foundational results in probability theory and statistics. It explains how, under certain conditions, the distribution of the sample mean (or normalized sum) converges to a normal distribution, even if the original data is not normally distributed.

### Statement of CLT
Let $ X_1, X_2, \ldots, X_n $ be a sequence of independent and identically distributed (i.i.d.) random variables with mean $ \mu $ and variance $ \sigma^2 $. Define the normalized sum:

$
 S_n = \frac{1}{\sqrt{n}} \sum_{i=1}^n \left( X_i - \mu \right)
$

As $ n \to \infty $, the distribution of $ S_n $ approaches a standard normal distribution $ N(0, 1) $, regardless of the original distribution of $ X_i $ (provided certain conditions, like finite mean and variance, are met):

$
 S_n \xrightarrow{d} N(0, 1)
$

---

### Properties of CLT
1. **Mean of Sample Means**:
   - The mean of the sample means is equal to the population mean $ \mu $.
   
2. **Variance of Sample Means**:
   - The variance of the sample means is $ \sigma^2 / n $, which decreases as the sample size increases.

3. **Normal Approximation**:
   - The approximation improves with larger sample sizes.

### Example: Rolling a Die
- Population: Outcomes of a fair six-sided die $ \{1, 2, 3, 4, 5, 6\} $.
- Population Mean $ \mu = 3.5 $, Variance $ \sigma^2 = 2.92 $.
- If we roll the die $ n = 5 $ times repeatedly and calculate the sample means, the distribution of these means will approach a normal distribution as the number of rolls increases.

---

## Characteristic Functions of Random Variables

The **characteristic function** of a random variable $ X $ is a powerful tool in probability theory, defined as:

$
 \phi_X(t) = \mathbb{E}\left[ e^{itX} \right]
$

where $ i $ is the imaginary unit and $ t $ is a real parameter.

### Key Properties
1. **Existence**: The characteristic function always exists for any random variable.
2. **Uniqueness**: It uniquely determines the probability distribution of a random variable.
3. **Convolution Property**: The characteristic function of the sum of independent random variables is the product of their individual characteristic functions:
   $
    \phi_{X+Y}(t) = \phi_X(t) \cdot \phi_Y(t)
   $
4. **Inversion Formula**: A random variable's probability density function (PDF) can be recovered from its characteristic function using the inverse Fourier transform.

---

## Role of Characteristic Functions in CLT

Characteristic functions simplify the proof and understanding of the Central Limit Theorem because:
1. **Transforming Convolution to Multiplication**:
   - The sum of independent random variables corresponds to the product of their characteristic functions.
2. **Analyzing Limiting Behavior**:
   - The limiting behavior of the characteristic function of the normalized sum of random variables directly leads to the Gaussian distribution.

### Formal Proof Idea Using Characteristic Functions
Let $ X_1, X_2, \ldots, X_n $ be i.i.d. random variables with mean $ \mu $ and variance $ \sigma^2 $. Define:

$
 S_n = \frac{1}{\sqrt{n}} \sum_{i=1}^n \left( X_i - \mu \right)
$

The characteristic function of $ S_n $, denoted $ \phi_{S_n}(t) $, is given by:

$
 \phi_{S_n}(t) = \left[ \phi_X\left( \frac{t}{\sqrt{n}} \right) \right]^n
$

For large $ n $, the Taylor expansion of $ \phi_X(t) $ around $ t = 0 $ can be used:

$
 \phi_X(t) \approx 1 - \frac{\sigma^2 t^2}{2} + o(t^2)
$

Substituting this into $ \phi_{S_n}(t) $, it can be shown that:

$
 \phi_{S_n}(t) \to e^{-t^2 / 2} \quad \text{as } n \to \infty
$

This is the characteristic function of a standard normal distribution $ N(0, 1) $, proving the CLT.

---
