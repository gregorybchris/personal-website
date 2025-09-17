---
date: 2022-04-18
slug: graph-contraction-search
title: Using Graph Attention Networks as a Search Heuristic
topics: []
archived: false
---

In graph theory, an _edge contraction_ is an operation where two adjacent vertices are merged into one and their shared edge is deleted.

<!-- <figure>
  <img src="https://storage.googleapis.com/cgme/projects/images/contraction--03.jpg" width="300">
  <figcaption><strong>Figure 1: </strong>Edge contraction &mdash; The new vertex's neighbors are the union of the neighbors from the original two vertices.</figcaption>
</figure> -->

On colored graphs, a similar operation exists called a _vertex contraction_. Edges connecting adjacent vertices are contracted if adjacent vertices share the same color as the contracted vertex.

<!-- <figure>
  <img src="https://storage.googleapis.com/cgme/projects/images/contraction--03.jpg" width="300">
  <figcaption><strong>Figure 2: </strong>Vertex contraction &mdash; The contacted vertex inherits neighbors from all adjacent vertices of the same color.</figcaption>
</figure> -->

Given a fully-connected colored graph, we can apply vertex contractions iteratively until only a single vertex remains. What good does that do us? For one, it lets us solve [fun puzzle games](https://apps.apple.com/us/app/kami/id710724007). But it's also the foundation of an interesting applied graph theory problem described more below.

<!-- <figure>
  <img src="https://storage.googleapis.com/cgme/projects/images/contraction--03.jpg" width="300">
  <figcaption><strong>Figure 3: </strong>Iterated vertex contraction</figcaption>
</figure>
 -->

As a small aside, we're basically using a flood fill algorithm, but on colored graphs, rather than pixels. Actually, flood filling pixels is a special case of colored graph contraction where the graph is constrained to a 2D lattice structure.

<!-- <figure>
  <img src="https://storage.googleapis.com/cgme/projects/images/contraction--03.jpg" width="300">
  <figcaption><strong>Figure 4: </strong>Pixel flood fill</figcaption>
</figure> -->

## Setting our objective

Let's minimize the number of contractions needed to fully contract a graph. Our solution will be the shortest sequence of `(vertex, color)` pairs that leave a single vertex when applied to a graph. The order in which vertices are contracted matters, so the number of possible contraction sequences grows exponentially with the number of vertices. For arbitrary graphs, finding the optimal contraction sequence is NP-hard <sup id="fnref:fn1"><a href="#fn:fn1">[1]</a></sup>.

The naïve, brute force approach is fairly obvious &mdash; select a vertex, select a color of one of its neighbors (different from its own color), contract the vertex with that color, and repeat until only one vertex remains. Do this for all possible selections to minimize the sequence length.

## Adding common sense heuristics

Let's consider some tricks and see if we can't speed up this solver a bit.

Let's start with the intuition that we want to go from n vertices to 1 vertex as quickly as possible. So the more edge contractions per turn the better. Vertices that have more neighbors will have a higher chance of reducing future work. Let's try using vertex degree as a heuristic to prioritize vertices that are more likely to lead to large contractions!

[todo: add table showing time to solve with and without vertex degree heuristic]

A very similar optimization is to look at which color we choose for each contraction. Choosing a color that is more common among the neighbors of the contracted vertex will lead to larger contractions. So let's try prioritizing colors by their frequency among the neighbors of the contracted vertex.

[todo: add table showing time to solve with and without color frequency heuristic]

A less intuitive heuristic comes from solving a lot of these by hand. If you can pick vertices that are close to the center of the graph, then you can accumulate many edges in a fairly central vertex. The flood fill radiates outward to the rest of the graph. If we prioritize vertices by their centrality we can chop the problem roughly twice as quickly in some cases compared to stating with vertices on the periphery of the graph.

[todo: add table showing time to solve with and without centrality heuristic]

## Markov constraints

One potentially novel<sup id="fnref:fn2"><a href="#fn:fn2">[2]</a></sup> finding of this project is that a contraction is a local operation that at most affects the adjacency lists of second-degree neighbors of the contracted vertex. Therefore, two contractions not in the degree two neighborhood of each other are causally independent. Put another way, the ordering of two non-local operations is always arbitrary and there is a Markov boundary around the degree two neighborhood of each vertex.

It's this finding that leads us to only consider candidate vertices in the degree two neighborhood of the last contracted vertex. This greatly decreases the width of the search tree for sparse enough graphs. Empirically this improves search performance significantly on planar graphs.

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

<div id="fn:fn1">
  <a href="#fnref:fn1">[1]</a>
  <span>I haven't proven NP-hardness myself, but it feels true, doesn't it?</span>
</div>

<div id="fn:fn2">
  <a href="#fnref:fn2">[2]</a>
  <span>While this proof is fairly elementary, a cursory literature review did not turn up prior work on this topic, so as far as I know this is a novel proof.</span>
</div>
