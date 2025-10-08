## Theory

### Central Limit Theorem (CLT)

The **Central Limit Theorem (CLT)** is one of the foundational results in probability theory and statistics. It explains how, under certain conditions, the distribution of the sample mean (or normalized sum) converges to a normal distribution, even if the original data is not normally distributed.

#### Statement of CLT

Let $ X_1, X_2, \ldots, X_n $ be a sequence of independent and identically distributed (i.i.d.) random variables with mean $ \mu $ and variance $ \sigma^2 $. Define the normalized sum:

$$
S_n = \frac{1}{\sqrt{n}} \sum_{i=1}^n \left( X_i - \mu \right)
$$

As $ n \to \infty $, the distribution of $ S_n $ approaches a standard normal distribution $ N(0, 1) $, regardless of the original distribution of $ X_i $ (provided certain conditions, like finite mean and variance, are met):

$$
S_n \xrightarrow{d} N(0, 1)
$$

---

#### Properties of CLT

1. **Mean of Sample Means**:

   - The mean of the sample means is equal to the population mean $ \mu $.
2. **Variance of Sample Means**:

   - The variance of the sample means is $ \sigma^2 / n $, which decreases as the sample size increases.
3. **Normal Approximation**:

   - The approximation improves with larger sample sizes.

#### Example: Rolling a Die

- Population: Outcomes of a fair six-sided die $ \{1, 2, 3, 4, 5, 6\} $.
- Population Mean $ \mu = 3.5 $, Variance $ \sigma^2 = 2.92 $.
- If we roll the die $ n = 5 $ times repeatedly and calculate the sample means, the distribution of these means will approach a normal distribution as the number of rolls increases.

---

### Characteristic Functions of Random Variables

The **characteristic function** of a random variable $ X $ is a powerful tool in probability theory, defined as:

$$
\phi_X(t) = \mathbb{E}\left[ e^{itX} \right]
$$

where $ i $ is the imaginary unit and $ t $ is a real parameter.

#### Key Properties

1. **Existence**: The characteristic function always exists for any random variable.
2. **Uniqueness**: It uniquely determines the probability distribution of a random variable.
3. **Convolution Property**: The characteristic function of the sum of independent random variables is the product of their individual characteristic functions:
   $$
   \phi_{X+Y}(t) = \phi_X(t) \cdot \phi_Y(t)
   $$
4. **Inversion Formula**: A random variable's probability density function (PDF) can be recovered from its characteristic function using the inverse Fourier transform.

---

### Role of Characteristic Functions in CLT

Characteristic functions simplify the proof and understanding of the Central Limit Theorem because:

1. **Transforming Convolution to Multiplication**:
   - The sum of independent random variables corresponds to the product of their characteristic functions.
2. **Analyzing Limiting Behavior**:
   - The limiting behavior of the characteristic function of the normalized sum of random variables directly leads to the Gaussian distribution.

#### Formal Proof Idea Using Characteristic Functions

Let $ X_1, X_2, \ldots, X_n $ be i.i.d. random variables with mean $ \mu $ and variance $ \sigma^2 $. Define:

$$
S_n = \frac{1}{\sqrt{n}} \sum_{i=1}^n \left( X_i - \mu \right)
$$

The characteristic function of $ S_n $, denoted $ \phi_{S_n}(t) $, is given by:

$$
\phi_{S_n}(t) = \left[ \phi_X\left( \frac{t}{\sqrt{n}} \right) \right]^n
$$

For large $ n $, the Taylor expansion of $ \phi_X(t) $ around $ t = 0 $ can be used:

$$
\phi_X(t) \approx 1 - \frac{\sigma^2 t^2}{2} + o(t^2)
$$

Substituting this into $ \phi_{S_n}(t) $, it can be shown that:

$$
\phi_{S_n}(t) \to e^{-t^2 / 2} \quad \text{as } n \to \infty
$$

This is the characteristic function of a standard normal distribution $ \mathcal{N}(0, 1) $, proving the CLT.

---
