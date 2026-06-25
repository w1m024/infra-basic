# Open Source Playbook

This document provides the path from learner to vLLM / SGLang open source contributor. The goal is to lower the barrier for first contribution while avoiding choosing tasks that are too large initially.

## Contribution Principles

```text
Reproduce first → Locate → Minimal fix → Submit PR
```

Don't set your first contribution goal as "optimize scheduler" or "write kernel". A more reasonable path is:

```text
Documentation
→ example
→ issue reproduction
→ regression test
→ benchmark reproduction
→ small bugfix
→ small feature
→ core system change
```

## Required Skills Before Contributing

### Engineering Skills

- Can create isolated virtual environments
- Can install projects from source
- Can run unit tests or specific tests
- Can read tracebacks
- Can write minimal reproduction scripts
- Can record complete environment information
- Can organize changes with Git branches

### LLM Serving Knowledge

- Know prefill / decode
- Know KV cache
- Know continuous batching
- Know streaming
- Know benchmark metrics
- Know OpenAI-compatible API
- Know workload distribution affects benchmarks

## First Type: Documentation PR

This is the most suitable entry point for beginners.

### What to Fix

- Quickstart commands that don't work
- Parameter name changes
- Example models no longer available
- Example code missing dependencies
- Documentation missing hardware requirements
- Documentation missing common errors
- Incomplete benchmark steps
- Missing OpenAI-compatible API examples

## Second Type: Issue Reproduction

### How to Find Issues

- Look for issues labeled "good first issue"
- Look for issues with clear reproduction steps
- Look for issues in areas you've already read source code for

### Reproduction Template

```markdown
## Environment

- OS:
- GPU:
- Driver:
- CUDA:
- Python:
- PyTorch:
- vLLM/SGLang version or commit:
- Model:

## Command

```bash
# exact command
```

## Expected behavior

...

## Actual behavior

...

## Logs

```text
...
```

## Minimal reproduction

```python
...
```
```

## Third Type: Test / Benchmark PR

### When to Contribute Tests

- You found a bug and want to add regression test
- You noticed missing test coverage for a feature
- You want to add benchmark for a specific workload

## PR Quality Checklist

Before submitting:

- [ ] PR description explains the problem and solution
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and concise
- [ ] No unrelated changes included

## Common Mistakes

- Submitting PR without reading contribution guidelines
- Making changes too large for first contribution
- Not running tests before submitting
- Not responding to review feedback promptly
- Including unrelated changes in one PR
