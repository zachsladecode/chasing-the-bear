import { useEffect, useRef } from 'preact/hooks';

const CHAR_DELAY = 18; // ms per character — body types faster than header

type Block = {
  el: Element;
  segments: Array<{ node: Text; full: string }> | null; // null = code block (instant reveal)
};

function collectSegments(el: Element): Array<{ node: Text; full: string }> {
  const segments: Array<{ node: Text; full: string }> = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Text | null;
  while ((n = walker.nextNode() as Text | null)) {
    segments.push({ node: n, full: n.textContent ?? '' });
    n.textContent = '';
  }
  return segments;
}

function buildBlocks(source: HTMLElement): Block[] {
  return Array.from(source.children).map((child) => {
    const clone = child.cloneNode(true) as Element;
    if (clone.tagName === 'PRE') {
      // Code blocks: keep content intact, reveal instantly when reached
      return { el: clone, segments: null };
    }
    return { el: clone, segments: collectSegments(clone) };
  });
}

export default function TerminalBody() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const source = document.getElementById('post-body-source') as HTMLElement | null;
    const container = ref.current;
    if (!source || !container) return;

    // prefers-reduced-motion: leave source visible, hide this container
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.style.display = 'none';
      return;
    }

    // Hide source visually (still in DOM for SEO + screen readers)
    source.setAttribute('data-typing-hidden', '');

    const blocks = buildBlocks(source);
    let bi = 0; // current block index
    let si = 0; // current segment index within block
    let ci = 0; // current char index within segment
    let last = 0;
    let rafId: number;
    let done = false;

    // Append first block shell
    if (blocks.length > 0) container.appendChild(blocks[0].el);

    function isBelowFold(): boolean {
      const last = container!.lastElementChild;
      if (!last) return false;
      return last.getBoundingClientRect().bottom > window.innerHeight + 40;
    }

    function revealAll() {
      if (done) return;
      done = true;
      cancelAnimationFrame(rafId);
      // Fill current + append + fill all remaining blocks
      for (let i = bi; i < blocks.length; i++) {
        if (i > bi) container!.appendChild(blocks[i].el);
        if (blocks[i].segments) {
          for (const seg of blocks[i].segments!) seg.node.textContent = seg.full;
        }
      }
      document.removeEventListener('click', revealAll);
      document.removeEventListener('keydown', revealAll);
    }

    document.addEventListener('click', revealAll, { once: true });
    document.addEventListener('keydown', revealAll, { once: true });

    function tick(now: number) {
      if (done || bi >= blocks.length) return;

      // Pause while last-appended element is past the fold
      if (isBelowFold()) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (now - last < CHAR_DELAY) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      last = now;

      const block = blocks[bi];

      // Code block: already fully cloned — advance immediately
      if (!block.segments) {
        bi++;
        si = 0;
        ci = 0;
        if (bi < blocks.length) container!.appendChild(blocks[bi].el);
        rafId = requestAnimationFrame(tick);
        return;
      }

      // All segments typed in this block — move to next
      if (si >= block.segments.length) {
        bi++;
        si = 0;
        ci = 0;
        if (bi < blocks.length) container!.appendChild(blocks[bi].el);
        rafId = requestAnimationFrame(tick);
        return;
      }

      const seg = block.segments[si];
      if (ci < seg.full.length) {
        seg.node.textContent = seg.full.slice(0, ci + 1);
        ci++;
      } else {
        si++;
        ci = 0;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', revealAll);
      document.removeEventListener('keydown', revealAll);
    };
  }, []);

  return <div ref={ref} class="post-body" aria-hidden="true" />;
}
