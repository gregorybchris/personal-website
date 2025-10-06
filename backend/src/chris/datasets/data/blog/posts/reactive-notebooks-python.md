---
date: 2023-03-25
slug: reactive-notebooks-python
title: Bringing Reactive Notebooks to Python
archived: false
---

<a href="https://jupyter.org" target="_blank">Jupyter notebooks</a> are pretty great.<sup id="fnref:fn1"><a class="fnref" href="#fn:fn1">[1]</a></sup> It takes only a couple clicks/keystrokes to create a new cell, write some code, and run it. There's no creating a new file, naming the file, writing an entrypoint/main function, or switching to a terminal window to run the code. Unlike standard scripts, notebooks also allow you to embed markdown, plots, and other media directly so you can tell a story with your code.

One of the most powerful features of the notebook paradigm is that you can swap in and out bits of functionality just be running cells in a different order. This is incredible for exploration and prototyping, but with this great flexibility comes a serious drawback: Since there's no well-defined execution order for cells, your notebook can easily get into a state where running the cells top to bottom produces errors.

The notebook may have some very useful plots embedded in it, but if someone else can't reproduce those plots by re-running the notebook, then the notebook isn't very useful to them. Notebooks are often used by data "scientists" and real science demands reproducibility. Wouldn't it be great if our coding environment made it easy to achieve that high bar?

## Observable

Enter <a href="https://observablehq.com" target="_blank">Observable</a>, a platform for writing JavaScript notebooks, made by <a href="https://bost.ocks.org/mike" target="_blank">Mike Bostock</a>, the creator of the popular data visualization library D3.js.

Observable's key innovation is bringing reactivity to notebooks &mdash; execution of one cell can trigger execution of others. In Observable, each cell registers a variable that other cells can depend on. When a cell executes, the output of that cell automatically propagates to all cells that depend on it. Running a cell requires its parents to have run first, but because the dependency graph is explicitly defined, the notebook can run parent cells for you.

## Cado

After a few years of being sent (what I would consider) "broken" Jupyter notebooks and stewing on how cool Observable is, I decided to build <a href="https://github.com/gregorybchris/cado" target="_blank">Cado</a>, bringing the reactive notebook paradigm to Python.

<figure id="figure0">
  <img src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/cado-icon.png?cache=0" width="200" class="no-bg">
  <figcaption>Naturally, the app has a mascot named Avo.</figcaption>
</figure>

Over the next couple sections I'll go through some of the implementation decisions I made when building Cado.

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

Next, we need a way to ensure the notebook stays in a reproducible state. We enforce that the dependencies between cells form a directed acyclic graph (DAG) and that inputs and outputs of cells are well-defined.

Our cell model is pretty simple. Each cell has a unique ID, a list of input names, and a single output name.

```python
from dataclasses import dataclass

@dataclass
class Cell:
    id: str
    input_names: list[str]
    output_name: str
```

Next, we can build a graph representation of the cell dependencies by mapping output names to cell IDs and building up a dictionary that maps each cell to its parents/dependencies.

```python
Graph = dict[str, list[str]]

def build_graph(cells: list[Cell]) -> Graph:
    output_to_id = {}
    for cell in cells:
        if cell.output_name in output_to_id:
            raise ValueError(f"Output {cell.output_name} produced by multiple cells")
        output_to_id[cell.output_name] = cell.id

    graph = {}
    for cell in cells:
        for input_name in cell.input_names:
            if input_name not in output_to_id:
                raise ValueError(f"Input {input_name} is not an output of any cell")
        graph[cell.id] = [output_to_id[name] for name in cell.input_names]
    return graph
```

Note, that while building this graph, we also validate a few important invariants of our notebook:

1. Each output name is produced by exactly one cell
2. Each input name corresponds to an output of some cell

Finally, we can implement a depth-first search (DFS) to detect cycles in the graph.

```python
def detect_cycles(graph: Graph) -> None:
    checked = set()
    path = []

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

With these pieces in place, whenever a user runs a cell, clears a cell, or updates a cell's inputs or output, we can rebuild the graph and check for cycles to ensure the notebook remains in a valid state.

### Caching execution results

To avoid re-executing cells unnecessarily, we cache the results of cell executions. A cell only needs to be re-executed if one of its inputs has changed since the last time it was run.

Of course, this assumes that each cell is a pure function of its inputs, which may not always be the case. For example, if a cell reads from a file or makes a network request, it may produce different outputs even if its inputs haven't changed. In these cases, the user can manually force a re-execution of the cell.

If you know a cell is impure, you can mark it so that it always re-executes when any of its descendants are run. This could lead to the impure cell running quite frequently, but since we cache execution results, impure cell updates only cascade if the impure cell's output does not match the output from the last execution.

### Language server

I built the backend for Cado in Python as a <a href="https://fastapi.tiangolo.com" target="_blank">FastAPI</a> app. Every action you can perform in the notebook UI corresponds to a WebSocket message sent to the backend. The backend processes the message, updates the notebook state, and sends back any necessary updates to the frontend.

### Web interface

Similarly to Jupyter, the Cado server also serves the user interface. By running the `cado up` command, a single Python process serves the WebSocket API as well as the frontend, which connects to the socket automatically.

<figure id="figure1">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/parent-updates-propagate-to-children.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 1: </strong>
    Parents propagate updates to their children automatically.
  </figcaption>
</figure>

<figure id="figure2">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/children-use-cached-parent-outputs.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 2: </strong>
    Children use cached parent outputs if they're available rather than re-executing parents.
  </figcaption>
</figure>

<figure id="figure3">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/running-children-runs-uncached-parents.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 3: </strong>
    If a parent's output is not cached, running a child will run the parent first.
  </figcaption>
</figure>

<figure id="figure4">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/cycle-detected-error.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 4: </strong>
    Cycles are automatically detected.
  </figcaption>
</figure>

<figure id="figure5">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/unknown-input-name-error.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 5: </strong>
    Cells cannot rely on input names that aren't outputs of other cells.
  </figcaption>
</figure>

<figure id="figure6">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/duplicate-output-names-error.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 6: </strong>
    Output names must be unique across all cells.
  </figcaption>
</figure>

<figure id="figure7">
  <video className="delayed-loop" width="90%" autoplay muted playsinline>
  <source src="https://storage.googleapis.com/cgme/blog/posts/reactive-notebooks-python/drag-cells-to-reorder.mov?cache=1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 7: </strong>
    Cells are draggable (using <a href="https://www.framer.com/motion" target="_blank">Framer Motion</a>), something I always thought Jupyter notebooks should support.
  </figcaption>
</figure>

## Wrapping up

I hope someday the reactive notebook paradigm gains traction, if not as a default, perhaps as an opt-in setting. With the right user interface design, the benefits of reactivity could far outweigh the added complexity and by taking out page out of Observable's book we can make data science more reproducible.

The full source code for this project is available on <a href="https://github.com/gregorybchris/cado" target="_blank">GitHub</a>.

## Footnotes

<div id="footnotes">
  <div id="fn:fn1">
    <a class="fn" href="#fnref:fn1">[1]</a>
    <span>I hear emacs/vim power users protesting already. Sure, notebooks aren't for everyone, but if you're prototyping in Python and aren't allergic to the computer mouse they're worth a shot!</span>
  </div>
</div>
