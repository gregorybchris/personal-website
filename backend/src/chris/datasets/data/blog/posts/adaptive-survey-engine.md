---
date: 2024-08-24
slug: adaptive-survey-engine
title: Building an Adaptive Survey to Predict Everything
archived: false
---

Have you ever filled out a survey at the doctor's office and had to answer the same question multiple times? How about a survey where the answer should have been obvious based on your previous answers? A survey that was so long you just gave up halfway through?

Let's develop a survey that adapts to your previous answers. It asks the most broad questions first and then only asks more specific questions if necessary.

## Decision trees

Program to dynamically select survey questions based on previous answers using information theory. The ID3 and C4.5 algorithms were used as inspiration for this program, which uses entropy and information gain to compute the feature most likely to help predict a target variable.

As you answer questions on a Surv survey, the expected information gain is recalculated, determining which question to present next. In most cases you don't need to fill out every question in the survey before results are known to a high degree of confidence.

### Entropy

<!-- prettier-ignore -->
$ H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x) $

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

<!-- prettier-ignore -->
$$ IG(D, A) = H(D) - \sum_{a \in A} p(a) \, H(S_a) $$

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

### Selecting a question

We loop over all attributes, compute the information gain for each, select the attribute with the highest information gain, and present that question to the user. We repeat that process until attributes stop being informative (given some threshold) or we run out of attributes.

## Predicting everything

- GWAS (Genome-Wide Association Studies) are studies that look for associations between genetic variants and traits in large populations. We can p-hack our way to interesting psychological results.
- Which Friends character are you?
- OCEAN personality test
- Myers-Briggs personality test

Nobody likes to fill out long surveys, especially ones with obviously redundant questions. Surv is designed to keep participants engaged by minimizing the number of questions while maximizing the information gained from each question.

## Wrapping up

Survey length is especially important when the participant has a choice in whether to complete the survey. When filling out a medical intake form you may have no choice but to answer 100 questions, but for use cases like market research, product usability studies, job satisfaction surveys, or political polls, the length and precision of the survey can significantly affect the probability of survey completion. And low completion rate can lead to sample bias and decreased survey validity.

The paradox of the adaptive survey is that while each participant spends less time taking the survey, you are able to include more total questions in the survey, including questions that do not apply to a large portion of the population, but are highly informative for some individuals.

The full source code for this project is available on <a href="https://github.com/gregorybchris/surv" target="_blank">GitHub</a>.
