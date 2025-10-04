---
date: 2023-03-25
slug: reactive-notebooks-to-python
title: Bringing Reactive Notebooks to Python
archived: false
---

Aren't <a href="https://jupyter.org" target="_blank">Jupyter</a> notebooks great? It takes so few keystrokes/clicks to create a new cell, write some code, and run it. You don't need to create a new file, name the file, write an entrypoint for the code, maybe switch to a terminal to run the code, etc. And the user interface makes it much easier than the IPython REPL for the average user.

And notebooks let you restructure your code so easily! Swapping in and out bits of functionality is possible just by running cells in a different order.

There lies one of the most confusing parts of the notebook workflow, however... by the time you've got something working the order of cell execution often doesn't match the order of the cells in the notebook. This always slightly bothered me. Shouldn't there be a way to encode the execution order into the notebook itself?

## Observable

<a href="https://observablehq.com" target="_blank">Observable</a> is a platform for writing notebooks in JavaScript. It was created by Mike Bostock, the creator of D3.js, and has a strong focus on interactivity and reactivity. When one cell executes, the output of that cell will automatically propagate to all cells that depend on it.

After playing around with Observable I realized immediately that this was the notebook experience I wanted for Python.

## Cado

After few years of stewing on this idea of the reactive Python notebook I decided to build it myself. At the core of the project is a graph of cell dependencies. Unlike Jupyter notebooks, I wanted Cado to explicitly track these dependencies, which would give it the power to restrict you from getting your notebook into funky states, but also help you work more quickly by refreshing the state of cells immediately for you.

I wanted to be able to detect cycles in the dependency graph of cells and enforce that the graph is a directed acyclic graph (DAG).

- If you clear a cell all descendants are cleared
- If you run a cell and its output changes all descendants are updated
- Cells specify their outputs and inputs
- Cells can only have one output
- Only one cell can produce a given output
- You can create multiple notebooks
- You can change a cell's type to markdown
- You can reorder cells easily by dragging and dropping

## Notebooks as scripts

A related drawback of using Jupyter notebooks in production is that they don't interoperate well with the rest of your Python codebase. You can't call into a notebook easily from a script, so once a notebook is written there's always a need to manually convert it to a script or a module in a package.
