---
date: 2024-01-07
slug: on-typogenetics
title: "On Typogenetics: Visualizations and Connections"
archived: false
status: draft
---

Maybe you've never heard of Typogenetics or maybe you're a long time fan of Douglas Hofstadter's award-winning book _Gödel, Escher, Bach: An Eternal Golden Braid_ (1979). Either way, this blog post is for you.

The book is incredible, but books don't have animations. So I've picked out the major ideas from the book and paired them with animated visuals to help make the concepts more intuitive.

## What's Typogenetics?

Typogenetics (short for "typographical genetics") is a toy model of biological genetics. It boils real biology down to a small set of concepts and rules to make the core principles of genetics more intuitive.

In the real biology of life on Earth, our DNA is made of four molecules called nucleobases: Adenine (A), Cytosine (C), Guanine (G), and Thymine (T). All the information for how to build a person, a peanut, or a parrot is encoded in a long and winding sequence of these four molecules.

In his book, Hofstadter explores what he calls a "strange loop" -- a mind-bending process where molecular machines interpret genetic code to produce more machines that are programmed with the very same code.

This powerful cycle at the core of all life on Earth is full of complex chemistry, but you might wonder: how much of this complexity can we afford to toss aside and retain the strange loop? This is what Typogenetics aims to answer.

## Building blocks

Just like in real DNA, we'll start with four building blocks: A, C, G, and T. We'll call these "bases". And for the purposes of Typogenetics, we don't care at all about the actual chemistry of these four chemicals.

<figure id="figure1">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/bases.svg?cache=1" width="350">
  <figcaption><strong>Figure 1: </strong>Bases &mdash; The four bases and their two groups: A and G are both called "pyrimidines" and C and T are "purines".</figcaption>
</figure>

If we string a few of these bases together we'll call that a "strand". Each position along a strand is called a "unit".

<figure id="figure2">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/strand.svg?cache=1" width="350">
  <figcaption><strong>Figure 2: </strong>Strands &mdash; Bases strung together in any order form a strand.</figcaption>
</figure>

## Rewriting

When we apply rules to a strand, it gets rewritten into a new strand. A sequence of rules is called an "enzyme". Let's look at an example of an enzyme made up of three rules:

1. Delete the unit to which the enzyme is bound (and then bind to the next unit to the right).
2. Move one unit to the right.
3. Insert a T (to the immediate right of this unit)

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

Each of these rules is called an "amino acid". A very useful amino acid is called `cut`, which slices a strand to the right of the current unit, producing two strands.

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

Another useful amino acid is `cop`, which turns on "Copy mode". When Copy mode is on, new bases bind to the current strand. Specifically, A binds to T, and C binds to G. These are called "complementary base pairs". When Copy mode is on, any time the enzyme moves left or right, a new complementary base is added to the other strand.

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

Next let's see what happens if we cut where the strand is being copied. You can see that we get a couple of free-floating strand fragments. A single enzyme acting on a single strand can produce many strands as output.

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

<figure id="figure7">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/amino-acid-table.svg?cache1" width="300">
  <figcaption><strong>Figure 7: </strong>Amino acids &mdash; This description will need to be filled in.</figcaption>
</figure>

> Note: The AA duplet does not code for an amino acid. It is reserved as a "punctuation mark" to mean "end of enzyme". Multiple amino acid sequences can be created from a single strand during translation.

## Binding preference

<figure id="figure8">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/binding-preference.svg?cache=1" width="350">
  <figcaption><strong>Figure 8: </strong>Binding preferences &mdash; This description will need to be filled in.</figcaption>
</figure>

The relative orientation of the first and last segments of an enzyme's tertiary structure determines the binding-preference of the enzyme.

Holding the orientation of the first segment to the right, the orientation of the last segment determines the binding-preference of the enzyme.

## Translation

<figure id="figure9">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/translation.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 9: </strong>
    Translation &mdash; This description will need to be filled in.
  </figcaption>
</figure>

Each pair of bases is assigned to one amino acid.

<figure id="figure10">
  <img src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/duplet.svg?cache=1" width="350">
  <figcaption><strong>Figure 10: </strong>Strand &mdash; This description will need to be filled in.</figcaption>
</figure>

## Tertiary structure

Each amino acid has the possibility of inducing a kink in the enzyme. "r" indicates a right turn in the enzyme, "l" indicates a left turn, and "s" indicates no turn induced and the enzyme remains straight at that amino acid.

<figure id="figure11">
  <video width="450" autoplay muted loop playsinline>
    <source src="https://storage.googleapis.com/cgme/blog/posts/on-typogenetics/folding.mp4?cache=3" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption>
    <strong>Figure 11: </strong>
    Folding &mdash; This description will need to be filled in.
  </figcaption>
</figure>

### Instructions

| ins                           | action                                         |
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

There are also some clarifications offered that preemptively address ambiguities that may have otherwise arisen:

- `cut` applies to both strands.
- `del` applies to only the strand on which the enzyme is working.
- `swi` moves the enzyme to the attached strand above the current strand. if there is no complementary base where the enzyme is currently bound, then the enzyme just detaches itself.
- insertion instructions will insert into both strands if Copy mode is on (with the complement inserted into the other strand). if Copy mode is off then a blank space is left in the complementary strand.
- if Copy mode is on and move or search instructions are encountered, then complementary bases should be manufactured everywhere the current strand slides.DNA chains are made up of nucleotides. Each nucleotide is made up of 1. a phosphate group, 2. a ribose sugar, and 3. a base. In Typogenetics we drop the first two components of a nucleotide and our strands are just composed of bases.

Enzymes are one type of protein. All proteins in Typogenetics can actively operate on strands, so we just refer to all proteins in Typogenetics as enzymes.

Transcription is the process of turning DNA into mRNA, which is then read by ribosomes to create proteins through the process of translation. In Typogenetics we skip this step and our program (the player of the Typogenetics game) does the job of a ribosome, creating enzymes without any machinery built from genetic code.

Proteins are actually made up of 20 distinct amino acids, compared to the 15 in Typogenetics.

Typically about 300 amino acids make up a complete protein. Strands of DNA can be made up of hundreds of thousands or millions of nucleotides. Compare to Typogenetics where strands are potentially much shorter and amino acid sequences are potentially on the order of the length of strands of bases.

Three consecutive bases/nucleotides form a "codon". Since there are 4 bases and each codon has 3 bases, the number of possible codons is 4x4x4 = 64. Seeing as there are 20 amino acids, multiple codons will map to a single amino acid.

Finally, in real biology there is no 1:1 relationship between an amino acid and some operation. The tertiary structure of a protein decides the function of the protein. It is the full context of the protein that determines how any one amino acid will function.

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

### Terminology

| term                       | definition                                                                    |
| -------------------------- | ----------------------------------------------------------------------------- |
| bases                      | C, G, T, A                                                                    |
| strand                     | string of bases                                                               |
| unit                       | position within a strand                                                      |
| purines                    | A and G                                                                       |
| pyrimidines                | C and T                                                                       |
| complementary base pairing | when a strand is copied pyrimidines swap with purines, A &harr; T, C &harr; G |
| enzymes                    | operate on strands one unit at a time                                         |
| instruction                | an operation performed by an enzyme                                           |
| amino acid                 | three letter abbreviation for an instruction performed by an enzyme           |
| duplet                     | an adjacent pair of bases                                                     |
| translation                | mapping from duplets to instructions                                          |
| primary structure          | amino acid sequence                                                           |
| tertiary structure         | folded structure of an enzyme                                                 |
| gene                       | a portion of a strand that codes for a single enzyme                          |
| ribosome                   | reads strands and produces enzymes                                            |

## Reflections

I'll offer some potential ways to extend Hofstadter's system and explore some loose connections to other areas that are analogous or related to Typogenetics.

## Extensions

### Larger codon size

If a codon is comprised of two nucleotides, then a single base can be translated into two different amino acids depending on the initial binding site. A codon of three nucleotides allows for three distinct meanings that a single base takes on, effectively increasing the density of genes without increasing the length of a strand. There may be a very good reason living systems on Earth use a codon of size three. I would be interested to explore the effects of codons of size 4, 5, 6. The size of the instruction set need not increase to accommodate an increased number of possible codons. Just as in real biology, a large diversity of nucleotide combinations can be mapped to a smaller set of amino acids with redundancy built in. Would increasing the density of genetic information on a strand help us evolve complex systems faster?

### More nucleobases

In real biology we have pyrimidines and purines. I would be curious to add a third category of bases. If I had to guess, C, T, G, A is close to the only code that satisfies both requirements of simplicity and error correction. Simplicity is a requirement because anything more complex would have been vanishingly unlikely to evolve out of primordial metabolic networks. And error correction, of course, to ensure genetic code would be stable enough to propagate over time. However we could have had a true binary code. Which makes me wonder what the effect would be of a hexadecimal code. Does increasing the number of available nucleotides increase the expressive power?

### Complex instruction set

The instruction set of 15 amino acids that Hofstadter gives us is certainly not the simplest possible instruction set, though there's something very beautiful about it being as reduced as it is. One does wonder how powerful strand rewriting could be with a few more instructions. I also wonder if the conditional rules that come in the box are a bit too complex, even. We currently can scan left/right until reaching a pyrimidine/purine. These are are conditionals, but not as simple as "if purine, move left one unit". Perhaps conditionals that simple could facilitate the evolution of more stable enzymes even if the enzymes need to be longer to do anything useful.

## Connections

### Turing completeness

While I have not found anything definitive about whether Typogenetics is Turing complete, I would not be surprised if it were proven to be Turing incomplete. While there is certainly the ability to write to a tape, the lack of a set of states for the machine to be in is a bit worrying. Endowing an enzyme with a small finite state machine could be an interesting way to increase its representational power.

[Turing completeness](https://en.wikipedia.org/wiki/Turing_completeness)

### Sequence to sequence modeling

Would it be possible to train a transformer to apply an enzyme to a strand?

### Parallelism

Without changing the specification of Typogenetics at all it would be cool to speed up its execution by parallelizing. While each rewrite step is fundamentally serial, the processing of strands is an embarrassingly parallel operation. Especially if selection of strands and enzymes to interact is completely random, there are guaranteed to be no race conditions.

### Adding a spatial dimension

Inspired in part by Axelrod's experiments with agents playing the iterated prisoner's dilemma, you could limit strands to move around a "physical" space. Requiring interactions between enzymes and strands to be limited to spatially local interactions might promote more variation in evolved structures. More variation might come at the cost of lower complexity at first, but I can imagine some very improbable yet very destructive enzymes dominating if their radius of interaction is effectively infinite. Akin to ancient hydrothermal vents, rare pockets of fertile quiet may be necessary for fragile complexity to emerge slowly, undisturbed by its chaotic environment.

[Nowak & May paper](https://www.nature.com/articles/359826a0)

<!-- TODO: cite this correctly in the footnotes -->

```txt
Nowak, M., May, R. Evolutionary games and spatial chaos. Nature 359, 826–829 (1992). https://doi.org/10.1038/359826a0
```

One of the major findings is that placing players on a lattice (or spatial array) and restricting interactions to local neighbors (rather than well-mixed populations) can allow cooperators (C) and defectors (D) to coexist indefinitely, often in striking spatial patterns, rather than one strategy driving out the other.

Nowak & May (1992) showed that even with memoryless (pure) cooperators and defectors, when arranged on a 2D lattice with local updating, complex spatial patterns emerge, with cooperator clusters resisting invasion by defectors and defectors persisting on cluster boundaries.

More generally, Nowak, May, and others extended the model to probabilistic updating, irregular spatial lattices, and asynchronous updating, and found that the essential outcome — polymorphic coexistence of C and D over a range of payoff parameters — is robust.

In particular, in "Spatial Games and the Maintenance of Cooperation", Nowak et al. argue that spatial interactions are sufficient (i.e. without memory, reciprocity, or sophisticated strategies) to maintain a mixture of cooperators and defectors across a wide parameter range.

Thus, the result is not that "Tit-for-Tat beats all others" under spatial constraints per se, but that spatial structure fundamentally alters which strategies can persist and how cooperation can be sustained even without complex memory.

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
