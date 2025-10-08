---
date: 2023-09-22
slug: evolutionary-algorithms-sports
title: Evolutionary Algorithms for Optimization in Sports
archived: false
---

I don't expect most readers will be very familiar with the sport of rowing. Maybe you have a vague idea of eight people in a boat, all facing the same direction, oars in hand, paddling in sync? Perhaps also you imagine a smaller person facing the rest yelling "stroke! stroke! stroke!" Well, that's all just about right -- except for the "stroke! stroke! stroke!" part. That would just be annoying.

A few years after moving to Seattle, I joined a <a href="https://lakeunioncrew.com" target="_blank">local rowing club</a>. And not long after that I saw a perfect opportunity to tarnish a pure and meditative outdoor activity with technology.

## Motivation

A group of 20 or so amateur rowers show up to practice each evening along with one or two coaches. Within 5-10 minutes at the beginning of practice, the coaches scramble to figure out which of the club's boats to use as well as which seats in which boats each rower in attendance should occupy.

For various reasons, these lineups cannot be determined ahead of time -- for one, these rowers are adults who value the flexibility to show up when they can.

Many factors and constraints go into determining lineups.

<!-- TODO: finish this -->

## Generating candidate lineups

### Partitioning

<!-- TODO: Explain knapsack dynamic programming quickly -->

### Filtering by equipment availability

Once we know all the different configurations of boat sizes that match the number of rowers at practice, we can filter out configurations that aren't possible given the equipment available.

## Genetic algorithm

The cat's out of the bag from the title. We're going to solve this with a genetic algorithm. The basic idea is to maintain a population of candidate solutions -- we'll call them <strong>agents</strong> -- evaluate their fitness, select the fittest individuals to be parents, and then produce a new generation of agents through crossover and mutation.

### Fitness function

The fitness function is only really understandable with some background on rowing. For that reason, this section can be found at the bottom of the post. For now, the important thing to know is that we can take a candidate lineup and compute a scalar value representing its fitness.

### Mutation & crossover

A standard practice in genetic algorithms is to apply mutation and crossover to the selected parents to produce a new generation of agents.

In our solution, crossover is tricky because two agents could have different numbers and sizes of boats. Instead, we'll just define mutation on an agent in order to increase diversity in the population each generation.

We'll define mutation as swapping the seats of two rowers. This could be between two different boats or within the same boat. One downside of this approach is that the boat sizes are fixed after the initial population and some configurations of boats may die out.

### Early stopping

Stop if no improvement in N generations

### Survival rate annealing

Survival rate annealing, similar to learning rate schedule

### Restarts

Restarts to avoid local minima

### Fitness gradient

Using fitness gradient - select individuals proportional to their fitness, sampled with replacement

## Fitness function penalties

I'll quickly list out some of the factors you can use to determine lineups, but you may choose to skip over this section.

Penalities applied to lineups that decrease their fitness:

- An un-coxed boat with an inexperienced bow seat
- A coxed boat with an experienced coxswain
- A boat with a rower in the coxswain seat
- A rower in stroke seat with low experience stroking
- A rower that prefers sweep to scull in a sculling boat
- A rower that prefers scull to sweep in a sweep boat
- A rower in a sweep boat that prefers starboard to port in a port seat
- A rower in a sweep boat that prefers port to starboard in a starboard seat
- A rower that tends to be in stern/middle/bow of the boat in a different section
- A boat with a rower that doesn't match the weight class of the boat
- A practice that has many boats

Some factors may play a role at some rowing clubs and not others. The following won't be used in our solution either because they're trickier to implement or they're simply not relevant for my rowing club:

- Matching pairs of rowers in sweep boats who have similar stroke styles or strengths
- Balancing the weight distribution in the boat to avoid drag on the bow
- Keeping boats either a single gender or mixed
- Prioritizing lineups that have an upcoming race
- Giving an athlete experience in a new position
