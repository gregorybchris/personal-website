---
date: 2025-04-14
slug: distrust-amazon-reviews
title: Why You Shouldn't Trust Amazon Reviews
archived: false
status: draft
---

I'll get to Amazon reviews in a minute, but first, if you'll allow me, a quick gripe about shopping online.

The other day I was shopping for a new bed-side lamp. On sites of well-known brands (Ikea, Pottery Barn, etc.) it was sometimes hard to tell from the pictures if I'd be getting a quality product. Then I tried the classic "Best Lamps of 2025" listicles (I have to imagine they were full of paid placements). [NYT Wirecutter](https://www.nytimes.com/wirecutter) had some fine options too. From Google searches I stumbled across a few sites with artsy lamps in the <i>thousands</i> of dollars. Hey, no judgement if that's your thing, but I'm a simple man. I want a sturdy lamp that'll last me a few decades and not break the bank.

At least for me, this is a pretty common experience buying a product online. I have a rough dollar amount in mind that I think I should have to pay (given cost of materials, manufacturing, shipping, etc). And I want to find a product that meets my expectations for quality. But then I go online and I'm flooded with options, many of which are super high quality, but cost an arm and a leg, and many of which look potentially well-constructed at first, but upon closer inspection would likely break while in transit to my front door.

Gaussian belief propagation for marketplace optimization

TrueScore considers how users rate items in an online marketplace and provides a measure of rater reliability using Gaussian belief propagation. The model jointly learns to estimate item quality and user reliability from data, putting less weight on ratings from users determined to be less reliable. As rater reliability changes, so do item quality estimates, hence the "propagation" in Gaussian belief propagation.

<!-- TODO: Add an animation of Gaussian distributions and message passing between them -->

## Copied

TrueScore considers how users rate items in an online marketplace and provides a measure of rater reliability. Online marketplaces have a large incentive to ensure item ratings are trustworthy and to identify bad actors before they can influence buyers.

Since both item quality and user reliability are determined from ratings, TrueScore jointly learns to estimate both from data, putting less weight on ratings from users determined to be less reliable. As rater reliability changes, so do item quality estimates, hence the "propagation" in Gaussian belief propagation.

It's worth noting that TrueScore is not a recommender system and therefore does not measure how individual user preferences factor into ratings. TrueScore estimates the conditional probability that a user would rate an item highly given they already want or need that item.

## The math

Given $N$ items and $M$ users.

- Let each item's true quality be $x_i$ for $i = 1,\dots, N$
- Let each user's reliability be $\alpha_u$ for $u = 1,\dots, M$

Model a rating $r_{u,i}$ (by user $u$, of item $i$) as drawn from a Gaussian around the true item quality with a variance based on the user's reliability.

$$
r_{u,i} \sim \mathcal{N}(x_i, \tfrac{1}{\alpha_u})
$$

The variance of a rating is $\sigma^2_u = \tfrac{1}{\alpha_u}$. A user with a high $\alpha_u$ has a low variance, and thus rates items more reliably (with higher precision).

By substituting our definition of variance in the Gaussian equation, for a single rating pair $(u,i)$ the likelihood term is:

$$
p(r_{u,i} \mid x_i, \alpha_u) = \mathcal{N}\Bigl(r_{u,i}; x_i, \tfrac{1}{\alpha_u}\Bigr) = \frac{1}{\sqrt{2\pi\bigl(\frac{1}{\alpha_u}\bigr)}} \exp\Bigl(-\tfrac{(r_{u,i}-x_i)^2}{2 \bigl(\tfrac{1}{\alpha_u}\bigr)}\Bigr)
$$

Then, after some arithmetic, we find the the negative log-likelihood (up to a constant) for a rating pair is:

$$
-\log p\bigl(r_{u,i}\mid x_i, \alpha_u\bigr) = \tfrac{1}{2}\log\bigl(\tfrac{1}{\alpha_u}\bigr)+\tfrac{1}{2}\alpha_u\bigl(r_{u,i}-x_i\bigr)^2
$$

Summing over all rating pairs $(u,i)$ in our training data yields the total negative log‐likelihood:

$$
\mathrm{NLL}(\mathbf{x}, \boldsymbol{\alpha}) = \sum_{(u,i)\in \text{data}}\Bigl[\tfrac{1}{2}\log\bigl(\tfrac{1}{\alpha_u}\bigr)+\tfrac{1}{2}\alpha_u(r_{u,i}-x_i)^2\Bigr]
$$

## Computing the loss

In practice we include L2 regularization terms with small coefficients for both $x$ and $\alpha$.

```python
from torch import Tensor

def forward(self, user_idxs: Tensor, item_idxs: Tensor, scores: Tensor) -> Tensor:
    """Compute the average negative log-likelihood for a batch."""
    log_alpha_u = self.log_alpha[user_idxs]
    alpha_u = torch.exp(log_alpha_u)
    x_i = self.x[item_idxs]
    residual = scores - x_i
    nll_obs = -0.5 * log_alpha_u + 0.5 * alpha_u * (residual**2)
    nll = nll_obs.mean()

    # Add L2 penalties on item qualities and on user reliabilities in log-space
    nll += 0.001 * (self.x**2).mean()
    nll += 0.001 * (self.log_alpha**2).mean()

    return nll
```
