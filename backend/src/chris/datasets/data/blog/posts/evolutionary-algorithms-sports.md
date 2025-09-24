---
date: 2023-09-22
slug: evolutionary-algorithms-sports
title: Evolutionary Algorithms for Optimization in Sports
archived: false
---

I don't expect most readers will be super familiar with the sport of rowing. Perhaps you have a vague idea of eight people in a boat, all facing the same direction, oars in hand, paddling in sync. Perhaps also a smaller person facing the rest yelling "stroke! stroke! stroke!" Well, that's about right, except for the "stroke! stroke! stroke!" part.

A few years after moving to Seattle, I joined a <a href="https://lakeunioncrew.com" target="_blank">local rowing club</a>. And not long after that I saw an opportunity to put computers and rowing together.

## The problem

The problem we want to solve is we have a group of rowers that show up to a practice and we want to quickly assign them to seats in boats. However, there are <i>many</i> factors to consider. So many factors go into making good boat lineups that it's hard to imagine going off anything but intuition. A computer program just seems intractable.

## Optimization

- Early stopping - stop if no improvement in N generations
- Survival rate annealing, similar to learning rate schedule
- Restarts to avoid local minima
- Using fitness gradient - select individuals proportional to their fitness, sampled with replacement

## Settings

- Small boats mode
- Fours mode

## Rower profile

- Measurements (height, weight)
- Abilities (bow, stroke, cox)
- Side preference (port, starboard, none)
- Oar type preference (sweep, scull, none)
- Boat end tendency (bow, stroke, none)
- Gender

## Generation

- Sample boat, oars, rowers
- Finding partitions with knapsack problem
- Filtering by boat availability
