---
date: 2023-03-25
slug: reactive-notebooks-to-python
title: Bringing Reactive Notebooks to Python
archived: false
---

<a href="https://observablehq.com" target="_blank">Observable</a> is a platform for writing notebooks in JavaScript. It was created by Mike Bostock, the creator of D3.js, and has a strong focus on interactivity and reactivity. After working with it for a bit and then using Jupyter notebooks, I started to wonder why we don't have a similar reactive notebook for Python.

Jupyter notebooks aren't stable enough for production because they don't have a clear cell execution order. It's also difficult or impossible to call into a notebook from a script or another notebook, making it difficult to build modular code around notebooks.

Terminal REPLs (like IPython) are difficult to use for most users.

- If you clear a cell all descendants are cleared
- If you run a cell and its output changes all descendants are updated
- Cells specify their outputs and inputs
- Cells can only have one output
- Only one cell can produce a given output
- You can create multiple notebooks
- You can change a cell's type to markdown
- You can reorder cells easily by dragging and dropping
