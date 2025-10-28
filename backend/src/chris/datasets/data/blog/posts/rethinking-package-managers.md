---
date: 2025-04-02
slug: rethinking-package-managers
title: Rethinking the Package Manager
archived: false
status: new
---

This post was inspired by a podcast episode I listened to recently, titled <a href="https://podcasts.apple.com/us/podcast/the-semver-rabbit-hole-with-predrag-gruevski/id1602572955?i=1000627543462" target="_blank">The SemVer Rabbit Hole</a> with guest <a href="https://predr.ag" target="_blank">Predrag Gruevski</a>. He developed and maintains the <a href="https://github.com/obi1kenobi/cargo-semver-checks" target="_blank">cargo-semver-checks</a> crate for the Rust programming language and has a lot of nuanced takes on the good and bad of semver.

One segment of the conversation really got me fired up. Predrag introduced the idea that if your package manager has type information about each function, variable, etc in a package, then it can automatically check for semver-compatibility.

As someone who couldn't live without types, this is a pretty compelling idea to me. Why shouldn't the type system be integrated with the package manager? Sure, types aren't perfect (and only the gnarliest type systems attempt to be perfect), but if they can catch bugs in our functions, why shouldn't they also catch bugs in our dependencies?

This podcast got me thinking that if the package manager knows the types of members, we can enforce that breaking changes introduce major version bumps. You can also gain more confidence that minor version upgrades won't break you (of course no type-system can guarantee this). Also, if the package manager knows which members are being imported from dependencies, then it can help you safely auto-upgrade to newer versions of your dependencies. Even if you're upgrading across a major version, if your code doesn't use any members that have breaking changes, then you should be able to upgrade safely. Even cooler, if you can define a type-safe rewrite rule for a breaking change, then the package manager could even automatically rewrite your code to be compatible with the new version!

## Conclusion

There's a ton we can do if we rethink the package manager to be more aware of types.

The full source code for this project is available on <a href="https://github.com/gregorybchris/myxa" target="_blank">GitHub</a>.
