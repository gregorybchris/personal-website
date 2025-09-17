---
date: 2025-08-01
slug: fermata-programming-language
title: The World Needs Another Programming Language
topics: []
archived: false
---

## Introduction

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
