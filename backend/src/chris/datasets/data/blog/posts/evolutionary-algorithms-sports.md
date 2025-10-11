---
date: 2023-09-22
slug: evolutionary-algorithms-sports
title: Evolutionary Algorithms for Optimization in Sports
archived: false
---

I don't expect most readers will be very familiar with the sport of rowing. Maybe you have a vague idea of eight people in a boat, all facing the same direction, oars in hand, paddling in sync? Perhaps also you imagine a smaller person facing the rest yelling "stroke! stroke! stroke!" Well, that's all just about right -- except for the "stroke! stroke! stroke!" part. That would just be annoying.

A few years after moving to Seattle, I joined a <a href="https://lakeunioncrew.com" target="_blank">local rowing club</a>. And not long after that I saw a perfect opportunity to tarnish a pure and meditative outdoor activity with technology. There was a problem at the boathouse and I needed to see if a computer could help solve it.

## Motivation

At this club where I'm a member, each evening, a group of 20 or so amateur rowers show up to practice along with one or two coaches. In the first 5-10 minutes of each practice, the coaches scramble to figure out who will sit in which seats of which boats.

Many factors go into determining whether a lineup is good enough to go out onto the water. And for various reasons, these lineups cannot be determined ahead of time. So we have a huge number of possible configurations to search through in a very short amount of time.

<!-- TODO: finish this -->

Here's an example of a lineup generated. You can imagine that with only 26 rowers there are many ways you could swap two people.

```txt
THE OLD MAN HAROLD // Yellow
c Leon
8 Brandon
7 Carmen
6 Kendra
5 Quentin
4 Farid
3 Gianna
2 Elena
1 MeZ

MISS EDNA // Red
c Xia
8 Winston
7 Rosa
6 Priya
5 Zane
4 Yara
3 Satoshi
2 Talia
1 Hi N

CAPTAIN MABEL // Blue
4 Javier
3 Aisha
2 Omar
1 Umar

GENTLE GEORGE // Pink
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

If we assume we have 26 rowers at practice and the boathouse has 5 doubles, 4 quads, 2 fours, and 3 eights, we can filter down our partitions to only those that are feasible:

- 5 doubles, 4 quads
- 4 doubles, 2 quads, 2 fours
- 2 doubles, 3 quads, 2 fours
- 4 quads, 2 fours
- 4 doubles, 1 quads, 1 fours, 1 eights
- 2 doubles, 2 quads, 1 fours, 1 eights
- 3 quads, 1 fours, 1 eights
- 4 doubles, 2 eights
- 2 doubles, 1 quads, 2 eights
- 2 quads, 2 eights

Now we have a list of possible configurations of boats. We just need to fill them with rowers.

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
