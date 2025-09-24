---
date: 2026-01-01
slug: example
title: Example Blog Post
archived: false
---

## Example blog post

This is some **bold text** and this is _italic_.

1. Item 1
1. Item 2
1. Item 3

- Item a
- Item b
- Item c

[Click here](https://chrisgregory.me) to go back home

This is `some_code()`

This is inline math: $e = mc^2$

This is block math:

$$ \frac{-b \pm \sqrt{b^2-4ac}}{2a} $$

> This is a blockquote.

```python
import os
from dataclasses import dataclass
from typing import Optional

A = torch.randn(2048, 2048, device='cuda', dtype=torch.bfloat16)
B = torch.randn(2048, 2048, device='cuda', dtype=torch.bfloat16)
ref = torch.mm(A, B)
for _ in range(1000):
    assert (torch.mm(A, B) - ref).abs().max().item() == 0

def scrapscript_demo():
    import scrapscript as ss
    ss.run("scrapscript--01")

@dataclass
class EnvSetting:
    var: str
    default: Optional[str] = None
    required: bool = False

    @property
    def value(self) -> Optional[str]:
        variable_value = os.getenv(str(self.var), self.default)
        if variable_value is None and self.required:
            raise EnvironmentError(f"Environment variable {self.var} is not set")
        return variable_value
```

<figure>
  <img src="https://storage.googleapis.com/cgme/projects/images/scrapscript--01.jpg" alt="Scrapscript demo" width="400">
  <figcaption><strong>Figure 1:</strong> Scrapscript demo.</figcaption>
</figure>

| ins | action                                         |
| --- | ---------------------------------------------- |
| cut | cut strand(s)                                  |
| del | delete a base from strand                      |
| swi | switch enzyme to other strand                  |
| mvr | move one unit to the right                     |
| mvl | move one unit to the left                      |
| cop | turn on Copy mode                              |
| off | turn off Copy mode                             |
| ina | insert A to the right of this unit             |
| inc | insert C to the right of this unit             |
| ing | insert G to the right of this unit             |
| int | insert T to the right of this unit             |
| rpy | search for the nearest pyrimidine to the right |
| rpu | search for the nearest purine to the right     |
| lpy | search for the nearest pyrimidine to the left  |
| lpu | search for the nearest purine to the left      |

|     | A   | C   | G   | T   |
| --- | --- | --- | --- | --- |
| A   |     | cut | del | swi |
| C   | mvr | mvl | cop | off |
| G   | ina | inc | ing | int |
| T   | rpy | rpu | lpy | lpu |

| ins | dir |
| --- | --- |
| cut | s   |
| del | s   |
| swi | r   |
| mvr | s   |
| mvl | s   |
| cop | r   |
| off | l   |
| ina | s   |
| inc | r   |
| ing | r   |
| int | l   |
| rpy | r   |
| rpu | l   |
| lpy | l   |
| lpu | l   |

| first | last | base |
| ----- | ---- | ---- |
| R     | R    | A    |
| R     | U    | C    |
| R     | D    | G    |
| R     | L    | T    |
