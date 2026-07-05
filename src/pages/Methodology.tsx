import React from 'react';
import { ArrowLeft, ShieldCheck, Brain, Waves, Sparkles, Heart, Activity, CheckCircle, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const T = {
  el: {
    title: 'Επιστημονική Θεμελίωση',
    subtitle: 'Η Νευροεπιστήμη πίσω από τη Μεθοδολογία μας',
    intro: 'Η προσέγγισή μας δεν βασίζεται σε γενικές οδηγίες χαλάρωσης, αλλά σε σύγχρονα, peer-reviewed ευρήματα της νευροεπιστήμης και της κλινικής έρευνας για τον νευροδιαφορετικό εγκέφαλο (ADHD, Αυτισμός, HSP).',
    
    philosophyTitle: 'Φιλοσοφία Έρευνας & Νευροδιαφορετικότητα',
    philosophyText: 'Οι κλασικές τεχνικές mindfulness συχνά προκαλούν άγχος ή «πάγωμα» (freeze response) σε νευροδιαφορετικά άτομα επειδή απαιτούν άμεση, αναγκαστική ακινησία και παθητική παρατήρηση. Η φιλοσοφία μας επαναπροσδιορίζει την πρακτική μέσω της σωματικής ενσυναισθητικής ρύθμισης (somatic bottom-up regulation):',
    
    pillars: [
      {
        id: 'study-kim-jung',
        icon: ShieldCheck,
        title: 'Αποτελεσματικότητα στην ΔΕΠΥ Ενηλίκων (Kim & Jung, 2025)',
        desc: 'Σε αυτή τη νέα συστηματική ανασκόπηση (2025), οι επιστήμονες επιβεβαιώνουν ότι οι παρεμβάσεις ενσυνειδητότητας (MBIs) βελτιώνουν στατιστικά σημαντικά τα κεντρικά συμπτώματα της ΔΕΠΥ στους ενήλικες, καθώς και την γενικότερη λειτουργικότητά τους. Αυτό επικυρώνει τη χρήση του Sanctuary ως κλινικά αποτελεσματική παρέμβαση για την διαχείριση της προσοχής.',
        citation: 'Kim & Jung (2025). Medicine. Doi: 10.1097/md.0000000000044308'
      },
      {
        id: 'study-calderone',
        icon: ShieldCheck,
        title: 'Νευροβιολογία της Ενσυνειδητότητας (Calderone et al., 2024)',
        desc: 'Αυτή η πρόσφατη συστηματική ανασκόπηση (2024) συγκεντρώνει τα κλινικά ευρήματα της τελευταίας δεκαετίας, επιβεβαιώνοντας ότι η ενσυνειδητότητα προκαλεί μετρήσιμες δομικές και λειτουργικές αλλαγές στον εγκέφαλο. Ειδικότερα, τεκμηριώνει την πάχυνση του προμετωπιαίου φλοιού (ρύθμιση προσοχής), τη μείωση του όγκου της αμυγδαλής (μείωση του άγχους) και τη βελτιωμένη συνδεσιμότητα της νήσου (insula - ενδοδεκτικότητα), παρέχοντας ολοκληρωμένη επιστημονική επικύρωση για τις πρακτικές του Sanctuary και του Τετραπλού Άξονα.',
        citation: 'Calderone et al. (2024). Biomedicines. Doi: 10.3390/biomedicines12112613'
      },
      {
        id: 'study-farb',
        icon: Brain,
        title: 'Απενεργοποίηση του DMN (Farb et al., 2007)',
        desc: 'Σε εγκέφαλους με ADHD ή χρόνιο masking, το Default Mode Network (DMN - το δίκτυο της αυτόματης εσωτερικής φλυαρίας και αυτοκριτικής) είναι υπερδραστήριο. Η μελέτη fMRI του Farb απέδειξε ότι η σκόπιμη εστίαση στην άμεση σωματική αίσθηση (Experiential Focus) απενεργοποιεί ακαριαία το DMN, προσφέροντας άμεση νευρολογική ανακούφιση.',
        citation: 'Farb et al. (2007). Social Cognitive and Affective Neuroscience. Doi: 10.1093/scan/nsm030'
      },
      {
        id: 'study-brewer',
        icon: Brain,
        title: 'Ρύθμιση Συνδεσιμότητας DMN (Brewer et al., 2011)',
        desc: 'Η ιστορική μελέτη νευροαπεικόνισης του Brewer απέδειξε ότι οι έμπειροι διαλογιστές παρουσιάζουν σημαντικά χαμηλότερη δραστηριότητα και αλλαγές στη συνδεσιμότητα του Default Mode Network (DMN). Αυτό βοηθά στη μείωση του μηρυκασμού και της συνεχούς εσωτερικής φλυαρίας, δημιουργώντας ένα βέλτιστο πρότυπο διαχείρισης της προσοχής.',
        citation: 'Brewer et al. (2011). PNAS. Doi: 10.1073/pnas.1112029108'
      },
      {
        id: 'study-porges',
        icon: Waves,
        title: 'Πολυβαγική Θεωρία & Ασφάλεια (Porges, 1995/2011)',
        desc: 'Το νευρικό σύστημα χάνει την ισορροπία του όταν νιώθει απειλή. Μέσω της αργής, ελεγχόμενης εκπνοής (Ventral Vagus stimulation), στέλνουμε σήματα βιολογικής ασφάλειας απευθείας στο στέλεχος του εγκεφάλου, παρακάμπτοντας τη λογική ανάλυση που συχνά οδηγεί σε πνευματικό μηρυκασμό.',
        citation: 'Stephen Porges, PhD (1995). Psychophysiology. Doi: 10.1111/j.1469-8986.1995.tb03320.x'
      },
      {
        id: 'study-corrigan',
        icon: Activity,
        title: 'Παράθυρο Ανοχής & Αυτορρύθμιση (Corrigan et al., 2010)',
        desc: 'Σύμφωνα με το μοντέλο του Παραθύρου Ανοχής, το αυτόνομο νευρικό σύστημα διαθέτει ένα βέλτιστο εύρος διέγερσης. Έξω από αυτό, οδηγούμαστε σε υπερδιέγερση ή υποδιέγερση. Οι σωματικές πρακτικές του Sanctuary δρουν ως εργαλεία αυτορρύθμισης, επαναφέροντας το σύστημα σε ισορροπία όταν βγαίνει εκτός ορίων λόγω emotional trauma ή overload.',
        citation: 'Corrigan et al. (2010). Journal of Psychopharmacology. Doi: 10.1177/0269881109354930'
      },
      {
        id: 'study-lane',
        icon: Activity,
        title: 'Brainwave Entrainment (Oster 1973, Lane 1998)',
        desc: 'Τα διωτικά κύματα (Binaural Beats) που χρησιμοποιούμε στο Sanctuary και τις ασκήσεις αναπνοής συντονίζουν τη νευρωνική δραστηριότητα (Neural Entrainment) μειώνοντας το αισθητηριακό overload. Λειτουργούν ως μια «ακουστική κουβέρτα βάρους», ηρεμώντας το συμπαθητικό σύστημα.',
        citation: 'Lane et al. (1998). Physiology & Behavior. Doi: 10.1016/S0031-9384(97)00436-8'
      },
      {
        id: 'study-lutz',
        icon: Sparkles,
        title: 'Συντονισμός Alpha & Gamma (Lutz/Davidson, 2004)',
        desc: 'Η πρακτική της Ανοιχτής Επίγνωσης (Open Awareness / Space Axis) συγχρονίζει απομακρυσμένες εγκεφαλικές περιοχές μέσω κυμάτων Alpha και Gamma υψηλού πλάτους. Αυτό μειώνει τη στενή υπερ-εστίαση που προκαλεί εξάντληση και δημιουργεί νοητική ευρυχωρία.',
        citation: 'Lutz, Davidson et al. (2004). PNAS. Doi: 10.1073/pnas.0407401101'
      },
      {
        id: 'study-zylowska',
        icon: CheckCircle,
        title: 'Γνωστική Βελτίωση στο ADHD (Zylowska et al., 2008)',
        desc: 'Το μοναδικό peer-reviewed πρόγραμμα 8 εβδομάδων ενσυνειδητότητας ειδικά για ΔΕΠΥ — βρήκε βελτιώσεις στην προσοχή, τη γνωστική αναστολή, το άγχος και τα καταθλιπτικά συμπτώματα.',
        citation: 'Zylowska, L., Ackerman, D. L., Yang, M. H., Futrell, J. L., Horton, N. L., Hale, T. S., Pataki, C., & Smalley, S. L. (2008). Mindfulness meditation training in adults and adolescents with ADHD: A feasibility study. Journal of Attention Disorders, 11(6), 737–746. https://doi.org/10.1177/1087054707308502'
      },
      {
        id: 'study-ashinoff',
        icon: Sparkles,
        title: 'Μελέτη Hyperfocus (Ashinoff & Abu-Akel, 2019)',
        desc: 'Η συστηματική αυτή έρευνα ορίζει το hyperfocus ως κατάσταση ολικής γνωστικής απορρόφησης χαρακτηριστικό των ADHD & Αυτιστικών προφίλ. Επιβεβαιώνει ότι δεν πρόκειται για "έλλειμμα" προσοχής, αλλά για "all-or-nothing" ρύθμιση, η οποία εξισορροπείται με τις τεχνικές Soft Gaze.',
        citation: 'Ashinoff & Abu-Akel (2019). Psychological Research. Doi: 10.1007/s00426-019-01245-8'
      },
      {
        id: 'study-mackrous',
        icon: Brain,
        title: 'Πρόβλεψη της Βαρύτητας & Παρεγκεφαλίδα (Mackrous et al., 2019)',
        desc: 'Η μελέτη αποδεικνύει ότι η παρεγκεφαλίδα υπολογίζει δυναμικά και προβλέπει τη βαρύτητα. Το Sanctuary και ο Τετραπλός Άξονας αξιοποιούν αυτόν τον αρχέγονο νευρωνικό υπολογισμό "αγκυρώνοντας" τον εγκέφαλο στο χώρο, προσφέροντας άμεση αίσθηση ασφάλειας στο υπερδιεγερμένο νευρικό σύστημα.',
        citation: 'Mackrous et al. (2019). Current Biology. Doi: 10.1016/j.cub.2019.07.006'
      },
      {
        id: 'study-vater',
        icon: Eye,
        title: 'Περιφερειακή Όραση & Περιβάλλον (Vater et al., 2022)',
        desc: 'Η περιφερειακή όραση δεν είναι απλώς βοηθητική. Σύμφωνα με τη συστηματική ανασκόπηση, αποτελεί θεμελιώδη μηχανισμό του εγκεφάλου για την παρακολούθηση του περιβάλλοντος και τον προσανατολισμό του σώματος. Το "μαλάκωμα" του βλέμματος (soft gaze) λειτουργεί ως νευρολογικό φρένο που μειώνει την αίσθηση εγκλωβισμού στο υπερδιεγερμένο νευρικό σύστημα.',
        citation: 'Vater et al. (2022). Psychonomic Bulletin & Review. Doi: 10.3758/s13423-022-02117-w'
      },
      {
        id: 'study-gibson',
        icon: Heart,
        title: 'Οικολογική Αντίληψη & Έδαφος (James J. Gibson, 1979)',
        desc: 'Η οικολογική προσέγγιση του Gibson αποδεικνύει ότι το σώμα και ο χώρος αποτελούν ένα ενιαίο σύστημα. Η αντίληψη του χώρου δεν είναι αφηρημένος υπολογισμός, αλλά βασίζεται στο «έδαφος» που στηρίζει φυσικά το σώμα, παρέχοντας άμεση σωματική ασφάλεια (affordances).',
        citation: 'James J. Gibson (1979). Psychology Press. Doi: 10.4324/9781315740218'
      }
    ],
    
    quote: '«Η ενσυνειδητότητα για το νευροδιαφορετικό μυαλό δεν είναι μια προσπάθεια επιβολής ελέγχου, αλλά η τέχνη του να προσφέρεις στο νευρικό σου σύστημα την κατάλληλη άγκυρα ασφάλειας.»',
    eeatBadge: '100% Evidence-Based • Peer-Reviewed Science'
  },
  en: {
    title: 'Evidence & Methodology',
    subtitle: 'The Neuroscience of Our Methodology',
    intro: 'Our approach is not built on generic relaxation advice, but on modern, peer-reviewed neuroscientific insights and clinical research dedicated to the neurodivergent brain (ADHD, Autism, HSP).',
    
    philosophyTitle: 'Research Philosophy & Neurodivergence',
    philosophyText: 'Traditional mindfulness techniques can often trigger anxiety or a "freeze response" in neurodivergent individuals because they demand instant, forced stillness and silent, passive observation. Our philosophy rebuilds mindfulness through somatic bottom-up regulation:',
    
    pillars: [
      {
        id: 'study-kim-jung',
        icon: ShieldCheck,
        title: 'Efficacy in Adult ADHD (Kim & Jung, 2025)',
        desc: 'In this new systematic review (2025), researchers confirm that mindfulness-based interventions (MBIs) produce statistically significant improvements in core ADHD symptoms and overall functioning in adults. This validates the use of Sanctuary as a clinically effective intervention for attention management.',
        citation: 'Kim & Jung (2025). Medicine. Doi: 10.1097/md.0000000000044308'
      },
      {
        id: 'study-calderone',
        icon: ShieldCheck,
        title: 'Neurobiology of Mindfulness (Calderone et al., 2024)',
        desc: 'This comprehensive 2024 systematic review synthesizes clinical neuroimaging findings, confirming that mindfulness induces measurable structural and functional neuroplastic changes. It details thickening in the prefrontal cortex (attention regulation), decreased amygdala volume (stress and fear response reduction), and enhanced insular connectivity (interoception), providing ultimate scientific validation for our Sanctuary and Fourfold Axis practices.',
        citation: 'Calderone et al. (2024). Biomedicines. Doi: 10.3390/biomedicines12112613'
      },
      {
        id: 'study-farb',
        icon: Brain,
        title: 'Silencing the DMN (Farb et al., 2007)',
        desc: 'In ADHD or highly masked brains, the Default Mode Network (DMN - the network behind rumination, mind-wandering, and self-criticism) is often hyperactive. Farb\'s landmark fMRI study demonstrated that shifting to direct somatic pathways (Experiential Focus) silences the DMN, offering immediate neural relief.',
        citation: 'Farb et al. (2007). Social Cognitive and Affective Neuroscience. Doi: 10.1093/scan/nsm030'
      },
      {
        id: 'study-brewer',
        icon: Brain,
        title: 'DMN Connectivity & Meditation (Brewer et al., 2011)',
        desc: 'Brewer\'s landmark neuroimaging study showed that meditation significantly alters the activation and functional connectivity of the Default Mode Network (DMN). This decreases unconscious mind-wandering and redirects active cognitive resources to gentle attention monitoring.',
        citation: 'Brewer et al. (2011). PNAS. Doi: 10.1073/pnas.1112029108'
      },
      {
        id: 'study-porges',
        icon: Waves,
        title: 'Polyvagal Theory & Somatic Safety (Porges, 1995/2011)',
        desc: 'The nervous system cannot integrate training while in threat states. By utilizing targeted somatic tools like deep, extended exhales (Ventral Vagal activation) and slow swaying, we send physical safety signals directly to the brainstem, bypassing cognitive loops.',
        citation: 'Stephen Porges, PhD (1995). Psychophysiology. Doi: 10.1111/j.1469-8986.1995.tb03320.x'
      },
      {
        id: 'study-corrigan',
        icon: Activity,
        title: 'Window of Tolerance & Self-Regulation (Corrigan et al., 2010)',
        desc: 'According to the Window of Tolerance model, the autonomic nervous system operates optimally within a specific range of arousal. Outside this, it enters hyperarousal or hypoarousal. Our somatic practices act as self-regulation tools, restoring the system to balance when it falls out of the window due to emotional trauma or sensory overload.',
        citation: 'Corrigan et al. (2010). Journal of Psychopharmacology. Doi: 10.1177/0269881109354930'
      },
      {
        id: 'study-lane',
        icon: Activity,
        title: 'Brainwave Entrainment (Oster 1973, Lane 1998)',
        desc: 'The binaural auditory beats embedded in our Sanctuary and breathing sessions promote Neural Entrainment, actively syncing target brainwaves to reduce sensory overload. They act as an "acoustic weighted blanket" that calms the sympathetic nervous system.',
        citation: 'Lane et al. (1998). Physiology & Behavior. Doi: 10.1016/S0031-9384(97)00436-8'
      },
      {
        id: 'study-lutz',
        icon: Sparkles,
        title: 'Alpha-Gamma Coherence (Lutz/Davidson, 2004)',
        desc: 'Open Awareness (our Space Axis) induces global, large-scale neural synchrony in Alpha (8-12 Hz) and Gamma (25-42 Hz) bands. This synchrony bridges isolated brain networks, offering cognitive integration and spaciousness over narrow, exhausting focus.',
        citation: 'Lutz, Davidson et al. (2004). PNAS. Doi: 10.1073/pnas.0407401101'
      },
      {
        id: 'study-zylowska',
        icon: CheckCircle,
        title: 'Clinical ADHD Feasibility (Zylowska et al., 2008)',
        desc: 'The only peer-reviewed 8-week mindfulness program designed specifically for ADHD — demonstrating key improvements in attention, cognitive inhibition, anxiety, and depressive symptoms.',
        citation: 'Zylowska, L., Ackerman, D. L., Yang, M. H., Futrell, J. L., Horton, N. L., Hale, T. S., Pataki, C., & Smalley, S. L. (2008). Mindfulness meditation training in adults and adolescents with ADHD: A feasibility study. Journal of Attention Disorders, 11(6), 737–746. https://doi.org/10.1177/1087054707308502'
      },
      {
        id: 'study-ashinoff',
        icon: Sparkles,
        title: 'Hyperfocus Frontier (Ashinoff & Abu-Akel, 2019)',
        desc: 'This seminal review details hyperfocus as a state of intense cognitive absorption and sensory gating typical of ADHD & Autistic profiles. Rather than a deficit, it represents an all-or-nothing attentional lock, modulated via our Soft Gaze somatic protocols.',
        citation: 'Ashinoff & Abu-Akel (2019). Psychological Research. Doi: 10.1007/s00426-019-01245-8'
      },
      {
        id: 'study-mackrous',
        icon: Brain,
        title: 'Cerebellar Gravity Prediction (Mackrous et al., 2019)',
        desc: 'This study demonstrates that the cerebellum dynamically computes and predicts gravity. Sanctuary and the Fourfold Axis leverage this primal neural computation, "anchoring" the brain in space and providing an immediate sense of safety to a hyper-aroused nervous system.',
        citation: 'Mackrous et al. (2019). Current Biology. Doi: 10.1016/j.cub.2019.07.006'
      },
      {
        id: 'study-vater',
        icon: Eye,
        title: 'Peripheral Vision in Real-World Tasks (Vater et al., 2022)',
        desc: 'Peripheral vision isn\'t just auxiliary. According to this systematic review, it is a fundamental brain mechanism for monitoring the environment and orienting the body. "Softening" the gaze acts as a neurological brake that reduces the feeling of being trapped in a hyper-aroused nervous system.',
        citation: 'Vater et al. (2022). Psychonomic Bulletin & Review. Doi: 10.3758/s13423-022-02117-w'
      },
      {
        id: 'study-gibson',
        icon: Heart,
        title: 'Ecological Space & Ground (James J. Gibson, 1979)',
        desc: 'Gibson\'s ecological approach proves that the body and space function as an inseparable, dynamic system. Space perception is deeply grounded in the literal physical surface supporting the body, offering direct cues of physical safety (affordances).',
        citation: 'James J. Gibson (1979). Psychology Press. Doi: 10.4324/9781315740218'
      }
    ],
    
    quote: '\"Mindfulness for the neurodivergent brain is not about forcing mental control, but about gracefully offering your nervous system the somatic anchors it needs to feel safe.\"',
    eeatBadge: '100% Evidence-Based • Peer-Reviewed Science'
  }
};

export default function Methodology() {
  const { language } = useLanguage();
  const t = T[language as keyof typeof T];

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#0f1117] font-sans pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-5 bg-white/[0.04] border-b border-white/[0.05] sticky top-0 z-10 backdrop-blur-md">
        <button 
          onClick={() => {
            if (window.history.length > 2) navigate(-1);
            else navigate('/settings');
          }}
          className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center text-[#d4d4d8] hover:bg-white/[0.08] hover:text-white transition-colors active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-teal-400 uppercase tracking-widest drop-shadow-sm truncate px-4">
          {t.title}
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
        
        {/* Title Block */}
        <div className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <ShieldCheck size={14} />
            <span>{t.eeatBadge}</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white/95 leading-snug">
            {t.subtitle}
          </h2>
          <p className="text-[#d4d4d8]/70 text-sm leading-relaxed max-w-xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Philosophy */}
        <section className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-3 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
          <h3 className="text-md font-bold text-white tracking-wide">
            {t.philosophyTitle}
          </h3>
          <p className="text-sm text-[#d4d4d8]/85 leading-relaxed text-justify">
            {t.philosophyText}
          </p>
        </section>

        {/* Core Pillars List */}
        <section className="space-y-4">
          {t.pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={index}
                id={pillar.id}
                className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.05] transition-all space-y-3 scroll-mt-24"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-[15px] font-bold text-white leading-tight">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-xs text-[#d4d4d8]/80 leading-relaxed text-left">
                  {pillar.desc}
                </p>
                <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-teal-300/80 tracking-wide">
                  📚 DOI/Ref: {pillar.citation}
                </div>
              </div>
            );
          })}
        </section>

        {/* Quote Block */}
        <section className="text-center py-6 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]">
          <p className="text-sm font-serif italic text-teal-200/90 max-w-lg mx-auto leading-relaxed">
            {t.quote}
          </p>
          <div className="mt-8 flex justify-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>© Awareness Gateway Science Board</span>
            <span>•</span>
            <span>Est. 2026</span>
          </div>
        </section>

      </div>
    </div>
  );
}
