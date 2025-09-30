---
date: 2023-12-28
slug: visualizing-typogenetics
title: Visualizing Typogenetics
archived: false
---

If you found this post, you may be familiar with Douglas Hofstadter's <strong>Typogenetics</strong> as described in his book <i>Gödel, Escher, Bach: An Eternal Golden Braid</i> (1979). If not, that's great because in this post I want to give a step-by-step specification of Typogenetics and provide visual intuitions for how the system works.

## Overview of Typogenetics

Typogenetics (or &ldquo;typographical genetics&rdquo;) is a toy model of biological genetics. It boils real biology down to a small set of concepts and rules to make the core principles of genetics more intuitive.

In the real genetics of life on Earth, our DNA is made of four molecules called nucleobases: Adenine (A), Cytosine (C), Guanine (G), and Thymine (T). All the information for how to build a person, a peanut, or a parrot is encoded in a long and winding sequence of these four bases.

In his book, Hofstadter explores what he calls a &ldquo;strange loop&rdquo; &mdash; how is it that this genetic code can be interpreted to build complex machines called proteins, which have the power assemble more strands of DNA?

## Spec

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
- if Copy mode is on and move or search instructions are encountered, then complementary bases should be manufactured everywhere the current strand slides.

### Translation

The first base from each duplet is on the y-axis and the second base is on the x-axis (ex. GC &rarr; `inc`)

|     | A                             | C                             | G                             | T                             |
| --- | ----------------------------- | ----------------------------- | ----------------------------- | ----------------------------- |
| A   |                               | <span class="snip">cut</span> | <span class="snip">del</span> | <span class="snip">swi</span> |
| C   | <span class="snip">mvr</span> | <span class="snip">mvl</span> | <span class="snip">cop</span> | <span class="snip">off</span> |
| G   | <span class="snip">ina</span> | <span class="snip">inc</span> | <span class="snip">ing</span> | <span class="snip">int</span> |
| T   | <span class="snip">rpy</span> | <span class="snip">rpu</span> | <span class="snip">lpy</span> | <span class="snip">lpu</span> |

> Note: The AA duplet does not code for an amino acid. It is reserved as a "punctuation mark" to mean "end of enzyme". Multiple amino acid sequences can be created from a single strand during translation.

### Folding

Each amino acid has the possibility of inducing a kink in the enzyme. "r" indicates a right turn in the enzyme, "l" indicates a left turn, and "s" indicates no turn induced and the enzyme remains straight at that amino acid.

| ins                           | dir |
| ----------------------------- | --- |
| <span class="snip">cut</span> | s   |
| <span class="snip">del</span> | s   |
| <span class="snip">swi</span> | r   |
| <span class="snip">mvr</span> | s   |
| <span class="snip">mvl</span> | s   |
| <span class="snip">cop</span> | r   |
| <span class="snip">off</span> | l   |
| <span class="snip">ina</span> | s   |
| <span class="snip">inc</span> | r   |
| <span class="snip">ing</span> | r   |
| <span class="snip">int</span> | l   |
| <span class="snip">rpy</span> | r   |
| <span class="snip">rpu</span> | l   |
| <span class="snip">lpy</span> | l   |
| <span class="snip">lpu</span> | l   |

### Binding-Preferences

The relative orientation of the first and last segments of an enzyme's tertiary structure determines the binding-preference of the enzyme.

Holding the orientation of the first segment to the right, the orientation of the last segment determines the binding-preference of the enzyme.

| first | last | base |
| ----- | ---- | ---- |
| R     | R    | A    |
| R     | U    | C    |
| R     | D    | G    |
| R     | L    | T    |

### Limitations to the Analogy

DNA chains are made up of nucleotides. Each nucleotide is made up of 1. a phosphate group, 2. a ribose sugar, and 3. a base. In Typogenetics we drop the first two components of a nucleotide and our strands are just composed of bases.

Enzymes are one type of protein. All proteins in Typogenetics can actively operate on strands, so we just refer to all proteins in Typogenetics as enzymes.

Transcription is the process of turning DNA into mRNA, which is then read by ribosomes to create proteins through the process of translation. In Typogenetics we skip this step and our program (the player of the Typogenetics game) does the job of a ribosome, creating enzymes without any machinery built from genetic code.

Proteins are actually made up of 20 distinct amino acids, compared to the 15 in Typogenetics.

Typically about 300 amino acids make up a complete protein. Strands of DNA can be made up of hundreds of thousands or millions of nucleotides. Compare to Typogenetics where strands are potentially much shorter and amino acid sequences are potentially on the order of the length of strands of bases.

Three consecutive bases/nucleotides form a "codon". Since there are 4 bases and each codon has 3 bases, the number of possible codons is 4x4x4 = 64. Seeing as there are 20 amino acids, multiple codons will map to a single amino acid.

Finally, in real biology there is no 1:1 relationship between an amino acid and some operation. The tertiary structure of a protein decides the function of the protein. It is the full context of the protein that determines how any one amino acid will function.

The full source code for this project is available on <a href="https://github.com/gregorybchris/typogenetics" target="_blank">GitHub</a>.
