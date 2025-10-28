---
date: 2022-04-18
slug: graph-contraction-search
title: Graph Neural Networks for Faster Search
archived: false
status: published
---

In graph theory, an <strong>edge contraction</strong> is an operation where two adjacent vertices are merged into one and their shared edge is deleted.

<figure id="figure1">
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

<figure id="figure2">
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

<figure id="figure3">
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

Are vertex contractions useful to us? Sure they are! We can use them to solve a particularly fun puzzle game called Kami<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup>. In Kami, we're presented with a screen of pixels grouped into colored regions. We attempt to flood-fill all pixels to be the same color within an allotted number of moves.

<figure id="figure4">
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/flood-fill.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 4: </strong>
    Flood fill &mdash; Each wave of flood filling pixels corresponds to a single vertex contraction in the corresponding graph.
  </figcaption>
</figure>

To solve a Kami puzzle we set up a correspondence between colored regions of pixels &harr; vertices in a graph:

- Each region of contiguous pixels of the same color gets an associated vertex in the graph.
- If two regions of pixels are touching then there's an edge between their corresponding graph vertices.
- A move in Kami corresponds to a vertex contraction in the graph.

Maybe you noticed, the pixels in <a href="#figure4">Figure 4</a> have the same connectivity as the graph in <a href="#figure3">Figure 3</a>.

To fill all pixels with the same color, we perform iterated vertex contractions until there is a single graph vertex. The vertices we contract in the graph tell us which regions of pixels we should flood fill.

## Specifying the objective

Our goal is to find a sequence of contractions that fully contracts the graph within the specified number of moves. A contraction is defined by the vertex being contracted and the color it's being assigned, so a puzzle solution will be a sequence of `(vertex, color)` pairs.

The naïve, brute force approach is a simple tree traversal -- select a vertex at random, select a color of one of its neighbors (different from its own color), contract the vertex with that color, and repeat until only one vertex remains. Do this for all possible vertices/colors and terminate when a solution is found with the desired length.

> You may notice that the order in which vertices are contracted matters, so the number of possible contraction sequences grows exponentially with the number of vertices.

## Ordering heuristics

The brute force approach is way too slow, so let's come up with some tricks to speed up this solver a bit.

The first heuristic is pretty intuitive -- to get from many edges (in the initial graph) to no edges (in a graph with one vertex) we should pick contractions that remove many edges. Vertices with more neighbors have a good chance of resulting in large contractions. Let's try using <i>vertex degree</i> as a heuristic!

```python
def iter_nodes_by_degree(G: nx.Graph, nodes: Iterable[str]) -> Iterator[str]:
    scores = [(node, len(G[node])) for node in nodes]
    for node, _ in sorted(scores, key=lambda x: -x[1]):
        yield node
```

Now, how do we pick which color to contract? Similarly to our vertex degree heuristic, we want to choose a color that maximizes edges/vertices contracted. For a given vertex, we'll pick the <i>color that appears most frequently</i> among its neighbors.

```python
def iter_neighbor_colors_by_freq(G: nx.Graph, node: str) -> Iterator[str]:
    frequencies = {}
    for child_node in G[node]:
        color = G.nodes[child_node]["color"]
        if color not in frequencies:
            frequencies[color] = 0
        frequencies[color] += 1

    for color, _ in sorted(frequencies.items(), key=lambda x: -x[1]):
        yield color
```

These last two heuristics were pretty greedy. They work well, but tend to fail when there are high degree vertices on the periphery of the graph. If we pick those first, we may end up with a large number of small contractions later on.

If we can pick vertices that are close to the "center" of the graph, rather than the periphery, then our contractions radiate outward and our number of steps is on the order of the radius of the graph, rather than the diameter.

We can measure <i>vertex centrality</i> by summing distances from each vertex to all other vertices. The vertex with the lowest sum of distances is the most central.

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

We can implement a [best-first search](https://en.wikipedia.org/wiki/Best-first_search) or [beam search](https://en.wikipedia.org/wiki/Beam_search) that will prioritize more promising trajectories through the search tree. (implementation not shown here)

## Locality constraints

The ordering heuristics of vertex degree, color frequency, and centrality don't actually reduce the total search space. They just increase the probability that we find a solution earlier in our search. What can we do to actually reduce the search space? (and thus decrease our worst case search time)

First, it helps to notice that a contraction is a pretty local operation. If you pay attention to just the edges of the graph, you'll notice that edges outside of second degree neighbors of the contracted vertex are always unaffected by the contraction.

<figure id="figure5">
  <video width="300" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/markov-blanket.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 5: </strong>
    Contraction locality &mdash; Edges crossing the boundary between second and third degree neighbors do not move. Vertices outside the boundary are unchanged by contraction.
  </figcaption>
</figure>

This is a big finding!<sup id="fnref:fn2"><a class="fnref" href="#fn:fn2">[2]</a></sup> If we contract two vertices that are far enough apart in the graph, then the order in which we contract them is completely arbitrary. Up to this point we've been wasting time computing <i>many</i> equivalent solutions.

Let's resolve our double-counting and <strong>only consider candidate vertices in the second degree neighborhood of the last contracted vertex</strong>. By doing this we can greatly decrease the width of the search tree.

> As an aside, I like to think of this boundary as a [Markov blanket](https://en.wikipedia.org/wiki/Markov_blanket). Vertices in the graph are represented as variables in a probabilistic graphical model. Vertices outside of each other's neighborhoods are conditionally independent.

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

Empirically this improves search performance significantly, especially on planar graphs, where the number of vertices in a second degree neighborhood tends to be small compared to the total number of vertices.

## Deep learning approach

Ordering heuristics and locality constraints can speed up the search considerably, but for very large graphs with many vertices and many colors, search can <i>still</i> be intractable for a computer to solve. Despite this combinatorial explosion, humans are able to solve large puzzles fairly quickly with a mix of visual intuition and very shallow backtracking. This performance gap between very fast computers and very intuitive humans informs our next approach -- maybe we can train a deep learning system to intuit which partial solutions are the most promising.

We'll train a model to <strong>estimate the number of moves needed to fully contract a graph</strong>. Then we can prioritize trajectories through the search space that are the most likely to converge quickly.

First we can embed the graph using a graph convolutional network (GCNConv from [PyTorch Geometric](https://pytorch-geometric.readthedocs.io)). The GCN architecture allows us to train on graphs of arbitrary shape and size.

> Graph attention layers have not seemed to provide an advantage over simple graph convolutions, however more data may be needed to see a benefit. The training dataset was limited to the levels provided in the Kami app.

In practice, including dropout and global max pooling improve training stability and lead to faster convergence. We use a ReLU non-linearity between GCN layers and a final linear layer maps the graph embedding to a single scalar output. This output is interpreted as an estimate of the minimum number of contractions needed to fully contract the graph.

<figure id="figure6">
  <img src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/architecture.png?cache=5" width="340">
  <figcaption><strong>Figure 6: </strong>Architecture &mdash; The model has a simple architecture of two GCN layers and a linear layer, separated by a ReLU, dropout, and global max pooling.</figcaption>
</figure>

> Experiments showed global max pooling performed better than global mean pooling. GCNConv layers outperformed GATConv and SAGEConv.

Our model's estimate can be used as a search heuristic, replacing vertex degree, color frequency, and centrality. Each step in the tree search we embed all candidate graphs, estimate how close they are to being solved, and rank the candidates by most promising to least.

We train with MSE loss and also calculate an accuracy score by rounding the model prediction to the nearest integer number of contractions.

<figure id="figure7">
  <img src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/loss-curve.png?cache=5" width="340">
  <figcaption><strong>Figure 7: </strong>Training curve &mdash; The model shows above random chance performance on predicting the number of contractions needed for a given graph.</figcaption>
</figure>

While the model trains successfully, unfortunately model inference latency is high enough to negate the benefits of the learned heuristic. To be useful, the model would have to rule out unlikely subtrees faster than the cost of evaluating those candidates. Perhaps with larger graphs the deep learning heuristic might win out.

## Dataset

As mentioned previously, the training data for this project was collected from the Kami app. As you can imagine, manually encoding levels as graphs would be a tedious process. To convert screenshots of levels into graphs automatically, we can use a simple image processing pipeline:

1. Extract 3x3 patches from the image in a lattice pattern.
2. Use K-means clustering for denoising to identify which patches have which colors.
3. Simplify the graph by contracting edges between vertices of the same color.

For train-test splitting, even-numbered levels were used for training and odd-numbered levels were used for testing. Since the structure of graphs increases in complexity as levels get harder, this split ensures that the model has seen all different types of graphs during training.

Because each contraction yields a new graph, the training dataset is augmented by including all intermediate graphs along the solution path. This increases the size of the training dataset and also ensures the dataset has a fairly balanced distribution of labels.

It's also worth noting that the one-hot encoded color of each vertex is used as a node feature during graph embedding. It's these vectors that are convolved in the GCN layers.

## Wrapping up

We've explored several classical optimizations to iterated vertex contraction and we've seen that we can successfully learn heuristics to tame the combinatorial search space. I wouldn't bet on this solution outperforming practiced humans, but it certainly blows the naïve approach out of the water and this research path is far from exhausted! Here are some ideas for future directions:

- Generate synthetic training data with random graphs
- Apply data augmentations on known planar graphs
- Try more modern GNN architectures
- Experiment with different activation functions
- Tune the learning rate schedule
- Balance inference latency as part of the beam search

Thanks for reading to the end of my first blog post! If you enjoyed it, please consider sharing it with a friend or saying hello via my <a href="/contact">contact page</a>.

The full source code for this project is available on <a href="https://github.com/gregorybchris/contraction" target="_blank">GitHub</a>.

This post can be cited as:

```bibtex
@misc{gregory_contraction_2022,
  author = {Christopher B. Gregory},
  title = {Graph Neural Networks for Faster Search},
  year = {2022},
  howpublished = {\url{https://www.chrisgregory.me/blog/graph-contraction-search}},
}
```

## Footnotes

<div id="footnotes">
  <div id="fn:fn1" class="footnote">
    <a class="fn" href="#fnref:fn1">[<span class="footnote-number">1</span>]</a>
    <span>Kami is available in both <a href="https://apps.apple.com/us/app/kami/id710724007" target="_blank">iOS</a> and <a href="https://play.google.com/store/apps/details?id=com.stateofplaygames.kami2&hl=en-US" target="_blank">Android</a> app stores.</span>
  </div>

  <div id="fn:fn2" class="footnote">
    <a class="fn" href="#fnref:fn2">[<span class="footnote-number">2</span>]</a>
    <span>While this optimization is fairly elementary, a cursory literature review did not turn up prior work on this topic, so as far as I know this is a novel approach.</span>
  </div>
</div>
