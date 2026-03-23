---
title: "What Is a Git Worktree?"
date: "2026-03-23"
category: "Software Engineering"
tags: ["git", "tooling", "workflow"]
summary: "You have been switching branches and stashing work for years. There is a better way — and it has been in Git the whole time."
draft: false
---

Working as a software engineer, I frequently have to switch between multiple tasks. Stashing changes in one branch to resume work in another or spinning up an entirely new branch for a critical hot fix. Up until recently I thought that was just par for the course.

But that's not the case. Git worktrees let you check out multiple branches of the same repo simultaneously — each in its own directory, all backed by the same underlying history and object store.

Baz Luhrmann said the real troubles in your life are *"the kind that blindside you at 4:00 pm on some idle Tuesday."* He was talking about life. He could have been talking about your git workflow.

Here's the scenario that made me actually go looking for something better. Three days into a feature — nothing committed yet, just a pile of half-finished changes and a mental map of what you're building. Then the ping comes. Production is down. Can you look at it?

Now you're running through your options:

## The Three Options — and Why Two of Them Suck

**Option 1: Commit the WIP.** Just get your changes out of the way. You add everything, write `"wip"` in the commit message, and feel a little gross about it. Your git log now reads: `wip`, `temp`, `DO NOT MERGE`. Fine, it works — but it's not how you want to work.

**Option 2: Stash.** `git stash` saves your work in a little bundle off to the side. You switch branches, fix the bug, come back, run `git stash pop`. Most of the time it's fine. But stash is fragile. Easy to forget what you stashed. Dangerous to pop if you've stashed multiple things. And if something goes sideways during the pop, you're untangling a mess. It's the right tool, just for the wrong job.

Neither feels great. Both feel like workarounds. Because they are.

There's a third option. It's been in Git the whole time. You just weren't told about it.

## Let Me Give You a Mental Model First

Here's the honest version: a worktree does put another set of source files on disk. You're not getting something for nothing.

What you're *not* duplicating is the `.git` folder — the thing that stores all your history, every commit, every object ever written. In a mature repo, that's where the real weight lives. The source files are small by comparison.

So think of it less like "no duplication" and more like: **two working directories, one git history**. You pay for the extra checkout, but you don't pay for the extra past.

## So What Actually Is a Worktree?

A worktree is just a working directory — a folder on disk with a checked-out version of your project. You already have one. Every single clone creates a default worktree automatically. The `git worktree` feature just lets you add more.

Each additional worktree is checked out to a different branch. Under the hood, the linked worktree contains a `.git` file — not a folder — that's a pointer back to an admin directory inside the main repo's `.git/worktrees/`. The object store, history, and refs all live in the original `.git/`. The working files and checkout state are separate per worktree; everything else is shared.

Here's what that looks like on disk:

```
+---------------------------------------+
|        .git/  (your repository)       |
|  history . branches . commits . all   |
+-------------------+-------------------+
                    |
          +---------+---------+
          |                   |
+---------+------+   +--------+---------+
|    my-app/     |   |  my-app-hotfix/  |
|  [feature/     |   |  [hotfix/        |
|   dashboard]   |   |   login-bug]     |
+----------------+   +------------------+
  working dir 1         working dir 2
```

Two folders. One git history. Both fully live.

## What It's NOT

A few things to clear up before they become assumptions:

- **Not a clone.** You get another set of checked-out files, yes — but no duplicated `.git` folder, no separate history, no second copy of every commit.
- **Not a branch trick.** You're not switching branches on one directory — you have *two directories on disk at the same time*.
- **Not magic.** It's a folder. You `cd` into it. Your editor opens it. It behaves like any other project directory.

One-liner: it's just a folder that knows which branch it's on.

## Why Not Just Clone the Repo Twice?

Fair question — some people do this, and it kind of works. Here's why it falls apart:

**Duplicate history on disk.** Two full `.git` folders storing the same data. If your repo history is large, that adds up fast.

**Separate remotes to maintain.** `git fetch` in one clone doesn't update the other. You're now managing two independent copies of the same project.

**No guardrails.** Nothing stops you from checking out the same branch in both clones and making conflicting changes. Git has no idea — they're just two separate repos as far as it knows.

With worktrees:

- One `.git`. No duplication.
- `git fetch` from any worktree updates all of them.
- Git actively **prevents** checking out the same branch in two worktrees simultaneously — multiple views of the same project, using the same repository instance.

## A Quick Peek

I won't get into the full command set yet — that's the next post. But here's what it looks like when you have two worktrees running:

```bash
$ git worktree list
/Users/zach/projects/my-app          a3f92c1 [feature/new-dashboard]
/Users/zach/projects/my-app-hotfix   b74e210 [hotfix/login-bug]
```

Two directories. Same repo. No stash. No WIP commit.

You fix the hotfix in `my-app-hotfix/`, merge it, then `cd` back to `my-app/` — and your feature is exactly where you left it.

## The Scenario, Resolved

You get the ping. Instead of stashing or committing garbage, you run one command. A new folder appears. You fix the bug. You merge. You `cd` back. Your feature is untouched.

That's it. That's the whole pitch.

Next up: let's actually build one. I'll walk you through the full command set using exactly this scenario — you're mid-feature, prod breaks, and you have 10 minutes.
