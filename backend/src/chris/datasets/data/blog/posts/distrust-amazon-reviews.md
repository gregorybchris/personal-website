---
date: 2025-04-14
slug: distrust-amazon-reviews
title: Why You Shouldn't Trust Amazon Reviews
archived: false
status: draft
---

I'll get to Amazon reviews in a minute, but first, if you'll allow me, a quick gripe about shopping online in general.

The other day I was shopping for a new bed-side lamp. And even on sites of well-known, respectable brands (Ikea, Pottery Barn, etc.) it was hard to tell from the pictures if I'd be getting a quality product. Then I tried the classic "Best Lamps of 2025" listicles, but I had to imagine they were full of paid placements... [NYT Wirecutter](https://www.nytimes.com/wirecutter) had some fine options, but not quite the selection I was hoping for. From Google searches I stumbled across a few sites with artsy lamps in the <i>thousands</i> of dollars. Hey, no judgement if that's your thing, but I'm a simple man. I want a sturdy lamp that'll last me a few decades and not break the bank.

At least for me, this is a pretty common experience buying a product online. I have a rough dollar amount in mind that I think I should have to pay (given cost of materials, manufacturing, shipping, etc). And I want to find a product that meets my expectations for quality. But then I go online and I'm flooded with options, many of which are super high quality, but cost an arm and a leg, and many of which look potentially well-constructed at first, but upon closer inspection might crumble and break while in transit to my front door.

And we're not even considering style or personal taste here. Why is it that for every quality product at a reasonable price, there are ten others that are either overpriced or of dubious quality?

## Recommender systems

I think part of the reason we're in this situation is that the maintainers of the most common recommender systems for physical products (Amazon and others) benefit more from recommending a variety of things than they do from helping users find things calibrated to their quality and cost expectations.

Of course, the _most-true_ story is that while some companies thrive on great brand loyalty and customer trust, there's a whole ecosystem of retailers that succeed by selling high volume, low quality, cheap products that are marketed just well enough to get clicks and buys.

I'm a realist enough to know that in the free market there will always be a diversity of business models and there will always be pressures toward low quality products. But I'm an idealist enough to believe there's a hypothetical system that gives consumers the power to distinguish high from low quality.

Clearly Amazon reviews are an attempt at such a system, but obviously reviews can be gamed. You can buy fake reviews that artificially inflate a product's rating. And in the age of AI-generated text, it's extremely easy to generate realistic and diverse reviews (even images) at scale if you're willing to spend a bit of cash.

What would it look like if Amazon's recommender system were more aligned with the goals of users?

## Rating propagation

I've had an inkling of an idea for a while that you could estimate item's quality with user ratings and then measure rater reliability based on similarity to other raters. You could then promote or discount ratings based on rater reliability. What would emerge is a dynamical system where a single rating sends ripples through a network of items and users, updating estimates of both item quality and user reliability. The information from a single rating sort of diffuses outward and this is happening continuously as new ratings come in.

Further, I hoped that if I could make enough simplifying assumptions (like item ratings being normally distributed), there might be an efficient closed form solution that scales to many users and items. Perhaps with simple Bayesian updates, I could avoid updating every item and every user for each incoming rating.

I wasn't able to figure out a clean closed form solution, but during my research I stumbled across <a href="https://en.wikipedia.org/wiki/Belief_propagation#Gaussian_belief_propagation_(GaBP)" target="_blank">Gaussian belief propagation</a>, which is a message-passing algorithm for performing inference on graphical models with Gaussian distributions.<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup> And while I didn't up using this approach, it gave me some intuitions that informed the deep learning approach that I did take.

<!-- TODO: Add an animation of Gaussian distributions and message passing between them -->

## Deep learning

I trained a model called "TrueScore" to jointly learn item quality and user reliability from data. It's a simple model with parameters that scale linearly with the number of users and items. It also supports online learning so that new ratings can be incorporated into the model without retraining from scratch.

It's worth noting that TrueScore is not a recommender system and therefore does not measure how individual user preferences factor into ratings. TrueScore estimates the conditional probability that a user would rate an item highly given they already want or need that item.

## The math

For those who want the gory details, here's a derivation of the loss function used to train TrueScore.

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

Then, after some arithmetic, cancelling logs and exponents and ignoring constants, we find the the negative log-likelihood for a rating pair is:

$$
-\log p\bigl(r_{u,i}\mid x_i, \alpha_u\bigr) = \tfrac{1}{2}\log\bigl(\tfrac{1}{\alpha_u}\bigr)+\tfrac{1}{2}\alpha_u\bigl(r_{u,i}-x_i\bigr)^2
$$

Summing over all rating pairs $(u,i)$ in our training data yields the total negative log‐likelihood:

$$
\mathrm{NLL}(\mathbf{x}, \boldsymbol{\alpha}) = \sum_{(u,i)\in \text{data}}\Bigl[\tfrac{1}{2}\log\bigl(\tfrac{1}{\alpha_u}\bigr)+\tfrac{1}{2}\alpha_u(r_{u,i}-x_i)^2\Bigr]
$$

## Model training

We train with a simple PyTorch optimization loop, minimizing the average negative log-likelihood over batches of observed ratings. The bulk of the math is captured in the `forward()` method and the rest is either plumbing or handled by PyTorch.

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

To ensure user reliabilities remain positive, we optimize in log-space, learning $\log \alpha_u$ instead of $\alpha_u$ for each user. Item qualities $x_i$ are learned directly. After training for `500` epochs, with a batch size of `16`, and a static learning rate of `1e-2`, the model converges quickly to a stable solution (see Figure 1).

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/distrust-amazon-reviews/loss-curve.png?cache=1" width="450">
  <figcaption><strong>Figure 1: </strong>Loss curve &mdash; As expected, on synthetic data the learning curve is very smooth.</figcaption>
</figure>

## Outcomes

I was surprised to find (though I shouldn't have been) that it takes many ratings per item to get a high-confidence estimate of item quality. Given this constraint, it's unclear to me whether this model would be useful in practice.

I enjoyed building a full CRUD API into this project for storing users, items, and ratings. If you're interested in trying TrueScore and using your own data, give the API a spin.

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

As a follow-up I'd like to return to this idea and build more rigor into down-ranking users with lower reliability, either using Gaussian belief propagation or by factoring the user reliabilities from the TrueScore model into item quality estimates.

## Footnotes

<div id="footnotes">
  <div id="fn:fn1" class="footnote">
    <a class="fn" href="#fnref:fn1">[<span class="footnote-number">1</span>]</a>
    <span>I found this <a href="https://gaussianbp.github.io" target="_blank">cool demo of Gaussian belief propagation online.</a></span>
  </div>
</div>
