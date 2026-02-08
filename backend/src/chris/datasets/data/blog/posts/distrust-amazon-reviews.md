---
date: 2025-04-14
slug: distrust-amazon-reviews
title: Fixing Amazon's Product Review System
archived: false
status: published
---

I'll get to Amazon reviews in a minute, but first, if you'll allow me, a quick gripe about shopping online in general.

The other day I was shopping for a new bed-side lamp. And even on sites of well-known, respectable brands (Ikea, Pottery Barn, etc.) it was hard to tell from the pictures if I'd be getting a quality product. Then I tried the classic "Best Lamps of 2025" listicles, but I had to imagine they were full of paid placements... [NYT Wirecutter](https://www.nytimes.com/wirecutter) had some fine options, but not quite the selection I was hoping for. From Google searches I stumbled across a few sites with artsy lamps in the _thousands_ of dollars. Hey, no judgement if that's your thing, but I'm a simple man. I want a sturdy lamp that'll last me a few decades and not break the bank.

At least for me, this is a pretty common experience buying a product online. I have a rough dollar amount in mind that I think I should have to pay (given cost of materials, manufacturing, shipping, etc). And I want to find a product that meets my expectations for quality. But then I go online and I'm flooded with options, many of which are super high quality, but cost an arm and a leg, and many of which look potentially well-constructed at first, but upon closer inspection might crumble and break while in transit to my front door.

And we're not even considering style or personal taste. Why is it that for every quality product at a reasonable price, there are ten others that are either overpriced or of dubious quality?

## Recommender systems

I think part of the reason we're in this situation is that the maintainers of the most common recommender systems for physical products (Amazon and others) benefit more[^amazon-ecosystem] from recommending a variety of things than they do from helping users find things calibrated to their quality and cost expectations.

Of course, the _most-true_ story is that while some companies thrive on great brand loyalty and customer trust, there's a whole ecosystem of retailers that succeed by selling high volume, low quality, cheap products that are marketed just well enough to get clicks and buys.

I'm a realist enough to know that in the free market there will always be a diversity of business models and there will always be pressures toward low quality products. But I'm an idealist enough to believe there's a hypothetical system that gives consumers the power to distinguish high from low quality.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/distrust-amazon-reviews/pareto.svg?cache=3" width="420">
  <figcaption><strong>Figure 1: </strong>Pareto front &mdash; There is a diversity of preferences on the cost-quality tradeoff, but we all want to be somewhere on the Pareto front, not inside the curve.</figcaption>
</figure>

Amazon reviews are a reasonable attempt at such a system, I think. Seeing the average rating out of 5 stars is a super simple and intuitive way to think about buyer satisfaction. But unfortunately reviews can be gamed. You can buy fake reviews that artificially boost a product's rating. What would it look like if Amazon's recommender system were more aligned with the goals of users?

## Rating propagation

I've had an inkling of an idea for a while that you could estimate item's quality with user ratings and then measure rater reliability based on similarity to other raters. You could then discount ratings from users with low reliability.[^insider-scoop] What would emerge is a dynamical system where a single rating sends ripples through a network of items and users, updating estimates of both item quality and user reliability. The information gained from ratings diffuses outward as ratings stream in.

I'm hopeful that with enough simplifying assumptions (like item ratings being normally distributed), there might be an efficient closed form solution that scales to many users and items.

> I like to think of this model as similar to finding a fixed point with the [PageRank algorithm](https://en.wikipedia.org/wiki/PageRank) or diffusion in [spectral clustering](https://en.wikipedia.org/wiki/Spectral_clustering). Instead of Markov chain transitions between web pages, or eigenvectors of a graph Laplacian, we propagate Bayesian updates between items and users. But alas, these are just the mathematically illiterate ramblings of a software engineer. Shoot me some [mail](https://www.chrisgregory.me/contact) if you want to set me straight.

<figure id="figure2">
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/distrust-amazon-reviews/message-passing.mp4?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 2: </strong>
    Message passing &mdash; Ratings influence item quality estimates, then in return, item quality influences user reliability estimates. Information propagates through the network of users and items like messages being passed around.
  </figcaption>
</figure>

To avoid the risk of collusion or coalitional manipulation, it's also important that we track the system's confidence in rater reliability. You could create thousands of bots to boost the rating of a new item you're trying to sell, but if all of those bots have no previous track record of trustworthy ratings, then their votes won't be worth much.

I want to reiterate here that while the assumption of normally distributed item ratings is idealized, we don't expect to unfairly penalize users for having different tastes. Our goal is to reward raters who consistently and accurately rate item _quality_, which should be much more unimodal than individual _preference_ or taste. Put another way, we want to estimate the conditional probability that a user would rate an item highly given they already want or need that item.

After noodling on this for a while, I wasn't able to come up with the beautiful closed form solution I had hoped for. But I did come up with a deep learning approach that I think is still pretty cool!

## Deep learning

I trained a model called TrueScore to jointly learn item quality and user reliability from data. It's a simple model with parameters that scale linearly with the number of users and items. It also supports online learning so that new ratings can be incorporated into the model without retraining from scratch.

### The math

For those who want the gory details, here's a derivation of the loss function used to train the model.

Given $N$ items and $M$ users.

- Let each item's true quality be $x_i$ for $i = 1,\dots, N$
- Let each user's reliability be $\alpha_u$ for $u = 1,\dots, M$

Model a rating $r_{u,i}$ (by user $u$, of item $i$) as drawn from a Gaussian around the true item quality with a variance based on the user's reliability.

$$
r_{u,i} \sim \mathcal{N}(x_i, \tfrac{1}{\alpha_u})
$$

The variance of a rating is $\sigma^2_u = \tfrac{1}{\alpha_u}$. A user with a high $\alpha_u$ has a low variance, and thus rates items more reliably (with higher precision).

By substituting our definition of variance into the equation for a Gaussian, the likelihood term for a single rating pair $(u,i)$ is:

$$
p(r_{u,i} \mid x_i, \alpha_u) = \mathcal{N}\Bigl(r_{u,i}; x_i, \tfrac{1}{\alpha_u}\Bigr) = \frac{1}{\sqrt{2\pi\bigl(\frac{1}{\alpha_u}\bigr)}} \exp\Bigl(-\tfrac{(r_{u,i}-x_i)^2}{2 \bigl(\tfrac{1}{\alpha_u}\bigr)}\Bigr)
$$

Then, after some arithmetic, cancelling logs and exponents and ignoring constants, we find the negative log-likelihood for a rating pair is:

$$
-\log p\bigl(r_{u,i}\mid x_i, \alpha_u\bigr) = \tfrac{1}{2}\log\bigl(\tfrac{1}{\alpha_u}\bigr)+\tfrac{1}{2}\alpha_u\bigl(r_{u,i}-x_i\bigr)^2
$$

Summing over all rating pairs $(u,i)$ in our training data yields the total negative log‐likelihood:

$$
\mathrm{NLL}(\mathbf{x}, \boldsymbol{\alpha}) = \sum_{(u,i)\in \text{data}}\Bigl[\tfrac{1}{2}\log\bigl(\tfrac{1}{\alpha_u}\bigr)+\tfrac{1}{2}\alpha_u(r_{u,i}-x_i)^2\Bigr]
$$

### Model training

We train with a simple PyTorch optimization loop, minimizing the average negative log-likelihood over batches of observed ratings. The bulk of the math is captured in the `forward()` method and the rest is either plumbing or handled by PyTorch.

```python
from uuid import UUID

import torch
from torch import Tensor
from torch.nn import Module, Parameter

class Model(Module):
    def __init__(self, *, user_ids: list[UUID], item_ids: list[UUID]) -> None:
        super().__init__()
        # Item qualities
        self.x = Parameter(torch.randn(len(item_ids)))
        # User reliabilities are learned in log-space to ensure positive values
        self.log_alpha = Parameter(torch.zeros(len(user_ids)))

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

After training for `500` epochs, with a batch size of `16`, and a static learning rate of `1e-2`, the model converges quickly to a stable solution (see Figure 1). These hyperparameters were chosen fairly arbitrarily and based on the smooth shape of the loss curve, I doubt additional hyperparameter tuning would yield significant improvements.

<figure id="figure3">
  <img src="https://storage.googleapis.com/cgme/blog/posts/distrust-amazon-reviews/loss-curve.png?cache=1" width="450">
  <figcaption><strong>Figure 3: </strong>Loss curve &mdash; As expected, on synthetic data the learning curve is very smooth.</figcaption>
</figure>

## Outcomes

I was surprised to find (though maybe I shouldn't have been) that it takes a fair number of ratings per item to get a high-confidence estimate of quality. Rather than placing a Gaussian prior over the item quality distribution, I might try computing the mean and variance per item directly to get a more accurate estimate of quality.

As a follow-up I'd like to return to this idea and build more rigor into down-ranking users with lower reliability, either using Gaussian belief propagation[^belief-propagation] (a technique I came across in my research) or by factoring the user reliabilities from the TrueScore model into final item quality estimates without propagation.

If you're interested in trying TrueScore with your own data, check out the GitHub repo and spin up the TrueScore API. It supports loading item ratings from a local SQLite file or database connection. Once you've trained the model on your data, you can query for item quality and user reliability estimates.

<github-button user="gregorybchris" repo="truescore"></github-button>

```bash
# Infer user reliability
curl -s -X GET "http://localhost:8000/users/166b67de-83df-4124-b5ab-2d4a7d949435/reliability"
```

```json
{
  "user_id": "166b67de-83df-4124-b5ab-2d4a7d949435",
  "reliability": 0.42870861291885376
}
```

```bash
# Infer item quality
curl -s -X GET "http://localhost:8000/items/469df558-4e16-4e9e-87a9-f3013b1e1580/quality"
```

```json
{
  "item_id": "469df558-4e16-4e9e-87a9-f3013b1e1580",
  "quality": 3.872774362564087
}
```

[^belief-propagation]: [Gaussian belief propagation](<https://en.wikipedia.org/wiki/Belief_propagation#Gaussian_belief_propagation_(GaBP)>) is a message-passing algorithm for performing inference on graphical models with Gaussian distributions. I found this [cool demo online.](https://gaussianbp.github.io)
[^insider-scoop]: Edit (Nov. 2025): An insider at Amazon has confirmed that "verified users" do affect product recommendations at Amazon, but whether verified user feedback is reflected in aggregate ratings is still unclear to me.
[^amazon-ecosystem]: Edit (Feb 2026): I recommend [this video](https://www.youtube.com/shorts/S5eAEZAJtqs) from Ezra Klein's podcast for a clear explanation of the incentive structure Amazon has set up for itself and its sellers.
