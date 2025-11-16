# Exploring keyboard mapped pointer navigation

With the exception of this file and `docs/function_spec.odg`, everything in this repo has been generated using Google's Gemini CLI.

## Background
I recently installed Omarchy which has become my "daily driver". Omarchy is a keyboard-centric Arch Linux flavour and comes with a heap of key-bindings, a tiling window manager and a bunch of TUIs - the net effect is that having to switch to the mouse feels quite jarring when you're in flow on some task with the keyboard.

I've used MouseKeys on macOS before but it's very slow compared to the mouse so, I wondered if a grid-based solution might work. I tried a quick search for existing solutions and nothing came up for Linux (there are some macOS solutions that take advantage of the window control labels but they weren't available on Linux).

While my searches didn't turn up any existing solutions, I felt is was unlikely that I'd discovered something however, this did seem like a practical problem to explore using an AI coding assistant.

Read `functional_spec.odg` and `EXPERIMENT_ANALYSIS.md` to understand the idea better and read the results.

All in all, there's probably 3 hours of hacking / vibing on the solution and the results (it took me longer to figure out the approach and create the "functional spec"!).

My main take away from this was that the relative speed with which I was able to explore the solution, using Gemini in this case, makes validating ideas with simple proofs-of-concept much easier than if I'd had to build them by hand - as someone who doesn't build regularly (and that's being very generous) this is even more true.

The Gemini generated README is in `README_generated.md` - that'll tell you more about the repo and how to get the simulation going.
