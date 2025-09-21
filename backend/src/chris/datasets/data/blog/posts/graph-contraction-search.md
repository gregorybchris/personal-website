---
date: 2022-04-18
slug: graph-contraction-search
title: Using Graph Attention Networks as a Search Heuristic
topics: []
archived: false
---

In graph theory, an <strong>edge contraction</strong> is an operation where two adjacent vertices are merged into one and their shared edge is deleted.

<figure>
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/edge-contraction.mp4?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 1: </strong>
    Edge contraction &mdash; The new vertex's neighbors are the union of the neighbors from the original two vertices.
  </figcaption>
</figure>

On colored graphs, another operation exists that we'll call a <strong>vertex contraction</strong>. Edges around a vertex are contracted if the adjacent vertices are the same color.

<figure>
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/vertex-contraction.mp4?cache=2" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 2: </strong>
    Vertex contraction &mdash; The contacted vertex inherits neighbors from all adjacent vertices of the same color.
  </figcaption>
</figure>

Given a fully-connected colored graph, we can <strong>apply vertex contractions iteratively</strong> until only a single vertex remains.

<figure>
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/iterated-contraction.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 3: </strong>
    Iterated vertex contraction &mdash; Each turn we select a vertex to change color and then apply a vertex contraction to it.
  </figcaption>
</figure>

## Motivation

Are vertex contractions useful to us? Sure they are! We can use them to solve a particularly fun puzzle game called Kami<sup id="fnref:fn1"><a href="#fn:fn1">[1]</a></sup>.

In Kami, we attempt to flood-fill all pixels with the same color in as few moves as possible.
In an image, each region of continuous pixels of the same color gets an associated vertex in the graph. If two regions of pixels are touching then there's an edge between their corresponding graph vertices. To fill all pixels with the same color we perform iterated vertex contractions until there is a single graph vertex.

In the example below, the pixels have the same connectivity as the graph in Figure 3.

<figure>
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/flood-fill.mp4?cache=2" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 4: </strong>
    Flood fill &mdash; Each wave of flood filling pixels corresponds to a single vertex contraction in the corresponding graph.
  </figcaption>
</figure>

## Specifying the objective

Our goal is to minimize the number of steps needed to fully contract a graph to a single vertex. Specifically, the solution will be the shortest sequence of `(vertex, color)` pairs that leave a single vertex when applied to a graph. To apply a pair we first change the vertex's color, then we apply a contraction at that vertex.

The naïve, brute force approach is fairly obvious &mdash; select a vertex at random, select a color of one of its neighbors (different from its own color), contract the vertex with that color, and repeat until only one vertex remains. Do this for all possible selections and track the solution with the minimum sequence length.

> You may notice that the order in which vertices are contracted matters, so the number of possible contraction sequences grows exponentially with the number of vertices.

## Common sense heuristics

The brute force approach is way too slow, so let's come up with some tricks to speed up this solver a bit.

The first heuristic is pretty intuitive &mdash; to get from many edges (in the initial graph) to no edges (in a graph with one vertex) we should pick contractions that remove many edges. Vertices with more neighbors have a good chance of resulting in large contractions. Let's try using <i>vertex degree</i> as a heuristic!

```python
def iter_nodes_by_degree(G: nx.Graph, nodes: Iterable[str]) -> Iterator[str]:
    scores = [(node, len(G[node])) for node in nodes]
    for node, _ in sorted(scores, key=lambda x: -x[1]):
        yield node
```

<!-- [todo: add table showing time to solve with and without vertex degree heuristic] -->

Now, how do we pick which color to contract? Similarly to our vertex degree heuristic, we want to choose a color that maximizes edges/vertices contracted. For a given vertex, we'll pick the <i>color that appears most frequently</i> among its neighbors.

```python
def iter_neighbor_colors_by_freq(G: nx.Graph, node: str) -> Iterator[str]:
    frequencies = {}
    for child_node in G[node]:
        color = G.nodes[child_node]["color"]
        if color not in frequencies:
            frequencies[color] = 0
        frequencies[color] += 1

    for node, _ in sorted(frequencies.items(), key=lambda x: -x[1]):
        yield node
```

<!-- [todo: add table showing time to solve with and without color frequency heuristic] -->

These last two heuristics were pretty greedy. They work well, but tend to fail when there are high degree vertices on the periphery of the graph. If we pick those first, we may end up with a large number of small contractions later on.

If we can pick vertices that are close to the "center" of the graph, rather than the periphery, then our contractions radiate outward and our number of steps is on the order of the radius of the graph, rather than the diameter. We can measure <i>vertex centrality</i> by summing distances from each vertex to all other vertices. The vertex with the lowest sum of distances is the most central.

```python
def iter_nodes_by_centrality(G: nx.Graph, nodes: Iterable[str], power: int = 2) -> Iterator[str]:
    scores = {}
    queue = Queue()
    for node in nodes:
        scores[node] = 0

        # Run a BFS to sum distances to all other nodes
        visited = set()
        queue.put((node, 0))
        while not queue.empty():
            current_node, distance = queue.get()
            if current_node not in visited:
                # Use d^n to penalize distant nodes more heavily
                scores[node] += distance**power
                visited.add(current_node)
                for child_node in G[current_node]:
                    queue.put((child_node, distance + 1))

    for node, _ in sorted(scores.items(), key=lambda x: x[1]):
        yield node
```

<!-- [todo: add table showing time to solve with and without centrality heuristic] -->

We can implement a [best-first search](https://en.wikipedia.org/wiki/Best-first_search) or [beam search](https://en.wikipedia.org/wiki/Beam_search) that will prioritize more promising trajectories through the search tree. (implementation not shown here)

## Markov constraints

The ordering heuristics of vertex degree, color frequency, and centrality don't actually reduce the total search space. They just increase the probability that we find a solution earlier in our search. What can we do to actually reduce the search space? (and thus decrease our worst case search time)

First, it helps to notice that a contraction is a pretty local operation. If you pay attention to just the edges of the graph, you'll notice that edges outside of second-degree neighbors of the contracted vertex are unaffected by the contraction.

<!-- [todo: add a dotted line around the degree two neighborhood, show a contraction going in and out] -->

This is a big finding!<sup id="fnref:fn2"><a href="#fn:fn2">[2]</a></sup> Inside this second degree neighborhood the ordering of contractions is important, but outside of it the ordering is arbitrary. Up to this point we've been wasting time computing many equivalent solutions.

Let's resolve our double-counting and <strong>only consider candidate vertices in the degree two neighborhood of the last contracted vertex</strong>. By doing this we greatly decrease the width of the search tree for sparse enough graphs.

> As an aside, I like to think of this boundary as a [Markov blanket](https://en.wikipedia.org/wiki/Markov_blanket). Vertices in the graph are represented as variables in a probabilistic graphical model. Vertices with non-overlapping neighborhoods are conditionally independent.

```python
def iter_markov_blanket(G: nx.Graph, node: str) -> Iterator[str]:
    markov_blanket = set()

    markov_blanket.add(node)
    yield node

    for child_node in G[node]:
        if child_node not in markov_blanket:
            markov_blanket.add(child_node)
            yield child_node

        for grandchild_node in G[child_node]:
            if grandchild_node not in markov_blanket:
                markov_blanket.add(grandchild_node)
                yield grandchild_node
```

Empirically this improves search performance significantly on planar graphs.

<!-- [todo: add table showing time to solve with and without Markov constraint] -->

## Deep learning approach

Hand-crafted ordering heuristics can speed up the search considerably. However, for very large graphs with many vertices and many colors brute force search quickly becomes intractable. Despite this combinatorial explosion, humans are able to solve large puzzles fairly quickly with a mix of visual intuition and very shallow backtracking.

So there's a gap in performance between our very fast computer and a very intuitive human. This gap informs the hypothesis that a deep learning approach may yield better heuristics than we can create by hand.

To guide search, we can first embed the graph using a graph convolutional network (e.g. GCNConv from [PyTorch Geometric](https://pytorch-geometric.readthedocs.io/)). This architecture allows us to train on graphs of arbitrary shape and size. In practice, I've found global max pooling improves training stability and leads to faster convergence. Graph attention layers did not seem to provide an advantage over simple graph convolutions, however more data may be needed to see a benefit.

A final linear layer maps the graph embedding to the predicted value, which estimates the minimum number of contractions needed to fully contract the graph. This estimate is used as a search heuristic, replacing centrality and vertex degree. Each iteration of the model-based beam search we embed all candidate graphs, estimate their likelihood of requiring few contractions, and use those estimates to rank candidates.

We train with MSE loss and also calculate an accuracy score by rounding the model prediction to the nearest integer number of contractions. Training was done on a single consumer-grade GPU.

<!-- <figure>
  <img src="https://storage.googleapis.com/cgme/projects/images/contraction--04.jpg" width="300">
  <figcaption><strong>Figure 5: </strong>Training curve &mdash; The model shows above random chance performance on predicting the number of contractions needed for a given graph.</figcaption>
</figure> -->

While model training was successful, the model inference time in practice is slow enough to negate the benefits of the deep learning heuristic. To be useful the model would have to rule out unlikely candidate solutions faster than the latency of evaluating those candidates. That said, only very small graphs were used in evaluation, so more work is needed to see if at larger graph sizes the deep learning heuristic really does win out.

## Future work

All training data for this project came from levels directly from the [Kami app](https://apps.apple.com/us/app/kami/id710724007). These levels are hand-designed and therefore have a certain structure that may not generalize to arbitrary graphs. Future work could include generating synthetic training data by randomly generating graphs of varying size and topology.

Another avenue for exploration is the architecture of the model. A few architectures were attempted, but followup investigations could include adding additional linear layers with non-linearities, adding dropout, etc.

## Footnotes

<div id="footnotes">
  <div id="fn:fn1">
    <a href="#fnref:fn1">[1]</a>
    <span>Kami is available in both <a href="https://apps.apple.com/us/app/kami/id710724007" target="_blank">iOS</a> and <a href="https://play.google.com/store/apps/details?id=com.stateofplaygames.kami2&hl=en-US" target="_blank">Android</a> app stores.</span>
  </div>

  <div id="fn:fn2">
    <a href="#fnref:fn2">[2]</a>
    <span>While this optimization is fairly elementary, a cursory literature review did not turn up prior work on this topic, so as far as I know this is a novel approach.</span>
  </div>
</div>
