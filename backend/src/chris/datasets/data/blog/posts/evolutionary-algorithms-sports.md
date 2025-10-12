---
date: 2023-09-22
slug: evolutionary-algorithms-sports
title: Evolutionary Algorithms for Optimization in Sports
archived: false
---

I expect most readers won't be intimately familiar with the sport of rowing. But maybe you have a vague idea of eight people in a boat, facing the same direction, long oars in hand, paddling in sync, racing against other boats? If you can picture that, then you've got the prerequisite understanding to follow along with this post.

## Motivation

A few years after moving to Seattle, I joined a <a href="https://lakeunioncrew.com" target="_blank">local rowing club</a>. And not long after that I saw a perfect opportunity to tarnish a pure and meditative outdoor activity with technology. There was a problem at the boathouse and I _needed_ to see if a computer could help solve it.

Each evening at the rowing club, a group of 20 or so amateur rowers and one or two coaches show up to practice. In the first 5-10 minutes, the coaches scramble to figure out who will sit in which seats of which boats. It's a race against the clock as the last minute logistics eat into practice time.

It's not an easy job either, to figure out who should go in which boat. Many factors contribute to what makes a lineup fast, safe, and fun. Some positions in the boat require certain skills to execute safely, some rowers have preferences for the kind and size of boat they row in, and the speed of the boat can be drastically increased if you get the order of rowers just right.

To recap, we have:

1. a huge number of possible configurations to search through
2. a pile of messy and interdependent constraints
3. a very short amount of time to come up with a solution

### Example lineup

To keep things concrete, here's an example of what coaches might come up with for a practice with 26 rowers. In capital letters are boat names, next to them are the names of the oars to use, and `c` represents the coxswain, who steers the boat and helps keep the rowers in sync.

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
1 MeZ

MISS EDNA // Red Oars
c Xia
8 Winston
7 Rosa
6 Priya
5 Zane
4 Yara
3 Satoshi
2 Talia
1 Hi N

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

### Partitioning

The first step in generating potential lineups is to figure out all the different ways we can fit rowers into boats. The canonical solution is a cousin of the <a href="https://en.wikipedia.org/wiki/Knapsack_problem" target="_blank">knapsack problem</a> called the <a href="https://en.wikipedia.org/wiki/Subset_sum_problem" target="_blank">subset sum problem</a>.

The following code computes all the different ways we can partition a given number of rowers into boats of specified sizes.

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

Not every partition is valid, however. Perhaps the club only has 2 fours. That will rule out all partitions with more than 2 fours.

### Filtering by equipment availability

We can filter down our partitions to only those that are feasible given the equipment available at the boathouse.

```python
def iter_partitions_by_availability(
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

If we assume we have 26 rowers at practice and the boathouse has 5 doubles, 4 quads, 2 fours, and 3 eights, we get a list of possible partitions that we have the equipment to support:

- 5 doubles, 4 quads
- 4 doubles, 2 quads, 2 fours
- 2 doubles, 3 quads, 2 fours
- 4 quads, 2 fours
- 4 doubles, quads, 1 four, 1 eight
- 2 doubles, 2 quads, 1 four, 1 eight
- 3 quads, 1 four, 1 eight
- 4 doubles, 2 eights
- 2 doubles, 1 quad, 2 eights
- 2 quads, 2 eights

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
