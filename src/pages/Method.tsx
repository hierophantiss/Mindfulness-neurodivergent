import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const T = {
  el: {
    title: 'Η Μέθοδος & Τα Σύμβολα',
    intro: 'Η ενσυνειδητότητα της μεθόδου μας δεν απαιτεί «να αδειάσεις το μυαλό σου», ούτε να μείνεις ακίνητος. Χρησιμοποιεί μια αλληγορία για να κατανοήσεις πώς η μέθοδος σε μαθαίνει να ρυθμίζεις το νευρικό σου σύστημα.',
    diffTitle: 'Γιατί διαφέρει από την κλασική Ενσυνειδητότητα (Mindfulness);',
    diffText: 'Στην κλασική μέθοδο, η οδηγία είναι συχνά "απλώς παρατήρησε την αναπνοή σου". Για έναν νου που "τρέχει", αυτό αρχικά είναι σχεδόν αδύνατο χωρίς να καταλήξει να ελέγχει την αναπνοή, φέρνοντας περισσότερο άγχος. Εμείς αλλάζουμε τη σειρά:\n\n1. Νιώσε τη βαρύτητα: Δίνουμε μια σταθερή, αδιαμφισβήτητη άγκυρα (Σώμα).\n2. Ρύθμιση αναπνοής: Αν η αναπνοή είναι σφιγμένη, δεν την "αποδεχόμαστε" απλώς παθητικά, αλλά τη ρυθμίζουμε σκόπιμα (π.χ. παρατεταμένες εκπνοές από το στόμα) για να ηρεμήσουμε το νευρικό σύστημα.\n3. Κλειστή και Ανοιχτή Προσοχή: Εναλλαγή μεταξύ σημειακής εστίασης (πυρσός) και ανοιχτής επίγνωσης του χώρου, μετατρέποντας τον νου σε σύμμαχο.',
    symbolsTitle: 'Το Λεξικό του Νου: Τα Σύμβολα',
    symbols: [
      {
        icon: '🐘',
        name: 'Ο Ελέφαντας (Ο Νους)',
        desc: 'Στην αρχή είναι μαύρος και ταραγμένος. Μέσα από τη σταθερότητα και την καλοσύνη σταδιακά "ασπρίζει", που συμβολίζει το χτίσιμο της νήσου (insula) και την ενίσχυση της αυτο-επίγνωσης. Δεν τον πολεμάμε, τον εκπαιδεύουμε.'
      },
      {
        icon: '🐒',
        name: 'Η Μαϊμού (Το Δίκτυο DMN)',
        desc: 'Αντιπροσωπεύει τη νοητική περιπλάνηση, την αυτοκριτική, την ανησυχία και την ηχώ των απορρίψεων του παρελθόντος. Πηδάει από κλαδί σε κλαδί. Δεν γινόμαστε σύμμαχοι με τη μαϊμού· απλώς την παρατηρούμε, μέχρι να κάνει πίσω και τα κύματα Άλφα του εγκεφάλου να συγχρονιστούν.'
      },
      {
        icon: '🐇',
        name: 'Ο Λαγός (Το Νευρικό Σύστημα σε Ανάπαυση)',
        desc: 'Συμβολίζει τη νωθρότητα και την έλλειψη συγκέντρωσης. Δεν είναι "αποτυχία". Είναι η απαραίτητη βιολογική ξεκούραση του νευρικού συστήματος μετά από χρόνια πάλης (fight or flight). Τον αγκαλιάζουμε με καλοσύνη.'
      },
      {
        icon: '🧗‍♂️',
        name: 'Ο Ασκητής (Ο Ενσυνείδητος Εαυτός)',
        desc: 'Είναι ο νέος σου εαυτός μέσα στην άσκηση. Αντί να επικρίνει τη διάσπαση, χρησιμοποιεί τα εργαλεία της αναπνοής και του mindfulness και παρατηρεί με καλοσύνη, απαλότητα και εγρήγορση.'
      },
      {
        icon: '🪢',
        name: 'Το Σχοινί (Η Βαρύτητα & Γείωση)',
        desc: 'Η ακλόνητη άγκυρά σου. Κάθε φόρα που αναγνωρίζεις το βάρος σου στο πάτωμα, πιάνεις το σχοινί.'
      },
      {
        icon: '🔦',
        name: 'Ο Πυρσός (Η Παρατήρηση)',
        desc: 'Το φως της προσοχής. Η πράξη της παρατήρησης της διάσπασης και του εκνευρισμού, χωρίς κριτική και χωρίς να αναλύεις τα "γιατί" — αυτή είναι η ίδια η ουσία της άσκησης.'
      }
    ],
    allegoriesTitle: 'Αλληγορίες & Μεταφορές',
    allegory1Title: 'Ο Ελέφαντας, η Μαϊμού και ο "Νευροδιαφορετικός" Ασκητής',
    allegory1Text: 'Σε μια αρχαία διαδρομή της παράδοσης Σαμάθα (περίπου 300 π.Χ.), ένας ασκητής προσπαθεί να δαμάσει τον νου του. Η εικόνα είναι συμβολική: ο νους είναι ένας μαύρος, αφηνιασμένος ελέφαντας (το νευρικό σύστημα σε ταραχή) τον οποίο σέρνει μια υπερκινητική μαϊμού (το DMN που πηδάει από σκέψη σε σκέψη). \n\nΣκέψου το εξής: ένας άνθρωπος πριν από 2.300 χρόνια, μέσα στην ησυχία της φύσης, δεν μπορούσε να μαζέψει το μυαλό του, το οποίο έτρεχε ανεξέλεγκτα με ξεκάθαρα στοιχεία διάσπασης. Κατά την προσωπική μου άποψη, αυτός ο ασκητής —όπως ίσως και ο ίδιος ο Βούδας— ήταν νευροδιαφορετικός. Χρειαζόταν ένα χειροπιαστό σύστημα για να "επιβιώσει" από τον ίδιο του τον νου.\n\nΗ διαφορά από την απλή "αυτοσυγκέντρωση" είναι ότι ο ασκητής χρησιμοποιεί δύο ξεκάθαρα εργαλεία: την Ενσυνειδητότητα / Mindfulness (ως ένα μεταφορικό σκοινί/λάσο) και την Αναπνοή. Κάθε φορά που η μαϊμού παρασέρνει τον ελέφαντα, ο ασκητής δεν χρησιμοποιεί βία ούτε επικρίνει τον εαυτό του. Ρίχνει απλώς απαλά το σκοινί του mindfulness, ρυθμίζει την αναπνοή του και τους επαναφέρει. Σταδιακά, χωρίς μάχη, η μαϊμού ηρεμεί, ο ελέφαντας γίνεται λευκός και γαλήνιος, και ο ασκητής αναπαύεται μαζί τους.',
    allegory1Lesson: 'Τι μας διδάσκει: Το Mindfulness (σκοινί) και η Αναπνοή είναι τα εργαλεία της "απαλής επιστροφής". Το ότι ο νους σου διασπάται διαρκώς δεν σημαίνει ότι απέτυχες· ίσως απλώς έχεις ένα νευροδιαφορετικό μυαλό, όπως ακριβώς οι αρχαίοι ασκητές. Η επιστροφή είναι η ίδια η εξάσκηση.',
    allegory2Title: 'Η Ενσυνειδητότητα ως Ποδήλατο',
    allegory2Text: 'Η πρακτική του Τετραπλού Άξονα μοιάζει με το να μαθαίνεις ποδήλατο. Σώμα είναι το ίδιο το ποδήλατο – το σταθερό πλαίσιο που σε κρατά. Αναπνοή είναι το πετάλι – η ρυθμική κίνηση που δίνει ροή. Προσοχή είναι το τιμόνι – κατευθύνει το βλέμμα και τη φορά. Χώρος είναι ο δρόμος και το περιβάλλον – εκεί που κυλάς, με εμπόδια και ελευθερία. Μέχρι τώρα, ασυνείδητα πατάμε πολύ δυνατά το πετάλι: προσπαθούμε υπερβολικά, κουραζόμαστε, χάνουμε την ισορροπία. Αν η προσοχή είναι μόνο κλειστή (κοιτάς επίμονα το δρόμο), πάλι δημιουργείται ανισορροπία. Χρειάζεται και κλειστή προσοχή (για να μη φύγεις από τη διαδρομή) και ανοιχτή προσοχή (για να βλέπεις το τοπίο, να νιώθεις το σώμα, να προσαρμόζεσαι). Η ισορροπία έρχεται όταν και οι δύο τρόποι δουλεύουν μαζί. Στην αρχή πέφτεις, κουνιέσαι, νιώθεις αδέξιος. Αλλά κάθε φορά που ξανασηκώνεσαι, το σώμα θυμάται. Με τον καιρό, η ισορροπία έρχεται φυσικά, και μπορείς να κοιτάς μπροστά χωρίς να σκέφτεσαι κάθε κίνηση. Έτσι λειτουργεί και η ενσυνειδητότητα: δεν είναι μαγική λύση, αλλά ένας τρόπος να γυμνάσεις τον νου, ώστε να έχεις παρουσία και να δουλέψεις με σκέψεις και συναισθήματα που σε βαραίνουν από το παρελθόν.',
    allegory2Lesson: 'Τι μας διδάσκει: Η ισορροπία δεν είναι στατική – είναι συνεχής προσαρμογή. Πατάμε ελαφρά, κοιτάμε κλειστά και ανοιχτά ταυτόχρονα, εμπιστευόμαστε τη ροή.'
  },
  en: {
    title: 'The Method & Symbols',
    intro: 'The mindfulness of our method does not require you to "empty your mind", nor to stay perfectly still. It uses an allegory to help you understand how the method trains you to regulate your nervous system.',
    diffTitle: 'Why is it different from classical Mindfulness?',
    diffText: 'In classical methods, the instruction is often "just observe your breath". For a mind that races, this is often impossible at first without ending up controlling the breath, causing more anxiety. We change the formula:\n\n1. Feel gravity: We provide a stable, undeniable anchor (Body).\n2. Regulate breath: If breath is tight, we do not just passively "accept" it—we actively regulate it (e.g., long exhales from the mouth) to calm the nervous system.\n3. Closed and Open Attention: Alternating between pinpoint focus (torch) and open spatial awareness, making the mind an ally.',
    symbolsTitle: 'Mind Dictionary: The Symbols',
    symbols: [
      {
        icon: '🐘',
        name: 'The Elephant (The Mind)',
        desc: 'Initially black and agitated. Through stability and kindness, it slowly "whitens", representing the building of the insula and interoception. We do not fight it, we train it.'
      },
      {
        icon: '🐒',
        name: 'The Monkey (The DMN)',
        desc: 'Represents mind wandering, the inner critic, anxiety, and echoes of past rejections. We do not ally with the monkey; we observe it until it steps back and Alpha brainwaves synchronize.'
      },
      {
        icon: '🐇',
        name: 'The Rabbit (Resting Nervous System)',
        desc: 'Symbolizes dullness and lack of concentration. It is not a "failure". It is the necessary biological rest of the nervous system after chronic fight-or-flight. We embrace it with kindness.'
      },
      {
        icon: '🧗‍♂️',
        name: 'The Ascetic (The Mindful Self)',
        desc: 'Your new self in the practice. Instead of criticizing distraction, they use the tools of breath and mindfulness to observe with kindness, gentleness, and vigilance.'
      },
      {
        icon: '🪢',
        name: 'The Rope (Gravity & Grounding)',
        desc: 'Your steady anchor. Every time you feel your weight on the floor, you hold the rope.'
      },
      {
        icon: '🔦',
        name: 'The Torch (Observation)',
        desc: 'The light of attention. The act of observing distraction and irritation without judgment or over-analysis—this is the core of the practice.'
      }
    ],
    allegoriesTitle: 'Allegories & Metaphors',
    allegory1Title: 'The Elephant, the Monkey, and the "Neurodivergent" Ascetic',
    allegory1Text: 'In an ancient path of the Samatha tradition (around 300 BC), an ascetic is trying to tame his mind. The imagery is symbolic: the mind is a crazed black elephant (the nervous system in turmoil) led by a hyperactive monkey (the DMN jumping from thought to thought). \n\nConsider this: a person 2,300 years ago, surrounded by the absolute quiet of nature, could not gather his thoughts; his mind raced uncontrollably, showing clear signs of severe distraction. In my personal opinion, this ascetic—and perhaps Buddha himself—was neurodivergent. He needed a practical, tangible system to "survive" his own mind.\n\nThe difference from simple "concentration" is that the ascetic uses two precise tools: Mindfulness (a metaphorical rope or lasso) and the Breath. Every time the monkey leads the elephant astray, the ascetic uses no force and does not criticize himself. He gently throws the rope of mindfulness, regulates his breath, and brings them back. Gradually, without a fight, the monkey calms down, the elephant turns white and peaceful, and the ascetic rests alongside them.',
    allegory1Lesson: 'What it teaches us: Mindfulness (the rope) and Breath are the tools of "gentle return". The fact that your mind constantly wanders doesn\'t mean you failed; you might just have a neurodivergent mind, exactly like the ancient ascetics. The return itself is the practice.',
    allegory2Title: 'Mindfulness as a Bicycle',
    allegory2Text: 'The Fourfold Axis practice is like learning to ride a bicycle. Body is the bicycle itself – the stable frame that holds you. Breath is the pedaling – the rhythmic motion that gives flow. Attention is the handlebar – it directs your gaze and direction. Space is the road and environment – where you move, with obstacles and freedom. Until now, unconsciously we pedal too hard: we try too much, tire ourselves, lose balance. If attention is only closed (staring at the road), imbalance also arises. We need both closed attention (to stay on track) and open attention (to see the landscape, feel the body, adjust). Balance comes when both work together. At first you fall, wobble, feel clumsy. But every time you get back up, the body remembers. Over time, balance comes naturally, and you can look ahead without thinking about each movement. That’s how mindfulness works: it’s not a magical solution, but a way to train the mind, so you can be present and work with thoughts and emotions that weigh you down from the past.',
    allegory2Lesson: 'What it teaches us: Balance is not static – it’s constant adjustment. Pedal lightly, look with both closed and open attention, trust the flow.'
  }
};

export default function Method() {
  const { language } = useLanguage();
  const t = T[language as keyof typeof T];

  return (
    <div className="flex flex-col h-full bg-[#0f1117] font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-5 bg-white/[0.04] border-b border-white/[0.05] sticky top-0 z-10 backdrop-blur-md">
        <Link 
          to="/" 
          className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center text-[#d4d4d8] hover:bg-white/[0.04] hover:text-white transition-colors active:scale-95"
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-[#d4d4d8] uppercase tracking-widest drop-shadow-sm truncate px-4">
          {t.title}
        </h1>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar pb-safe mb-6">
        
        {/* Intro Section */}
        <section className="space-y-4">
          <p className="text-[#d4d4d8]/80 text-sm md:text-base leading-relaxed text-justify opacity-95">
            {t.intro}
          </p>
        </section>

        {/* The Difference Section */}
        <section className="bg-white/[0.04] border border-white/[0.05] shape-cloud-4 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600/80 rounded-l-[2.5rem]" />
          <h2 className="text-[16px] font-bold text-teal-100 mb-3 drop-shadow-sm">
            {t.diffTitle}
          </h2>
          <div className="text-[#d4d4d8]/90 text-sm leading-relaxed whitespace-pre-wrap text-justify">
            {t.diffText}
          </div>
        </section>

        {/* Symbols Dictionary */}
        <section>
          <h2 className="text-[18px] font-bold text-[#d4d4d8] mb-5 border-b border-white/[0.05] pb-2 uppercase tracking-wide">
            {t.symbolsTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.symbols.map((sym, idx) => (
              <div 
                key={idx} 
                className="bg-white/[0.04] border border-white/[0.05] p-4 rounded-3xl flex items-start gap-4 hover:bg-white/[0.04] transition-colors"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-[32px] md:text-[40px] drop-shadow-md shrink-0 py-1">
                  {sym.icon}
                </div>
                <div>
                  <h3 className="text-[#d4d4d8] font-bold text-[15px] mb-1">
                    {sym.name}
                  </h3>
                  <p className="text-[#d4d4d8]/80 text-[12px] leading-relaxed">
                    {sym.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Allegories Section */}
        <section className="pt-4 border-t border-white/[0.05] mt-8">
          <h2 className="text-[18px] font-bold text-[#d4d4d8] mb-5 border-b border-white/[0.05] pb-2 uppercase tracking-wide">
            {t.allegoriesTitle}
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/[0.04] border border-white/[0.05] shape-cloud-5 p-5 shadow-lg relative overflow-hidden">
              <h3 className="text-[16px] font-bold text-amber-200 mb-3 drop-shadow-sm flex items-center gap-2">
                <span>🐘🐒</span> {t.allegory1Title}
              </h3>
              <p className="text-[#d4d4d8]/90 text-sm leading-relaxed whitespace-pre-wrap text-justify mb-4">
                {t.allegory1Text}
              </p>
              <div className="pt-3 border-t border-white/[0.05] text-xs font-medium text-teal-300 leading-relaxed">
                ✨ {t.allegory1Lesson}
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.05] shape-cloud-6 p-5 shadow-lg relative overflow-hidden">
              <h3 className="text-[16px] font-bold text-blue-200 mb-3 drop-shadow-sm flex items-center gap-2">
                <span>🚲</span> {t.allegory2Title}
              </h3>
              <p className="text-[#d4d4d8]/90 text-sm leading-relaxed whitespace-pre-wrap text-justify mb-4">
                {t.allegory2Text}
              </p>
              <div className="pt-3 border-t border-white/[0.05] text-xs font-medium text-teal-300 leading-relaxed">
                ✨ {t.allegory2Lesson}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
