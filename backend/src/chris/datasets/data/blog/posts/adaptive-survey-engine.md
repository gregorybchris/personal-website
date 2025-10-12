---
date: 2024-08-24
slug: adaptive-survey-engine
title: Building an Adaptive Survey to Predict Everything
archived: false
---

- GWAS (Genome-Wide Association Studies) are studies that look for associations between genetic variants and traits in large populations. We can p-hack our way to interesting psychological results.
- Surveys can be much smarter if they adapt themselves mid-survey based on previous answers.

Program to dynamically select survey questions based on previous answers using information theory. The ID3 and C4.5 algorithms were used as inspiration for this program, which uses entropy and information gain to compute the feature most likely to help predict a target variable.

The full source code for this project is available on <a href="https://github.com/gregorybchris/surv" target="_blank">GitHub</a>.
