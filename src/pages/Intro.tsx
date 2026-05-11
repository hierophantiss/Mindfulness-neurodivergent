import React from 'react';
import { ArrowLeft, Brain, Wind, Eye, Waves, Heart, Zap, Shield, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function Intro() {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-pine-950 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-5 bg-pine-900/50 border-b border-pine-800/80 sticky top-0 z-30 backdrop-blur-md">
        <Link 
          to="/" 
          className="w-10 h-10 rounded-full bg-pine-800/50 flex items-center justify-center text-pine-200 hover:bg-pine-700/50 hover:text-white transition-colors active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-pine-100 uppercase tracking-widest drop-shadow-sm truncate px-4">
          {language === 'el' ? 'Ο ψηφιακός σου βοηθός' : 'Your Digital Assistant'}
        </h1>
        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-8 space-y-10 custom-scrollbar pb-24 sm:pb-32 mb-8">
        
        {/* Helper Introduction */}
        <section className="bg-pine-900/30 border border-pine-700/40 rounded-[1.5rem] p-6 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-900/50 border border-teal-500/30 flex items-center justify-center text-teal-300 text-2xl drop-shadow-md shrink-0">
              ∞
            </div>
            <h2 className="text-xl font-bold text-teal-100 drop-shadow-sm">
              {language === 'el' ? 'Γεια! Είμαι ο ∞' : 'Hi! I am ∞'}
            </h2>
          </div>
          
          <div className="space-y-4 text-pine-200/90 text-[15px] leading-relaxed text-justify">
            <p>
              <strong className="text-pine-100">{language === 'el' ? 'Ο ρόλος μου: ' : 'My role: '}</strong>
              {language === 'el' 
                ? 'Σχεδιάστηκα για να σε υποστηρίζω χωρίς πίεση, χωρίς ενοχές και χωρίς να κρίνω την προσοχή σου.' 
                : 'I was designed to support you without pressure, without guilt, and without judging your attention.'}
            </p>
            <p>
              <strong className="text-pine-100">{language === 'el' ? 'Τι κάνω εδώ; ' : 'What am I doing here? '}</strong>
              {language === 'el' 
                ? 'Θυμάμαι πού σταμάτησες στα κεφάλαια, ποιες ασκήσεις σε βοήθησαν και πώς ένιωσες. Όλα μένουν αποκλειστικά στη δική σου συσκευή.' 
                : 'I remember where you stopped in chapters, which exercises helped you and how you felt. Everything stays exclusively on your own device.'}
            </p>
            <p>
              <strong className="text-pine-100">{language === 'el' ? 'Πώς βοηθάω; ' : 'How do I help? '}</strong>
              {language === 'el' 
                ? 'Αν νιώθεις overwhelm, αν ο νους σου τρέχει ή αν απλά θέλεις να μάθεις κάτι νέο, προτείνω το κατάλληλο εργαλείο για τη στιγμή.' 
                : 'If you feel overwhelmed, if your mind is racing or if you just want to learn something new, I suggest the right tool for the moment.'}
            </p>
            <p className="bg-pine-800/40 p-3 rounded-xl border border-pine-700/50">
              <strong className="text-teal-300">{language === 'el' ? 'Χωρίς ενοχές: ' : 'No guilt: '}</strong>
              {language === 'el' 
                ? 'Αν σταματήσεις για μέρες ή βδομάδες, δεν πειράζει. Η ενσυνειδητότητα δεν είναι γραμμική. Σε περιμένω ακριβώς εκεί που με άφησες.' 
                : 'If you stop for days or weeks, it’s fine. Mindfulness is not linear. I am waiting for you exactly where you left me.'}
            </p>
          </div>
        </section>

        {/* Differences */}
        <section>
          <h2 className="text-[17px] font-bold text-pine-100 mb-4 border-b border-pine-800/60 pb-2 uppercase tracking-wide flex items-center gap-2">
            <Shield size={18} className="text-teal-400" />
            {language === 'el' ? 'Τι κάνει αυτό το εργαλείο διαφορετικό' : 'What makes this tool different'}
          </h2>
          <ul className="space-y-3">
            {[
              { el: 'Δωρεάν, χωρίς λογαριασμό, χωρίς διαφημίσεις', en: 'Free, no account, no ads' },
              { el: 'Σχεδιασμένο ειδικά για νευροδιαφορετικούς', en: 'Designed specifically for neurodivergent minds' },
              { el: 'Trauma-informed: σέβεται τα όριά σου', en: 'Trauma-informed: respects your boundaries' },
              { el: 'Λειτουργεί offline — εγκατάσταση στο κινητό', en: 'Works offline — installable on mobile' },
              { el: 'Τα δεδομένα σου μένουν μόνο στη συσκευή σου', en: 'Your data stays only on your device' }
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 bg-pine-800/30 p-3 rounded-2xl border border-pine-700/30">
                <span className="text-teal-400 shrink-0">✦</span>
                <span className="text-pine-200 text-sm font-medium">{language === 'el' ? item.el : item.en}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Science and Research */}
        <section>
          <h2 className="text-[17px] font-bold text-pine-100 mb-2 border-b border-pine-800/60 pb-2 uppercase tracking-wide">
            {language === 'el' ? 'Γιατί αυτό λειτουργεί — Η έρευνα' : 'Why this works — The research'}
          </h2>
          <p className="text-pine-300 text-sm italic mb-5 leading-relaxed">
            {language === 'el' 
              ? 'Ο Τετραπλός Άξονας δεν βασίζεται σε θεωρία. Κάθε πρακτική αντιστοιχεί σε μετρήσιμες αλλαγές στο νευρικό σύστημα:'
              : 'The Fourfold Axis is not based on theory. Each practice corresponds to measurable changes in the nervous system:'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-3xl space-y-2">
              <div className="text-xl mb-1">🧠</div>
              <h3 className="font-bold text-pine-100 text-[15px]">{language === 'el' ? 'Η γείωση αλλάζει τον εγκέφαλο.' : 'Grounding changes the brain.'}</h3>
              <p className="text-pine-300 text-xs leading-relaxed">
                {language === 'el' ? '8 εβδομάδες πρακτικής ενσυνειδητότητας αυξάνουν το πάχος του φλοιού στην insula και τον ιππόκαμπο — περιοχές που συνδέουν αίσθηση, μνήμη και αυτορρύθμιση. (Hölzel et al., 2011)' : '8 weeks of mindfulness practice increases cortical thickness in the insula and hippocampus — areas connecting sensation, memory, and self-regulation. (Hölzel et al., 2011)'}
              </p>
            </div>
            
            <div className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-3xl space-y-2">
              <div className="text-xl mb-1">🫁</div>
              <h3 className="font-bold text-pine-100 text-[15px]">{language === 'el' ? 'Η αργή εκπνοή ενεργοποιεί το πνευμονογαστρικό.' : 'Slow exhale activates the vagus nerve.'}</h3>
              <p className="text-pine-300 text-xs leading-relaxed">
                {language === 'el' ? 'Η εκπνοή μεγαλύτερη από την εισπνοή ενεργοποιεί τον παρασυμπαθητικό κλάδο, μειώνει τον καρδιακό ρυθμό και την κορτιζόλη. (Gerritsen & Band, 2018)' : 'Exhaling longer than inhaling activates the parasympathetic branch, lowers heart rate and cortisol. (Gerritsen & Band, 2018)'}
              </p>
            </div>

            <div className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-3xl space-y-2">
              <div className="text-xl mb-1">👁</div>
              <h3 className="font-bold text-pine-100 text-[15px]">{language === 'el' ? 'Η προσοχή μεταμορφώνει τη δομή.' : 'Attention transforms structure.'}</h3>
              <p className="text-pine-300 text-xs leading-relaxed">
                {language === 'el' ? 'Η εστιασμένη προσοχή ενισχύει τον προμετωπιαίο φλοιό — θεμέλιο της αυτορρύθμισης και της ικανότητας «επιστροφής». (Lazar et al., 2005)' : 'Focused attention strengthens the prefrontal cortex — the foundation of self-regulation and the ability to "return". (Lazar et al., 2005)'}
              </p>
            </div>

            <div className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-3xl space-y-2">
              <div className="text-xl mb-1">🌊</div>
              <h3 className="font-bold text-pine-100 text-[15px]">{language === 'el' ? 'Ρυθμίζεται ο «αυτόματος πιλότος».' : 'The "autopilot" is regulated.'}</h3>
              <p className="text-pine-300 text-xs leading-relaxed">
                {language === 'el' ? 'Η πρακτική μειώνει τη δραστηριότητα του Default Mode Network — το δίκτυο που ευθύνεται για τη νοητική περιπλάνηση και τον αυτοαναφορικό βρόχο. (Brewer et al., 2011)' : 'Practice reduces activity in the Default Mode Network — the network responsible for mind wandering and the self-referential loop. (Brewer et al., 2011)'}
              </p>
            </div>

            <div className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-3xl space-y-2">
              <div className="text-xl mb-1">❤️</div>
              <h3 className="font-bold text-pine-100 text-[15px]">{language === 'el' ? 'Η καρδιακή συνοχή βελτιώνεται.' : 'Heart coherence improves.'}</h3>
              <p className="text-pine-300 text-xs leading-relaxed">
                {language === 'el' ? 'Ρυθμική αναπνοή (π.χ. 5 δευτ. μέσα - 5 έξω) συγχρονίζει τη μεταβλητότητα καρδιακού ρυθμού, μειώνει άγχος και βελτιώνει τη συναισθηματική ρύθμιση. (McCraty et al., 2009)' : 'Rhythmic breathing synchronizes heart rate variability, reduces stress and improves emotional regulation. (McCraty et al., 2009)'}
              </p>
            </div>

            <div className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-3xl space-y-2">
              <div className="text-xl mb-1">⚡</div>
              <h3 className="font-bold text-pine-100 text-[15px]">{language === 'el' ? 'Αόρατες δόσεις, μεγάλα αποτελέσματα.' : 'Invisible doses, macro results.'}</h3>
              <p className="text-pine-300 text-xs leading-relaxed">
                {language === 'el' ? 'Σύντομες αλλά συχνές πρακτικές ("Invisible") είναι πιο αποτελεσματικές από μεγάλες συνεδρίες, λόγω του spacing effect. (Cepeda et al., 2006)' : 'Short but frequent practices ("Invisible") are more effective than long sessions, due to the spacing effect. (Cepeda et al., 2006)'}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-pine-800/20 p-4 rounded-2xl border border-pine-700/30 text-pine-300 text-[13px] leading-relaxed text-center font-serif italic">
            {language === 'el' 
              ? 'Βασισμένο σε παραδόσεις Qi Gong, Dzogchen, Samatha/Vipassana και Σούφι διαλογισμού — τις ίδιες πηγές από τις οποίες αντλούν οι σύγχρονες μέθοδοι (Somatic Therapy, MBSR).'
              : 'Based on traditions of Qi Gong, Dzogchen, Samatha/Vipassana and Sufi meditation — the same sources from which modern methods draw (Somatic Therapy, MBSR).'}
          </div>
        </section>

        {/* Trauma Informed */}
        <section>
          <h2 className="text-[17px] font-bold text-pine-100 mb-4 border-b border-pine-800/60 pb-2 uppercase tracking-wide">
            {language === 'el' ? 'Γιατί ο οδηγός είναι trauma-informed' : 'Why this guide is trauma-informed'}
          </h2>
          <ul className="space-y-3">
            {[
              { el: 'Ξεκινά πάντα από το σώμα — όχι από τη σκέψη. Η γείωση δημιουργεί αίσθηση ασφάλειας πριν ζητηθεί οτιδήποτε άλλο.', en: 'It always starts from the body — not from thought. Grounding creates a sense of safety before anything else is asked.' },
              { el: 'Δεν ζητάει «άδειασμα του νου». Η προσοχή επιστρέφει, δεν ελέγχει. Κάθε αποτυχία είναι μέρος της άσκησης.', en: 'It does not ask to "empty the mind". Attention returns, it does not control. Every failure is part of the practice.' },
              { el: 'Σέβεται τα όρια — αν κάτι φέρνει δυσφορία, σταματάς.', en: 'It respects boundaries — if something brings discomfort, you stop.' },
              { el: 'Χρησιμοποιεί καλοσύνη αντί κατάκριση.', en: 'Uses kindness instead of criticism.' }
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 bg-pine-800/30 p-3 rounded-2xl border border-pine-700/30">
                <span className="text-teal-400 shrink-0">✦</span>
                <span className="text-pine-200 text-[13px] leading-relaxed font-medium text-justify">{language === 'el' ? item.el : item.en}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Glossary */}
        <section>
          <h2 className="text-[17px] font-bold text-pine-100 mb-4 border-b border-pine-800/60 pb-2 uppercase tracking-wide">
            {language === 'el' ? 'Γλωσσάρι' : 'Glossary'}
          </h2>
          <div className="space-y-3">
            {[
              { title: 'Insula', desc: { el: 'Η γέφυρα αίσθησης-επίγνωσης. Ενισχύεται με πρακτική.', en: 'The sensation-awareness bridge. Strengthened with practice.' } },
              { title: 'DMN (Default Mode Network)', desc: { el: 'Ο «αυτόματος πιλότος» του νου. Η ενσυνειδητότητα τον ρυθμίζει.', en: 'The mind’s "autopilot". Mindfulness regulates it.'} },
              { title: { el: 'Πνευμονογαστρικό', en: 'Vagus Nerve' }, desc: { el: 'Η αργή εκπνοή το ενεργοποιεί → ηρεμία.', en: 'Slow exhalation activates it → calmness.' } },
              { title: { el: 'Ιδιοδεκτικότητα', en: 'Proprioception' }, desc: { el: 'Ο εσωτερικός GPS σου — αίσθηση θέσης στον χώρο.', en: 'Your inner GPS — sense of position in space.' } },
              { title: { el: 'Νευροπλαστικότητα', en: 'Neuroplasticity' }, desc: {el: 'Ο εγκέφαλος αλλάζει δομή με εμπειρία. 8 εβδομάδες αρκούν.', en: 'The brain changes structure through experience. 8 weeks is enough.' } }
            ].map((term, i) => (
              <div key={i} className="bg-pine-900/30 border border-pine-700/40 p-4 rounded-xl">
                <h3 className="font-bold text-teal-300 mb-1">{typeof term.title === 'string' ? term.title : (language === 'el' ? term.title.el : term.title.en)}</h3>
                <p className="text-pine-200 text-sm">{language === 'el' ? term.desc.el : term.desc.en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Author */}
        <section className="bg-gradient-to-br from-pine-900/80 to-pine-950 border border-pine-700/50 rounded-[1.5rem] p-6 shadow-xl relative overflow-hidden">
          <h2 className="text-[17px] font-bold text-pine-100 mb-3 drop-shadow-sm">
            {language === 'el' ? 'Ο Δημιουργός' : 'The Creator'}
          </h2>
          <p className="text-pine-300 text-sm leading-relaxed text-justify mb-4">
            {language === 'el' 
              ? 'Ο Τετραπλός Άξονας δημιουργήθηκε από τον Θεόδωρο Μπαϊρακτάρη — νευροδιαφορετικό ασκούμενο με πάνω από 20 χρόνια πρακτικής σε παραδόσεις ενσυνειδητότητας: Tai Chi & Qi Gong, Σούφι διαλογισμό (Inayatiyya), και Θιβετιανό Βουδισμό (Samatha, Tsa Lung, Shine). Η μέθοδος γεννήθηκε από προσωπική ανάγκη για εργαλεία παρουσίας που λειτουργούν για τον νευροδιαφορετικό νου.'
              : 'The Fourfold Axis was created by Theodoros Bairaktaris — a neurodivergent practitioner with over 20 years of practice in mindfulness traditions: Tai Chi & Qi Gong, Sufi meditation (Inayatiyya), and Tibetan Buddhism (Samatha, Tsa Lung, Shine). The method was born from a personal need for presence tools that work for the neurodivergent mind.'}
          </p>
          <div className="flex items-center gap-2 text-teal-400 font-medium text-sm">
            <Mail size={16} />
            <a href="mailto:bairaktaris.theodoros@gmail.com" className="hover:text-teal-200 transition-colors">
              bairaktaris.theodoros@gmail.com
            </a>
          </div>
        </section>
        
      </div>
    </div>
  );
}
