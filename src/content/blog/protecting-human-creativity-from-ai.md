---
title: "Protecting Human Creativity From AI"
date: "2026-08-30"
category: "AI/ML"
tags: ["ai", "creativity", "consent"]
summary: "My day job already feels like it's slipping away to AI. I don't want my creativity to be next. Here's what I'm learning about noai tags and consent registries, and what I'm actually doing about it."
author: "Zach Slade Code"
draft: true
---

Well, here we are; we made it past Judgment Day.

August 29th, 1997, is the date Sarah Connor gives in [Terminator 2](https://en.wikiquote.org/wiki/Terminator_2:_Judgment_Day): the day Skynet goes live and, per her opening narration, three billion human lives end in nuclear fire. August 29th, 2026 came and went uneventfully. Skynet, or the real life equivalent, didn't hit anywhere near that number. Thank whatever power you believe in.

It didn't come for us the way the movie promised but maybe it's coming for something quieter instead.

I started this blog acknowledging the anxiety that AI might one day replace certain aspects of my work. Lately I’ve noticed the same feeling creeping into a different part of my life, a part of my life that truly represents what it means to be human. My creativity.

Blogging. Photography. Singing in the shower. Literally anything I’d call mine. I don’t want my creativity being turned into output for a machine.

I’m finally learning what actually exists to protect creative work from being scraped up as training data without anyone even asking. I was glad to find a little more than I expected, and it seems relatively straightforward to set up. 

## The Human Consent Registry

The first thing I came across was id.humanconsent.org, run by the Human Consent Foundation. It’s a public, machine-readable record where a person documents how AI is (or isn’t) allowed to use their likeness, voice, movement, etc. 

Everyone can decide whether AI should be prohibited, permitted with terms, or permitted outright to use their creative works. It’s pretty straightforward. It’s not a licensing body, and it doesn’t enforce anything on its own. If you think about it, it’s almost closer to a robots.txt for your identity, a clear, readable statement that a compliant system can check before it uses something of yours.

I know you’re probably asking yourself if anyone actually respects this, and I asked myself the same thing. It’s the same question I had about noai tags before I looked into how those work.

## noai and noimageai

As someone with a few websites, some of which have creative work, I found that there are two directives you can add to the standard robots meta tag:

```html
<meta name="robots" content="index, follow, noai, noimageai">
```

`noai` asks AI systems not to use the page's content, text, code, etc., as training data. `noimageai` does the same specifically for images on the page (think photography, modeling, art). You can combine them with your normal indexing directives, which is exactly what I did below.

If you'd rather set it at the server level, there's an HTTP header equivalent:

```
X-Robots-Tag: noai, noimageai
```

Which is nice because it applies to any file type, not just HTML pages, and is especially useful if you're serving images or PDFs directly. It only works if you control the server response, though. This blog is static and hosted on GitHub Pages, which doesn't let me set custom HTTP headers, so the meta tag is what I actually used.

The honest caveat, and this matters more than the syntax: a noai tag is a request, and not guaranteed to be enforced. It only works if the crawler on the other end chooses to honor it. The good news is the major labs like OpenAI, Anthropic, and Google respect it (I hope). The bad news is not everyone does. Bytespider, ByteDance’s crawler, has a [documented history of ignoring meta directives entirely](https://www.openshadow.io/guides/noai-meta-tag), and for something like that you’d need a robots.txt disallow rule or an IP block instead.

So the problem remains largely unsolved, and it’s more like a norm that’s still being established. Thankfully, enough of the major players are honoring it that it’s worth doing anyway.

## What I'm actually doing

I added the `noai, noimageai` meta tag to this site's base layout in the same pull request as this blog post, so it's on every page, not just this one. It was a very quick ask, only taking a few minutes. Yes, Claude helped me configure it (I know, the irony). 

I’ve already registered some of my content on the Human Consent Registry, mostly because I’d rather have a voice documented saying what I consent to. As opposed to letting AI have free rein over me. 

Maybe resistance is futile. I know that neither of these stops anything by force. But I keep coming back to the same lesson I’ve been learning about the bear in general: I can’t control what the tools do. I can control whether I said something about it first.

If you run a site or publish anything you’d call creative work, both of these take less time than reading this post did. Why are you still reading? 

