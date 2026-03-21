---
title: "What Even Is a Git Worktree?"
date: "2026-03-21"
category: "Software Engineering"
tags: ["git", "tooling", "workflow"]
summary: "You have been switching branches and stashing work for years. There is a better way — and it has been in Git the whole time."
draft: false
---

You have been switching branches and stashing work for years. There is a better way.

A Git worktree lets you check out multiple branches of the same repo simultaneously — each in its own directory, sharing one `.git` folder.

## The Problem

The typical workflow: you are deep in a feature branch, someone pings you about a bug on main, you stash everything, switch branches, fix the bug, switch back, pop the stash, try to remember where you were. It works, but it is friction.

## What a Worktree Does

```bash
# Add a new worktree for the hotfix branch
git worktree add ../chasing-the-bear-hotfix hotfix/urgent-bug

# Work in it like a normal repo
cd ../chasing-the-bear-hotfix
git commit -am "fix: patch the thing"

# Remove it when done
git worktree remove ../chasing-the-bear-hotfix
```

Both directories share the same object store and refs — no duplication, instant checkout.

## When to Use It

- Reviewing a PR without leaving your current branch
- Running a long build in one branch while continuing work in another
- Keeping a `main` worktree always ready for hotfixes

## When Not To

Each worktree has its own `HEAD` and index, but they share the same refs. Because of this, Git prevents you from checking out the same branch in two worktrees simultaneously — doing so would mean two worktrees updating the same ref independently, which would corrupt the branch. They also add a little mental overhead — if you are not juggling multiple branches regularly, `git stash` is fine.

> The right tool depends on your workflow. But if you find yourself stashing and switching multiple times a day, worktrees are worth learning.
