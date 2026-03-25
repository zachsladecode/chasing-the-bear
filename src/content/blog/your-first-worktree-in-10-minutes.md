---
title: "Your First Worktree in 10 Minutes"
date: "2026-03-24"
category: "Software Engineering"
tags: ["git", "tooling", "workflow"]
summary: "Enough theory. Here's the full command set — walk through your first git worktree using exactly the scenario that makes it click."
draft: false
---

My last post ended with a promise that I would help alleviate stress when you've already committed effort to a mental model and you have to stop to turn your attention to an urgent new task.

## Revisiting The Scenario

Your three days into `feature/new-dashboard` with nothing committed. Your mental model is fully loaded.

Then you get a ping that production down with some SSO login bug and you're being tasked to look into it. No three days grace here. But how do you cleanly transition to this ask?

## Step 1: Add a Worktree

Run the following command from inside your existing project directory:

```bash
git worktree add ../my-app-hotfix hotfix/login-bug
```

Pretty elegant and simple when you stop to think about it. Here's what that command does:

- Git spun up a new directory at `../my-app-hotfix`
- It checked out a new branch called `hotfix/login-bug` into that directory
- Your original working directory — `my-app/`, with all your uncommitted feature work remains untouched.

The anatomy of the command:

```bash
git worktree add <path> <branch>
```

`<path>` is where you want the new working directory. `<branch>` is what gets checked out inside it; just like if you were to a run a `git checkout -b "branch name"` except, the branch exists in the subfolder. If the branch doesn't exist yet, Git creates it pointing at `HEAD`.

Now `cd` into it and get to work:

```bash
cd ../my-app-hotfix
# the actual hard part; fixing the bug
git add .
git commit -m "fix: resolve SSO login bug"
git push
```

## Step 2: Check What You've Got

Remember `git worktree list` from last post? Here it is for real:

```bash
$ git worktree list
/Users/zach/projects/my-app          a3f92c1 [feature/new-dashboard]
/Users/zach/projects/my-app-hotfix   b74e210 [hotfix/login-bug]
```

Two directories. Same repo. Both live. You can run this from either worktree — the output is the same either way.

## Step 3: Go Back, Clean Up

Once the hotfix is merged you can transition back to working on your original feature:

```bash
cd ../my-app
```

Your changes are exactly where you left them. Unstaged, uncommitted, untouched. Maybe your mental model was slightly fragmented but, hopefully you can pick it up again easily knowing everything is in place right as you left it.

There's only one aspect left to clean up; removing the worktree.

```bash
git worktree remove ../my-app-hotfix
```

Gone. The branch still exists in your repo — you can push, merge, or delete it from here. The working directory is just cleaned up.

## Organizing Worktrees on Disk

One thing worth thinking about before you start spinning up worktrees — where do you actually put them?

Git doesn't enforce anything here, so I'd recommend the sibling directory pattern. Your hotfix lives right next to your main project at the same level:

```text
projects/
+-- my-app/          [feature/new-dashboard]
+-- my-app-hotfix/   [hotfix/login-bug]
```

It's easy to reason about, easy to `cd` between, and easy to open in a second editor window or terminal tab without any special configuration.

Some people tuck worktrees inside the repo itself under a `worktrees/` subdirectory:

```text
my-app/
+-- worktrees/
|   +-- hotfix/      [hotfix/login-bug]
+-- src/
+-- ...
```

That works too — just be aware that your editor might pick them up as part of the project. Either pattern is fine. Just pick one and stick with it.

## A Few Gotchas Worth Knowing

### You Can't Check Out the Same Branch Twice

I mentioned this in the last post as one of the guardrails that makes worktrees better than just cloning the repo twice. Here's what it actually looks like when you try:

```bash
$ git worktree add ../my-app-2 feature/new-dashboard
fatal: 'feature/new-dashboard' is already checked out at '/Users/zach/projects/my-app'
```

Git stops you. It's not being difficult — it's protecting you from two copies of the same branch silently diverging from each other. That's a good thing.

If you genuinely need a second look at the same branch — for code review, or to run tests without disturbing your working state — you can use a detached HEAD:

```bash
git worktree add --detach ../my-app-review feature/new-dashboard
```

You get a read-only-ish view of the branch without Git treating it as a second checkout.

### Delete the Folder vs. `git worktree remove`

This one tripped me up early on. If you `rm -rf` the worktree directory manually instead of using the Git command, Git doesn't know it's gone:

```bash
rm -rf ../my-app-hotfix   # don't do this
```

What's left behind is an orphaned admin directory under `.git/worktrees/my-app-hotfix/`. Your `git worktree list` output will show a stale entry, and things can behave oddly until you clean it up.

The right way to remove a worktree is always:

```bash
git worktree remove ../my-app-hotfix
```

And if you already deleted the folder the hard way, you can recover with:

```bash
git worktree prune
```

That scans `.git/worktrees/` and clears out any entries pointing at directories that no longer exist.

### New Branch vs. Existing Branch

By default, `git worktree add <path> <branch>` will create `<branch>` if it doesn't exist yet. If the branch already exists, Git just checks it out — no flags needed either way.

Where it gets slightly different is when you want to base a new branch on something specific, like a remote branch:

```bash
git worktree add -b hotfix/login-bug ../my-app-hotfix origin/main
```

Same idea as `git checkout -b`, just scoped to the new worktree.

## The Full Command Reference

```bash
# Add a worktree on a new branch
git worktree add <path> <branch>

# Add a worktree on a new branch based on a specific starting point
git worktree add -b <branch> <path> <commit-ish>

# Add a worktree in detached HEAD state
git worktree add --detach <path> <commit-ish>

# List all worktrees
git worktree list

# Remove a worktree cleanly
git worktree remove <path>

# Clean up stale worktree entries after manual deletion
git worktree prune
```

---

That's the whole workflow. One scenario, six commands, no stash, no WIP commits.

Once you've been using worktrees for a week or two, you'll start finding yourself reaching for them in situations you didn't expect. An always-on hotfix worktree. A clean checkout for code review. One per open PR. That's what we'll focus on in the next post.
