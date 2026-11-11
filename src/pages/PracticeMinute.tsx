import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { MethodMark, type MarkPart } from '../components/MethodMark';
import { ConceptText } from '../components/ConceptInfoOverlay';
import { useLanguage } from '../hooks/useLanguage';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { prepareSound, ringBell } from '../lib/sound';

// One minute, the four axes: the method in one gesture, in its own order
// (body, breath, attention, space), fifteen seconds each. The sign shows where
// you are: the axis, the circle (it breathes), the triangle, the infinity.
// Starts from gravity (as every practice does), asks no visualisation, and
// the method's words open their short explanation.

type T = { el: string; en: string };
const STEP_MS = 15000;

const STEPS: { part: MarkPart; name: T; text: T }[] = [
  {
    part: 'body',
    name: { el: 'Βαρύτητα', en: 'Gravity' },
    text: {
      el: 'Άφησε το [[βάρος|gravity]] σου να πέσει προς τα κάτω, και νιώσε πώς σε κρατά το κάθισμα ή το πάτωμα.',
      en: 'Let your [[weight|gravity]] drop, and feel how the seat or the floor holds you.',
    },
  },
  {
    part: 'breath',
    name: { el: 'Αναπνοή', en: 'Breath' },
    text: {
      el: 'Άσε την ανάσα να έρθει μόνη της, χωρίς να την αλλάζεις. Νιώσε πού κινείται: στην κοιλιά, στο στήθος, στη μύτη.',
      en: 'Let the breath come by itself, without changing it. Feel where it moves: in the belly, the chest, the nose.',
    },
  },
  {
    part: 'attention',
    name: { el: 'Προσοχή', en: 'Attention' },
    text: {
      el: 'Άφησε την προσοχή να ακουμπήσει σε ένα σημείο: στον αέρα που μπαίνει από τη μύτη. Όταν φύγει, [[φέρ’ τη απαλά πίσω|gentle_return]].',
      en: 'Let your attention rest on one point: the air coming in at the nose. When it wanders, [[bring it gently back|gentle_return]].',
    },
  },
  {
    part: 'space',
    name: { el: 'Χώρος', en: 'Space' },
    text: {
      el: 'Με το βλέμμα μπροστά, άφησε την [[όραση να ανοίξει|peripheral_vision]] δεξιά και αριστερά, χωρίς να κουνήσεις τα μάτια. Μπορείς να νιώσεις τον χώρο γύρω σου;',
      en: 'With your gaze forward, let your [[vision open|peripheral_vision]] to the left and right, without moving your eyes. Can you feel the space around you?',
    },
  },
];

const INK: Record<MarkPart, string> = {
  body: 'var(--axis-body-ink)',
  breath: 'var(--axis-breath-ink)',
  attention: 'var(--axis-attention-ink)',
  space: 'var(--axis-space-ink)',
};

export default function PracticeMinute() {
  const { language } = useLanguage();
  const el = language !== 'en';
  const lang: 'el' | 'en' = el ? 'el' : 'en';
  const { logActivity } = useActivityTracker();
  // -1 = not started; 0–3 = the step; 4 = done.
  const [step, setStep] = useState(-1);
  const [left, setLeft] = useState(15);
  const startedAt = useRef(0);

  useEffect(() => {
    if (step < 0 || step > 3) return;
    startedAt.current = Date.now();
    setLeft(15);
    if (step > 0) ringBell({ soft: true });
    const tickId = window.setInterval(() => {
      setLeft(Math.max(1, 15 - Math.floor((Date.now() - startedAt.current) / 1000)));
    }, 250);
    const next = window.setTimeout(() => setStep(s => s + 1), STEP_MS);
    return () => { clearInterval(tickId); clearTimeout(next); };
  }, [step]);

  useEffect(() => {
    if (step !== 4) return;
    ringBell();
    logActivity({ category: 'general', itemId: 'four-axes-minute', durationSeconds: 60, completed: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const start = () => { prepareSound(); setStep(0); };
  const running = step >= 0 && step <= 3;
  const current = running ? STEPS[step] : null;

  return (
    <div className="flex flex-col gap-6 pb-10 desk:max-w-[760px] desk:mx-auto">
      <style>{'@keyframes minute-fill { from { width: 0%; } to { width: 100%; } }'}</style>
      <div className="pt-2">
        <PageHeader
          back="/"
          eyebrow={el ? 'Πρακτική' : 'Practice'}
          title={el ? 'Ένα λεπτό: οι τέσσερις άξονες' : 'One minute: the four axes'}
          lead={el
            ? 'Η μέθοδος με τη σειρά της, 15 δευτερόλεπτα σε κάθε άξονα.'
            : 'The method in its own order, 15 seconds on each axis.'}
        />
      </div>

      <div className="flex flex-col items-center gap-5">
        <MethodMark
          className="w-[min(50vw,190px)] h-auto desk:w-[280px]"
          label={el ? 'Το σήμα της μεθόδου' : 'The sign of the method'}
          focus={running ? current!.part : step === 4 ? undefined : null}
          breathe={step === 4}
        />

        {/* The four steps, the one you are in lit; its line fills in fifteen seconds. */}
        <ol className="grid grid-cols-4 gap-2 w-full max-w-[420px]" aria-label={el ? 'Τα τέσσερα βήματα' : 'The four steps'}>
          {STEPS.map((s, i) => (
            <li key={s.part} className="flex flex-col gap-1.5 items-center" aria-current={i === step ? 'step' : undefined}>
              <span className="w-full h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
                <span
                  key={i === step ? `on-${step}` : `off-${i}`}
                  className="block h-full rounded-full"
                  style={{
                    backgroundColor: INK[s.part],
                    width: i < step || step === 4 ? '100%' : i === step ? undefined : '0%',
                    animation: i === step ? `minute-fill ${STEP_MS}ms linear forwards` : undefined,
                  }}
                />
              </span>
              <span className="text-[12px]" style={{ color: i === step || step === 4 ? INK[s.part] : 'color-mix(in srgb, var(--color-ink) 55%, transparent)' }}>
                {s.name[lang]}
              </span>
            </li>
          ))}
        </ol>

        <div className="min-h-[124px] w-full max-w-[460px] text-center" aria-live="polite">
          {current && (
            <>
              <p className="font-display text-[26px] leading-tight" style={{ color: INK[current.part] }}>
                {step + 1} · {current.name[lang]}
              </p>
              <p className="mt-3 text-[17px] leading-relaxed text-ink/90">
                <ConceptText text={current.text[lang]} />
              </p>
              <p className="mt-3 font-mono text-[13px] text-ink/60" aria-hidden="true">{left}″</p>
            </>
          )}
          {step === -1 && (
            <p className="text-[16px] leading-relaxed text-ink/80">
              {el
                ? 'Κάθισε ή στάσου όπως είσαι. Ένα απαλό κουδούνι σε πηγαίνει στο επόμενο βήμα.'
                : 'Sit or stand as you are. A soft bell takes you to the next step.'}
            </p>
          )}
          {step === 4 && (
            <p className="text-[17px] leading-relaxed text-ink/90">
              {el
                ? 'Αυτό ήταν: οι τέσσερις άξονες σε ένα λεπτό. Μπορείς να μείνεις λίγο ακόμα εδώ.'
                : 'That was it: the four axes in one minute. You can stay here a little longer.'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {running ? (
            <button type="button" onClick={() => setStep(-1)} className="btn-soft h-11 px-6 rounded-full text-[14px]">
              {el ? 'Σταμάτα' : 'Stop'}
            </button>
          ) : (
            <button type="button" onClick={start} className="btn-gold h-11 px-7 rounded-full text-[14px] font-medium">
              {step === 4 ? (el ? 'Ξανά' : 'Again') : (el ? 'Ξεκίνα' : 'Start')}
            </button>
          )}
          {step === 4 && (
            <Link to="/" className="btn-soft inline-flex items-center h-11 px-5 rounded-full text-[14px]">
              {el ? 'Στην αρχική' : 'Home'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
