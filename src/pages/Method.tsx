import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { MethodMark } from '../components/MethodMark';

// The sign of the method: what each of its four parts stands for (the author's reading).
const SIGN = {
  el: {
    title: 'Το σήμα της μεθόδου',
    parts: [
      { color: '#d9b77a', name: 'Ο χρυσός κάθετος άξονας', text: 'η βαρύτητα και ο άξονας της σπονδυλικής στήλης: το Σώμα.' },
      { color: '#6a9de0', name: 'Ο μπλε κύκλος', text: 'η Αναπνοή.' },
      { color: '#d9a957', name: 'Το χρυσό τρίγωνο', text: 'η Προσοχή.' },
      { color: 'rainbow', name: 'Το άπειρο, στο κέντρο', text: 'ο Χώρος, ο πυρήνας όλων των αξόνων.' },
    ],
  },
  en: {
    title: 'The sign of the method',
    parts: [
      { color: '#d9b77a', name: 'The gold vertical axis', text: 'gravity and the axis of the spine: the Body.' },
      { color: '#6a9de0', name: 'The blue circle', text: 'the Breath.' },
      { color: '#d9a957', name: 'The gold triangle', text: 'Attention.' },
      { color: 'rainbow', name: 'The infinity, at the centre', text: 'Space, the core of all the axes.' },
    ],
  },
};
const RAINBOW = 'linear-gradient(90deg,#ff3b30,#ff9500,#ffd60a,#34c759,#32ade6,#3478f6,#9b59d0)';

const T = {
  el: {
    title: 'Η Μέθοδος & Το Σήμα',
    intro: 'Η ενσυνειδητότητα της μεθόδου δεν σου ζητά «να αδειάσεις το μυαλό σου» ούτε να μείνεις ακίνητος. Σε μαθαίνει να ρυθμίζεις το νευρικό σου σύστημα με τέσσερα απλά βήματα, τους τέσσερις άξονες: Σώμα, Αναπνοή, Προσοχή, Χώρος.',
    rootsTitle: 'Ρίζες',
    roots: 'Η μέθοδος πατά σε αρχές από διαφορετικές παραδόσεις: τη Σαμάθα (shiné, η ηρεμία του νου) και τη Βιπάσανα (η καθαρή όραση), το Τάι Τσι και το Τσι Κονγκ, και τον Σουφισμό. Από αυτές κρατά ό,τι βοηθά το νευρικό σύστημα να ρυθμιστεί, δοσμένο σε απλά βήματα. Καμία από αυτές τις παραδόσεις δεν έχει εγκρίνει τη μέθοδο.',
    axesTitle: 'Οι 4 Άξονες',
    axes: [
      { id: 'body', icon: 'I', title: 'Σώμα (Γη)', desc: 'Νιώθεις τη βαρύτητα: το βάρος σου πέφτει και στηρίζεται.' },
      { id: 'breath', icon: '○', title: 'Αναπνοή (Αέρας)', desc: 'Μακριά, ήρεμη εκπνοή από το στόμα, που ρυθμίζει το νευρικό σύστημα.' },
      { id: 'attention', icon: '△', title: 'Προσοχή (Φωτιά)', desc: 'Ο Φακός: στενεύει σε ένα σημείο και ανοίγει σε όλο το πεδίο.' },
      { id: 'space', icon: '∞', title: 'Χώρος (Νερό)', desc: 'Ανοιχτή επίγνωση: ξεκουράζεσαι στον χώρο γύρω σου.' }
    ],
    axesButton: 'Ασκήσεις αυτού του άξονα',
    diffTitle: 'Γιατί διαφέρει από την κλασική ενσυνειδητότητα;',
    diffIntro: 'Στην κλασική ενσυνειδητότητα η οδηγία είναι συχνά «απλώς παρατήρησε την αναπνοή σου». Για έναν νου που τρέχει, αυτό στην αρχή είναι σχεδόν αδύνατο: καταλήγεις να ελέγχεις την αναπνοή και το άγχος μεγαλώνει. Εδώ η σειρά αλλάζει:',
    diffSteps: [
      { name: 'Σώμα', text: 'Νιώσε τη βαρύτητα, το βάρος σου να πέφτει και να στηρίζεται από το κάθισμα ή το έδαφος. Μια σταθερή, αναμφίβολη άγκυρα.' },
      { name: 'Αναπνοή', text: 'Αν η αναπνοή είναι σφιγμένη, δεν την αποδέχεσαι απλώς παθητικά· τη ρυθμίζεις σκόπιμα, με μακριές εκπνοές από το στόμα, για να ηρεμήσει το νευρικό σύστημα.' },
      { name: 'Προσοχή', text: 'Ο Φακός. Στενεύεις την προσοχή σε ένα σημείο και ύστερα την ανοίγεις σε όλο το πεδίο. Με τον καιρό μπορείς να κρατάς και τα δύο μαζί: το βλέμμα μένει μπροστά και η περιφέρεια ανοίγει.' },
      { name: 'Χώρος', text: 'Αφήνεσαι στον χώρο γύρω σου, χωρίς να κάνεις τίποτα. Εδώ η ανοιχτή επίγνωση είναι ξεκούραση, όχι προσπάθεια.' },
    ],
    bikeTitle: 'Η Ενσυνειδητότητα ως Ποδήλατο',
    bikeText: 'Η πρακτική του Τετραπλού Άξονα μοιάζει με το να μαθαίνεις ποδήλατο. Σώμα είναι το ίδιο το ποδήλατο, το σταθερό πλαίσιο που σε κρατά. Αναπνοή είναι το πετάλι, η ρυθμική κίνηση που δίνει ροή. Προσοχή είναι το τιμόνι, κατευθύνει το βλέμμα και τη φορά. Χώρος είναι ο δρόμος και το τοπίο, εκεί που κυλάς, με εμπόδια και ελευθερία.\n\nΜέχρι τώρα, χωρίς να το καταλαβαίνουμε, πατάμε πολύ δυνατά το πετάλι: προσπαθούμε υπερβολικά, κουραζόμαστε, χάνουμε την ισορροπία. Αν η προσοχή είναι μόνο κλειστή (κοιτάς επίμονα τον δρόμο), πάλι χάνεται η ισορροπία. Χρειάζεται κλειστή προσοχή, για να μη βγεις από τη διαδρομή, και ανοιχτή, για να βλέπεις το τοπίο, να νιώθεις το σώμα, να προσαρμόζεσαι. Στην αρχή τις εναλλάσσεις· με τον καιρό δουλεύουν μαζί.\n\nΣτην αρχή πέφτεις, κουνιέσαι, νιώθεις αδέξιος. Αλλά κάθε φορά που ξανασηκώνεσαι, το σώμα θυμάται. Με τον καιρό η ισορροπία έρχεται φυσικά, και κοιτάς μπροστά χωρίς να σκέφτεσαι κάθε κίνηση. Έτσι λειτουργεί και η ενσυνειδητότητα: δεν είναι μαγική λύση, αλλά ένας τρόπος να γυμνάσεις τον νου, ώστε να είσαι παρών και οι σκέψεις και τα συναισθήματα να μη σε παρασύρουν.',
    bikeLesson: 'Τι μας διδάσκει: Η ισορροπία δεν είναι στατική· είναι συνεχής προσαρμογή. Πατάς ελαφρά, κρατάς κλειστή και ανοιχτή προσοχή μαζί, εμπιστεύεσαι τη ροή.',
    closing: '«Δεν σταμάτησε το μυαλό μου να τρέχει, αλλά σταμάτησε να με παρασύρει.»',
  },
  en: {
    title: 'The Method & the Sign',
    intro: 'The mindfulness of this method does not ask you to "empty your mind", nor to stay still. It teaches you to regulate your nervous system in four simple steps, the four axes: Body, Breath, Attention, Space.',
    rootsTitle: 'Roots',
    roots: 'The method draws on principles from different traditions: Samatha (shiné, calm abiding of the mind) and Vipassana (clear seeing), Tai Chi and Qigong, and Sufism. From them it keeps what helps the nervous system settle, given in simple steps. None of these traditions has endorsed the method.',
    axesTitle: 'The 4 Axes',
    axes: [
      { id: 'body', icon: 'I', title: 'Body (Earth)', desc: 'You feel gravity: your weight drops and is supported.' },
      { id: 'breath', icon: '○', title: 'Breath (Air)', desc: 'A long, calm out-breath through the mouth that settles the nervous system.' },
      { id: 'attention', icon: '△', title: 'Attention (Fire)', desc: 'The Flashlight: it narrows to one point and opens to the whole field.' },
      { id: 'space', icon: '∞', title: 'Space (Water)', desc: 'Open awareness: you rest in the space around you.' }
    ],
    axesButton: 'Practice this axis',
    diffTitle: 'Why is it different from classical mindfulness?',
    diffIntro: 'In classical mindfulness the instruction is often "just observe your breath". For a mind that races, this is almost impossible at first: you end up controlling the breath and the anxiety grows. Here the order changes:',
    diffSteps: [
      { name: 'Body', text: 'Feel gravity, your weight dropping and being supported by the seat or the ground. A steady, undoubted anchor.' },
      { name: 'Breath', text: 'If the breath is tight, you do not just passively accept it; you regulate it on purpose, with long out-breaths through the mouth, so the nervous system can settle.' },
      { name: 'Attention', text: 'The Flashlight. You narrow your attention to one point, then open it to the whole field. In time you can hold both together: your gaze stays forward while the periphery opens.' },
      { name: 'Space', text: 'You let yourself rest in the space around you, doing nothing. Here open awareness is rest, not effort.' },
    ],
    bikeTitle: 'Mindfulness as a Bicycle',
    bikeText: 'The Fourfold Axis practice is like learning to ride a bicycle. Body is the bicycle itself, the stable frame that holds you. Breath is the pedalling, the rhythmic motion that gives flow. Attention is the handlebar, it directs your gaze and your course. Space is the road and the landscape, where you ride, with obstacles and freedom.\n\nUntil now, without noticing, we pedal too hard: we try too much, tire ourselves, lose balance. If attention is only closed (staring at the road), balance is lost again. You need closed attention, to stay on the road, and open attention, to see the landscape, feel the body, adjust. At first you alternate between them; in time they work together.\n\nAt first you fall, wobble, feel clumsy. But every time you get back up, the body remembers. In time balance comes naturally, and you look ahead without thinking about every movement. Mindfulness works the same way: it is not a magic solution, but a way to train the mind, so you can be present and your thoughts and feelings do not carry you away.',
    bikeLesson: 'What it teaches us: Balance is not static; it is constant adjustment. You pedal lightly, hold closed and open attention together, trust the flow.',
    closing: '"My mind didn\'t stop racing, but it stopped carrying me away."',
  }
};

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
    <div className="flex flex-col h-full bg-[#0f1117] font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-5 bg-[#191b20] border-b border-white/[0.05] sticky top-0 z-10">
        <Link 
          to="/" 
          className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center text-[#d4d4d8] hover:bg-white/[0.04] hover:text-ink transition-colors active:scale-95"
          aria-label={language === 'el' ? 'Πίσω στην αρχική' : 'Back to home'}
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-[14px] font-bold text-[#d4d4d8] uppercase tracking-[0.03em] drop-shadow-sm truncate px-2">
          {t.title}
        </h1>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar pb-safe mb-6">
        
        {/* Intro */}
        <section className="space-y-4">
          <p className="text-[#d4d4d8]/85 text-[15px] leading-relaxed">
            {t.intro}
          </p>
        </section>

        {/* Roots */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#d4d4d8]/60">{t.rootsTitle}</h2>
          <p className="text-[#d4d4d8]/80 text-sm leading-relaxed">{t.roots}</p>
        </section>

        {/* The sign of the method */}
        {(() => {
          const sign = SIGN[language === 'en' ? 'en' : 'el'];
          return (
            <section className="flex flex-col items-center gap-5">
              <MethodMark className="w-40 h-40" label={language === 'en' ? 'The sign of the Fourfold Axis' : 'Το σήμα του Τετραπλού Άξονα'} />
              <div className="w-full space-y-3">
                <h2 className="text-[16px] font-bold text-[#d4d4d8]">{sign.title}</h2>
                <ul className="space-y-2.5">
                  {sign.parts.map(part => (
                    <li key={part.name} className="flex items-start gap-3 text-sm leading-relaxed text-[#d4d4d8]/85">
                      <span className="mt-[7px] w-3 h-3 shrink-0 rounded-full" style={{ background: part.color === 'rainbow' ? RAINBOW : part.color }} aria-hidden="true" />
                      <span><span className="text-[#d4d4d8]">{part.name}</span>: {part.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })()}

        {/* The 4 axes, each with its practices */}
        <section className="pt-4 border-t border-white/[0.05]">
          <h2 className="text-[18px] font-bold text-[#d4d4d8] mb-5 border-b border-white/[0.05] pb-2 uppercase tracking-wide">
            {t.axesTitle}
          </h2>
          <div className="grid gap-4">
            {t.axes.map(axis => (
              <div key={axis.id} className="card-relief p-5 rounded-3xl flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-mono border border-white/10 bg-white/5 text-teal-400 shrink-0" aria-hidden="true">
                    {axis.icon}
                  </div>
                  <div>
                    <h3 className="text-[#d4d4d8] font-bold text-[16px] mb-1">{axis.title}</h3>
                    <p className="text-[#d4d4d8]/80 text-[13px] leading-relaxed">{axis.desc}</p>
                  </div>
                </div>
                <Link
                  to={`/practice?axis=${axis.id}`}
                  className="mt-auto w-full py-3 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-all text-sm font-semibold text-center border border-teal-500/20 active:scale-[0.98]"
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
          <p className="text-[#d4d4d8]/90 text-sm leading-relaxed mb-3">{t.diffIntro}</p>
          <ol className="space-y-2.5 list-decimal pl-5 text-[#d4d4d8]/90 text-sm leading-relaxed marker:text-teal-300/80">
            {t.diffSteps.map(step => (
              <li key={step.name}><span className="font-semibold text-[#d4d4d8]">{step.name}:</span> {step.text}</li>
            ))}
          </ol>
        </section>

        {/* The bicycle */}
        <section className="bg-white/[0.04] border border-white/[0.05] shape-cloud-6 p-5 shadow-lg relative overflow-hidden">
          <h2 className="text-[16px] font-bold text-blue-200 mb-3 drop-shadow-sm flex items-center gap-2">
            <span aria-hidden="true">🚲</span> {t.bikeTitle}
          </h2>
          <p className="text-[#d4d4d8]/90 text-sm leading-relaxed whitespace-pre-wrap mb-4">{t.bikeText}</p>
          <p className="pt-3 border-t border-white/[0.05] text-xs font-medium text-teal-300 leading-relaxed">{t.bikeLesson}</p>
        </section>

        {/* Closing: the author's words */}
        <p className="text-center text-[15px] leading-relaxed text-amber-200/80 px-4 pb-4">{t.closing}</p>

      </div>
    </div>
  );
}
