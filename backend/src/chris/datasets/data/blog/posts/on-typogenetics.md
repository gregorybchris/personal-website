---
date: 2024-01-07
slug: on-typogenetics
title: "On Typogenetics: Visualizations and Connections"
archived: false
status: draft
---

Maybe you've never heard of Typogenetics before or maybe you're a long time fan of Douglas Hofstadter's Pulitzer prize-winning book _Gödel, Escher, Bach: An Eternal Golden Braid_ (1979). Either way, this blog post is for you.

## What's Typogenetics?

Typogenetics, short for "typographical genetics", is a simplification of biology. It's an artificial system that explores some of the coolest computational features of genetics while ignoring much of the messy chemistry and physics.

Over the next few sections, we'll lay out the rules of Typogenetics, starting simple and slowly adding complexity.

## Building blocks

All life on Earth has DNA built from four molecules: Adenine (A), Cytosine (C), Guanine (G), and Thymine (T). These are called nucleobases, but in the spirit of simplification, Typogenetics calls these **bases**. And don't worry about the molecular names or the underlying chemistry of these molecules. For our purposes, all we care about is the letters A, C, G, and T.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/bases.svg?cache=1" width="350">
  <figcaption><strong>Figure 1: </strong>Bases &mdash; The four bases and their two groups: A and G are both called "pyrimidines" and C and T are "purines".</figcaption>
</figure>

If we string a few of these bases together we'll call that a **strand**. Each position along a strand is called a **unit**.

<figure id="figure2">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/strand.svg?cache=1" width="350">
  <figcaption><strong>Figure 2: </strong>Strands &mdash; Bases strung together in any order form a strand.</figcaption>
</figure>

## Rewriting

Typogenetics defines a small set of rules, that when applied to a strand, rewrite it into a new strand. Each rule is called an **amino acid**. A sequence of these rules is called an **enzyme**. Let's look at an example of an enzyme made up of three rules:

- Rule 1 -- `del`: Delete the base to which the enzyme is bound (and then bind to the next unit to the right).
- Rule 2 -- `mvr`: Move one unit to the right.
- Rule 3 -- `int`: Insert a T (to the immediate right of this unit)

<figure id="figure3">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/rewriting.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 3: </strong>
    Rewriting &mdash; In this simple example, the `del-mvr-int` enzyme rewrites `ACA` to `CAT`.
  </figcaption>
</figure>

A very useful amino acid is called `cut`, which slices a strand to the right of the current unit, producing two strands.

<figure id="figure4">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/cut.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 4: </strong>
    Cut &mdash; The `cut` amino acid slices a strand into two. In this example, `mvr-mvr-cut` moves two units to the right and then performs a cut.
  </figcaption>
</figure>

Another useful amino acid is `cop`, which turns on "Copy mode". When Copy mode is on, new bases bind to the current strand. Specifically, A binds to T, and C binds to G. These are called **complementary base pairs**. When Copy mode is on, any time the enzyme moves left or right, a new complementary base is added to the other strand.

> Note that the complementary strand is built mirroring our current strand, so we flip it at the end to read it left to right.

<figure id="figure5">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/copy.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 5: </strong>
    Copy &mdash; Copy mode allows enzymes to duplicate strands. In this case, `cop-mvr-mvr-mvr-mvr-mvr` turns Copy mode on and then walks down the current strand, creating a complementary strand in the process.
  </figcaption>
</figure>

Next let's see what happens if we cut while the strand is being copied. You can see that we get a couple of free-floating strand fragments. A single enzyme acting on a single strand can produce many strands as output.

<figure id="figure6">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/copy-and-cut.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 6: </strong>
    Copy and cut &mdash; Cutting a strand while Copy mode is enabled can produce many strands.
  </figcaption>
</figure>

## Closing the loop

Fans of Typogenetics and biologists will have predicted this next magical step. We create a mapping between amino acids and pairs of bases. Every unique pair of bases "codes" for a single amino acid.

Now, not only can enzymes operate on strands, but those same strands can themselves be treated as enzymes. All we need to do is take a strand, use this chart to convert pairs of bases into amino acids, and we have a new enzyme that can itself operate on strands.

<figure id="figure7">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/amino-acid-table.svg?cache1" width="300">
  <figcaption><strong>Figure 7: </strong>Amino acids &mdash; This table shows the mapping from pairs of bases to their corresponding amino acids.</figcaption>
</figure>

> Note: The AA duplet does not code for an amino acid. It is reserved as a "punctuation mark" to mean "end of enzyme". Multiple amino acid sequences can be created from a single strand during translation.

## Translation

The process of turning strands of bases into enzymes of amino acids is called **translation**. Each pair of bases, called a **duplet**, gets assigned an amino acid. The product of translation is a chain of amino acids.

<figure id="figure8">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/translation.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 8: </strong>
    Translation &mdash; A chain of amino acids is constructed by decoding pairs of bases.
  </figcaption>
</figure>

## Folding

In Figure 8, we showed the enzyme being constructed as a straight chain of amino acids. In Typogenetics, we introduce a bit more complexity. Each amino acid has the possibility of inducing a 90º kink in the enzyme. "r" indicates a right turn in the enzyme, "l" indicates a left turn, and "s" indicates no turn induced and the enzyme remains straight at that amino acid. Figure 7 shows the full mapping from amino acids to folding directions.

<figure id="figure9">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/folding.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 9: </strong>
    Folding &mdash; Akin to real life protein folding, Typogenetics adds some higher level structure to enzymes by introducing 90º kinks to amino acid chains.
  </figcaption>
</figure>

## Binding preference

The folding structure of enzymes in Typogenetics isn't just for fun. We use this structure to determine which base on a strand the enzyme should bind to initially. Holding the orientation of the first segment to the right, the orientation of the last segment determines the binding-preference of the enzyme.

The ultimate function of the amino acid depends on small contributions from all amino acids, similar to how the 3D structure of a protein determines its function in real biology.

<figure id="figure10">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/binding-preference.svg?cache=1" width="350">
  <figcaption><strong>Figure 10: </strong>Binding preferences &mdash; The relative orientation of the first and last segments of an enzyme's secondary/tertiary structure determines the binding-preference of the enzyme.</figcaption>
</figure>

## Filling in the details

At this point, we've covered all the major design features of Typogenetics, which completes our simulation of the [central dogma of molecular biology](https://en.wikipedia.org/wiki/Central_dogma_of_molecular_biology).

If you're inspired to implement Typogenetics yourself, you will need a few more details. If you want to skip the details, you can jump to the next section.

<details>
<summary>Show me the details ||| Hide the details</summary>

### Table of amino acid rewrite rules

| Amino Acid                    | Rule                                           |
| ----------------------------- | ---------------------------------------------- |
| <span class="snip">cut</span> | cut strand(s)                                  |
| <span class="snip">del</span> | delete a base from strand                      |
| <span class="snip">swi</span> | switch enzyme to other strand                  |
| <span class="snip">mvr</span> | move one unit to the right                     |
| <span class="snip">mvl</span> | move one unit to the left                      |
| <span class="snip">cop</span> | turn on Copy mode                              |
| <span class="snip">off</span> | turn off Copy mode                             |
| <span class="snip">ina</span> | insert A to the right of this unit             |
| <span class="snip">inc</span> | insert C to the right of this unit             |
| <span class="snip">ing</span> | insert G to the right of this unit             |
| <span class="snip">int</span> | insert T to the right of this unit             |
| <span class="snip">rpy</span> | search for the nearest pyrimidine to the right |
| <span class="snip">rpu</span> | search for the nearest purine to the right     |
| <span class="snip">lpy</span> | search for the nearest pyrimidine to the left  |
| <span class="snip">lpu</span> | search for the nearest purine to the left      |

### Clarifications

- `cut` applies to both strands.
- `del` applies to only the strand on which the enzyme is working.
- `swi` moves the enzyme to the attached strand above the current strand. if there is no complementary base where the enzyme is currently bound, then the enzyme just detaches itself.
- Insertion instructions will insert into both strands if Copy mode is on (with the complement inserted into the other strand). If Copy mode is off then a blank space is left in the complementary strand.
- If Copy mode is on and move or search instructions are encountered, then complementary bases should be manufactured everywhere the current strand slides.

</details>

## Try it out

I've implemented a command line interface for Typogenetics. You can test translation from strands to enzymes and the application of enzymes to strands. You can also simulate many generations of rewrites in search of a particular function or with open-ended search.

```bash
# Translate a single strand into an enzyme
typo translate ATAGAGAGATCACATGTACGATAC

# Apply an enzyme to a strand to produce a set of new strands
typo rewrite cop-mvl-mvr-swi-cut-rpy AATACTAAACCGA --debug

# Simulate many generations of rewrites with a starting strand
typo simulate ATAGCGAATAGGATAATG --iter 10000 --seed 42

# Search for all strands that code for enzymes with similar function
typo search ATAAACGATAATTGACAGAGCGAATG ATCGATAGGGAACATGTCGT --edits 5 --depth 20 --seed 42
```

<github-button user="gregorybchris" repo="typogenetics"></github-button>

In these last two sections, I want to consider implications of potential tweaks to the system and explore some loose connections to other areas that are analogous to Typogenetics.

## Extensions

### Larger codon size

If a codon is comprised of two nucleotides, then a single base can be translated into two different amino acids depending on the initial binding site. A codon of three nucleotides allows for three distinct meanings that a single base takes on, effectively increasing the density of genes without increasing the length of a strand. There may be a very good reason living systems on Earth use a codon of size three. I would be interested to explore the effects of codons of size 4, 5, 6. The size of the instruction set need not increase to accommodate an increased number of possible codons. Just as in real biology, a large diversity of nucleotide combinations can be mapped to a smaller set of amino acids with redundancy built in. Would increasing the density of genetic information on a strand help us evolve complex systems faster?

### More nucleobases

In real biology we have pyrimidines and purines. I would be curious to add a third category of bases. If I had to guess, C, T, G, A is close to the only code that satisfies both requirements of simplicity and error correction. Simplicity is a requirement because anything more complex would have been vanishingly unlikely to evolve out of primordial metabolic networks. And error correction, of course, to ensure genetic code would be stable enough to propagate over time. However we could have had a true binary code. Which makes me wonder what the effect would be of a hexadecimal code. Does increasing the number of available nucleotides increase the expressive power?

### Complex instruction set

The instruction set of 15 amino acids that Hofstadter gives us is certainly not the simplest possible instruction set, though there's something very beautiful about it being as reduced as it is. One does wonder how powerful strand rewriting could be with a few more instructions. I also wonder if the conditional rules that come in the box are a bit too complex, even. We currently can scan left/right until reaching a pyrimidine/purine. These are are conditionals, but not as simple as "if purine, move left one unit" (think [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck)). Perhaps conditionals that simple could facilitate the evolution of more stable enzymes even if the enzymes need to be longer to do anything useful.

## Connections

### Turing completeness

While I have not found anything definitive about whether Typogenetics is [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), I would not be surprised if it were proven to be Turing incomplete. While there is certainly the ability to write to a tape, the lack of a set of states for the machine to be in is a bit worrying. Endowing an enzyme with a small finite state machine could be an interesting way to increase its representational power.

### Sequence to sequence modeling

Would it be possible to train a sequence to sequence model to apply an enzyme to a strand with the same rules as Typogenetics? Many instructions seem difficult to me to represent, but perhaps there's a recurrent architecture that could represent the full instruction set.

### Parallelism

Without changing the specification of Typogenetics at all it would be cool to speed up its execution by parallelizing. While each rewrite step is fundamentally serial, the processing of strands is an embarrassingly parallel operation. Especially if selection of strands and enzymes to interact is completely random, we are guaranteed to have no race conditions.

### Adding a spatial dimension

Inspired by Axelrod & Hamilton (1981) and Nowak & May (1992), you could limit strands to move around a "physical" space. Requiring interactions between enzymes and strands to be limited to spatially local interactions might promote more variation in evolved structures. More variation might come at the cost of lower complexity at first, but I can imagine some very improbable yet very destructive enzymes dominating if their radius of interaction is effectively infinite. Akin to ancient hydrothermal vents, rare pockets of fertile quiet may be necessary for fragile complexity to emerge slowly, undisturbed by its chaotic environment.

### Tuning

Many find it incredible that the John Horton Conway's Game of Life can produce and maintain so much complexity with such simple rules. I believe I remember Conway reacting to this impression in an interview once, saying something about how it's really not that incredible at all, given that the rules of the game were specifically selected in order to elicit that exact behavior of complexity and sustained complexity. I'm not sure if by that he meant that the rules were mathematically derived to produce the desired behavior or that the rules were tuned semi-blindly until the desired behavior emerged. Regardless, it has always intrigued me that if complex/interesting behavior does not initially emerge from a fairly complicated system, perhaps complex behaviors might emerge after fine-tuning parameters of that complicated system. Is there a way to parameterize the instructions of Typogenetics in such a way that they become tunable? Is there a metric we can optimize toward once we do have tunable instructions? If there's no good metric for complexity, what metric is worth optimizing?

In an [interview](https://youtu.be/R9Plq-D1gEk?si=-uQe6GJrdUg9m6eh&t=290) with the Numberphile YouTube channel, Conway explains that the rules of the Game of Life were discovered through a process of trial and error.

> "[The Game of Life] was different for quite a long time. We tinkered with these rules and finally came up with the ones I said. And they really seemed to have very nice properties. Namely [we] didn't seem to be able to predict what would happen. And in the end we succeeded in proving essentially anything could happen. These things could do any kind of computation you wanted to do." -- John Horton Conway

### Genotype Networks

Informed by Andreas Wagner's research, you could model the space of enzymes. A genotype is close to another genotype in genotype space if their edit distance is small. But exploration of this space to find another genotype with the same phenotype (enzyme function) is relatively easy given all of the dimensions (units of a strand) along which we can search. As Wagner explains in "Arrival of the Fittest" (2014), you're looking for many needles in the same haystack. If this theory is correct, it should be very easy to cross vast distances in genotype space (large strand edit distance) while remaining stationary in phenotype space (coding for the same enzyme). You would also expect the vast majority of genotypes in close proximity to each other to inhabit extremely diverse regions of phenotype space. In this way the tendrils of these genotype networks are both extremely disconnected from other networks while also being tightly interwoven.

- [Arrival of the Fittest Goodreads](https://www.goodreads.com/book/show/20821275-arrival-of-the-fittest)
- [Arrival of the Fittest Amazon](https://www.amazon.com/Arrival-Fittest-How-Nature-Innovates/dp/1617230219)
- [Pipes demo](https://1j01.github.io/pipes)
- [History of the Windows 3D Pipes screensaver](https://devblogs.microsoft.com/oldnewthing/20240611-00/?p=109881)

## Wrapping up

I hope you enjoyed some of the visuals in this post.

## Citations

```bibtex
@article{axelrod1980effective,
  author  = {Axelrod, Robert},
  title   = {Effective Choice in the {Prisoner's Dilemma}},
  journal = {Journal of Conflict Resolution},
  volume  = {24},
  number  = {1},
  pages   = {3--25},
  year    = {1980},
  doi     = {10.1177/002200278002400101}
}

@article{nowak1992spatial,
  author  = {Nowak, Martin A. and May, Robert M.},
  title   = {Evolutionary Games and Spatial Chaos},
  journal = {Nature},
  volume  = {359},
  number  = {6398},
  pages   = {826--829},
  year    = {1992},
  doi     = {10.1038/359826a0}
}

@book{wagner2014arrival,
  author    = {Wagner, Andreas},
  title     = {Arrival of the Fittest: Solving Evolution's Greatest Puzzle},
  publisher = {Current},
  address   = {New York},
  year      = {2014},
  isbn      = {9781591846468}
}
```
