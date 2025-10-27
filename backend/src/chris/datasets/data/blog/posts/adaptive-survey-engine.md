---
date: 2024-08-24
slug: adaptive-survey-engine
title: Building an Adaptive Survey to Predict Everything
archived: false
---

Have you ever filled out a survey at the doctor's office and had to answer the same question multiple times? How about a survey where the answer should have been obvious based on your previous answers? A survey that was so long you just gave up halfway through?

Let's develop a survey that adapts to your previous answers. It asks the most broad questions first and then only asks more specific questions if necessary.

## Decision trees

We'll base our solution off two algorithms for building decision trees called the <a href="https://en.wikipedia.org/wiki/ID3_algorithm" target="_blank">ID3</a> and <a href="https://en.wikipedia.org/wiki/C4.5_algorithm" target="_blank">C4.5</a> algorithms.

These algorithms use the concepts of <a href="https://en.wikipedia.org/wiki/Entropy_(information_theory)" target="_blank">entropy</a> and <a href="https://en.wikipedia.org/wiki/Information_gain_(decision_tree)" target="_blank">information gain</a> to determine attributes (survey questions) that are most informative for predicting a target variable (the survey result).

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/adaptive-survey-engine/decision-tree.png?cache=2" width="500">
  <figcaption><strong>Figure 1: </strong>Decision tree -- There are more total questions than the longest path through the decision tree.</figcaption>
</figure>

### Entropy

The first concept we need to define is entropy, which we'll use to measure how mixed the answers are for a particular question. The intuition here is that we'd like to prompt the survey participant with questions that decrease the entropy in our target variable. If we get entropy down to zero, then we know with high confidence the result of the survey and can stop asking questions.

<!-- prettier-ignore -->
$$
H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x)
$$

```python
import numpy as np

def entropy(a: np.ndarray) -> float:
    h = 0.0
    for x in np.unique(a):
        p_x = np.sum(a == x) / a.shape[0]
        h -= p_x * np.log2(p_x)
    return float(h)
```

### Information gain

Next, we'll look at information gain, which measures how helpful it would be if the participant answered a particular question. Finding the question with the highest information gain is the key to building an adaptive survey.

<!-- prettier-ignore -->
$$
IG(D, A) = H(D) - \sum_{a \in A} p(a) \, H(S_a)
$$

- $D$ is the full dataset
- $A$ is the attribute we’re splitting on
- $a$ is a possible value of attribute $A$
- $D_a$ is the subset of $D$ where $A = a$
- $p(a) = \frac{|D_a|}{|D|}$ is the proportion of samples with $A = a$

```python
def information_gain(attribute: np.ndarray, target: np.ndarray) -> float:
    gain = entropy(target)
    for value in np.unique(attribute):
        target_subset = target[attribute == value]
        proportion = target_subset.shape[0] / target.shape[0]
        gain -= proportion * entropy(target_subset)
    return gain
```

> Note: This code has been simplified to work for categorical attributes as in the ID3 algorithm. The C4.5 algorithm extends this to work with continuous attributes as well.

### Selecting a question

We loop over all attributes, compute the information gain for each, select the attribute with the highest information gain, and present that question to the user. We repeat that process until attributes stop being informative (given some threshold) or we run out of attributes.

## Predicting everything

The paradox of the adaptive survey is that while each participant spends less time taking the survey, you are able to include more total questions in the survey, including questions that do not apply to a large portion of the population, but are highly informative for some individuals.

Imagine taking the adaptive survey to the extreme and including thousands or even millions of questions. With enough questions and participants you could create a survey that figures out the right questions to predict a huge range of target variables.

> GWAS (Genome-Wide Association Studies) are studies that look for associations between genetic variants and traits in large populations.

- We can p-hack our way to interesting psychological results.
- Which Friends character are you?
- OCEAN personality test
- Myers-Briggs personality test

## Wrapping up

Nobody likes to fill out long surveys, especially ones with obviously redundant questions. Surv is designed to keep participants engaged by minimizing the number of questions while maximizing the information gained from each question.

Survey length is especially important when the participant has a choice in whether to complete the survey. When filling out a medical intake form you may have no choice but to answer 100 questions, but for use cases like market research, product usability studies, job satisfaction surveys, or political polls, the length and precision of the survey can significantly affect the probability of survey completion. And low completion rate can lead to sample bias and decreased survey validity.

The full source code for this project is available on <a href="https://github.com/gregorybchris/surv" target="_blank">GitHub</a>.
