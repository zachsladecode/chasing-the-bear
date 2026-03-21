import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  title: string;
  date: string;
  category: string;
}

const CHAR_DELAY = 50; // ms per character
const LINE_PAUSE = 300; // ms pause before starting next line

type Phase = 'title' | 'date' | 'category' | 'done';

const PHASES: Phase[] = ['title', 'date', 'category', 'done'];

export default function TerminalHeader({ title, date, category }: Props) {
  const lines: Record<Exclude<Phase, 'done'>, string> = { title, date, category };

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [pausing, setPausing] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentPhase = PHASES[phaseIndex] as Phase;
  const isDone = currentPhase === 'done' || skipped;

  // Build visible lines from completed + in-progress phases
  const completedPhases = PHASES.slice(0, phaseIndex).filter(
    (p): p is Exclude<Phase, 'done'> => p !== 'done'
  );
  const currentLine =
    currentPhase !== 'done'
      ? lines[currentPhase as Exclude<Phase, 'done'>].slice(0, charIndex)
      : '';

  function skip() {
    setSkipped(true);
  }

  useEffect(() => {
    if (prefersReduced) {
      setSkipped(true);
      return;
    }

    const handler = () => skip();
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
  }, []);

  useEffect(() => {
    if (isDone || prefersReduced) return;

    if (pausing) {
      const timer = setTimeout(() => {
        setPausing(false);
        setPhaseIndex((i) => i + 1);
        setCharIndex(0);
      }, LINE_PAUSE);
      return () => clearTimeout(timer);
    }

    const currentText = lines[currentPhase as Exclude<Phase, 'done'>];

    if (charIndex >= currentText.length) {
      // Line done — pause before next
      setPausing(true);
      return;
    }

    function tick(now: number) {
      if (now - lastTimeRef.current >= CHAR_DELAY) {
        lastTimeRef.current = now;
        setCharIndex((i) => i + 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [charIndex, pausing, isDone, currentPhase]);

  if (isDone) {
    return (
      <div class="th-header th-header--done">
        <p class="th-line">
          <span class="th-prompt" aria-hidden="true">&gt;</span>{' '}
          <span class="th-title">{title}</span>
        </p>
        <p class="th-line">
          <span class="th-prompt" aria-hidden="true">&gt;</span>{' '}
          <time class="th-meta">{date}</time>
        </p>
        <p class="th-line">
          <span class="th-prompt" aria-hidden="true">&gt;</span>{' '}
          <span class="th-meta">{category}</span>
        </p>
      </div>
    );
  }

  return (
    <div class="th-header" aria-hidden="true">
      {completedPhases.map((phase) => (
        <p key={phase} class="th-line">
          <span class="th-prompt">&gt;</span> {lines[phase]}
        </p>
      ))}
      <p class="th-line">
        <span class="th-prompt">&gt;</span>{' '}
        {currentLine}
        <span class="th-cursor" />
      </p>
    </div>
  );
}
