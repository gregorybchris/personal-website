---
date: 2023-03-25
slug: reactive-notebooks-python
title: Bringing Reactive Notebooks to Python
archived: false
status: published
---

<a href="https://jupyter.org" target="_blank">Jupyter notebooks</a> are pretty neat.<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup> It takes only a couple clicks/keystrokes to create a new cell, write some code, and run it. You can skip all the steps of creating a new file, naming the file, writing an entrypoint/main function, and switching to a terminal window to run the code.

One of the most powerful features of the notebook paradigm is that you can swap in and out bits of functionality just by running cells in a different order. You can update a function and then only re-run the pieces of code that depend on that change. This is incredible for exploration and prototyping, but with this great flexibility comes a serious drawback: Since there's no well-defined execution order for cells, your notebook can easily get into a state where running the cells top to bottom produces errors.

Notebooks are often used by data scientists to produce and embed plots and test theories. If someone else can't reproduce those plots by re-running the notebook, then the notebook loses a lot of its value. A core value of science is reproducibility, so wouldn't it be great if our coding environment made it easier to achieve that high bar?

## Observable

In case you're not familiar, I want to quickly introduce <a href="https://observablehq.com" target="_blank">Observable</a>, a platform for writing JavaScript notebooks, made by <a href="https://bost.ocks.org/mike" target="_blank">Mike Bostock</a>. You may be familiar with the data visualization library <a href="https://d3js.org" target="_blank">D3.js</a>, which he also created.

Observable's key innovation is bringing reactivity to notebooks -- execution of one cell can trigger execution of others. In Observable, each cell registers a variable that other cells can depend on. When a cell executes, the output of that cell automatically propagates to all cells that depend on it, keeping all connected cells in sync.

## Cado

After a few years of being a full time Python developer, wishing I could use Observable, wishing my notebooks were smarter, I decided to build a proof of concept called <a href="https://github.com/gregorybchris/cado" target="_blank">Cado</a>, bringing the reactive notebook paradigm to Python.

<figure id="figure0">
  <img src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/cado-icon.png?cache=0" width="200" className="no-shadow">
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

This allows us to execute a cell and capture its output, errors, and any variables it defines.

> It's worth noting that `exec` has full access to your Python environment, so be careful when executing untrusted code.

### Enforcing the DAG

Next, we need a way to check whether a given update to the notebook would put it in a non-reproducible state. If we can build a directed acyclic graph (DAG) of cell dependencies, then we know the notebook is valid -- there are no cycles that would make ordering the notebook impossible.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/dag.png?cache=1" width="280">
  <figcaption><strong>Figure 1: </strong>An example of a directed acyclic graph representing cell dependencies. Running the cells in order from 1 to 7 ensures dependencies are run before they are needed.</figcaption>
</figure>

Before we get to cycle detection, we need to build a graph of cell dependencies. Each cell has a unique ID, a list of input variables, and a single output variable.

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

While building this graph, we also validate a few important invariants of our notebook:

1. Each output variable is produced by exactly one cell
2. Each input variable corresponds to an output of some cell

Finally, we can implement a depth-first search (DFS) to detect cycles in the graph.

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

With these pieces in place, whenever a user interacts with the notebook, we can use the dependency graph to figure out which cells need to be executed first and where outputs should be propagated. Maintaining this DAG is pretty valuable!<sup id="fnref:fn2"><a class="fnref" href="#fn:fn2">[2]</a></sup>

### Caching execution results

If we built Cado with just the pieces we've discussed so far, then a single cell's execution would propagate updates through the whole notebook (all connected cells). So to avoid re-executing cells unnecessarily, we can cache the results of cell executions. A cell only needs to be re-executed if one of its inputs has changed since the last time it was run. Much more efficient!

But what if a cell is not a pure function of its inputs? For example, a cell might read from a file on disk or make a network request via some API. Then it could produce different outputs even if its inputs haven't changed. In these cases, the user can mark the cell as impure and it will always re-execute when any of its descendants are run and the update only cascades if the new output differs from the cached output.

The cost of equality checks on cached outputs is the main source of complexity in Cado's implementation. For objects with imprecise equality semantics, letting users define what equality means for each output variable is an interesting UX challenge.

### Web interface

Similarly to Jupyter, the Cado server also serves the user interface. By running the `cado up` command, a single Python process serves the <a href="https://fastapi.tiangolo.com" target="_blank">FastAPI</a> WebSocket API as well as the <a href="https://react.dev" target="_blank">React</a> frontend, which connects to the socket automatically.

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
    Cells are draggable (using <a href="https://www.framer.com/motion" target="_blank">Framer Motion</a>), something I always thought Jupyter notebooks should support.
  </figcaption>
</figure>

## Wrapping up

I hope someday the reactive notebook paradigm gains traction, if not as a default, perhaps as an opt-in setting. With the right user interface design, the benefits of reactivity could far outweigh the added complexity. Using the same tricks Observable used to make data visualization more interactive, we can make data science more reproducible.

The full source code for this project is available on <a href="https://github.com/gregorybchris/cado" target="_blank">GitHub</a>.

## Footnotes

<div id="footnotes">
  <div id="fn:fn1" class="footnote">
    <a class="fn" href="#fnref:fn1">[<span class="footnote-number">1</span>]</a>
    <span>I can hear the grumbling protestations of emacs/vim power users. I get it, notebooks aren't for everyone. But if you're prototyping in Python and aren't horribly allergic to the computer mouse then they're worth a shot!</span>
  </div>
</div>

<div id="footnotes">
  <div id="fn:fn2" class="footnote">
    <a class="fn" href="#fnref:fn2">[<span class="footnote-number">2</span>]</a>
    <span>Another cool thing you can do with this DAG is safely convert a notebook to a script. You can prefix local variables in each cell with the cell ID, topologically sort the cells with the DAG, then concatenate the cell contents. You're guaranteed a working script that you can fold into your Python codebase as a module.</span>
  </div>
</div>
