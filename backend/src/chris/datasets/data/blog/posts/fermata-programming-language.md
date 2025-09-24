---
date: 2025-08-01
slug: fermata-programming-language
title: The World Needs Another Programming Language
archived: false
---

Okay, okay, the world <i>really</i> doesn't need another programming language. As you read on, I hope you'll appreciate the bit of self-aware humor.

I think a lot about what factors make some programming languages more enjoyable to use than others. Sometimes a language is preferred based on requirements of the problem at hand. Sometimes it's the quality of tooling or size of the language's ecosystem. Sometimes it's just personal preference. And personal preference is <i>quite</i> a can of worms. Do you have a soft spot for static typing? An aversion to verbosity? A need for speed?

All of these factors co-evolve and culminate in these artifacts, these frankensteins of various opinions, tradeoffs, and historical accidents. The design space of languages is vast and thanks to the time and effort required to produce one, every language ends up far from how it was conceived.

> I recently watched the talk "<a href="https://www.youtube.com/watch?v=yVuEPwNuCHw" target="_blank">Types, and why you should care</a>" by Ron Minsky and learned about a <a href="https://news-web.php.net/php.internals/70691" target="_blank">shocking historical accident</a> that when PHP was first created "In order to get a nice hash distribution of function names across the various function name lengths, names were picked specifically to make them fit into a specific length bucket."

## Why Fermata?

I started working on a project to flesh out my "perfect language", knowing full well that no language could be perfect for solving every problem I have, let alone every problem. Despite the task being impossible, I was curious to see what it would be like to build a language with a splash of experimental/innovative, but a focus on being familiar, intuitive, and inoffensive.

After a few years of jotting down little ideas here and there, I finally sat down and coded up the first prototype of the Fermata programming language. You can try it out in your browser at <a href="https://fermata-ide.vercel.app" target="_blank">fermata-ide.vercel.app</a>.

## Key features

- Syntax that feels like Python or TypeScript so that it feels familiar to most programmers
- Reducing the amount of special characters so it's easy to type - no brackets, no colons, letters for boolean operators, etc.
- Tags to create TypeScript-like types without imports (as with enums)
- Modern pattern matching
- Built-in type hints
- Traits like Rust rather than inheritance or interfaces
- Algebraic data types
- First-class iterators
- First-class async/await
- Lambdas with arrow notation
- Pipelines
- Monadic error handling

## Better tooling

- A better package manager that auto-upgrades and checks for semver compatibility
- A built-in testing framework where tests link back to the code they test
- A built-in linter
- A built-in formatter
- A built-in type checker
- A built-in docs generator from standardized docstrings
- An IDE that integrates with linter, docs generator, tests, and package manager
- A solution for reactive notebooks, built into the IDE
