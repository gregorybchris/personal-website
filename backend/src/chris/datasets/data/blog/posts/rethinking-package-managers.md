---
date: 2025-04-02
slug: rethinking-package-managers
title: Rethinking the Package Manager
archived: false
status: draft
---

This post was inspired by an episode of the <a href="https://podcasts.apple.com/us/podcast/the-semver-rabbit-hole-with-predrag-gruevski/id1602572955?i=1000627543462" target="_blank">Software Unscripted</a> podcast. The guest, <a href="https://predr.ag" target="_blank">Predrag Gruevski</a>, developed and maintains the Rust <a href="https://github.com/obi1kenobi/cargo-semver-checks" target="_blank">cargo-semver-checks</a> crate and talks about the nitty-gritty of semantic versioning (<a href="https://semver.org" target="_blank">semver</a>).

One segment of the conversation really got me thinking. If your package manager had access to type information for every variable and every function in a package, then it could automatically check for compatibility breaks between versions.

Sure, it wouldn't be perfect -- you can always change a function to behave differently without changing its type signature. But this could address a large class of mishaps that package maintainers have to spend time and effort avoiding.

## Rethink

This seed of an idea sent me down a rabbit hole of other potential improvements to the package managers I'm most familiar with.

### Version selection

- Help maintainer pick the right version for the next release
- Only need major and minor versions to represent breaking and non-breaking changes
- Alert if there was an accidental break before publishing

### Changelog automation

- Automatically document breaking changes to the public interface of a package
- This exists for doc generators, why not package managers?
- Can integrate this with AI tools to provide summaries of breaking changes

### User confidence

- Users can be more confident that minor version upgrades won't break them

### Automatic major version upgrades

- One of the coolest features
- We know which members are being imported from dependencies
- If no breaking members are used, we can automatically upgrade across major versions
- Packages are huge - often you only use a small fraction of the members
- Why get stuck on old major versions if you don't use any breaking members?
- This can greatly reduce dependency rot
- Can integrate with dependabot to automatically open upgrade PRs

### Library vs application packages

- Differentiate between library and application packages
- Libraries need to maintain wide compatibility
- Applications can and should upgrade more aggressively
- This requires coordination between the package manager and the package registry
- This exists to some extent in cargo for Rust and crates.io I think

### Code rewriting

- Automatically rewrite code to be compatible with new major versions if type-safe rewrite rules are provided
- Rewrite rules can be in the form of regular expressions or AST transformations
- Examples: renamed variables/functions/parameters, reordered parameters, etc

### Manual upgrade prioritization

- If rewrites are not possible the package manager can warn that you're getting behind the latest major version
- It can provide documentation on how to upgrade members you depend on that have breaking changes
- It can sort upgrades by priority by looking at ease of upgrade, security concerns, and how out-of-date you are
- This can integrate with vulnerability scanners to prioritize security upgrades
- Can integrate with AI tools to generate PRs to help with manual upgrades

### Tree shaking

- Tree-shake unused members from dependencies to reduce bundle size
- This is common in frontend applications already where bundle size significantly impacts performance
- Can also be useful for large backend applications where environment setup and image builds slows down CI/CD pipelines.
- We can take this to its logical extreme and treat all package members as individually versioned entities
- Packages become more of a namespace than an actual bundle of code
- We currently have large packages because
  - It's easier for users to reason about installs
  - It's easier for maintainers to build infra to publish and manage versions
  - It's easier to market a package and build user trust if it has a recognizable name
  - Bundling more and more components into one package guarantees that all components are compatible within a given version
- Your actual application environment can be a tiny fraction of the size when you tree-shake unused members

### Package usage statistics

- In the age of AI the "developer" can look over thousands rather than dozens of candidate packages for use in a project
- There will be new tradeoffs for how we select trusted dependencies.
- By tracking how much a package is actually used in production we can hint to AI developers that a given micro-package is worth using
- If the package manager is also integrated with the deployment service we can ensure the user actually pays to run the package as a proof of trust

## Myxa

I built a toy package manager called <a href="https://github.com/gregorybchris/myxa" target="_blank">Myxa</a> to explore these ideas. It's written in Python as a proof of concept for some of the ideas explored above.

I've listed a few of the supported commands below as a peek at the kind of functionality Myxa provides:

```bash
mx init <name> "<description>"
mx info
mx info --version <version>
mx add <dependency-name>
mx add <dependency-name> --version <version>
mx remove <dependency-name>
mx lock
mx update
mx check
mx check --version <version>
mx diff
mx diff --version <version>
mx publish
mx index
mx index --package <package_name>
```

<!--
Note: these code SVGs were created manually
1. `script -q /dev/null uv run mx check | tee temp.txt`
2. ChatGPT to convert to SVG
3. Manual tweaking of SVG to fix any issues
 -->

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/rethinking-package-managers/info.svg?cache=6" width="100%" class="code-svg">
  <figcaption><strong>mx info</strong> prints type information for all package members and shows resolved dependencies.</figcaption>
</figure>

<figure id="figure2">
  <img src="https://storage.googleapis.com/cgme/blog/posts/rethinking-package-managers/check.svg?cache=3" width="100%" class="code-svg">
  <figcaption><strong>mx check</strong> prints the list of breaking changes since the last published version of a package.</figcaption>
</figure>

### Dependency resolution

The dependency resolver was the trickiest part of this project, so I wanted to recreate it as simply as possible here. The strategy is a recursive backtracking search that explores every combination of package versions until it finds a valid solution. I can guarantee it'll be horribly slow, but for a proof of concept it does the trick.

<details>
<summary>Show types and stubs ||| Hide types and stubs</summary>

```python
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterator, Optional


@dataclass(frozen=True)
class Version:
    major: int
    minor: int


@dataclass(frozen=True)
class Dep:  # package ~= version
    name: str
    version: Version

    def is_satisfied_by(self, version: Version) -> bool: ...


@dataclass(frozen=True)
class Package:
    name: str
    version: Version
    deps: list[Dep]


@dataclass
class Solution:
    pins: dict[str, Version] = field(default_factory=dict)

    def get(self, name: str) -> Optional[Version]: ...
    def add(self, package: Package) -> None: ...
    def remove(self, name: str) -> None: ...
    def is_compatible_with(self, package: Package) -> bool: ...


def iter_versions_sorted(name: str) -> Iterator[Package]: ...
```

</details>

```python
# Main function that initiates the dependency resolution
def solve(package: Package) -> Optional[Solution]:
    init_solution = Solution()
    solutions_iter = solve_rec(package.deps, init_solution)
    return next(solutions_iter, None)


# Recursive helper function that implements the backtracking search
def solve_rec(deps: list[Dep], solution: Solution) -> Iterator[Solution]:
    # If we have no more deps to satisfy, yield a valid solution
    if len(deps) == 0:
        yield solution
        return

    # Pop a dep of the queue and try to satisfy it
    dep, *tail = deps

    # If this dep is already in the solution with a compatible version, continue
    if version := solution.get(dep.name):
        if dep.is_satisfied_by(version):
            yield from solve_rec(tail, solution)
        return

    # Recurse on every package version that satisfies the current dep
    for package in iter_versions_sorted(dep.name):
        if not dep.is_satisfied_by(package.version):
            continue
        if not solution.is_compatible_with(package):
            continue

        solution.add(package)
        new_deps = tail + package.deps
        yield from solve_rec(new_deps, solution)

        # Backtrack
        solution.remove(package.name)
```

## Scratch

Instead of relying on package maintainers to never make a mistake when bumping versions, the package manager can automatically verify whether a new version is compatible with the previous version. Even more useful, because we know exactly which members are being imported from a dependency, we could even automatically upgrade across major versions as long as no members with breaking changes are being used!

Not only can the package manager help the package maintainer avoid mistakes, but everyone who uses the package can benefit quite a bit as well in their development process.

It's worth a quick aside to note that types are never perfect. There's a whole computational world of runtime behavior that type signatures will never capture. That said, even if the type system can't guarantee there aren't breaking changes, it can do an admirable job of telling us when there are.

If we already rely on type systems to catch bugs between functions, why shouldn't they also catch bugs in our dependencies?

This podcast got me thinking that if the package manager knows the types of members, we can enforce that breaking changes introduce major version bumps. You can also gain more confidence that minor version upgrades won't break you (of course no type-system can guarantee this). Also, if the package manager knows which members are being imported from dependencies, then it can help you safely auto-upgrade to newer versions of your dependencies. Even if you're upgrading across a major version, if your code doesn't use any members that have breaking changes, then you should be able to upgrade safely. Even cooler, if you can define a type-safe rewrite rule for a breaking change, then the package manager could even automatically rewrite your code to be compatible with the new version!

The end goal is that maintainers only rarely have to think about the nitty gritty of versioning - if there's a change to a member that doesn't affect types, but does affect behavior. The package users should basically never need to think about versioning at all.

## Conclusion

There's a ton we can do if we rethink the package manager to be more aware of types.

The full source code for this project is available on <a href="https://github.com/gregorybchris/myxa" target="_blank">GitHub</a>.
