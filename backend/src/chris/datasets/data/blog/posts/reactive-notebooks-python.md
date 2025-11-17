---
date: 2023-03-25
slug: reactive-notebooks-python
title: Bringing Reactive Notebooks to Python
archived: false
status: published
---

[Jupyter notebooks](https://jupyter.org) are pretty neat.[^1] It takes only a couple clicks/keystrokes to create a new cell, write some code, and run it. You can skip all the steps of creating a new file, naming the file, writing an entrypoint/main function, and switching to a terminal window to run the code.

One of the most powerful features of the notebook paradigm is that you can swap in and out bits of functionality just by running cells in a different order. You can update a function and then only re-run the pieces of code that depend on that change. This is incredible for exploration and prototyping, but with this great flexibility comes a serious drawback: Since there's no well-defined execution order for cells, your notebook can easily get into a state where running the cells top to bottom produces errors.

In my own experience, notebooks are most often used by data scientists and researchers to create plots and test theories. And while not always essential, if someone else can't reproduce those plots by re-running the notebook, then the notebook loses a lot of its value. A core value of science is reproducibility, so wouldn't it be great if our coding environment made it easier to achieve that lofty goal?

## Observable

In case you're not familiar with it, I want to quickly introduce [Observable](https://observablehq.com), an online platform for writing JavaScript notebooks. It was created by [Mike Bostock](https://bost.ocks.org/mike), who you may recognize as the author of the [D3.js](https://d3js.org) data visualization library.

Observable's key innovation is bringing reactivity to notebooks -- execution of one cell can trigger execution of others. Each cell registers a variable that other cells can depend on. When a cell executes, the updated output automatically propagates to all cells that depend on it, keeping all cells in sync.

## Cado

After a few years of being a full time Python developer, wishing I could use Observable, wishing my notebooks were smarter, I decided to build a proof of concept called [Cado](https://github.com/gregorybchris/cado), bringing the reactive notebook paradigm to Python.

<figure id="figure0">
  <img src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/cado-logo-shadow.svg?cache=2 width="200" className="no-shadow">
  <figcaption>Naturally, the app has a mascot named Avo.</figcaption>
</figure>

Over the next couple sections I'll go through four key features that made Cado possible.

### Python exec and locals

First, we need a way to run cells. Fortunately, Python exposes runtime access to its own interpreter. You can define some code as a string and execute it with the built-in `exec` function.

```python
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from typing import Any, Mapping

source = """
product = "IPython"
author = "Fernando Perez"
print(f"{product} was started in {year} by {author}.")
"""

exec_globals: dict[str, Any] = {
    "year": 2001,
}

exec_stdout = StringIO()
exec_stderr = StringIO()
exec_locals: Mapping[str, Any] = {}

with redirect_stdout(exec_stdout), redirect_stderr(exec_stderr):
    exec(source, exec_globals, exec_locals)

print("stdout:", exec_stdout.getvalue().rstrip())
print("stderr:", exec_stderr.getvalue().rstrip())
print("locals:", exec_locals)
```

This code outputs:

```bash
stdout: IPython was started in 2001 by Fernando Perez.
stderr:
locals: {'product': 'IPython', 'author': 'Fernando Perez'}
```

This code alone is the meat of a cell implementation. We can execute a cell and capture its output, errors, and any variables it defines. Capturing locals will be important later when we validate which variables can be registered as the output of a cell. And stdout and stderr gives us control of how we display a cell's I/O streams.

> It's worth noting that `exec` has full access to your Python environment, so be careful when executing untrusted code.

### Enforcing the DAG

Next, let's introduce the reactivity. We'll need to track which cells depend on which other cells so the execution of one can trigger propagation to others.

The obvious data structure for dependency tracking is a [directed acyclic graph (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph). Each cell is a node in the graph, and there is a directed edge from cell A to cell B if B depends on A.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/dag.svg?cache=1" width="280">
  <figcaption><strong>Figure 1: </strong>An example of a directed acyclic graph representing cell dependencies. Running the cells in order from 1 to 7 ensures dependencies are run before they are needed.</figcaption>
</figure>

We can easily build up the graph from a list of cells where each cell has an ID, a list of input variables, and a single output variable. And while building the graph, we can also validate a few important invariants of our notebook:

1. Each output variable is produced by exactly one cell
2. Each input variable corresponds to an output of some cell

```python
from dataclasses import dataclass

@dataclass
class Cell:
    id: str
    input_vars: list[str]
    output_var: str
```

```python
Graph = dict[str, list[str]]

def build_graph(cells: list[Cell]) -> Graph:
    # Map output vars to cell IDs
    output_to_id = {}
    for cell in cells:
        if cell.output_var in output_to_id:
            raise ValueError(f"Output {cell.output_var} produced by multiple cells")
        output_to_id[cell.output_var] = cell.id

    # Build graph mapping cell IDs to IDs those cells depend on
    graph = {}
    for cell in cells:
        for input_var in cell.input_vars:
            if input_var not in output_to_id:
                raise ValueError(f"Input {input_var} is not an output of any cell")
        graph[cell.id] = [output_to_id[var] for var in cell.input_vars]
    return graph
```

Finally, to make sure the DAG doesn't get into a bad state, we can implement a depth-first search (DFS) to detect cycles. If the notebook had a cycle, then there wouldn't be a valid execution order for the cells.

```python
def detect_cycles(graph: Graph) -> None:
    checked = set() # Nodes we have verified are not part of a cycle
    path = [] # Current path in the DFS

    def visit(node: str):
        if node in path:
            cycle_repr = " -> ".join([*path, node])
            raise ValueError(f"Cycle detected in dependencies: {cycle_repr}")
        if node in checked:
            return
        path.append(node)
        for neighbor in graph.get(node, []):
            visit(neighbor)
        path.remove(node)
        checked.add(node)

    for node in graph:
        visit(node)
```

With these pieces in place, whenever a user interacts with the notebook, we can use the dependency graph to figure out which dependencies need to be executed first and where outputs should be propagated. Maintaining this DAG is pretty valuable![^2]

### Caching execution results

Once I got this far, I found a bug. Did you catch it? If a cell runs its dependencies before running itself, and then a cell propagates its output to its dependents, then the notebook is going to get itself into an infinite loop of reactivity.

We need a way to stop updates from propagating forever. Also, if a cell executes, but produces the same output as the last time it was run, we wouldn't want to waste compute triggering its dependents to re-execute unnecessarily.

Both of these problems can be solved by caching the results of cell executions! A cell only needs to be re-executed if one of its inputs has changed since the last time it was run. Much more efficient!

But what if a cell is not a pure function of its inputs? For example, a cell might read from a file on disk or make a network request via some API. Then it could produce different outputs even if its inputs haven't changed. In these cases, the user can mark the cell as `impure` and it will _always_ re-execute when any of its descendants are run. The update of an impure cell only cascades if the new output differs from the cached output.

The cost of equality checks on cached outputs is the main source of complexity in Cado's implementation. For objects with imprecise equality semantics, letting users define what equality means for each output variable is an interesting UX challenge that I don't have a great answer for yet.

### Web interface

Similarly to Jupyter, the Cado server also serves the user interface. By running the `cado up` command, a single Python process serves the [FastAPI](https://fastapi.tiangolo.com) WebSocket API as well as the [React](https://react.dev) frontend, which connects to the socket automatically.

<figure id="figure2">
  <video className="delayed-loop" autoplay muted playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/parent-updates-propagate-to-children.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 2: </strong>
    Updates propagate from cells to cells that depend on them.
  </figcaption>
</figure>

<figure id="figure3">
  <video className="delayed-loop" autoplay muted playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/children-use-cached-parent-outputs.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 3: </strong>
    Cells use cached outputs from dependencies rather than re-executing their dependencies.
  </figcaption>
</figure>

<figure id="figure4">
  <video className="delayed-loop" autoplay muted playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/running-children-runs-uncached-parents.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 4: </strong>
    Running a cell triggers execution of all dependencies that don't have cached outputs.
  </figcaption>
</figure>

<figure id="figure5">
  <video className="delayed-loop" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/cycle-detected-error.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 5: </strong>
    Cycles are automatically detected.
  </figcaption>
</figure>

<figure id="figure6">
  <video className="delayed-loop" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/unknown-input-name-error.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 6: </strong>
    Cells cannot rely on input variables that aren't outputs of other cells.
  </figcaption>
</figure>

<figure id="figure7">
  <video className="delayed-loop" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/duplicate-output-names-error.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 7: </strong>
    Output variables must be unique across all cells.
  </figcaption>
</figure>

<figure id="figure8">
  <video className="delayed-loop" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/drag-cells-to-reorder.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 8: </strong>
    Cells are draggable (using [Framer Motion](https://www.framer.com/motion)), something I always thought Jupyter notebooks should support.
  </figcaption>
</figure>

## Wrapping up

I hope someday the reactive notebook paradigm gains traction in the Python ecosystem, if not as a default, perhaps as an opt-in setting. With the right user interface design, the benefits of reactivity could far outweigh the added complexity. Using the same tricks Observable used to make data visualization more interactive, we can make data science more reproducible.

<github-button user="gregorybchris" repo="cado"></github-button>

[^1]: I can hear the grumbling protestations of emacs/vim power users. I get it, notebooks aren't for everyone. But if you're prototyping in Python and aren't horribly allergic to the computer mouse then they're worth a shot!

[^2]: Another cool thing you can do with this DAG is safely convert a notebook to a script. You can prefix local variables in each cell with the cell ID, topologically sort the cells with the DAG, then concatenate the cell contents. You're guaranteed a working script that you can fold into your Python codebase as a module.
