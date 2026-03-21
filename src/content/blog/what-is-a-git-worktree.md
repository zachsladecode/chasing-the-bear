---
title: "What Even Is a Git Worktree?"
date: "2026-03-21"
category: "Software Engineering"
tags: ["git", "tooling", "workflow"]
summary: "You have been switching branches and stashing work for years. There is a better way — and it has been in Git the whole time."
draft: false
---

You are twenty minutes deep into a feature. You have half a function written, two files open, and a mental model of what you are building that took a while to construct. Then someone messages you: "hey, can you look at this bug on main real quick?"

And now you have a decision to make.

## The three options

Most developers land on one of two moves here, and neither feels great.

**Option one: commit what you have.** Works, but now your history has a "WIP: halfway through the thing" commit that you will need to clean up later. If you forget, it lives there forever, quietly judging you.

**Option two: stash it.** `git stash` was built for exactly this situation, and it is fine — until you have three stashes with unhelpful names, or you pop the wrong one, or you forget a stash exists and then later find it like a sticky note from past you with no context.

There is a third option most developers do not know exists: **add a new worktree**.

## What a worktree actually is

When you clone a repo, two things happen. Git downloads the repository itself — all the commits, all the branches, the full history — into a `.git` folder. Then it creates a *working directory*: the folder you actually open in your editor with your project files checked out.

That working directory is a worktree. You have been using one this whole time.

What most people do not know is that a single Git repository can have *multiple* working directories attached to it simultaneously. You can check out `main` in one folder and `hotfix/urgent-bug` in another folder, both pointing at the same `.git` folder, both fully functional.

That is a Git worktree.

## Why not just clone the repo twice?

This is the question that comes up every time. Cloning twice gives you two separate working directories — why not just do that?

A few reasons.

**You duplicate the history.** A clone stores a full copy of every object in the repository. For a large repo with years of commits, that is a lot of disk space, multiplied by however many copies you make.

**You have to keep them in sync manually.** Run `git fetch` in one clone, and the other one has no idea. You need to remember to update every clone separately. Miss one and you are working with stale branch information.

**You lose branch protection.** Git will not let you check out the same branch in two worktrees at the same time. That sounds like a restriction, but it is actually a feature — it prevents you from making conflicting changes to the same branch from two different locations and wondering why things are broken. Two clones have no such protection. Nothing stops you from opening the same branch in both and making a mess.

With a proper worktree, all of that goes away. One `.git` folder. One fetch to update everything. Shared history, shared refs, and Git actively protecting you from the footgun.

## The mental model

The framing that clicked for me: **a worktree is a view, not a copy**.

When you add a worktree, you are asking Git to open a new window into the same repository — a different working directory with a different branch checked out. The underlying repo is unchanged. You are not duplicating anything; you are just looking at it from another angle.

Think of it like having multiple tabs open in your editor. Same project, same files on disk, different context in each tab. Switching tabs does not copy the project — it just changes what you are looking at. Worktrees are similar, except the "tabs" are real directories on your filesystem with their own `HEAD`, their own index, and their own uncommitted changes.

That last part is the key difference from stashing. When you stash, you are hiding your work to get it out of the way. When you add a worktree, your work just *stays where it is*. You walk over to a different room. The first room does not disappear.

## When to reach for it

Worktrees are not a replacement for stashing — they are a different tool for different situations. Stash is fine for quick, low-stakes context switches. Worktrees earn their keep when:

- You need to review a pull request without abandoning your current branch
- You are running a long build or test suite in one branch and want to keep working in another
- You keep a `main` worktree always clean and ready so you can respond to production issues immediately
- You are doing anything that benefits from having two branches side by side on disk at the same time

The overhead is minimal. Adding a worktree takes one command. Removing it takes one command. The repo itself is untouched.

## What comes next

This post covers the concept. The next one goes hands-on: the actual commands, flags worth knowing, how to structure your directories, and the one thing Git will refuse to let you do (and why that is a good thing).

If you have been stashing and switching multiple times a day, worktrees are worth fifteen minutes of your time. That is the whole pitch.
