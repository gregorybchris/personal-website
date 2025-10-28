---
date: 2023-09-22
slug: evolutionary-algorithms-sports
title: Evolutionary Algorithms for Optimization in Sports
archived: false
status: published
---

I expect most readers won't be intimately familiar with the sport of rowing. But maybe you have a vague idea of eight people in a boat, facing the same direction, long oars in hand, paddling in sync, racing against other boats? If you can picture that, then you've got the prerequisite understanding to follow along with this post.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/evolutionary-algorithms-sports/rowing.jpg?cache=1" width="450">
  <figcaption><strong>Figure 1: </strong>Eight rowers in a boat. (Bonus points if you can tell which little blob is me)</figcaption>
</figure>

A few years after moving to Seattle, I joined a <a href="https://lakeunioncrew.com" target="_blank">local rowing club</a>. And not long after that I saw a perfect opportunity to tarnish a pure and meditative outdoor activity with technology. There was a problem at the boathouse and I _needed_ to see if a computer could help solve it.

## Motivation

Let me quickly walk you through the setup. Each evening at the rowing club, a group of 20 or so amateur rowers and one or two coaches show up to practice. In the first 5-10 minutes, the coaches scramble to figure out who will sit in which seats of which boats. It's a race against the clock as the last minute logistics eat into practice time.

It's not an easy job either, to figure out who should go in which boat. Many factors contribute to what makes a lineup fast, safe, and fun. Some positions in the boat require certain skills to execute safely, some rowers have preferences for the kind and size of boat they row in, and the speed of the boat can be drastically increased if you get the order of rowers just right.

To recap, we have:

1. a huge number of possible boat configurations
2. a pile of messy and interdependent constraints
3. a very short amount of time to find a solution

### Example lineup

To help you visualize our end goal, here's a hypothetical lineup that a coach might cook up for a practice with 26 rowers. In capital letters are boat names and next to them are the names of the oars to use. The `c` represents the coxswain, who steers the boat and helps keep the rowers in sync. And finally, as is tradition, the rowers are numbered from high to low and from stern to bow.

```txt
THE OLD MAN HAROLD // Yellow Oars
c Leon
8 Brandon
7 Carmen
6 Kendra
5 Quentin
4 Farid
3 Gianna
2 Elena
1 Mei

MISS EDNA // Red Oars
c Xia
8 Winston
7 Rosa
6 Priya
5 Zane
4 Yara
3 Satoshi
2 Talia
1 Hiro

CAPTAIN MABEL // Blue Oars
4 Javier
3 Aisha
2 Omar
1 Umar

GENTLE GEORGE // Pink Oars
4 Valeria
3 Noah
2 Darius
1 Imani
```

## Generating candidate lineups

Before we can crafting a lineup that is _good_, let's first solve the easier problem of generating a lineup that is _theoretically_ rowable.

### Partitioning

First, let's figure out all the different ways we can fit rowers into boats. The canonical form of this problem is a cousin of the <a href="https://en.wikipedia.org/wiki/Knapsack_problem" target="_blank">knapsack problem</a> called the <a href="https://en.wikipedia.org/wiki/Subset_sum_problem" target="_blank">subset sum problem</a>.

We use dynamic programming to efficiently figure out all the ways we can pack a given number of rowers into boats of specified sizes.

```python
Partition = dict[int, int]

def get_partitions(coxed_boat_sizes: list[int], n_rowers: int) -> list[Partition]:
    # Set up dynamic programming table
    partitions: list[list[Partition]] = [[] for _ in range(n_rowers + 1)]
    partitions[0].append({})

    for size in coxed_boat_sizes:
        for amount in range(size, n_rowers + 1):
            for partition in partitions[amount - size]:
                new_partition = partition.copy()
                if size not in new_partition:
                    new_partition[size] = 0
                new_partition[size] += 1
                partitions[amount].append(new_partition)

    return partitions[n_rowers]
```

### Filtering by equipment availability

Not every partition is valid, however. Perhaps the club only has 5 doubles. That disqualifies the lineup where we take out 6 doubles, for example.

<figure id="figure2">
  <img src="https://storage.googleapis.com/cgme/blog/posts/evolutionary-algorithms-sports/abstract-rowing-shells.svg?cache=1" width="450">
  <figcaption><strong>Figure 2: </strong>Rowing shell sizes &mdash; These are the primary boat classes you will see most often. Less commonly you'll also encounter straight fours (4-, with no coxswain) and coxed pairs (2+, with a coxswain).</figcaption>
</figure>

Next, we filter down our partitions to only those that are feasible given the equipment available at the boathouse.

```python
def filter_partitions_by_availability(
    partitions: Iterable[Partition],
    coxed_size_map: dict[int, int],
) -> Iterator[Partition]:
    for partition in partitions:
        for coxed_size, count in partition.items():
            # Check that we have enough of each boat size in the partition
            if count > coxed_size_map[coxed_size]:
                break
        else:
            yield partition
```

If we assume we have 26 rowers at practice and the boathouse has 5 doubles, 4 quads, and 3 eights, then we only have 4 viable partitions (down from 10 partitions before filtering).

- 5 doubles, 4 quads
- 4 doubles, 2 eights
- 2 doubles, 1 quad, 2 eights
- 2 quads, 2 eights

## Genetic algorithm

We now have a method for generating candidate lineups that are theoretically rowable, but as discussed earlier, we'd really like the lineups to adhere to our constraints and be fast, safe, and fun. If you read the title of this post, you can guess what's coming next.

We're going to solve this with a genetic algorithm. The basic idea is to maintain a "population" of candidate lineups. In the world of genetic algorithms, each lineup would be called an "agent" or "individual". We'll construct a function that measures the "fitness" of each lineup, select only the fittest individuals to persist into the next generation of the population, and repeat this process until the fitness of lineups stops improving.

> As a brief implementation detail, we initialize our population of lineups by randomly selecting a viable partition and then randomly shuffling the rowers across the boats.

### Fitness function

The fitness function should really be the first thing we define when writing a genetic algorithm. Unfortunately the fitness function for this application is really only understandable with some deeper background on rowing. For that reason, I recommend skipping over this section, which I have relocated to the <a href="#postscript-fitness-function-for-real">bottom of the post</a>. For now, the important thing to know is that we can take a candidate lineup and compute a scalar value representing how preferable it is.

### Mutation & crossover

How does each generation create "offspring" lineups? A standard practice in genetic algorithms is to apply mutation and crossover to the selected parents to produce a new generation of individuals.

In our rowing scenario, crossover isn't trivial to implement because two lineups could have different numbers and sizes of boats. Through testing I found that mutation provides sufficient diversity for selection to act on and crossover isn't actually needed. Let's define mutation as simply swapping the seats of two rowers.

```python
import random

Boat = list[str]
Lineup = list[Boat]

def swap(boat_a: Boat, boat_b: Boat, idx_a: int, idx_b: int) -> None:
    boat_a[idx_a], boat_b[idx_b] = boat_b[idx_b], boat_a[idx_a]

def mutate(lineup: Lineup) -> Lineup:
    boat_idx_a = random.randint(0, len(lineup) - 1)
    boat_idx_b = random.randint(0, len(lineup) - 1)
    rower_idx_a = random.randint(0, len(lineup[boat_idx_a]) - 1)
    rower_idx_b = random.randint(0, len(lineup[boat_idx_b]) - 1)
    new_lineup = [boat.copy() for boat in lineup]
    swap(new_lineup[boat_idx_a], new_lineup[boat_idx_b], rower_idx_a, rower_idx_b)
    return new_lineup
```

A downside of this method is that once a partition of boat sizes "dies out" we cannot get it back. We also cannot introduce a new partition that wasn't present in the initial population. However, other than partitions being fixed, all other sources of variation are possible through mutation alone.

This is all we need to get things working! Each generation we can select the top k% of lineups by fitness and replace the rest of the population with mutated versions of the top k%.

## Further improvements

With the basic genetic algorithm in place, we can now explore some improvements to speed up convergence to a good solution.

### Early stopping

The first improvement is to halt optimization if the highest fitness score of any lineup in the population hasn't improved over several generations.

```txt
--------------------------------------
 1657 |  @
 1578 |
 1500 |
 1422 |   @
 1343 |
 1265 |
 1187 |    @
 1108 |
 1030 |     @
  952 |
  874 |      @
  795 |
  717 |       @
  639 |
  560 |        @
  482 |         @
  404 |          @
  325 |           @@@
  247 |              @@
  169 |                @@
   91 |                  @@@@@@@@@@@@@
--------------------------------------
```

In this plot you can see the fitness score hitting ~91 and then plateauing. After ~10 generations of little improvement, we stop early and avoid wasting compute.

### Simulated annealing

Another trick that seriously improves our convergence to an optimal solution is a technique called simulated annealing. Early in our optimization process we want to explore a wide variety of lineups and avoid losing diversity, so we'll throw out only a small fraction of the population. As we get more confident we have a good solution, we can be more aggressive and fill out the population with mutations of only a few of the fittest lineups.

```python
survival_rate = (init - base) * (decay ** generation) + base
```

> This works similarly to a learning rate schedule during gradient descent in machine learning. At first, you explore by jumping around the loss landscape, but as you get closer to a minimum you take smaller and smaller steps, preferring a strategy with more exploitation.

### Fitness proportional selection

As briefly mentioned at the end of the <a href="#mutation-crossover">mutation & crossover</a> section, the most naïve selection approach is to retain the top k% of the population. In the literature, this is called <a href="https://en.wikipedia.org/wiki/Truncation_selection" target="_blank">truncation selection</a>.

A more sophisticated approach, called <a href="https://en.wikipedia.org/wiki/Fitness_proportionate_selection" target="_blank">fitness proportionate selection</a> (aka "roulette wheel selection"), selects each individual with probability proportional to its fitness.

```python
import numpy as np

def to_probabilities(a: np.ndarray) -> np.ndarray:
    a = a - a.min()  # Ensure all scores positive
    a_sum = a.sum()  # Divide by sum so scores sum to 1
    return a * 1.0 / a_sum if a_sum > 0 else np.ones_like(a) / len(a)

def fitness_proportional_selection(lineups: list[Lineup], scores: list[float], k: int) -> list[Lineup]:
    p = to_probabilities(np.array(scores))
    indices = np.random.choice(np.arange(len(lineups)), size=k, p=p, replace=True)
    return [lineups[i] for i in indices]
```

Using this method, even low fitness lineups have a chance at being selected, increasing diversity in the population. High fitness lineups can be selected multiple times, which helps us exploit<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup> the information we have about which lineups might be the best.

### Restarts

For our last improvement we'll implement a simple, but powerful trick. We start by noticing that the initial population is comprised of a small number of configurations samples from a large configuration space. Sometimes we get lucky and the initial population contains good building blocks for a strong solution. Other times we're not so lucky.

To mitigate this, we'll restart the entire genetic algorithm from scratch a few times<sup id="fnref:fn2"><a class="fnref" href="#fn:fn2">[2]</a></sup> and take the best solution we find. This increases our chances of finding a good solution by searching the configuration space more thoroughly.

## Wrapping up

We've discussed how to sample valid yet suboptimal lineups to seed a genetic algorithm as well as some tricks for making the genetic algorithm converge to a good solution quickly.

Maybe as a follow-up it would be worth trying a SAT solver or integer programming, but this approach can generate lineups in under a minute, which is good enough to call the problem solved.

### Postscript: fitness function for real

This part may be of interest to readers more familiar with rowing.

We define our fitness function in terms of penalties, heuristics for undesirable lineup characteristics. We tune our genetic algorithm by updating the weights on each penalty. This can be done manually or with historical lineup data.

- A coxed boat with an inexperienced coxswain
- An un-coxed boat with an inexperienced bow seat
- A rower in stroke seat with low experience stroking
- A rower with a sweep or scull preference not being met
- A rower with a port or starboard preference not being met in a sweep boat
- A rower that tends to be in stern/middle/bow of the boat in a different section
- A rower that doesn't fit the weight class of their boat
- A lineup that has many boats

There are other obvious factors that I have not implemented either because they're difficult to quantify or simply not relevant for my rowing club.

- Prioritizing lineups that have an upcoming race
- Matching up pairs of rowers in sweep boats who have similar stroke styles or power
- Balancing the weight distribution in the boat to avoid drag on the bow
- Keeping boats either a single gender or mixed
- Giving an athlete experience in a new position

## Footnotes

<div id="footnotes">
  <div id="fn:fn1" class="footnote">
    <a class="fn" href="#fnref:fn1">[<span class="footnote-number">1</span>]</a>
    <span>I really love this trick because it's similar to gradient ascent with respect to the fitness function, but technically we're approximating a gradient with respect to the population distribution (in frequency space), not the fitness function itself. We take a natural gradient step in the steepest direction that respects our normalized probability distribution over individual fitness scores.</span>
  </div>

  <div id="fn:fn2" class="footnote">
    <a class="fn" href="#fnref:fn2">[<span class="footnote-number">2</span>]</a>
    <span>Unlike other tricks discussed here, this one can be parallelized easily, so restarts do not significantly slow down optimization when implemented efficiently.</span>
  </div>
</div>
