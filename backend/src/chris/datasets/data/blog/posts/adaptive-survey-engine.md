---
date: 2024-08-24
slug: adaptive-survey-engine
title: Building an Adaptive Survey to Predict Everything
archived: false
status: draft
---

Have you ever filled out a survey at the doctor's office and had to answer the same question multiple times? How about a survey where the answer should have been obvious based on your previous answers? A survey that was so long you just gave up halfway through?

Let's develop an intelligent survey that adapts to your previous answers. It asks the most broad questions first and then only asks more specific questions if necessary. Then we'll expand our survey to include improbable questions and mine for unexpected outcomes.

## Decision trees

We'll base our solution off two algorithms for building decision trees called the <a href="https://en.wikipedia.org/wiki/ID3_algorithm" target="_blank">ID3</a> and <a href="https://en.wikipedia.org/wiki/C4.5_algorithm" target="_blank">C4.5</a> algorithms.

These algorithms use the concepts of <a href="https://en.wikipedia.org/wiki/Entropy_(information_theory)" target="_blank">entropy</a> and <a href="https://en.wikipedia.org/wiki/Information_gain_(decision_tree)" target="_blank">information gain</a> to determine attributes (survey questions) that are most informative for predicting a target variable (the survey result).

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/adaptive-survey-engine/decision-tree.svg?cache=1" width="500">
  <figcaption><strong>Figure 1: </strong>Decision tree &mdash; Medical triage is like a tree where each question narrows down the possible diagnoses until we can predict the urgency of treatment.</figcaption>
</figure>

### Entropy

The first concept we need to define is **entropy**, which we'll use to measure how mixed the answers are for a particular question. We'd like to prompt the survey participant with questions that decrease the entropy in our target variable. The faster we get entropy down to zero, the sooner we know with high confidence the result of the survey and can stop asking questions.

<!-- prettier-ignore -->
$$
H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x)
$$

For simplicity, these code snippets focus on categorical data and don't cover entropy over continuous attributes<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup>.

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

Next, we'll look at **information gain**, which measures how helpful it would be if the participant answered a particular question. Finding the question with the highest information gain is the key to building an adaptive survey.

<!-- prettier-ignore -->
$$
IG(D, A) = H(D) - \sum_{a \in A} p(a) \, H(S_a)
$$

- $D$ is the full dataset -- all previous survey responses
- $A$ is the attribute we’re splitting on -- the question we’re asking
- $a$ is a possible value of attribute $A$ -- an answer to a question
- $D_a$ is the subset of $D$ where $A = a$
- $p(a) = \frac{|D_a|}{|D|}$ is the proportion of samples with $A = a$

We don't know which of the possible answers to attribute $A$ the participant will give, so we take a weighted average over the possible answers. The information gain is the (expected) difference in entropy before and after asking the question.

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

We loop over all attributes, compute the information gain for each, select the attribute with the highest information gain, and present that question to the survey taker. We repeat that process until attributes stop being informative (based on a threshold) or we run out of attributes.

And that's all of it! There's a bit of math to it, but at the end of the day, not so complicated.

## Predicting everything

Ok, now let's get ambitious. Let's get _extreme_. What could we do if we had a survey where survey taker effort doesn't scale with the number of questions?

The paradox of the adaptive survey is that while each participant spends less time taking the survey, you are able to include more total questions in the survey, including questions that do not apply to a large portion of the population, but are highly informative for some individuals.

With enough questions and participants you could create a survey that figures out the right questions to predict a huge range of target variables. It's like a GWAS (<a href="https://en.wikipedia.org/wiki/Genome-wide_association_study" target="_blank">Genome-Wide Association Study</a>) for psychology, something that must already exist in some form<sup id="fnref:fn2"><a class="fnref" href="#fn:fn2">[2]</a></sup>.

The vast majority of our questions don't even have to be good, but now and then we may uncover an unlikely gem of a question that is surprisingly predictive of some outcome. Maybe that outcome is something fun like "Which <a href="https://en.wikipedia.org/wiki/Friends" target="_blank">Friends</a> character are you?" Or maybe it's something more scientific, "What is your <a href="https://en.wikipedia.org/wiki/Big_Five_personality_traits" target="_blank">OCEAN</a> personality type?" I personally really like the <a href="https://www.nytimes.com/interactive/2014/upshot/dialect-quiz-map.html" target="_blank">New York Times Dialect Quiz</a> that predicts where in the US you are from based on how you speak.

Of course, there is a huge amount of <a href="https://en.wikipedia.org/wiki/Data_dredging" target="_blank">p-hacking</a> going on here, so any interesting correlations we find would need to be validated with a separate study, but the adaptive survey could be a powerful tool for hypothesis generation.

## Wrapping up

The full source code for this project is available on <a href="https://github.com/gregorybchris/surv" target="_blank">GitHub</a>.

## Footnotes

<div id="footnotes">
  <div id="fn:fn1" class="footnote">
    <a class="fn" href="#fnref:fn1">[<span class="footnote-number">1</span>]</a>
    <span>The C4.5 algorithm extends the ID3 algorithm to handle continuous features. Entropy of a continuous features is calculated by iterating over each numeric value and calculating entropy of the target for all target values where the attribute is greater than the threshold.</span>
  </div>

  <div id="fn:fn2" class="footnote">
    <a class="fn" href="#fnref:fn2">[<span class="footnote-number">2</span>]</a>
    <span>A brief literature review turned up <a href="https://www.icpsr.umich.edu/web/ICPSR/series/203" target="_blank">MIDUS</a>, <a href="https://www.europeansocialsurvey.org/findings/europeans-wellbeing/drivers-wellbeing" target="_blank">ESS</a>, and <a href="https://openpsychometrics.org/_rawdata/" target="_blank">OpenPsychometrics</a>.</span>

  </div>
</div>
