---
title: Easy profiling for Node.js Applications
layout: docs.hbs
---

# Easy profiling for Node.js Applications

There are many third party tools available for profiling Node.js applications
but, in many cases, the easiest option is to use the Node.js built in profiler.
The built in profiler uses the profiler inside V8 which samples the stack at
regular intervals during program execution. It records the results of these
samples, along with important optimization events such as jit compiles, as a
series of ticks:
