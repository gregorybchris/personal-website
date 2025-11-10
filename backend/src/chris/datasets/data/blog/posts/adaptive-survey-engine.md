---
date: 2024-08-24
slug: adaptive-survey-engine
title: Building an Adaptive Survey to Predict Everything
archived: false
status: published
---

Have you ever filled out a intake form at the doctor's office and had to answer the same question multiple times? How about a survey question where the answer should have been obvious based on your previous answers? A questionnaire that was so long you just gave up halfway through?

Let's develop an intelligent survey that adapts to your previous answers. It asks the most broad questions first and then only asks more specific questions when relevant.

As for what I mean by "predict everything" I'll get to that in just a sec!

## Decision trees

Decision trees, built with the <a href="https://en.wikipedia.org/wiki/ID3_algorithm" target="_blank">ID3</a> and <a href="https://en.wikipedia.org/wiki/C4.5_algorithm" target="_blank">C4.5</a> algorithms, use the math of information theory to select attributes from a dataset that are the most informative. We can use this same approach to select questions from a survey that are the least redundant.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/adaptive-survey-engine/decision-tree.svg?cache=4" width="500">
  <figcaption><strong>Figure 1: </strong>Decision tree &mdash; Medical triage is like a tree where each question narrows down the possible diagnoses until we can predict the urgency of treatment.<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup></figcaption>
</figure>

### Entropy

The first concept we need to define is **entropy**, which measures how uncertain we are about how a survey participant would respond to a question. We'd like to prompt the participant with questions that decrease entropy. The faster we get entropy down to zero, the sooner we can stop asking questions.

<!-- prettier-ignore -->
$$
H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x)
$$

For simplicity, these code snippets focus on categorical data and don't cover entropy over continuous attributes<sup id="fnref:fn2"><a class="fnref" href="#fn:fn2">[2]</a></sup>. Fortunately, this will work totally fine for multiple choice or yes/no survey questions.

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

Next, we'll look at **information gain**, which measures how much we expect to learn if the participant answers a particular question. Finding the question with the highest information gain is the key to building an adaptive survey.

<!-- prettier-ignore -->
$$
IG(D, A) = H(D) - \sum_{a \in A} p(a) \, H(S_a)
$$

- $D$ is the full dataset -- all previous survey responses
- $A$ is the attribute we’re splitting on -- the question we’re asking
- $a$ is a possible value of attribute $A$ -- an answer to a question
- $D_a$ is the subset of $D$ where $A = a$
- $p(a) = \frac{|D_a|}{|D|}$ is the proportion of samples with $A = a$

We don't know which of the possible answers to attribute $A$ the participant will give, so we take a weighted average over the possible answers. The information gain is the expected difference in entropy before and after asking the question.

```python
def information_gain(attribute: np.ndarray, target: np.ndarray) -> float:
    gain = entropy(target)
    for value in np.unique(attribute):
        target_subset = target[attribute == value]
        proportion = target_subset.shape[0] / target.shape[0]
        gain -= proportion * entropy(target_subset)
    return gain
```

## Selecting a question

The only thing left to do is use entropy and information gain to select questions. It's a fairly simple algorithm.

1. Loop over all attributes
2. Compute the information gain for each
3. Select the attribute with the highest information gain
4. Repeat steps 1-3 until either
   1. Information gain for all attributes drops below some threshold (configurable)
   2. All attributes in the dataset have already been selected

And that's all of it! There's a bit of math to it, but at the end of the day, not so complicated. Now we have an adaptive survey engine that avoids asking questions that don't teach us anything.

## Predicting everything

Ok, now that we hav the basics, let's think about ambitious applications. What could we do if survey taker effort didn't scale with the number of questions?

The paradox of the adaptive survey is that while each participant spends less time taking the survey, you are able to include more total questions in the survey, including questions that do not apply to a large portion of the population, but are highly informative for some individuals.

With enough questions and participants you could create a survey that selects the right questions to predict a huge range of target variables. It's like a <a href="https://en.wikipedia.org/wiki/Genome-wide_association_study" target="_blank">genome-wide association study</a> for psychology (something that must already exist in some form that I'm not aware of<sup id="fnref:fn3"><a class="fnref" href="#fn:fn3">[3]</a></sup>).

The vast majority of our questions don't even have to be good, but now and then we may uncover an unlikely gem of a question that is surprisingly predictive of some outcome. Maybe that outcome is something fun like "Which <a href="https://en.wikipedia.org/wiki/Friends" target="_blank">Friends</a> character are you?" Or maybe it's something more scientific, "What is your <a href="https://en.wikipedia.org/wiki/Big_Five_personality_traits" target="_blank">OCEAN</a> personality type?" I personally really like the <a href="https://www.nytimes.com/interactive/2014/upshot/dialect-quiz-map.html" target="_blank">New York Times Dialect Quiz</a> that predicts where in the US you are from based on how you speak.

You could use this as part of the matching algorithm for a serious dating app. Or help high school and college students think about potential careers based on their interests and personality traits.

Of course, there is a huge amount of <a href="https://en.wikipedia.org/wiki/Data_dredging" target="_blank">p-hacking</a> going on here, so any interesting correlations we find would need to be validated with a separate study, but the adaptive survey could be a really powerful tool for hypothesis generation.

## Wrapping up

I built this survey engine because often a random question pops into my head that feels like it would split the population in an interesting way. I don't have a target variable in mind to predict. I just have a feeling that the responses to my question might be correlated to something interesting. Of course, the vast majority of these ideas will correlate with nothing very special at all. And yet, there's hope that one needle in the haystack will lead to a grand discovery.

<github-button user="gregorybchris" repo="surv"></github-button>

## Footnotes

<div id="footnotes">
  <div id="fn:fn1" class="footnote">
    <a class="fn" href="#fnref:fn1">[<span class="footnote-number">1</span>]</a>
    <span>I'm not a doctor and have no idea how medical triage actually works.</span>
  </div>

  <div id="fn:fn2" class="footnote">
    <a class="fn" href="#fnref:fn2">[<span class="footnote-number">2</span>]</a>
    <span>The C4.5 algorithm extends the ID3 algorithm to handle continuous features. Entropy of a continuous features is calculated by iterating over each numeric value and calculating entropy of the target for all target values where the attribute is greater than the threshold.</span>
  </div>

  <div id="fn:fn3" class="footnote">
    <a class="fn" href="#fnref:fn3">[<span class="footnote-number">3</span>]</a>
    <span>A brief literature review turned up <a href="https://www.icpsr.umich.edu/web/ICPSR/series/203" target="_blank">MIDUS</a>, <a href="https://www.europeansocialsurvey.org/findings/europeans-wellbeing/drivers-wellbeing" target="_blank">ESS</a>, and <a href="https://openpsychometrics.org/_rawdata/" target="_blank">OpenPsychometrics</a>.</span>
  </div>
</div>
