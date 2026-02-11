---
date: 2022-04-18
slug: graph-contraction-search
title: Graph Neural Networks for Faster Search
archived: false
status: published
---

In graph theory, an <strong>edge contraction</strong> is an operation where two adjacent vertices are merged into one.

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

On colored graphs, there's another operation we'll call a <strong>vertex contraction</strong>. Edges around a vertex are contracted if the adjacent vertices are the same color.

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

Given a fully-connected colored graph, we can apply vertex contractions _iteratively_, repeatedly changing the color of a single vertex and then applying a contraction until only a single vertex remains.

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

Are vertex contractions useful to us? Sure they are! We can use them to solve a particularly fun puzzle game called Kami[^kami-app]. In Kami, we're presented with a screen of pixels grouped into colored regions. We attempt to flood-fill all pixels to be the same color within an allotted number of moves.

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

Our goal is to find a sequence of contractions that fully contracts the graph within the specified number of moves.

The naïve, brute force approach is a simple tree traversal (like a BFS or DFS). You could simply select a starting vertex arbitrarily, recolor it to match at least one of its neighbors, contract the vertex, and repeat until only one vertex remains. You terminate the search when you've found a sequence that fully contracts the graph and also respects the allotted number of moves.

The order in which vertices are contracted matters, so the number of possible contraction sequences grows exponentially with the number of vertices. For graphs of only a dozen vertices, this search might take a while...

> If you're wondering why we haven't gotten to the deep learning yet, you may skip ahead at your own risk to the <a href="#deep-learning-approach">part about graph neural networks</a>. For now, though, I want to share some of the optimizations I found when solving this problem without machine learning.

## Ordering heuristics

We can do better than naïve brute force search by implementing some simple heuristics to prioritize more promising contractions first.

The first heuristic to speed up the naïve solver is pretty intuitive. To get from many edges (in the initial graph) to no edges (in a graph with one vertex) we should pick contractions that remove many edges. And vertices with more neighbors have a good chance of resulting in large contractions. Let's try using _vertex degree_ as a heuristic!

```python
def iter_nodes_by_degree(G: nx.Graph, nodes: Iterable[str]) -> Iterator[str]:
    scores = [(node, len(G[node])) for node in nodes]
    for node, _ in sorted(scores, key=lambda x: -x[1]):
        yield node
```

Now, how do we pick which color to contract? Similarly to our vertex degree heuristic, we want to choose a color that maximizes edges/vertices contracted. For a given vertex, we'll pick the _color that appears most frequently_ among its neighbors.

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

These last two heuristics were pretty greedy. They work well in the average case, but can fail to produce speedups when there are high degree vertices on the periphery of the graph. If we pick those first, we may end up with a large number of small contractions later on.

If we can pick vertices that are close to the "center" of the graph, rather than the periphery, then our contractions radiate outward and our number of steps is on the order of the radius of the graph, rather than the diameter. We can measure _vertex centrality_ by summing distances from each vertex to all other vertices. The vertex with the lowest sum of distances is the most central.

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

> Using [best-first search](https://en.wikipedia.org/wiki/Best-first_search) or [beam search](https://en.wikipedia.org/wiki/Beam_search) are nice algorithms for prioritizing promising trajectories through the search tree. (implementation not shown here)

## Locality constraints

There's one more optimization for the classical solver that I'm excited to share. This one is a bit tricky to explain, so I'll try my best to break it down.

Let me start by pointing out that the ordering heuristics above (vertex degree, color frequency, and centrality) don't actually reduce the total search space. They just increase the probability that we find a solution earlier in our search. What can we do to actually reduce the search space? (and thus improve our worst-case search time)

First, notice that a contraction is a fairly local operation. By that I mean that contracting a vertex doesn't affect vertices far away in the graph. First and second degree neighbors of a contracted vertex can have edges added, removed, merged, etc. But vertices that are three or more hops away are completely unaffected by the contraction.

If you watch the edges crossing the dotted line in this animation, you'll see that they don't move at all. Vertices outside that boundary are totally "unaware" of the contraction happening inside.

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

It might not be obvious yet, but this fact about contraction locality is going to prove extremely useful.

Let's imagine two vertices $a$ and $b$ that are far apart in the graph. If we contract $a$ first and then $b$, we get the same resulting graph as if we contracted $b$ first and then $a$. (There are enough vertices and edges acting as a buffer between the two contractions)

Going back to our search tree from earlier. If two paths through the search tree arrive at the exact same graph, then we're duplicating _all_ the work of searching the subtrees below that point. How do we take advantage of our locality insight and always explore only one of the two equivalent subtrees?

The trick is to only consider candidate vertices in the second degree neighborhood of the last contracted vertex.[^novel-finding]

Here's a quick hand-wavy explanation for why this works. Let's say our last contraction was to vertex $x$ and $a$ is local to $x$, but $b$ is non-local to $x$. Also, as before, $a$ and $b$ are non-local to each other. By adding the constraint that $a$ must be contracted before $b$ we've pruned one subtree that we know to be equivalent to another.

Empirically I've found that this improves search performance _significantly_, especially on planar graphs, where the number of vertices in a second degree neighborhood tends to be small compared to the total number of vertices.[^faster-markov-constraints]

> As an aside, I like to think of this boundary as a [Markov blanket](https://en.wikipedia.org/wiki/Markov_blanket). Contractions outside of each other's neighborhoods are conditionally independent.

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

For very large graphs with many vertices and many colors, search can _still_ be intractable for a computer to solve, even with locality constraints. Despite this combinatorial explosion, humans are able to solve large puzzles fairly quickly with a mix of visual intuition and very shallow backtracking. This performance gap between very fast computers and very intuitive humans informs our next approach -- maybe we can train a deep learning system to intuit which partial solutions are the most promising.

## Deep learning approach

If you've made it this far, whether you skipped ahead or not, congratulations. Now, let's talk deep learning.

We'll take our inspiration from how a human looks at a level of Kami and intuits the region that's most promising to flood fill next. Similarly, we'd like a model that can look at a graph and estimate the expected value of contracting a given vertex.

Specifically we'll use value-based reinforcement learning to estimate the number of moves needed to fully contract a given graph. The model acts as a heuristic, prioritizing trajectories through the search space that are the most likely to converge quickly.

In the language of reinforcement learning, we find the action $a^*$ (a contraction) that maximizes the value function $V_θ$ (our model) applied to the next state $f(s, a)$ (a graph after contraction).

$$
a^* = \arg\max_a V_\theta(f(s, a))
$$

> This $a^*$ is distinct from the $A*$ search algorithm, although the $*$ notation does imply "better" or "best" in both cases.

How do we train this model to select the best action? Well, we can't just run graphs through matmuls. We'll have to embed them into a vector representation somehow. I chose to use a graph convolutional network (GCNConv from [PyTorch Geometric](https://pytorch-geometric.readthedocs.io)). The GCN architecture allows us to train on graphs of arbitrary shape and size.

This embedding layer sees the structure of the graph as well as one-hot encoded colors of the vertices as node features.

> Graph attention layers have not seemed to provide an advantage over simple graph convolutions, however more data may be needed to see a benefit.

After some experimentation, I found that including dropout and global max pooling improved training stability and led to faster convergence. The network uses a ReLU non-linearity between GCN layers and a final linear layer maps the graph embedding to a single scalar output.

<figure id="figure6">
  <img src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/architecture.svg?cache=2" width="340">
  <figcaption><strong>Figure 6: </strong>Architecture &mdash; The model has a simple architecture of two GCN layers and a linear layer, separated by a ReLU, dropout, and global max pooling. The full thing has a whopping 251 parameters.</figcaption>
</figure>

> Experiments showed global max pooling performed better than global mean pooling. GCNConv layers outperformed GATConv and SAGEConv.

The scalar output of the model is interpreted as an estimate of the minimum number of contractions needed to fully contract the graph. MSE loss pushes model predictions closer to the true number of contractions needed for a given graph.

I also plot an accuracy score, which rounds the model prediction to the closest whole integer and compares that to the true minimum number of contractions. Accuracy is not used for training or during search, but it can be useful to get an intuition for model quality.

<figure id="figure7">
  <img src="https://storage.googleapis.com/cgme/blog/posts/graph-contraction-search/loss-curve.png?cache=6" width="340">
  <figcaption><strong>Figure 7: </strong>Training curve &mdash; The model shows above random chance performance on predicting the number of contractions needed for a given graph.</figcaption>
</figure>

Each step in the tree search we embed all candidate graphs, estimate how close they are to being solved (this is the value function from the RL formulation above), and recurse on the most promising candidates first.

<details>
<summary>Show data collection steps ||| Hide data collection steps</summary>

The training data for this project was collected directly from the Kami app. As you can imagine, manually encoding 114 levels as graphs would be a painfully tedious process. So to convert screenshots of levels into graphs automatically, I coded up a simple image processing pipeline that extracts the graph structure from images.

1. Crop 3x3 patches from the image in a lattice pattern.
2. Use K-means clustering for denoising to identify which patches have which colors.
3. Simplify the graph by contracting edges between vertices of the same color.

The allotted number of moves per level were entered manually.

For train-test splitting, even-numbered levels were used for training and odd-numbered levels were used for testing. Since the structure of graphs increases in complexity as levels get harder, this split ensures that the model has seen all different types of graphs during training. I personally don't mind that the network may not generalize to harder puzzles, as long as it can solve the difficulty of puzzles from the app.

Because each contraction yields a new graph, the training dataset is augmented by including all intermediate graphs along the solution path. This increases the size of the training dataset and also ensures the dataset has a fairly balanced distribution of labels.

</details>

## Wrapping up

As a recap, we've looked at how graph contractions can be a useful tool to solve real-world (video game) problems and developed some heuristic improvements to a naïve solver. We dug into a more nuanced and powerful optimization that leverages the locality of the contraction operation. And finally we found that we can replace hand-crafted heuristics by training a deep learning system to estimate the quality of partial solutions and guide high dimensional search.

I wouldn't bet on this solution outperforming practiced humans any time soon, but this research path is far from exhausted! Here are some ideas for future directions:

- Generate synthetic training data with random graphs
- Apply data augmentations on known planar graphs
- Experiment with different activation functions
- Tune the learning rate schedule
- Increase parameter count generally
- Benchmark solver speed and model latency with various configurations
- Investigate other RL approaches that evaluate an action directly rather than a value function over states

Thanks for reading to the end of my first blog post! If you enjoyed it, please consider sharing it with a friend or saying hello via my [contact page](/contact).

<github-button user="gregorybchris" repo="contraction"></github-button>

This post can be cited as:

```bibtex
@misc{gregory_contraction_2022,
  author = {Christopher B. Gregory},
  title = {Graph Neural Networks for Faster Search},
  year = {2022},
  howpublished = {\url{https://www.chrisgregory.me/blog/graph-contraction-search}},
}
```

## Acknowledgements

Thank you to Ben Cooper for his collaboration on developing the original Kami solver and thanks to [Max Bernstein](https://bernsteinbear.com) for his thoughtful feedback on this post.

[^kami-app]: Kami is available in both [iOS](https://apps.apple.com/us/app/kami/id710724007) and [Android](https://play.google.com/store/apps/details?id=com.stateofplaygames.kami2&hl=en-US) app stores.
[^novel-finding]: While this optimization is fairly elementary, a cursory literature review did not turn up prior work on this topic, so as far as I know this is a novel approach. Please reach out if you know otherwise!
[^faster-markov-constraints]: Edit (Oct. 2025): The original Markov constraint implementation can be improved. Second degree neighbors fall outside the Markov blanket if the associated first degree neighbor has a different color than the contracting vertex. This reduces the number of vertices inside the Markov blanket and further shrinks the search space.
