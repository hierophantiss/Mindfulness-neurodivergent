import React, { useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { D as courseDataEl } from '../data/course-el';
import { D as courseDataEn } from '../data/course-en';

export const CompanionDashboardWidget: React.FC = () => {
  const { language } = useLanguage();
  const { companionData } = useCompanion();
  const navigate = useNavigate();

  const { week, day } = companionData.programProgress;
  const courseData = language === 'en' ? courseDataEn : courseDataEl;
  
  // Calculate narrative based on the fourfold axis (Week 1-2: Body, 3-4: Breath, 5-6: Attention, 7-8: Space)
  const getNarrative = () => {
    let phase = 0;
    if (week >= 0 && week < 2) phase = 0; // Body / Gravity
    else if (week >= 2 && week < 4) phase = 1; // Breath
    else if (week >= 4 && week < 6) phase = 2; // Attention
    else if (week >= 6) phase = 3; // Space

    const elNarratives = [
      {
        title: "Γείωση & Βαρύτητα",
        text: "Η μαϊμού της υπερανάλυσης και της αυτοκριτικής (DMN) είναι ακόμα ανήσυχη. Πριν προσπαθήσουμε να ελέγξουμε τις σκέψεις, ας γειώσουμε τον ελέφαντα του νευρικού συστήματος. Η βαρύτητα είναι το πρώτο μας σκοινί."
      },
      {
        title: "Ρύθμιση της Αναπνοής",
        text: "Ο ελέφαντας νιώθει το έδαφος, αλλά η ενέργειά του είναι ακανόνιστη. Ας χρησιμοποιήσουμε την αναπνοή για να ρυθμίσουμε το νευρικό του σύστημα πριν ασχοληθούμε με τη μαϊμού."
      },
      {
        title: "Η Επίγνωση ως Εργαλείο",
        text: "Τώρα που το σώμα και η αναπνοή έχουν ηρεμήσει, η μαϊμού της αυτοκριτικής κουράζεται. Ώρα να πιάσουμε το εργαλείο της καθαρής επίγνωσης και να κατευθύνουμε την προσοχή."
      },
      {
        title: "Ο Ανοιχτός Χώρος",
        text: "Η μαϊμού κάθεται ήσυχα πίσω και ο ελέφαντας σιγά-σιγά ασπρίζει (ηρεμεί). Δεν χρειάζεται πια να προσπαθούμε. Αναπαυόμαστε στην ανοιχτή επίγνωση του χώρου."
      }
    ];

    const enNarratives = [
      {
        title: "Grounding & Gravity",
        text: "The monkey of over-analysis and self-criticism (DMN) is relentless. Before attempting to control thoughts, let's ground the nervous system's elephant. Gravity is our lasso."
      },
      {
        title: "Regulating the Breath",
        text: "The elephant feels the ground, but its energy is erratic. Let's use the breath to soothe its nervous system before taming the monkey."
      },
      {
        title: "Awareness as a Tool",
        text: "Now that the body and breath are calm, the self-critical monkey is tiring. It's time to grasp the tool of pure awareness and direct our attention."
      },
      {
        title: "The Open Space",
        text: "The monkey sits quietly behind, and the elephant slowly turns white (calms). We no longer need to try; we rest in the open awareness of space."
      }
    ];

    return language === 'el' ? elNarratives[phase] : enNarratives[phase];
  };

  const narrative = getNarrative();
  const currentWeekData = courseData[week + 1];
  const currentDayData = currentWeekData?.days[day];

  const handleContinue = () => {
    navigate(`/program/week/${week + 1}`);
  };

  return (
    <div className="w-full flex-col gap-4 flex animate-fade-in pb-4">
      
      {/* 1. Companion Message Panel */}
      <div className="backdrop-blur-[4px] bg-white/[0.04] border border-white/[0.1] rounded-[24px] p-5 relative overflow-hidden">
        {/* Decorative flair */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e99b37]/10 blur-[40px] rounded-full pointer-events-none -mr-10 -mt-10" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white/10 shadow-lg relative">
            <img 
              src="/assets/cat1.png" 
              alt="Companion" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e99b37';
              }}
            />
            {/* Online Indicator */}
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-[#1a1d27]" />
          </div>
          
          <div className="flex flex-col gap-2 pt-1">
            <h3 className="text-[14px] font-bold text-[#e99b37] tracking-wider uppercase">
              {narrative.title}
            </h3>
            <p className="text-[14.5px] text-white/90 leading-relaxed font-serif italic">
              «{narrative.text}»
            </p>
          </div>
        </div>
      </div>

      {/* 2. Progress & Next Step Action */}
      <div className="backdrop-blur-[4px] bg-[#e99b37]/5 border border-[#e99b37]/20 rounded-[16px] p-4 flex items-center justify-between group cursor-pointer active:scale-95 transition-all" onClick={handleContinue}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[1px] text-[#e99b37]/80 font-bold">
            {language === 'el' ? 'Επομενο Βημα' : 'Next Step'}
          </span>
          <span className="text-[15px] font-medium text-white">
            {currentDayData ? currentDayData.title : (language === 'el' ? 'Συνεχίστε το Ταξίδι' : 'Continue Journey')}
          </span>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-[#e99b37]/20 flex items-center justify-center text-[#e99b37] group-hover:bg-[#e99b37]/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>

    </div>
  );
};
