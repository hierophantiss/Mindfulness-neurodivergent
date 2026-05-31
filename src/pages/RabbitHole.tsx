import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ChevronLeft, ChevronRight, X, Play, Youtube, Film, Check, SkipForward, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { informativeVideos } from '../data/informativeVideos';
import { dzogchenArticle } from '../data/dzogchenArticle';
import { neverForceArticle } from '../data/neverForceArticle';

export default function RabbitHole() {
  const { articleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const [activeArticle, setActiveArticleState] = useState<string | null>(null);
  
  // Video player states
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const [mantraStep, setMantraStep] = useState<number>(0);
  const [activeAttentionStyles, setActiveAttentionStyles] = useState<string[]>([]);
  const [isVoidActive, setIsVoidActive] = useState(false);
  
  const setActiveArticle = (id: string | null) => {
    setActiveArticleState(id);
    setCurrentPage(0);
    if (id) {
      if (articleId !== id) {
        navigate(`/rabbithole/${id}`, { replace: true });
      }
    } else {
      navigate(`/rabbithole`, { replace: true });
    }
  };
  
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // If it's a sub-route (e.g. /rabbithole/the-goose-is-out)
    if (articleId) {
      if (activeArticle !== articleId) {
        setActiveArticleState(articleId);
        setCurrentPage(0);
      }
    } else {
      // Backwards compatibility for ?article= queries
      const articleFromUrl = searchParams.get('article');
      if (articleFromUrl) {
        setActiveArticleState(articleFromUrl);
        setCurrentPage(0);
        navigate(`/rabbithole/${articleFromUrl}`, { replace: true });
      } else if (location.state && (location.state as any).activeArticle) {
        const stateArticle = (location.state as any).activeArticle;
        setActiveArticleState(stateArticle);
        setCurrentPage(0);
        navigate(`/rabbithole/${stateArticle}`, { replace: true, state: {} });
      } else {
        setActiveArticleState(null);
      }
    }
  }, [articleId, location.state, navigate, searchParams]);
  
  const touchStartX = useRef(0);

  const t = {
    title: language === 'en' ? 'The Rabbit Hole' : 'Κουνελότρυπα',
    subtitle: language === 'en' ? 'Allegories of the World' : 'Αλληγορίες του Κόσμου',
    back: language === 'en' ? 'Back' : 'Πίσω',
    startReading: language === 'en' ? 'Start Reading' : 'Έναρξη Ανάγνωσης',
    close: language === 'en' ? 'Close' : 'Κλείσιμο',
  };

  const articles = [
    {
      id: neverForceArticle.id,
      title: language === 'en' ? neverForceArticle.title.en : neverForceArticle.title.el,
      author: language === 'en' ? neverForceArticle.author.en : neverForceArticle.author.el,
      pages: language === 'en' ? neverForceArticle.pagesEn : neverForceArticle.pagesEl
    },
    {
      id: dzogchenArticle.id,
      title: language === 'en' ? dzogchenArticle.title.en : dzogchenArticle.title.el,
      author: language === 'en' ? dzogchenArticle.author.en : dzogchenArticle.author.el,
      pages: language === 'en' ? dzogchenArticle.pagesEn : dzogchenArticle.pagesEl
    },
    {
      id: 'koshas-veils',
      title: language === 'en' ? 'The Veils of Being' : 'Τα Πέπλα της Ύπαρξης',
      author: language === 'en' ? 'Yoga & 4-fold Axis' : 'Φιλοσοφία του 4πλού Άξονα',
      pages: language === 'en' ? [
        "The Matryoshka Allegory: A path from the material body to the air of pure consciousness.",
        "Just as a Matryoshka hides a smaller one inside, our existence consists of veils, one embracing the other. Every time we 'brush aside' a veil, we come closer to our core, which is absolute freedom.",
        "1. The Outer Matryoshka (Annamaya Kosha): The Veil of the Body. The largest, 'heaviest' doll. It is our physical body, the matter we touch. Axis: BODY. Grounding, Gravity, Senses.",
        "2. The Veil of Breath (Pranamaya Kosha): The second doll is made of energy. It is the breath that gives life to matter. Axis: BREATH. The bridge connecting the outside with the inside.",
        "3. The Veil of Mind (Manomaya): The veil of thoughts and emotions. The noise that covers stillness. Axis: ATTENTION. Our own axis that allows us to observe this veil without getting entangled in it. Clarity: By setting thoughts aside, attention finds the next, subtler level.",
        "4. The Veil of Wisdom (Vijnanamaya): Internal Discernment. This doll no longer contains reactions, but pure knowledge. It is the ability to see truth beyond the 'I'. It is where Attention becomes Awareness.",
        "5. The Veil of Bliss (Anandamaya): The last and subtlest veil. It is the sense of deep peace. It is not an emotion; it is our nature when everything else has quieted down.",
        "The Smallest Matryoshka: The Gateway of Space (THE AIR). When you open the last, smallest doll, you find nothing solid. You find air. Axis: SPACE. It is pure consciousness. It has no shape, no limits, yet it contains all other dolls within it.",
        "Mapping Summary:\nBODY -> Annamaya -> Outer Form\nBREATH -> Pranamaya -> Vital Flow\nATTENTION -> Manomaya/Vijnanamaya -> The Observer\nSPACE -> Anandamaya/Atman -> The Air of Freedom",
        "You are not the Matryoshka you see from the outside. You are the air that exists inside the smallest one, where every form ends."
      ] : [
        "Η αλληγορία της Μπάμπουσκα: Μια διαδρομή από το υλικό σώμα στον αέρα της καθαρής συνείδησης.",
        "Όπως μια Μπάμπουσκα κρύβει μέσα της μια μικρότερη, έτσι και η ύπαρξή μας αποτελείται από πέπλα που το ένα αγκαλιάζει το άλλο. Κάθε φορά που 'παραμερίζουμε' ένα πέπλο, ερχόμαστε πιο κοντά στον πυρήνα μας, ο οποίος είναι η απόλυτη ελευθερία.",
        "1. Η Εξωτερική Μπάμπουσκα (Annamaya Kosha): Το Πέπλο του Σώματος. Είναι η πιο μεγάλη, η πιο 'βαριά' μπάμπουσκα. Είναι το φυσικό μας σώμα, η ύλη που αγγίζουμε. Άξονας: ΣΩΜΑ. Γείωση, Βαρύτητα, Αισθήσεις.",
        "2. Το Πέπλο της Πνοής (Pranamaya Kosha): Η δεύτερη μπάμπουσκα είναι φτιαγμένη από ενέργεια. Είναι η πνοή που δίνει ζωή στην ύλη. Άξονας: ΑΝΑΠΝΟΗ. Η γέφυρα που συνδέει το έξω με το μέσα.",
        "3. Το Πέπλο του Νου (Manomaya): Το πέπλο των σκέψεων και των συναισθημάτων. Ο θόρυβος που καλύπτει την ηρεμία. Άξονας: ΠΡΟΣΟΧΗ. Ο δικός μας άξονας που μας επιτρέπει να παρατηρούμε αυτό το πέπλο χωρίς να μπερδευόμαστε.",
        "4. Το Πέπλο της Σοφίας (Vijnanamaya): Η Εσωτερική Διάκριση. Αυτή η μπάμπουσκα δεν περιέχει πλέον αντιδράσεις, αλλά καθαρή γνώση. Είναι η ικανότητα να βλέπεις την αλήθεια πέρα από το 'εγώ'. Είναι το σημείο όπου η Προσοχή γίνεται Επίγνωση.",
        "5. Το Πέπλο της Μακαριότητας (Anandamaya): Το τελευταίο και πιο λεπτό πέπλο. Είναι η αίσθηση της βαθιάς ειρήνης. Δεν είναι συναίσθημα, είναι η φύση μας όταν όλα τα άλλα έχουν ησυχάσει.",
        "Η Μικρότερη Μπάμπουσκα: Η Πύλη του Χώρου (O ΑΕΡΑΣ). Όταν ανοίγεις και την τελευταία, την πιο μικρή μπάμπουσκα, δεν βρίσκεις κάτι άλλο στερεό. Βρίσκεις αέρα. Άξονας: ΧΩΡΟΣ. Είναι η καθαρή συνείδηση. Δεν έχει σχήμα, δεν έχει όρια, αλλά μέσα της περιέχονται όλες οι άλλες μπάμπουσκες.",
        "Χάρτης Αντιστοίχισης:\nΣΩΜΑ -> Annamaya -> Η Εξωτερική Μορφή\nΑΝΑΠΝΟΗ -> Pranamaya -> Η Ζωτική Ροή\nΠΡΟΣΟΧΗ -> Manomaya/Vijnanamaya -> Ο Παρατηρητής\nΧΩΡΟΣ -> Anandamaya/Atman -> Ο Αέρας της Ελευθερίας",
        "Δεν είσαι η μπάμπουσκα που βλέπεις απέξω. Είσαι ο αέρας που υπάρχει μέσα στην πιο μικρή, εκεί που τελειώνει κάθε μορφή."
      ]
    },
    {
      id: 'dzogchen-nature-of-mind',
      title: language === 'en' ? 'The Nature of Mind & Tregchod' : 'Η Φύση του Νου & Η Λύση της Έντασης',
      author: language === 'en' ? 'Dzogchen & Neuroscience' : 'Τζοκτσέν & Νευροεπιστήμη',
      pages: language === 'en' ? [
        "According to Tibetan Buddhism and the Dzogchen tradition, the mind has two aspects. The first is the ordinary, dualistic, and discriminating mind, called 'Sem'.",
        "'Sem' operates in time (past and future), clinging, comparing, and continuously creating inner scenarios. Neurophysiologically, this closely relates to the brain's Default Mode Network (DMN), often accompanied by high Beta waves: a state of chronic tension and subtle alarm.",
        "The other aspect is the Nature of Mind (Rigpa). This is our indestructible, unchanging essence. It is the state of pure, open awareness—observation without an observer.",
        "Like a pure crystal taking on the color of whatever it touches without changing itself, or a mirror reflecting everything purely without grasping, the Nature of Mind reflects experience without being altered by it.",
        "In neuroscience, this profound state corresponds to the synchronization of the two brain hemispheres through Alpha and Gamma waves. The nervous system shifts from fragmented survival mode into harmonious integration.",
        "But how do we transition from the tension of 'Sem' to the vastness of the Nature of Mind? In Dzogchen, the answer is not forceful control or striving, but 'Tregchod', which translates to: the absolute cutting through, or release, of tension.",
        "The 4-Stage Method of our practice is effectively an application of Tregchod: releasing tension layer by layer.",
        "Stage 1 (Body): We abandon the mental scenarios of 'Sem'. Through the sensation of gravity, we drop immediately into the physical present.\nStage 2 (Breath): We focus on the internal touch, dissolving respiratory tension.\nStage 3 (Attention): We notice mental tension and let it unravel.\nStage 4 (Space): With tensions resolved, pristine open awareness organically emerges.",
        "And here lies a profound truth about self-compassion. At first, trying forcefully to 'be kind to yourself' might feel entirely fake or impossible.",
        "However, compassion is not a feeling we must actively manufacture and give to ourselves. When we remove the pressure, the internal rejection, and the subtle violence of constant striving, our nature organically emanates kindness.",
        "The self is the very source of compassion. We do not need to acquire it from the outside; we only need to let the tension settle and allow our true nature to shine."
      ] : [
        "Σύμφωνα με τον Θιβετιανό Βουδισμό και την παράδοση του Τζοκτσέν (Dzogchen), ο νους έχει δύο όψεις. Η πρώτη είναι ο συνηθισμένος, δυαδικός και διακριτικός νους, τον οποίο αποκαλούν «Σεμ» (Sem).",
        "Ο «Σεμ» λειτουργεί μέσα στο χρόνο, συγκρίνει, κρίνει και προσκολλάται συνεχώς σε νοητικά σενάρια. Νευροφυσιολογικά, λειτουργεί μέσα από το Δίκτυο Προεπιλεγμένης Λειτουργίας (DMN) του εγκεφάλου, εκπέμποντας συχνά υψηλά κύματα Βήτα: μια κατάσταση μόνιμου συναγερμού και χρόνιας έντασης.",
        "Η άλλη όψη είναι η Φύση του Νου (Ρίγκπα). Είναι η άφθαρτη, αμετάβλητη ουσία μας. Η κατάσταση της καθαρής, ολικής ανοιχτής επίγνωσης, όπου υπάρχει παρατήρηση-αντίληψη χωρίς παρατηρητή.",
        "Όπως μια κρυστάλλινη σφαίρα παίρνει το χρώμα του υλικού πάνω στο οποίο τοποθετείται χωρίς η ίδια να αλλάζει, ή όπως ο καθρέφτης αντανακλά τα πάντα δίχως να ταυτίζεται, η Φύση του Νου αντανακλά την εμπειρία δίχως να αλλοιώνεται από αυτήν.",
        "Στη σύγχρονη νευροεπιστήμη, αυτή η κατάσταση συσχετίζεται με τον συγχρονισμό των δύο ημισφαιρίων μέσω κυμάτων Άλφα και Γάμμα. Το νευρικό σύστημα περνά από τον κατακερματισμό της επιβίωσης σε βαθιά ενοποίηση.",
        "Όμως, πώς περνάμε από τον «Σεμ» στη Φύση του Νου; Στο Dzogchen, η απάντηση δεν είναι η πίεση, ο έλεγχος ή η πνευματική φιλοδοξία, αλλά το «Tregchod» (Τρέγκτσοντ) που σημαίνει: Η απόλυτη λύση της έντασης. Η αβίαστη, φυσική χαλάρωση.",
        "Η προσέγγιση των 4 Σταδίων που ακολουθούμε αποτελεί μια άμεση, πρακτική εφαρμογή του Tregchod.",
        "Στάδιο 1 (Σώμα): Βγαίνουμε από τα σενάρια του «Σεμ» και μέσω της πίεσης της βαρύτητας επιστρέφουμε στο τώρα.\nΣτάδιο 2 (Αναπνοή): Η εσωτερική αφή της πνοής λύνει τη σωματική ένταση.\nΣτάδιο 3 (Προσοχή): Παρατηρούμε τη νοητική ένταση και της επιτρέπουμε να διαλυθεί.\nΣτάδιο 4 (Χώρος): Με τις εντάσεις λυμένες, η ανοιχτή επίγνωση αναδύεται από μόνη της.",
        "Και εδώ κρύβεται ένα μεγάλο μυστικό για την αυτό-συμπόνια: Στην αρχή, το να προσπαθείς εσκεμμένα να νιώσεις καλοσύνη για τον εαυτό σου μοιάζει συχνά ανέφικτο ή \"ψεύτικο\".",
        "Η καλοσύνη δεν είναι κάτι 'εξωτερικό' που πρέπει με το ζόρι να δώσουμε στον εαυτό μας. Όταν μέσω της λύσης της έντασης (Tregchod) αφαιρέσουμε την πίεση, την εσωτερική απόρριψη και τη βία της συνεχούς προσπάθειας, ο ίδιος μας ο εαυτός αναδύει απόλυτη καλοσύνη.",
        "Η Φύση του Νου είναι η ίδια η πηγή της συμπόνιας. Δεν χρειάζεται να την αποκτήσουμε, αρκεί μόνο να αφήσουμε την ένταση να καταλαγιάσει ώστε να επιτρέψουμε στη φύση μας να λάμψει."
      ]
    },
    {
      id: 'buddha-autism',
      title: language === 'en' ? 'Was Buddha on the Spectrum?' : 'Ήταν ο Βούδας στο φάσμα;',
      author: 'Louise Woodford',
      pages: language === 'en' ? [
        "Do you find it shocking to imply that the Buddha might have been autistic? Autism is nothing more than a different cognitive and behavioral functioning, often misunderstood because it doesn't meet majority expectations.",
        "An autistic person is not disordered or lacking in spiritual evolution. I've often wondered: if Buddha Shakyamuni lived today in the West, what 'diagnosis' would he receive?",
        "He wasn't a follower of crowds; he often moved against social expectations. He avoided intimacy, found peace in solitude, felt a connection with animals, reflected deeply, and held high moral values.",
        "He was a solitary child, preferring to sit by a tree rather than play with peers. As an adult, he wandered from community to community, unattached socially, absolutely dedicated to awakening.",
        "He experienced the world with unusually deep internal sensitivity. Does this sound familiar?",
        "Friendships and connections are created through emotional bridges. Having emotions that are 'all or nothing' makes creating these emotional bridges difficult. If you were to design a condition that deprives you of this connection, it would be autism.",
        "A large part of our suffering as autistic individuals is caused by the comparing mind and attachment. The Dharma teaches us that the comparing mind is one of the ego's tools to construct identity.",
        "Through meditation, I learn to observe my thoughts, so when these comparison thoughts arise, I can simply watch them come and go without fighting them.",
        "Body mindfulness was another great help. Now I recognize that emotions manifest physically in my body, and I can observe those sensations without running away from them.",
        "Why would I want to be 'ordinary'? If I take four pieces of wood and place a flat board on top, that structure is called a 'table' — a construct of the mind. Just like the table, the 'autistic person' is a concept.",
        "Environmental activist Greta Thunberg said autism is a superpower. If there is a type of person who can give the spiritual path the unwavering focus it demands, that might just be an autistic person!",
        "I have decided to show up in life as I imagine the Buddha would: with vulnerable honesty, openly, without masks. If some people find me strange or boring, that is fine.",
        "For now, I will accept the label 'autistic' — just as I accept the word 'table'. But autism is not what I am in my essence. And, with all due respect, I do not believe it is a disorder.",
        "If you look for me, you will find me mentally in the forest, with the trees and the animals, reflecting deeply. Because, ultimately, there is nothing — absolutely nothing — that I am missing."
      ] : [
        "Πιστεύετε ότι ο Βούδας ήταν τέλειος, χωρίς καμία «διαταραχή», και σας φαίνεται παράλογο ή σοκαριστικό να υπονοηθεί ότι μπορεί να ήταν αυτιστικός; Αν ναι, τότε ίσως η αντίληψή σας για το τι σημαίνει «αυτισμός» να είναι ελαφρώς παραπλανητική.",
        "Ο αυτισμός δεν είναι τίποτα περισσότερο από μια διαφορετική γνωστική και συμπεριφορική λειτουργία. Ένα άτομο στο αυτιστικό φάσμα δεν είναι διαταραγμένο ούτε μειονεκτεί σε ό,τι αφορά την πνευματική εξέλιξη.",
        "Πολλές φορές έχω αναρωτηθεί: αν ο Βούδας Σακιαμούνι ζούσε σήμερα στη Δύση, ποια \"διάγνωση\" θα του αποδιδόταν; Δεν ήταν άνθρωπος που ακολουθούσε τα πλήθη – το αντίθετο μάλιστα: κινούταν κόντρα στις κοινωνικές προσδοκίες.",
        "Απέφευγε την οικειότητα, έβρισκε γαλήνη στη μοναξιά, ένιωθε συνάφεια με τα ζώα, στοχαζόταν βαθιά, είχε υψηλές ηθικές αξίες. Ήταν μοναχικό παιδί, που προτιμούσε να κάθεται δίπλα σε ένα δέντρο παρά να παίζει με τους συνομηλίκους του.",
        "Ως ενήλικας, περιπλανιόταν από κοινότητα σε κοινότητα, δεν δεσμευόταν κοινωνικά, ήταν απόλυτα αφοσιωμένος στην αφύπνιση. Βίωνε τον κόσμο με μια ασυνήθιστα βαθιά και ευαίσθητη εσωτερικότητα.\n\nΣας φαίνεται οικείο όλο αυτό;",
        "Οι φιλίες και οι συνδέσεις δημιουργούνται μέσω συναισθηματικών γεφυρών. Το να έχουμε συναισθήματα που είναι «όλα ή τίποτα» δυσκολεύει τη δημιουργία αυτών των γεφυρών. Έτσι, αν σχεδιάζατε μια συνθήκη που σας στερεί την ευκολία σύνδεσης, αυτή θα ήταν ο αυτισμός.",
        "Ένα μεγάλο μέρος των δεινών μας ως αυτιστικών ατόμων προκαλείται από τη σύγκριση του νου και την προσκόλληση. Το ντάρμα μας διδάσκει ότι η σύγκριση του νου είναι ένα από τα εργαλεία του εγώ για να κατασκευάσει ταυτότητα.",
        "Μέσω του διαλογισμού, μαθαίνω να παρατηρώ τις σκέψεις μου, έτσι ώστε όταν προκύπτουν αυτές οι σκέψεις σύγκρισης, να μπορώ απλώς να τις παρακολουθώ να έρχονται και να φεύγουν.",
        "Η ενσυνειδητότητα του σώματος ήταν μια άλλη μεγάλη βοήθεια. Τώρα αναγνωρίζω ότι τα συναισθήματα εκδηλώνονται φυσικά στο σώμα μου και μπορώ να σταματήσω να τρέχω μακριά από τις αισθήσεις που δεν μου αρέσουν.",
        "Γιατί να θέλω να γίνω “συνηθισμένος”; Αν πάρω τέσσερα κομμάτια ξύλου και ένα επίπεδο ξύλο, τότε αυτή η δομή ονομάζεται «τραπέζι» — μια κατασκευή του νου. Όπως και το τραπέζι, έτσι και το «αυτιστικό άτομο» είναι μια έννοια.",
        "Η περιβαλλοντική ακτιβίστρια Γκρέτα Τούνμπεργκ είπε πως ο αυτισμός είναι υπερδύναμη. Αν υπάρχει ένας τύπος ανθρώπου που μπορεί να δώσει στο πνευματικό μονοπάτι την ακλόνητη εστίαση που απαιτεί, τότε αυτός μπορεί να είναι ένα αυτιστικό άτομο!",
        "Έχω αποφασίσει να εμφανίζομαι στη ζωή όπως φαντάζομαι ότι θα έκανε ο Βούδας: με ευάλωτη ειλικρίνεια, ανοιχτά, χωρίς μάσκες. Αν κάποιοι με βρίσκουν παράξενο ή βαρετό, δεν πειράζει.",
        "Προς το παρόν, θα αποδεχτώ την ταμπέλα “αυτιστικός” — όπως αποδέχομαι τη λέξη “τραπέζι”. Όμως ο αυτισμός δεν είναι αυτό που είμαι στην ουσία μου. Και, με κάθε σεβασμό, δεν πιστεύω πως είναι διαταραχή.",
        "Αν με αναζητήσετε, θα με βρείτε νοερά στο δάσος, μαζί με τα δέντρα και τα ζώα, να στοχάζομαι βαθιά. Γιατί, τελικά, δεν υπάρχει τίποτα — απολύτως τίποτα — που να μου λείπει."
      ]
    },
    {
      id: 'what-is-sandbox',
      title: language === 'en' ? 'What does Sandbox mean?' : 'Τι σημαίνει Sandbox;',
      author: language === 'en' ? 'Core Concept' : 'Βασική Έννοια',
      pages: language === 'en' ? [
        "A sandbox is an isolated and safe programming environment (mindfulness/approved space).",
        "Here, you let a process, a thought or a representation of a part of yourself (IFS part) \"execute\" and you monitor what possible warnings or errors the system throws (body, emotions).",
        "However, you don't just find problems in the \"code\" here. In this space, you can also observe the optimal performance of these parts, finding their ideal way of running, or even discovering their very core function.",
        "All of this happens without risking the main branch — your own life and your tangible relationships."
      ] : [
        "Ένα απομονωμένο και ασφαλές προγραμματιστικό περιβάλλον (mindfulness/εγκεκριμένος χώρος).",
        "Εδώ, αφήνεις μία διεργασία, μία σκέψη ή αναπαράσταση ενός τμήματος του εαυτού σου (IFS part) να \"εκτελεστεί\" και παρακολουθείς τι πιθανά warnings ή errors ρίχνει το σύστημα (σώμα, συναισθήματα).",
        "Όμως στο Sandbox δεν εντοπίζεις μόνο προβλήματα στον \"κώδικα\". Εδώ παρακολουθείς και την καλύτερη δυνατή λειτουργία αυτών των μερών, βρίσκοντας τον ιδανικό τρόπο να «τρέχουν» ή ακόμα και ανακαλύπτοντας την ίδια τη βασική τους λειτουργία (core function).",
        "Όλα αυτά χωρίς να κινδυνεύει το main branch — η ίδια σου η ζωή και οι απτές σου σχέσεις."
      ]
    },
    {
      id: 'mahamudra-one-taste',
      title: language === 'en' ? 'Mahamudra: The One Taste' : 'Μαχαμουντρα: Η Μία Γεύση',
      author: language === 'en' ? 'Vajrayana Wisdom' : 'Σοφία Vajrayana',
      pages: language === 'en' ? [
        "In the practice of Mahamudra, there is a stage called 'One Taste' (ekarsa). It is the realization that all experiences, whether 'good' or 'bad', share the same fundamental essence.",
        "Just as water, ice, and steam are all H2O, all perceptions, thoughts, and sensations are nothing but the display of the luminous nature of mind.",
        "For a neurodivergent mind, this is a revolutionary bridge to sensory integration. Instead of being overwhelmed by fragmented stimuli, we learn to recognize their singular 'taste' — the presence of awareness itself.",
        "When we stop fighting the 'noise' and start recognizing the 'essence', the nervous system begins to self-regulate. Sensory processing is no longer a battle, but a dance of the same energy."
      ] : [
        "Στην πρακτική της Μαχαμουντρα, υπάρχει ένα στάδιο που ονομάζεται «Μία Γεύση» (ekarsa). Είναι η συνειδητοποίηση ότι όλες οι εμπειρίες, είτε «καλές» είτε «κακές», μοιράζονται την ίδια θεμελιώδη ουσία.",
        "Όπως το νερό, ο πάγος και ο ατμός είναι όλα H2O, έτσι και όλες οι αντιλήψεις, οι σκέψεις και οι αισθήσεις δεν είναι τίποτα άλλο από την προβολή της φωτεινής φύσης του νου.",
        "Για έναν νευροδιαφορετικό νου, αυτό αποτελεί μια επαναστατική γέφυρα προς την αισθητηριακή ολοκλήρωση. Αντί να κατακλυζόμαστε από κατακερματισμένα ερεθίσματα, μαθαίνουμε να αναγνωρίζουμε τη μοναδική τους «γεύση» — την ίδια την παρουσία της επίγνωσης.",
        "Όταν σταματάμε να πολεμάμε τον «θόρυβο» και αρχίζουμε να αναγνωρίζουμε την «ουσία», το νευρικό σύστημα αρχίζει να αυτορρυθμίζεται. Η αισθητηριακή επεξεργασία παύει να είναι μια μάχη και γίνεται ένας χορός της ίδιας ενέργειας."
      ]
    },
    {
      id: 'binaural-gateway',
      title: language === 'en' ? 'Binaural Beats & The Gateway' : 'Binaural Beats & Το Gateway',
      author: language === 'en' ? 'Modern Neuroscience' : 'Σύγχρονη Νευροεπιστήμη',
      pages: language === 'en' ? [
        "The use of Binaural Beats was extensively studied by the Monroe Institute and even documented in the CIA's 'Gateway Experience' report as a tool for altering consciousness.",
        "Binaural beats work through 'frequency following response'. By playing two slightly different frequencies in each ear, the brain creates a third internal tone: the binaural beat.",
        "Modern research confirms that specific frequencies can regulate brain states. Alpha frequencies (8-13 Hz) are particularly powerful as they promote 'Hemispheric Synchronization'.",
        "When both hemispheres of the brain resonate at the same frequency, internal fragmentation decreases. For ADHD and Autism, this synchronization creates a 'coherent' state that facilitates deep focus and emotional stability."
      ] : [
        "Η χρήση των Binaural Beats μελετήθηκε εκτενώς από το Monroe Institute και μάλιστα τεκμηριώθηκε στην αναφορά 'Gateway Experience' της CIA ως εργαλείο για την αλλαγή της συνειδητότητας.",
        "Οι binaural beats λειτουργούν μέσω της «απόκρισης παρακολούθησης συχνότητας». Παίζοντας δύο ελαφρώς διαφορετικές συχνότητες σε κάθε αυτί, ο εγκέφαλος δημιουργεί έναν τρίτο εσωτερικό τόνο: τον binaural beat.",
        "Η σύγχρονη έρευνα επιβεβαιώνει ότι συγκεκριμένες συχνότητες μπορούν να ρυθμίσουν τις εγκεφαλικές καταστάσεις. Οι συχνότητες Άλφα (8-13 Hz) είναι ιδιαίτερα ισχυρές καθώς προάγουν τον «Συγχρονισμό των Ημισφαιρίων».",
        "Όταν και τα δύο ημισφαίρια του εγκεφάλου συντονίζονται στην ίδια συχνότητα, ο εσωτερικός κατακερματισμός μειώνεται. Για τη ΔΕΠΥ και τον Αυτισμό, αυτός ο συγχρονισμός δημιουργεί μια «συνεκτική» κατάσταση που διευκολύνει τη βαθιά εστίαση και τη συναισθηματική σταθερότητα."
      ]
    },
    {
      id: 'open-focus-brain',
      title: language === 'en' ? 'The Open Focus Brain' : 'Το Open Focus Brain',
      author: 'Les Fehmi, PhD',
      pages: language === 'en' ? [
        "The Open Focus technique, developed by Dr. Les Fehmi, reveals that peak performance and brain synchronization are achieved not through willpower, but through 'effortless awareness'.",
        "The secret lies in shifting from 'Narrow Focus' (the chronic tension of modern life) to 'Open Focus'. This is achieved by perceiving the 'Space' between objects, thoughts, and sounds.",
        "By emphasizing the absence of objects — the silence between words, the distance between atoms — the nervous system naturally shifts into synchronous Alpha waves.",
        "This 'synchronous Alpha' state unifies both hemispheres of the brain. It is the physiological foundation for the 'One Taste' of Mahamudra: a state where inner and outer space become one."
      ] : [
        "Η τεχνική Open Focus, που αναπτύχθηκε από τον Δρ. Les Fehmi, αποκαλύπτει ότι η μέγιστη απόδοση και ο συγχρονισμός του εγκεφάλου επιτυγχάνονται όχι μέσω της θέλησης, αλλά μέσω της «άκοπης επίγνωσης».",
        "Το μυστικό βρίσκεται στη μετάβαση από τη «Στενή Εστίαση» (τη χρόνια ένταση της σύγχρονης ζωής) στην «Ανοιχτή Εστίαση». Αυτό επιτυγχάνεται με την αντίληψη του «Χώρου» ανάμεσα στα αντικείμενα, τις σκέψεις και τους ήχους.",
        "Δίνοντας έμφαση στην απουσία αντικειμένων —τη σιωπή ανάμεσα στις λέξεις, την απόσταση ανάμεσα στα άτομα— το νευρικό σύστημα μεταβαίνει φυσικά σε συγχρονισμένα κύματα Άλφα.",
        "Αυτή η κατάσταση «συγχρονισμένου Άλφα» ενοποιεί και τα δύο ημισφαίρια του εγκεφάλου. Είναι το φυσιολογικό θεμέλιο για τη «Μία Γεύση» της Μαχαμούντρα: μια κατάσταση όπου ο εσωτερικός και ο εξωτερικός χώρος γίνονται ένα."
      ]
    },
    {
      id: 'riding-the-wind',
      title: language === 'en' ? 'Learning to Ride the Wind' : 'Μαθαίνοντας να ιππεύεις τον άνεμο',
      author: language === 'en' ? 'Tsa Lung & Practice' : 'Tsa Lung & Παράδοση',
      pages: language === 'en' ? [
        "In the Tibetan tradition, the practice of *tsa lung* (channels and winds) teaches us that the energy of the mind, the 'wind', moves through the physical and energetic pathways of the body.",
        "This principle pervades all great traditions. Yoga was perhaps the first to systematize the union of body and breath, describing our existence as a 'Matryoshka': veils embracing one another.",
        "We find the same unification in Kung Fu (as taught by Bodhidharma to ground the scattered mind), in the arts of Qi Gong and Tai Chi, and in the sacred spinning of the Sufis.",
        "All these methods share a common goal: **regulating the nervous system so that open awareness can emerge effortlessly.**",
        "For a neurodivergent person, energy often moves violently between distraction and fixation. The goal is to learn to ride this wind, cultivating a calmness that cooperates with our brain instead of fighting it.",
        "Tregchod is not a technique. It is not something you do.",
        "It is what happens when you stop resisting.",
        "For the neurodivergent mind — which has been trained for years to control, predict, overcompensate, and mask — the idea of 'effortless relaxation' might sound like a luxury. Like something for others. For those who never had to fight with their own mind.",
        "But Tregchod does not ask you to stop paying attention. It asks you to let the tension of effort drop — like a hand that was holding tightly onto something and now, simply, relaxes. The object doesn't leave. You don't disappear. Awareness remains. Only the violence of holding dissolves.",
        "The 4-Stage practice is Tregchod in motion.",
        "We start with the Body — not because the body is 'inferior', but because it is the only place that cannot lie. Gravity is undeniable. There, the tension of 'Sem' has nowhere to hide.",
        "From there, the Breath. Not to control it — but to feel it as an internal touch. Every exhale is a small release of tension. A small Tregchod.",
        "Then Attention — which observes mental tension without judging it. It does not fight it. It lets it unravel on its own, like a knot that loosens when you stop tightening it.",
        "And then, effortlessly, Space emerges. Open awareness is not achieved — it is revealed. It was always there, beneath the layer of tension.",
        "**Rhythm & Brain Waves / The Veils of the Mind (Manomaya Kosha)**\nIn moments of hyperarousal, the mind emits chaotic Beta waves. To quiet this noise, we need rhythm. The Sufis, through rhythmic movements and the recitation of sacred sounds (*dhikr*), tune their nervous system to the frequency of love, bringing the center to the heart.",
        "Neurologically, this unification causes the **synchronization of the two hemispheres**. Chaotic waves give way to **Alpha and Theta waves**. Presence becomes total and effortless.",
        "**Open Space, Mahamudra, and 'One Taste' (Anandamaya Kosha)**\nWhen energy flows freely, we brush aside the final veil. There we find Space. In the Mahamudra tradition, this state is called **'One Taste'**. There is no longer a separation between the observer and the observed, between 'inside' and 'outside'. Everything – thoughts, sounds, emotions – has the same 'taste' of pure awareness.",
        "At this point, neuroscientists observe an explosion of **Gamma waves**, which are associated with absolute clarity and the experience of Oneness.",
        "You are not the Matryoshka you see from the outside. **You are the air in the smallest Matryoshka (in the heart), which is inseparably united with the infinite space.** In this open awareness, the mind may continue to think, but it stops carrying you away. You have learned to ride the wind."
      ] : [
        "Στην παράδοση του Θιβέτ, η πρακτική του *tsa lung* (κανάλια και άνεμοι) μας διδάσκει ότι η ενέργεια του νου, δηλαδή ο «άνεμος», κινείται μέσα από τα φυσικά και ενεργειακά μονοπάτια του σώματος.",
        "Αυτή η αρχή διαπερνά όλες τις μεγάλες παραδόσεις. Η Γιόγκα ήταν ίσως η πρώτη που συστηματοποίησε την ένωση σώματος και αναπνοής, περιγράφοντας την ύπαρξή μας σαν μια «Μπάμπουσκα»: πέπλα που το ένα αγκαλιάζει το άλλο.",
        "Την ίδια ενοποίηση συναντάμε στο Κουνγκ Φου (όπως το δίδαξε ο Μποντιντάρμα για να γειώσει τον διασκορπισμένο νου), στις τέχνες του Τσι Κονγκ και του Τάι Τσι, αλλά και στις ιερές περιστροφές των Σούφι.",
        "Όλες αυτές οι μέθοδοι μοιράζονται έναν κοινό στόχο: **τη ρύθμιση του νευρικού συστήματος, ώστε η ανοιχτή επίγνωση να αναδυθεί αβίαστα.**",
        "Για έναν νευροαποκλίνοντα άνθρωπο, η ενέργεια συχνά κινείται βίαια ανάμεσα στη διάσπαση και την καθήλωση. Το ζητούμενο είναι να μάθουμε να ιππεύουμε αυτόν τον άνεμο, καλλιεργώντας μια ηρεμία που συνεργάζεται με τον εγκέφαλό μας αντί να τον πολεμά.",
        "Το Tregchod δεν είναι τεχνική. Δεν είναι κάτι που κάνεις.",
        "Είναι αυτό που συμβαίνει όταν σταματάς να αντιστέκεσαι.",
        "Για τον νευροδιαφορετικό νου — που έχει εκπαιδευτεί χρόνια να ελέγχει, να προβλέπει, να αντισταθμίζει, να κρύβει — η ιδέα της «αβίαστης χαλάρωσης» μπορεί να ακούγεται σαν πολυτέλεια. Σαν κάτι για άλλους. Για εκείνους που δεν χρειάστηκε ποτέ να παλέψουν με το δικό τους νου.",
        "Αλλά το Tregchod δεν ζητά να σταματήσεις να προσέχεις. Ζητά να αφήσεις την ένταση της προσπάθειας να κατεβεί — σαν ένα χέρι που κρατούσε σφιχτά κάτι και τώρα, απλώς, ξεχαλαρώνει. Το αντικείμενο δεν φεύγει. Εσύ δεν εξαφανίζεσαι. Η επίγνωση παραμένει. Μόνο η βία της κράτησης διαλύεται.",
        "Η πρακτική των 4 Σταδίων είναι το Tregchod σε κίνηση.",
        "Ξεκινάμε από το Σώμα — όχι γιατί το σώμα είναι «κατώτερο», αλλά γιατί είναι το μόνο σημείο που δεν μπορεί να ψεύδεται. Η βαρύτητα είναι αδιαμφισβήτητη. Εκεί η ένταση του «Σεμ» δεν έχει που να κρυφτεί.",
        "Από εκεί, η Αναπνοή. Όχι για να την ελέγξουμε — αλλά για να τη νιώσουμε ως εσωτερική αφή. Κάθε εκπνοή είναι μια μικρή λύση έντασης. Ένα μικρό Tregchod.",
        "Μετά η Προσοχή — που παρατηρεί τη νοητική ένταση χωρίς να την κρίνει. Δεν την πολεμά. Την αφήνει να ξετυλιχθεί μόνη της, όπως ένας κόμπος που χαλαρώνει όταν πάψεις να τον σφίγγεις.",
        "Και τότε, χωρίς προσπάθεια, αναδύεται ο Χώρος. Η ανοιχτή επίγνωση δεν κατακτάται — αποκαλύπτεται. Ήταν πάντα εκεί, κάτω από τη στρώση της έντασης.",
        "**Ρυθμός & Εγκεφαλικά Κύματα / Τα Πέπλα του Νου (Manomaya Kosha)**\nΣε στιγμές υπερδιέγερσης, ο νους εκπέμπει χαοτικά κύματα Βήτα. Για να ησυχάσει αυτός ο θόρυβος, χρειαζόμαστε ρυθμό. Οι Σούφι, μέσα από ρυθμικές κινήσεις και την απαγγελία ιερών ήχων (*ζικρ*), συντονίζουν το νευρικό τους σύστημα με τη συχνότητα της αγάπης, φέρνοντας το κέντρο στην καρδιά.",
        "Νευρολογικά, αυτή η ενοποίηση προκαλεί τον **συγχρονισμό των δύο ημισφαιρίων**. Τα χαοτικά κύματα υποχωρούν για τα **κύματα Άλφα και Θήτα**. Η παρουσία γίνεται ολική και αβίαστη.",
        "**Ανοιχτός Χώρος, Μαχαμούντρα και «Μια Γεύση» (Anandamaya Kosha)**\nΌταν η ενέργεια ρέει ελεύθερα, παραμερίζουμε και το τελευταίο πέπλο. Εκεί βρίσκουμε τον Χώρο. Στην παράδοση της Μαχαμούντρα, αυτή η κατάσταση ονομάζεται **«Μια Γεύση» (One Taste)**. Δεν υπάρχει πλέον διαχωρισμός ανάμεσα στον παρατηρητή και το παρατηρούμενο, ανάμεσα στο «μέσα» και το «έξω». Τα πάντα –σκέψεις, ήχοι, συναισθήματα– έχουν την ίδια «γεύση» καθαρής επίγνωσης.",
        "Σε αυτό το σημείο, οι νευροεπιστήμονες παρατηρούν την έκρηξη των **κυμάτων Γάμμα**, που συνδέονται με την απόλυτη διαύγεια και την εμπειρία της Ενότητας.",
        "Δεν είσαι η μπάμπουσκα που βλέπεις απέξω. **Είσαι ο αέρας στην πιο μικρή μπάμπουσκα (στην καρδιά), που είναι αδιάσπαστα ενωμένος με τον άπειρο χώρο.** Σε αυτή την ανοιχτή επίγνωση, το μυαλό μπορεί να συνεχίσει να σκέφτεται, αλλά παύει να σε παρασύρει. Έχεις μάθει να ιππεύεις τον άνεμο.."
      ]
    },
    {
      id: 'the-goose-is-out',
      title: language === 'en' ? 'The Goose is Out' : 'Η Χήνα Είναι Έξω',
      author: language === 'en' ? 'Mindfulness & Neurodiversity' : 'Ενσυνειδητότητα & Νευροδιαφορετικότητα',
      pages: language === 'en' ? [
        "In the classical Zen tradition, a famous story is preserved. Governor Lu Xuan approached Master Nanquan and posed an old, unsolved problem: \"If a man puts a young gosling into a glass bottle and feeds it until it grows into a full-sized goose, how can he get it out without breaking the glass and without killing the goose?\" The Master, instead of offering a logical solution, clapped his hands and shouted loudly: \"Officer!\". Lu Xuan, startled by the sudden sound, reflexively replied: \"Yes?\". Then the Master smiled and said: \"See, the goose is already out!\".",
        "This ancient allegory perfectly captures what contemporary spiritual teacher Eckhart Tolle describes as the core separation of our existence: \"form identity\" and \"essence identity\". The bottle represents form—our physical body, the constructed mind, and our social identifications. The goose is our pure consciousness, our formless and unbound essence.",
        "WE WERE NOT BORN TO FIT IN\nThe truth is one: we were not born to fit anywhere. However, from the very first day of our lives, we exist within families, societies, and nations that demand specific things from us. For a neurodivergent individual, these rigid expectations, rules, and neurotypical \"molds\" are experienced as a true prison. The environment demands our consciousness to be compressed into an extremely narrow and unsuitable bottle.",
        "THE BOTTLE HAS A NAME: MASKING\nWhat contemporary neuroscience calls \"masking\" — the exhausting daily performance of being someone you are not, so that others feel comfortable — the Zen Master understood 1,200 years ago. It is the bottle.\n\nThe unceasing labor of compressing yourself into a shape that was never yours. Monitoring every word before it leaves your mouth. Rehearsing expressions in the mirror. Calculating whether your reaction is \"too much\" or \"too little\". Pretending the noise doesn't bother you. Smiling when your nervous system is screaming.\n\nResearch confirms what you already know in your body: chronic masking raises cortisol, exhausts the prefrontal cortex, and is directly linked to burnout, anxiety, and depression. It is not weakness. It is what happens when a goose lives too long inside a bottle.\n\nAnd here is what the Master's answer reveals: you never became the bottle. The goose was always out. The mask was a function — never your identity.",
        "Naturally, living in this world requires practicality. Taking care of ourselves, assuming responsibilities, and working for self-preservation are necessary. The secret, however, as Tolle points out, lies in recognizing that these are merely roles. When we work, we assume the role of the worker; we operate within the \"bottle\" to survive, but we do not identify deeply with this role. Our work is a function in the world of form, not our identity. Our consciousness (the goose) remains entirely unaffected by the time we sell or the roles we play.",
        "THE INTERACTIVE APP AND THE FOUR-FOLD AXIS\nFor the neurodivergent mind, understanding this separation cannot merely remain theoretical; it must be experienced somatically and neurologically. This is where the mindfulness app comes into play, based on the Four-fold Axis: Body - Breath - Attention - Space.",
        "Through this lens, the first three axes constitute the \"Bottle\":\n* The Body: Offers us the stability and grounding of gravity in the \"Here\".\n* The Breath: Connects us with the biological rhythm of life.\n* The Attention: Acts as the lens that gathers and directs the mind, bringing order to distraction.\nThis is our material and cognitive structure. It is the necessary container for us to exist in the world.",
        "However, true liberation arrives with the fourth axis, Space (Open Awareness), which is the \"Goose\" itself. It is the ability to open our perception like the vast sky, making room for everything within us (thoughts, sensations, sounds) without being overwhelmed by anything.",
        "FROM NARROWNESS TO WHOLENESS: THE NEUROPHYSIOLOGICAL SHIFT\nWhen an individual regulates their consciousness by transitioning from the first three axes to the fourth, a significant change happens. Perception shifts from \"narrow\" (survival mode) to \"open\" and inclusive.\nNeurophysiologically, this process marks the transition from Beta (β) brainwaves—which characterize intense, narrow focus, stress, and the \"mechanical/anxious mind\"—to Alpha (α) brainwaves. Alpha waves harmonize the two brain hemispheres and induce a state of calm alertness. It is the moment the brain stops seeing the bottle as an obstacle and experiences the wholeness of the goose's mind. In this frequency, the concept of being \"locked in\" and overloaded dissolves.",
        "GRADUAL LIBERATION: LOOSENING THE BOTTLE\nAs scholars of this tradition suggest, instantaneous realization (sudden awakening) worked in the original story because the student-official was already a highly advanced and trained Zen scholar. For our case, however, and particularly for the neurodivergent mind, instantaneous awakening is rarely enough.",
        "Our nervous system is frequently in a state of sensory overload, with the \"mechanical mind\" constantly running in the background. Therefore, the practice demands gradual work. We physically start with the body and breath, aiming first to calm the nervous system and send it clear signals of safety. Once this precious calm falls upon us, we can observe the \"autopilot\"—the negative conditioning, patterns, and ceaseless noise—and deactivate it.\nIn the place of this autopilot, we establish pure presence. This is achieved by using the stability of gravity as an anchor, always approaching ourselves with kindness, compassion, and acceptance.",
        "Through this gentle process, we do not fight to aggressively break the glass. Instead, we \"loosen the bottle\". We create the right conditions of safety so that the mind can finally break free and the goose can breathe, confirming to the neurodivergent individual that their essence was always, from the very beginning, completely free."
      ] : [
        "Στην κλασική παράδοση του Ζεν, διασώζεται μια περίφημη ιστορία. Ο Κυβερνήτης Λου Σουάν πλησίασε τον Δάσκαλο Ναντσουάν και του έθεσε ένα παλιό, άλυτο πρόβλημα: «Αν ένας άνθρωπος βάλει ένα νεογέννητο χηνόπουλο σε ένα γυάλινο μπουκάλι και το ταΐζει μέχρι να γίνει μια ολόκληρη, μεγάλη χήνα, πώς μπορεί να τη βγάλει έξω χωρίς να σπάσει το γυαλί και χωρίς να σκοτώσει τη χήνα;». Ο Δάσκαλος, αντί να προσφέρει μια λογική λύση, χτύπησε τα χέρια του και φώναξε δυνατά: «Αξιωματικέ!». Ο Λου Σουάν, σαστισμένος από τον ξαφνικό ήχο, απάντησε αντανακλαστικά: «Μάλιστα;». Τότε ο Δάσκαλος χαμογέλασε και του είπε: «Δες, η χήνα είναι ήδη έξω!».",
        "Αυτή η αρχαία αλληγορία αποδίδει με εκπληκτική ακρίβεια αυτό που ο σύγχρονος πνευματικός δάσκαλος Έκχαρτ Τόλλε (Eckhart Tolle) περιγράφει ως τον θεμελιώδη διαχωρισμό της ύπαρξής μας: την «ταυτότητα της μορφής» (form identity) και την «ταυτότητα της ουσίας» (essence identity). Το μπουκάλι αντιπροσωπεύει τη μορφή —το φυσικό μας σώμα, τον κατασκευασμένο νου και τις κοινωνικές ταυτίσεις. Η χήνα είναι η καθαρή μας συνειδητότητα, η άμορφη και αδέσμευτη ουσία μας.",
        "ΔΕΝ ΓΕΝΝΗΘΗΚΑΜΕ ΓΙΑ ΝΑ ΧΩΡΕΣΟΥΜΕ ΚΑΠΟΥ\nΗ αλήθεια είναι μία: δεν γεννηθήκαμε για να χωρέσουμε πουθενά. Ωστόσο, από την πρώτη μέρα της ζωής μας, υπάρχουμε μέσα σε οικογένειες, κοινωνίες και χώρες που απαιτούν από εμάς συγκεκριμένα πράγματα. Για ένα νευροδιαφορετικό άτομο, αυτές οι άκαμπτες προσδοκίες, οι κανόνες και τα νευροτυπικά \"καλούπια\" βιώνονται ως μια πραγματική φυλακή. Το περιβάλλον απαιτεί από τη συνειδητότητά μας να συμπιεστεί μέσα σε ένα εξαιρετικά στενό και ακατάλληλο μπουκάλι.",
        "ΤΟ ΜΠΟΥΚΑΛΙ ΕΧΕΙ ΟΝΟΜΑ: MASKING\nΑυτό που η σύγχρονη νευροεπιστήμη ονομάζει «masking» — την εξαντλητική, καθημερινή παράσταση του να είσαι κάποιος άλλος, ώστε οι γύρω σου να νιώθουν άνετα — ο Δάσκαλος του Ζεν το γνώριζε 1.200 χρόνια πριν. Είναι το μπουκάλι.\n\nΗ ακούραστη δουλειά να συμπιέζεις τον εαυτό σου σε ένα σχήμα που δεν ήταν ποτέ δικό σου. Να ελέγχεις κάθε λέξη πριν βγει από το στόμα σου. Να εξασκείς εκφράσεις μπροστά στον καθρέφτη. Να υπολογίζεις αν η αντίδρασή σου είναι «υπερβολική» ή «ανεπαρκής». Να προσποιείσαι ότι ο θόρυβος δεν σε ενοχλεί. Να χαμογελάς όταν το νευρικό σου σύστημα ουρλιάζει.\n\nΗ έρευνα επιβεβαιώνει αυτό που ήδη ξέρεις στο σώμα σου: το χρόνιο masking αυξάνει την κορτιζόλη, εξαντλεί τον προμετωπιαίο φλοιό και συνδέεται άμεσα με burnout, άγχος και κατάθλιψη. Δεν είναι αδυναμία. Είναι αυτό που συμβαίνει όταν μια χήνα ζει για πολύ καιρό μέσα σε ένα μπουκάλι.\n\nΚαι να τι αποκαλύπτει η απάντηση του Δασκάλου: δεν έγινες ποτέ το μπουκάλι. Η χήνα ήταν πάντα έξω. Η μάσκα ήταν μια λειτουργία — ποτέ η ταυτότητά σου.",
        "Φυσικά, το να ζούμε σε αυτόν τον κόσμο απαιτεί πρακτικότητα. Η φροντίδα του εαυτού μας, η ανάληψη ευθυνών και η εργασία για την αυτοσυντήρησή μας είναι απαραίτητα. Το μυστικό, όμως, όπως επισημαίνει ο Τόλλε, βρίσκεται στο να αναγνωρίσουμε πως όλα αυτά είναι απλώς ρόλοι. Όταν δουλεύουμε, αναλαμβάνουμε τον ρόλο του εργαζομένου· λειτουργούμε μέσα στο \"μπουκάλι\" για να επιβιώσουμε, αλλά δεν ταυτιζόμαστε βαθιά με αυτόν τον ρόλο. Η δουλειά μας είναι μια λειτουργία στον κόσμο της μορφής, όχι η ταυτότητά μας. Η συνειδητότητά μας (η χήνα) παραμένει εντελώς ανεπηρέαστη από τον χρόνο που πουλάμε ή τους ρόλους που υποδυόμαστε.",
        "Η ΔΙΑΔΡΑΣΤΙΚΗ ΕΦΑΡΜΟΓΗ ΚΑΙ Ο ΤΕΤΡΑΠΛΟΣ ΑΞΟΝΑΣ\nΓια τον νευροδιαφορετικό νου, η κατανόηση αυτού του διαχωρισμού δεν αρκεί να μείνει στη θεωρία· πρέπει να βιωθεί σωματικά και νευρολογικά. Εδώ έρχεται να λειτουργήσει η εφαρμογή ενσυνειδητότητας, η οποία βασίζεται στον Τετραπλό Άξονας: Σώμα - Αναπνοή - Προσοχή - Χώρος.",
        "Μέσα από αυτό το πρίσμα, οι τρεις πρώτοι άξονες αποτελούν το «Μπουκάλι»:\n* Το Σώμα: Μας προσφέρει τη σταθερότητα και τη γείωση της βαρύτητας στο \"Εδώ\".\n* Η Αναπνοή: Μας συνδέει με τον βιολογικό ρυθμό της ζωής.\n* Η Προσοχή: Λειτουργεί ως ο φακός που συγκεντρώνει και κατευθύνει τον νου, βάζοντας τάξη στη διάσπαση.\nΑυτή είναι η υλική και γνωστική μας δομή. Είναι το απαραίτητο δοχείο για να υπάρξουμε στον κόσμο.",
        "Ωστόσο, η αληθινή απελευθέρωση έρχεται με τον τέταρτο άξονα, τον Χώρο (την Ανοιχτή Επίγνωση), ο οποίος είναι η ίδια η «Χήνα». Είναι η ικανότητα να ανοίγουμε την αντίληψή μας σαν τον αχανή ουρανό, χωρώντας τα πάντα μέσα μας (σκέψεις, αισθήσεις, ήχους) χωρίς να κατακλυζόμαστε από τίποτα.",
        "ΑΠΟ ΤΗ ΣΤΕΝΩΣΗ ΣΤΗΝ ΟΛΟΤΗΤΑ: Η ΝΕΥΡΟΦΥΣΙΟΛΟΓΙΚΗ ΑΛΛΑΓΗ\nΌταν το άτομο ρυθμίζει τη συνείδησή του περνώντας από τους πρώτους τρεις άξονες στον τέταρτο, συμβαίνει κάτι εντυπωσιακό. Η αντίληψη αλλάζει ριζικά από \"στενή\" (λειτουργία επιβίωσης) σε \"ανοιχτή\" και περιεκτική.\nΝευροφυσιολογικά, αυτή η διαδικασία σηματοδοτεί τη μετάβαση από τα εγκεφαλικά κύματα Βήτα (β) —που χαρακτηρίζουν την έντονη, στενή εστίαση, το στρες και τον «μηχανικό/αγχώδη νου»— στα εγκεφαλικά κύματα Άλφα (α). Τα κύματα Άλφα εναρμονίζουν τα δύο ημισφαίρια του εγκεφάλου και προκαλούν μια κατάσταση ήρεμης εγρήγορσης. Είναι η στιγμή που ο εγκέφαλος σταματά να βλέπει το μπουκάλι ως εμπόδιο και βιώνει την ολότητα του νου της χήνας. Σε αυτή τη συχνότητα, η έννοια του \"κλειδώματος\" και της υπερφόρτωσης διαλύεται.",
        "Η ΣΤΑΔΙΑΚΗ ΑΠΕΛΕΥΘΕΡΩΣΗ: ΧΑΛΑΡΩΝΟΝΤΑΣ ΤΟ ΜΠΟΥΚΑΛΙ\nΌπως υποδεικνύουν οι μελετητές της παράδοσης, η στιγμιαία συνειδητοποίηση (το απότομο ξύπνημα) λειτούργησε στην περίπτωση της αρχικής ιστορίας επειδή ο μαθητής-αξιωματούχος ήταν ήδη ένας πολύ προχωρημένος και εκπαιδευμένος μελετητής του Ζεν. Για τη δική μας περίπτωση, ωστόσο, και ιδιαίτερα για τον νευροδιαφορετικό νου, η στιγμιαία αφύπνιση σπάνια είναι αρκετή.",
        "Το νευρικό μας σύστημα βρίσκεται συχνά σε κατάσταση υπερφόρτωσης, με τον «μηχανικό νου» να λειτουργεί συνεχώς στο παρασκήνιο. Γι' αυτό, η πρακτική απαιτεί να κάνουμε σιγά-σιγά δουλειά. Ξεκινάμε με το σώμα και την αναπνοή, με σκοπό να ηρεμήσουμε πρώτα το νευρικό σύστημα και να του δώσουμε σαφή σήματα ασφάλειας. Αφού επέλθει αυτή η πολύτιμη ηρεμία, μπορούμε να παρατηρήσουμε τον \"αυτόματο πιλότο\" —τις αρνητικές καταγραφές, τα μοτίβα και τον ασταμάτητο θόρυβο— και να τον απενεργοποιήσουμε.\nΣτη θέση αυτού του αυτόματου πιλότου, εγκαθιδρύουμε την αγνή παρουσία. Αυτό επιτυγχάνεται χρησιμοποιώντας ως άγκυρα τη σταθερότητα της βαρύτητας, προσεγγίζοντας πάντα τον εαυτό μας με καλοσύνη, συμπόνια και αποδοχή.",
        "Μέσα από αυτή την ήπια διαδικασία, δεν παλεύουμε να σπάσουμε βίαια το γυαλί. Αντιθέτως, «χαλαρώνουμε το μπουκάλι». Δημιουργούμε τις κατάλληλες συνθήκες ασφάλειας ώστε ο νους να μπορέσει τελικά να ελευθερωθεί και η χήνα να αναπνεύσει, επιβεβαιώνοντας στον νευροδιαφορετικό άνθρωπο ότι η ουσία του ήταν πάντοτε, εξαρχής, ελεύθερη."
      ]
    },
    {
      id: 'blue-sky-mind',
      title: language === 'en' ? 'Space - Sky' : 'Χώρος - Ουρανός',
      author: 'Chögyam Trungpa Rinpoche',
      pages: language === 'en' ? [
        "Practice means that everything you do, you act from Blue Sky Mind. You don't run off with your delusions when they arise. Seeing them as clouds, you begin to understand that which stays and that which goes. This Blue Sky Mind observes all of these passing conditions and sees them all clearly, but it isn't any one of those states itself.",
        "Blue Sky Mind, this unstainable consciousness, Buddha nature. Through practice you develop the strength to not identify with the things that come up and begin to prefer the spaciousness of your unstainable consciousness. The more time you spend as Blue Sky, the less you will want to spend time as clouds.",
        "To the extent that you spend time in this birthless mind, in the mind that hasn't taken the hard form of opinion, likes, and dislikes, to that extent you can have a flexible, expansive, and open mind.",
        "You keep returning to Blue Sky Mind and as you spend more and more time there, eventually that becomes your place of residence. At this point it feels like a true turn-around has occurred, one with entirely different quality of being."
      ] : [
        "Η πρακτική σημαίνει ότι καθετί που κάνεις, το πράττεις μέσα από τον Νου του Γαλάζιου Ουρανού. Δεν παρασύρεσαι από τις αυταπάτες σου όταν αυτές αναδύονται. Βλέποντάς τες σαν σύννεφα, αρχίζεις να κατανοείς τι είναι αυτό που μένει και τι είναι αυτό που φεύγει. Αυτός ο Νους του Γαλάζιου Ουρανού παρατηρεί όλες αυτές τις περαστικές συνθήκες και τις βλέπει όλες ξεκάθαρα, αλλά δεν ταυτίζεται με καμία από αυτές τις καταστάσεις.",
        "Ο Νους του Γαλάζιου Ουρανού, αυτή η αμόλυντη συνειδητότητα, η βουδική φύση. Μέσα από την πρακτική αναπτύσσεις τη δύναμη να μην ταυτίζεσαι με τα πράγματα που προκύπτουν και αρχίζεις να προτιμάς την ευρυχωρία της αμόλυντης συνειδητότητάς σου. Όσο περισσότερο χρόνο περνάς ως Γαλάζιος Ουρανός, τόσο λιγότερο θα θέλεις να περνάς χρόνο ως σύννεφα.",
        "Στον βαθμό που περνάς χρόνο σε αυτόν τον αγέννητο νου, στον νου που δεν έχει πάρει τη σκληρή μορφή της άποψης, των προτιμήσεων και των δυσαρεσκειών, σε αυτόν τον βαθμό μπορείς να έχεις έναν ευέλικτο, επεκτατικό και ανοιχτό νου.",
        "Συνεχώς επιστρέφεις στον Νου του Γαλάζιου Ουρανού, και καθώς περνάς όλο και περισσότερο χρόνο εκεί, τελικά αυτός γίνεται η μόνιμη κατοικία σου. Σε αυτό το σημείο, νιώθεις ότι έχει συμβεί μια αληθινή μεταστροφή, μια μεταστροφή με μια εντελώς διαφορετική ποιότητα ύπαρξης."
      ]
    },
    {
      id: 'myth-of-freedom-earth',
      title: language === 'en' ? 'The Touch of the Earth' : 'Το Άγγιγμα της Γης',
      author: 'Chögyam Trungpa Rinpoche',
      pages: language === 'en' ? [
        "As the Buddha's approach to the practice of meditation evolved, he realized that gimmicks are merely neurotic affectations.\n\nHe decided to look for what is simple, what is actually there, to discover the relationship between mind and body, his relationship with the kusha grass mat on which he sat and the bodhi tree above his head.",
        "He looked into his relationships with everything very simply and directly. It was not especially exciting—there were no flashes of anything—but it was reassuring.",
        "At the dawn of his enlightenment someone asked the Buddha, 'What are your credentials? How do we know that you are enlightened?'\n\nHe touched his hand to the ground. 'This solid earth is my witness. This solid earth, this same earth, is my witness.'",
        "Sane and solid and definite, no imaginings, no concepts, no emotions, no frivolity, but being basically what is: this is the awakened state. And this is the example we follow in our meditation practice.\n\n📖 The Myth of Freedom"
      ] : [
        "Καθώς η προσέγγιση του Βούδα στην πρακτική του διαλογισμού εξελισσόταν, συνειδητοποίησε ότι τα τεχνάσματα και τα 'κόλπα' είναι απλώς νευρωτικές επιτηδεύσεις.\n\nΑποφάσισε να αναζητήσει αυτό που είναι απλό, αυτό που υπάρχει πραγματικά εκεί, για να ανακαλύψει τη σχέση ανάμεσα στον νου και το σώμα, τη σχέση του με το ψάθινο στρώμα από χορτάρι κούσα πάνω στο οποίο καθόταν και το δέντρο Μπόντι πάνω από το κεφάλι του.",
        "Κοίταξε τις σχέσεις του με τα πάντα πολύ απλά και άμεσα. Δεν ήταν τίποτα ιδιαίτερα συναρπαστικό —δεν υπήρχαν λάμψεις ή εντυπωσιακά βιώματα— αλλά ήταν καθησυχαστικό.",
        "Την αυγή της φώτισής του, κάποιος ρώτησε τον Βούδα: «Ποια είναι τα διαπιστευτήριά σου; Πώς ξέρουμε ότι έχεις αφυπνιστεί;»\n\nΕκείνος άγγιξε το χέρι του στο έδαφος. «Αυτή η στέρεη γη είναι ο μάρτυράς μου. Αυτή η στέρεη γη, αυτή η ίδια γη, είναι ο μάρτυράς μου».",
        "Λογικό, στέρεο και συγκεκριμένο, χωρίς φαντασιώσεις, χωρίς έννοιες, χωρίς συναισθηματισμούς, χωρίς περιττές ελαφρότητες, αλλά το να είσαι ουσιαστικά αυτό που υπάρχει: αυτή είναι η αφυπνισμένη κατάσταση. Και αυτό είναι το παράδειγμα που ακολουθούμε στη διαλογιστική μας πρακτική.\n\n📖 Ο Μύθος της Ελευθερίας"
      ]
    }
  ];

  // Story Viewer Handlers
  const handleNext = () => {
    if (activeArticle) {
      const activeData = articles.find(a => a.id === activeArticle);
      if (activeData && currentPage < activeData.pages.length - 1) {
        setCurrentPage(p => p + 1);
      }
    }
  };

  const handlePrev = () => {
    setCurrentPage(p => Math.max(0, p - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      handleNext(); // swipe left -> next page
    } else if (diff < -40) {
      handlePrev(); // swipe right -> prev page
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeArticle) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle]);

  // Story Viewer Render
  if (activeArticle) {
    const article = articles.find(a => a.id === activeArticle);
    if (!article) return <div className="text-white p-20 mt-20 text-center">Article not found: {activeArticle}</div>;

    const storyViewer = (
      <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md text-white flex flex-col animate-in fade-in duration-300">
        
        {/* Top Progress Bar & Header */}
        <div className="pt-safe px-4 pb-3 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md/80 backdrop-blur-md relative z-20">
          <button 
            onClick={() => setActiveArticle(null)} 
            className="p-2 -ml-2 text-white/40 hover:text-white transition-colors active:scale-95"
            aria-label={t.close}
          >
            <X size={24} />
          </button>
          <div className="flex-1 px-4 text-center">
            <h2 className="text-[14px] font-medium font-serif italic text-white/90 truncate">{article.title}</h2>
          </div>
          <div className="w-10 text-xs text-teal-400/80 font-mono text-right font-medium tracking-wide">
            {currentPage + 1}<span className="text-white/20">/{article.pages.length}</span>
          </div>
        </div>

        {/* Progress Indicator Lines */}
        <div className="flex gap-1.5 px-4 py-3 opacity-80 z-20">
          {article.pages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i === currentPage 
                  ? 'bg-teal-400/80 scale-y-125' 
                  : i < currentPage 
                    ? 'bg-teal-500/30' 
                    : 'bg-white/10'
              }`} 
            />
          ))}
        </div>

        {/* Reading Area Wrapper */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Invisible Hitboxes (Fixed in the viewer, outside scrolling) */}
          <button 
            className="absolute top-0 left-0 w-[30%] h-full z-10 flex flex-col justify-center items-start pl-2 md:pl-6 group outline-none"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous page"
            disabled={currentPage === 0}
          >
            {currentPage > 0 && (
              <div className="p-3 rounded-full opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronLeft size={40} className="text-white" />
              </div>
            )}
          </button>
          
          <button 
            className="absolute top-0 right-0 w-[30%] h-full z-10 flex flex-col justify-center items-end pr-2 md:pr-6 group outline-none"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next page"
            disabled={currentPage === article.pages.length - 1}
          >
            {currentPage < article.pages.length - 1 && (
              <div className="p-3 rounded-full opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight size={40} className="text-white" />
              </div>
            )}
          </button>

          {/* Scrolling Content */}
          <div 
            className="flex-1 overflow-y-auto px-6 md:px-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Text Content */}
            <div 
              key={currentPage} 
              className="min-h-full flex flex-col justify-center max-w-xl mx-auto w-full py-12 pb-32 animate-in fade-in zoom-in-[0.98] duration-300 ease-out relative z-0 pointer-events-none"
            >
              <BookOpen size={24} className="text-teal-500/20 mx-auto justify-center mb-8" />
              <p className="text-[20px] md:text-[24px] leading-[1.7] font-serif text-white/90 text-center tracking-wide whitespace-pre-line pointer-events-auto" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)"}}>
                {article.pages[currentPage]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(storyViewer, document.body);
  }

  // List View Render (when activeArticle is null)
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <Link 
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-white transition-colors active:scale-95"
            aria-label={t.back}
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-lg font-serif italic text-white/90 tracking-wide flex items-center gap-2">
              <span className="text-[16px] not-italic opacity-80">🐇🕳️</span> {t.title}
            </h1>
            <p className="text-[9px] text-teal-400/60 uppercase tracking-[0.25em] mt-0.5">{t.subtitle}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 max-w-4xl mx-auto w-full">
        {/* Custom Tabs */}
        <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('articles')}
            className={cn(
              "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              activeTab === 'articles' 
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                : "text-white/30 hover:text-white/60"
            )}
          >
            <BookOpen size={16} />
            {language === 'el' ? 'ΚΕΙΜΕΝΑ' : 'ARTICLES'}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={cn(
              "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
              activeTab === 'videos' 
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                : "text-white/30 hover:text-white/60"
            )}
          >
            <Film size={16} />
            {language === 'el' ? 'ΒΙΝΤΕΟ' : 'VIDEOS'}
          </button>
        </div>

        <p className="text-white/40 text-sm md:text-base font-serif italic mb-10 text-center px-4 leading-relaxed">
          {activeTab === 'articles' ? (
            language === 'en' 
              ? 'A collection of theoretical pieces, allegories, and insights from across the world charting the human path to the exploration of consciousness.'
              : 'Μια βιβλιοθήκη με θεωρητικά κείμενα, αλληγορίες και στοχασμούς από όλο τον κόσμο για την ανθρώπινη πορεία προς την εξερεύνηση της συνειδητότητας.'
          ) : (
            language === 'en'
              ? 'Visual insights and philosophical explorations.'
              : 'Οπτικές αναζητήσεις και φιλοσοφικές εξερευνήσεις.'
          )}
        </p>

        {activeTab === 'articles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Link to Method & Symbols */}
          <Link 
            to="/method"
 className="w-full md:col-span-2 glass-card rounded-[2rem] p-6 md:p-8 block text-left transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-teal-500/20 relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-[0.04] transition-all duration-700">
              <span className="text-[120px] md:text-[160px] grayscale">🐘</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <span className="text-[24px] drop-shadow-md grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🐘</span>
              </div>
              <div>
                <h2 className="text-[20px] md:text-[24px] font-serif italic font-medium text-[#d4d4d8] leading-snug tracking-tight group-hover:text-teal-100 transition-colors">{language === 'en' ? 'The Method & Symbols' : 'Η Μέθοδος & τα Σύμβολα'}</h2>
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#d4d4d8]/50 font-bold mt-1.5">{language === 'en' ? 'THE ELEPHANT & THE MONKEY' : 'Ο ΕΛΕΦΑΝΤΑΣ ΚΑΙ Η ΜΑΙΜΟΥ'}</p>
              </div>
            </div>
            <p className="text-[#d4d4d8]/70 text-sm md:text-[15px] leading-relaxed line-clamp-3 relative z-10 font-medium">
              {language === 'en' 
                ? "Dive into the allegorical framework that structures the practice. Understanding how the mind wanders and returns."
                : "Εξερευνήστε το αλληγορικό πλαίσιο που δομεί την πρακτική. Πώς ο νους περιπλανάται και πώς επιστρέφει."}
            </p>
            <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-teal-400/80 font-medium text-[13px] md:text-sm relative z-10 group-hover:text-teal-300 transition-colors">
              <span className="flex items-center gap-2">
                {language === 'en' ? 'Explore Symbols' : 'Εξερεύνηση Συμβόλων'} <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {articles.map((article) => {
            const isNew = article.id === 'dzogchen-great-perfection';
            return (
              <button 
                key={article.id}
                onClick={() => { setActiveArticle(article.id); setCurrentPage(0); }}
                className={`w-full border rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col text-left transition-all duration-300 active:scale-[0.98] hover:shadow-2xl relative overflow-hidden group ${
                  isNew 
 ? 'glass-card border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-950/20' 
 : 'glass-card hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                {isNew && (
                  <div className="absolute top-5 right-5 bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest z-20">
                    {language === 'en' ? 'New' : 'Νεο'}
                  </div>
                )}
                
                {/* Subtle background glow for new items */}
                {isNew && <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] to-transparent pointer-events-none" />}

                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ${isNew ? 'bg-teal-500/[0.05]' : 'bg-white/[0.02]'}`}>
                    <BookOpen size={22} className={`${isNew ? 'text-teal-400/80' : 'text-white/30'}`} />
                  </div>
                  <div className="flex-1 pr-12">
                    <h2 className="text-[18px] md:text-[20px] font-serif italic font-medium text-white/90 leading-snug tracking-tight group-hover:text-white transition-colors">{article.title}</h2>
                    <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mt-1.5 ${isNew ? 'text-teal-400/60' : 'text-white/30'}`}>{article.author}</p>
                  </div>
                </div>
                <p className="text-white/40 text-[13px] md:text-[14px] leading-relaxed line-clamp-3 relative z-10 font-sans">
                  "{article.pages[0]}"
                </p>
                <div className="mt-auto pt-6">
                  <div className="pt-5 border-t border-white/5 flex justify-between items-center text-white/50 font-medium text-[13px] md:text-[14px] relative z-10 group-hover:text-white/70 transition-colors">
                    <span className="flex items-center gap-2">
                       {t.startReading} <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] text-white/20 font-bold tracking-[0.25em] uppercase">
                      {article.pages.length} {language === 'en' ? 'PAGES' : 'ΣΕΛΙΔΕΣ'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        ) : (
        <div className="flex flex-col gap-4">
          {informativeVideos.map((video) => (
            <button 
              key={video.id}
              onClick={() => {
                setActiveVideo(video.id);
                setVideoStartTime(0);
                setMantraStep(0);
                setActiveAttentionStyles([]);
                setIsVoidActive(false);
              }}
              className="group flex flex-col md:flex-row gap-5 p-4 md:p-5 bg-white/[0.02] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-white/20 transition-all text-left w-full active:scale-[0.98]"
            >
              <div className="relative w-full md:w-56 aspect-video rounded-[1rem] overflow-hidden flex-shrink-0 border border-white/[0.05]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" style={{ backgroundImage: `url(${video.thumbnail})` }} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-teal-500/80 group-hover:border-teal-400 group-hover:scale-110 transition-all">
                    <Play size={20} className="translate-x-[1px]" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 pb-1">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-teal-400 mb-2 block">
                  {language === 'el' ? video.category.el : video.category.en}
                </span>
                <h3 className="text-[17px] font-serif italic text-white/90 leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">
                  {language === 'el' ? video.title.el : video.title.en}
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-black text-white/30 truncate">
                  {video.author}
                </p>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>
      {/* Video Portal Modal */}
      {activeVideo && createPortal(
        <div className={cn(
          "fixed inset-0 z-[10000] flex flex-col animate-in fade-in duration-1000 overflow-y-auto custom-scrollbar transition-colors duration-1000",
          isVoidActive ? "bg-black" : "bg-black/40 backdrop-blur-md"
        )}>
          {/* Starry Background for Void Mode */}
          <AnimatePresence>
            {isVoidActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
                className="fixed inset-0 pointer-events-none z-0"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_1px)] bg-[length:120px_120px]" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_1px)] bg-[length:180px_180px] animate-pulse" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.03)_0%,transparent_1px)] bg-[length:250px_250px]" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex items-center justify-between p-4 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Youtube size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                {language === 'el' ? 'ΠΡΟΒΟΛΗ ΒΙΝΤΕΟ' : 'NOW PLAYING'}
              </span>
            </div>
            <button 
              onClick={() => setActiveVideo(null)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 transition-opacity duration-1000">
            {/* Player Container */}
            <div className={cn(
              "flex-[2] space-y-6 transition-all duration-1000",
              isVoidActive ? "scale-105" : "scale-100"
            )}>
              <div className={cn(
                "w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl transition-all duration-1000 relative group",
                isVoidActive ? "border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.05)]" : "border-white/10"
              )}>
                <iframe
                  key={`${activeVideo}-${videoStartTime}`}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&start=${videoStartTime}&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className={cn("hidden md:block transition-opacity duration-1000", isVoidActive ? "opacity-20" : "opacity-100")}>
                 <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 mb-2">
                   {informativeVideos.find(v => v.id === activeVideo)?.title[language as 'en'|'el']}
                 </h2>
                 <p className="text-lg text-white/30 font-medium font-serif italic">
                   {informativeVideos.find(v => v.id === activeVideo)?.author}
                 </p>
              </div>
            </div>

            {/* Description / Insights Sidebar */}
            <div className={cn(
              "flex-1 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-300 transition-opacity duration-1000",
              isVoidActive ? "opacity-20 hover:opacity-100" : "opacity-100"
            )}>
              {(() => {
                const videoData = informativeVideos.find(v => v.id === activeVideo);
                if (videoData?.description) {
                  const desc = videoData.description[language as 'en'|'el'];
                  return (
                    <div className="space-y-8 pb-12">
                      {/* Special Void Toggle for Space Meditations */}
                      {videoData.isSpaceMeditation && (
                        <motion.button 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          onClick={() => setIsVoidActive(!isVoidActive)}
                          className={cn(
                            "w-full py-5 rounded-[2.5rem] border flex items-center justify-center gap-3 transition-all duration-700 font-serif italic text-lg shadow-2xl",
                            isVoidActive 
                             ? "bg-white/5 border-white/30 text-white shadow-[0_0_60px_rgba(255,255,255,0.1)]" 
                             : "bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500/20"
                          )}
                        >
                          <motion.div 
                            animate={{ 
                              scale: isVoidActive ? [1, 1.5, 1] : 1,
                              opacity: isVoidActive ? [0.5, 1, 0.5] : 1
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className={cn("w-3 h-3 rounded-full", isVoidActive ? "bg-white" : "bg-teal-500")} 
                          />
                          {isVoidActive 
                             ? (language === 'el' ? 'Return from Reality' : 'Return from the Void')
                             : (language === 'el' ? 'Enter the Void' : 'Enter the Void')}
                        </motion.button>
                      )}

                      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                        <p className="text-[14px] text-white/60 leading-relaxed font-sans">
                          {desc.intro}
                        </p>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[12px] font-serif italic text-teal-400/80">
                             {desc.tip}
                           </p>
                        </div>
                      </div>

                      {desc.mantra && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΟΔΗΓΟΣ ΡΟΗΣ' : 'FLOW GUIDE'}
                          </span>
                          <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/20 rounded-[2.5rem] p-8 text-center relative overflow-hidden group/mantra">
                             <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-50"></div>
                             
                             {/* Stepper Dots */}
                             <div className="flex justify-center gap-1.5 mb-8 relative z-10">
                               {desc.mantra.map((_, idx) => (
                                 <div 
                                   key={idx}
                                   className={`h-1 rounded-full transition-all duration-500 ${idx === mantraStep ? 'w-8 bg-teal-400' : 'w-2 bg-white/10'}`}
                                 />
                               ))}
                             </div>

                             <div className="relative h-20 flex items-center justify-center mb-6">
                               <h4 className="text-3xl md:text-4xl font-serif italic text-white/90 animate-in fade-in zoom-in duration-500 tracking-widest" key={mantraStep}>
                                 {desc.mantra[mantraStep]}
                               </h4>
                             </div>

                             <div className="flex items-center justify-center gap-4 relative z-10">
                               <button 
                                 onClick={() => setMantraStep((prev) => (prev > 0 ? prev - 1 : (desc.mantra ? desc.mantra.length - 1 : 0)))}
                                 className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                               >
                                 <ChevronLeft size={20} />
                               </button>
                               <button 
                                 onClick={() => setMantraStep((prev) => (prev < (desc.mantra ? desc.mantra.length - 1 : 0) ? prev + 1 : 0))}
                                 className="px-8 h-12 rounded-full bg-teal-500 text-black font-bold text-[11px] uppercase tracking-widest hover:bg-teal-400 transition-all active:scale-95 shadow-lg shadow-teal-500/20"
                               >
                                 {language === 'el' ? 'ΕΠΟΜΕΝΟ' : 'NEXT'}
                               </button>
                             </div>
                             
                             <button 
                               onClick={() => {
                                 let time = 0;
                                 if (videoData.id === '7Qbat52NE98') time = 564; // Tai Chi Mantra [09:24]
                                 setVideoStartTime(time);
                               }}
                               className="mt-6 text-[9px] font-bold text-teal-400/60 uppercase tracking-[0.2em] hover:text-teal-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                             >
                                <Youtube size={12} />
                                {language === 'el' ? 'ΔΕΣ ΤΟ ΣΤΟ ΒΙΝΤΕΟ' : 'WATCH IN VIDEO'} {videoData.id === '7Qbat52NE98' ? '[09:24]' : ''}
                             </button>
                          </div>
                        </div>
                      )}

                      {desc.movements && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΟΔΗΓΟΣ ΚΙΝΗΣΕΩΝ' : 'MOVEMENTS GUIDE'}
                          </span>
                          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50"></div>
                             
                             {/* Header */}
                             <div className="flex items-center justify-between mb-8 relative z-10">
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                                   {language === 'el' ? `ΚΙΝΗΣΗ ${desc.movements[mantraStep]?.id || 1} / 10` : `MOVEMENT ${desc.movements[mantraStep]?.id || 1} / 10`}
                                 </span>
                                 <h4 className="text-xl font-serif italic text-white/90">
                                   {desc.movements[mantraStep]?.name}
                                 </h4>
                               </div>
                               <div className="flex gap-2">
                                 <button 
                                   onClick={() => setMantraStep((prev) => (prev > 0 ? prev - 1 : 9))}
                                   className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                 >
                                   <ChevronLeft size={18} />
                                 </button>
                                 <button 
                                   onClick={() => setMantraStep((prev) => (prev < 9 ? prev + 1 : 0))}
                                   className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                                 >
                                   <ChevronRight size={18} />
                                 </button>
                               </div>
                             </div>

                             {/* Breath Instruction */}
                             <div className="grid grid-cols-2 gap-4 relative z-10">
                               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center group transition-all hover:bg-teal-500/10 hover:border-teal-500/30">
                                 <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-3">
                                   <ChevronRight size={16} className="-rotate-90" />
                                 </div>
                                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                                    {language === 'el' ? 'ΕΙΣΠΝΟΗ' : 'INHALE'}
                                 </span>
                                 <p className="text-sm font-serif italic text-white/80">
                                    {language === 'el' ? 'Χέρια πάνω' : 'Hands up'}
                                 </p>
                               </div>
                               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center group transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30">
                                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
                                   <ChevronRight size={16} className="rotate-90" />
                                 </div>
                                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">
                                    {language === 'el' ? 'ΕΚΠΝΟΗ' : 'EXHALE'}
                                 </span>
                                 <p className="text-sm font-serif italic text-white/80">
                                    {language === 'el' ? 'Χέρια κάτω' : 'Hands down'}
                                 </p>
                               </div>
                             </div>

                             <button 
                               onClick={() => {
                                 let time = 0;
                                 if (videoData.id === 'no4x4ewf1dM') time = 65; // Plum Village Mantra [01:05]
                                 setVideoStartTime(time);
                               }}
                               className="mt-8 text-[9px] font-bold text-indigo-400/60 uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                             >
                                <Youtube size={12} />
                                {language === 'el' ? 'ΔΕΣ ΤΟ ΣΤΟ ΒΙΝΤΕΟ' : 'WATCH IN VIDEO'} {videoData.id === 'no4x4ewf1dM' ? '[01:05]' : ''}
                             </button>
                          </div>
                        </div>
                      )}

                      {desc.attentionStyles && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΣΤΥΛ ΠΡΟΣΟΧΗΣ' : 'ATTENTION STYLES'}
                          </span>
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50"></div>
                             
                             <div className="grid grid-cols-2 gap-3 relative z-10 mb-8">
                               {desc.attentionStyles.map((style) => {
                                 const isActive = activeAttentionStyles.includes(style.id);
                                 return (
                                   <button 
                                     key={style.id}
                                     onClick={() => {
                                       setActiveAttentionStyles(prev => 
                                         isActive ? prev.filter(id => id !== style.id) : [...prev, style.id]
                                       );
                                       const [mins, secs] = style.time.split(':').map(Number);
                                       setVideoStartTime((mins * 60) + secs);
                                     }}
                                     className={`p-4 rounded-3xl border transition-all text-left group active:scale-95 ${
                                       isActive 
                                         ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                                         : 'bg-white/5 border-white/10 hover:border-white/20'
                                     }`}
                                   >
                                      <div className={`w-2 h-2 rounded-full mb-3 transition-all ${isActive ? 'bg-amber-400 scale-125' : 'bg-white/20'}`}></div>
                                      <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isActive ? 'text-amber-200' : 'text-white/40'}`}>
                                        {style.name}
                                      </span>
                                      <p className="text-[10px] text-white/30 leading-tight">
                                        {style.desc}
                                      </p>
                                   </button>
                                 );
                               })}
                             </div>

                             {activeAttentionStyles.length === 4 ? (
                               <div className="relative z-10 bg-teal-500/20 border border-teal-500/40 rounded-3xl p-6 text-center animate-in zoom-in duration-500">
                                 <div className="w-12 h-12 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-4 animate-pulse">
                                   <Play size={24} fill="currentColor" />
                                 </div>
                                 <h4 className="text-xl font-serif italic text-white mb-2">
                                   {language === 'el' ? 'Ενεργοποίηση Άξονα Χώρου' : 'Space Axis Activated'}
                                 </h4>
                                 <p className="text-[11px] text-teal-300/60 uppercase tracking-widest font-bold mb-4">
                                   {language === 'el' ? 'ΚΑΤΑΣΤΑΣΗ PURE BEING' : 'PURE BEING STATE'}
                                 </p>
                                 <button 
                                   onClick={() => setVideoStartTime(306)}
                                   className="w-full h-12 rounded-2xl bg-teal-500 text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
                                 >
                                    {language === 'el' ? 'ΒΙΩΣΕ ΤΟ ΤΩΡΑ' : 'EXPERIENCE NOW'} [05:06]
                                 </button>
                               </div>
                             ) : (
                               <div className="relative z-10 text-center py-4">
                                 <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
                                   {language === 'el' 
                                     ? `Επιλογή ${activeAttentionStyles.length}/4 για τον Χώρο` 
                                     : `Select ${activeAttentionStyles.length}/4 for Space`}
                                 </p>
                               </div>
                             )}
                          </div>
                        </div>
                      )}

                      {desc.points && (
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            {language === 'el' ? 'ΚΛΕΙΔΙΑ ΠΡΑΚΤΙΚΗΣ' : 'PRACTICE KEYS'}
                          </span>
                          <div className="space-y-3">
                            {desc.points.map((pt, i) => (
                              <button 
                                key={i} 
                                onClick={() => {
                                  const [mins, secs] = pt.time.split(':').map(Number);
                                  const totalSeconds = (mins * 60) + secs;
                                  setVideoStartTime(totalSeconds);
                                }}
                                className="group w-full text-left p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-teal-500/20 transition-all"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[13px] font-bold text-white/80 group-hover:text-teal-300 transition-colors">{pt.title}</span>
                                  <span className="text-[10px] font-mono text-teal-500/50 bg-teal-500/5 px-2 py-1 rounded-lg group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-all">
                                    {pt.time}
                                  </span>
                                </div>
                                <p className="text-[12px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                  {pt.text}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {desc.bridge && (
                        <div className="space-y-4">
                          <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-all group">
                             <button 
                               onClick={() => setVideoStartTime(desc.bridgeTime!)}
                               className="text-[13px] font-serif italic text-white/80 leading-relaxed text-center group-hover:text-white transition-colors block w-full mb-4 cursor-pointer outline-none"
                             >
                                "{desc.bridge}"
                             </button>
                             <button 
                               onClick={() => {
                                 setActiveVideo(null);
                                 navigate("/practice");
                               }}
                               className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors w-full"
                             >
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                   {language === 'el' ? 'ΜΕΤΑΒΑΣΗ ΣΤΟΝ ΧΩΡΟ' : 'BRIDGE TO SPACE'}
                                </span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-6">
                    <div className="md:hidden">
                       <h2 className="text-2xl font-serif italic text-white/95 mb-2">
                         {videoData?.title[language as 'en'|'el']}
                       </h2>
                       <p className="text-sm text-white/30 font-medium">
                         {videoData?.author} • {videoData?.category[language as 'en'|'el']}
                       </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                       <div className="flex items-center gap-3 mb-6 text-teal-400/40">
                         <Info size={20} />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {language === 'el' ? 'ΠΛΗΡΟΦΟΡΙΕΣ' : 'INFORMATION'}
                         </span>
                       </div>
                       <p className="text-white/50 text-[14px] leading-relaxed italic font-serif">
                         {language === 'el' 
                           ? 'Αυτό το βίντεο αποτελεί μέρος της συλλογής μας για την εξερεύνηση της συνείδησης και της νευροδιαφορετικότητας.' 
                           : 'This video is part of our collection exploring consciousness and neurodiversity.'}
                       </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
