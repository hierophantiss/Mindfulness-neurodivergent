import { PageHeader } from '../components/PageHeader';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { MethodMark } from '../components/MethodMark';
import { SIGN } from '../data/pages/methodSign';
import { T } from '../data/pages/method';

// The sign of the method: what each of its four parts stands for (the author's reading).
const RAINBOW = 'linear-gradient(90deg,#ff3b30,#ff9500,#ffd60a,#34c759,#32ade6,#3478f6,#9b59d0)';


export default function Method() {
  const { language } = useLanguage();
  const { logActivity } = useActivityTracker();
  const startTimeRef = useRef<number>(Date.now());
  const t = T[language as keyof typeof T];

  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (duration >= 15) {
        logActivity({
          category: 'rabbithole',
          itemId: 'method-manual',
          durationSeconds: duration,
          completed: true,
          axis: 'space'
        });
      }
    };
  }, [logActivity]);

  return (
    <div className="flex flex-col h-full font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="pt-2">
        <PageHeader back="/" title={t.title} />
      </div>

      {/* Content */}
      <div className="flex-1 py-6 space-y-8 pb-safe mb-6">
        
        {/* First the sign: the whole method in one picture. */}
        {(() => {
          const sign = SIGN[language === 'en' ? 'en' : 'el'];
          return (
            <section className="flex flex-col items-center gap-5">
              <MethodMark className="w-40 h-40" label={language === 'en' ? 'The sign of the Fourfold Axis' : 'Το σήμα του Τετραπλού Άξονα'} />
              <div className="w-full space-y-3">
                <h2 className="text-[16px] font-bold text-ink">{sign.title}</h2>
                <ul className="space-y-2.5">
                  {sign.parts.map(part => (
                    <li key={part.name} className="flex items-start gap-3 text-sm leading-relaxed text-ink/85">
                      <span className="mt-[7px] w-3 h-3 shrink-0 rounded-full" style={{ background: part.color === 'rainbow' ? RAINBOW : part.color }} aria-hidden="true" />
                      <span><span className="text-ink">{part.name}</span>: {part.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })()}

        {/* Intro */}
        <section className="space-y-4">
          <p className="text-ink/85 text-[15px] leading-relaxed">
            {t.intro}
          </p>
        </section>

        {/* The 4 axes, each with its practices */}
        <section className="pt-4 border-t border-white/[0.05]">
          <h2 className="text-[18px] font-medium text-ink mb-5 border-b border-white/[0.05] pb-2">
            {t.axesTitle}
          </h2>
          <div className="grid gap-4">
            {t.axes.map(axis => (
              <div key={axis.id} className="card-relief p-5 rounded-3xl flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="icon-relief w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-mono border border-white/10 bg-white/5 shrink-0" style={{ color: `var(--axis-${axis.id}-ink)` }} aria-hidden="true">
                    {axis.icon}
                  </div>
                  <div>
                    <h3 className="text-ink font-bold text-[16px] mb-1">{axis.title}</h3>
                    <p className="text-ink/80 text-[13px] leading-relaxed">{axis.desc}</p>
                  </div>
                </div>
                <Link
                  to={`/practice?axis=${axis.id}`}
                  className="btn-soft mt-auto w-full"
                >
                  {t.axesButton}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Why it is different: the four steps, in the method's order */}
        <section className="bg-white/[0.04] border border-white/[0.05] shape-cloud-4 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600/80 rounded-l-[2.5rem]" />
          <h2 className="text-[16px] font-bold text-teal-100 mb-3 drop-shadow-sm">{t.diffTitle}</h2>
          <p className="text-ink/90 text-sm leading-relaxed mb-3">{t.diffIntro}</p>
          <ol className="space-y-2.5 list-decimal pl-5 text-ink/90 text-sm leading-relaxed marker:text-teal-300/80">
            {t.diffSteps.map(step => (
              <li key={step.name}><span className="font-semibold text-ink">{step.name}:</span> {step.text}</li>
            ))}
          </ol>
        </section>

        {/* The bicycle */}
        <section className="bg-white/[0.04] border border-white/[0.05] shape-cloud-6 p-5 shadow-lg relative overflow-hidden">
          <h2 className="text-[16px] font-bold text-blue-200 mb-3 drop-shadow-sm flex items-center gap-2">
            <span aria-hidden="true">🚲</span> {t.bikeTitle}
          </h2>
          <p className="text-ink/90 text-sm leading-relaxed whitespace-pre-wrap mb-4">{t.bikeText}</p>
          <p className="pt-3 border-t border-white/[0.05] text-xs font-medium text-teal-300 leading-relaxed">{t.bikeLesson}</p>
        </section>

        {/* Roots: where it comes from, after what it is. */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-semibold text-ink/60">{t.rootsTitle}</h2>
          <p className="text-ink/80 text-sm leading-relaxed">{t.roots}</p>
        </section>

        {/* The method's terms, from the book's glossary. */}
        <Link to="/glossary" className="btn-soft w-full">
          {language === 'en' ? 'Glossary: the terms of the method' : 'Γλωσσάρι: οι όροι της μεθόδου'}
        </Link>

        {/* Closing: the author's words */}
        <p className="text-center text-[15px] leading-relaxed text-amber-200/80 px-4 pb-4">{t.closing}</p>

      </div>
    </div>
  );
}
