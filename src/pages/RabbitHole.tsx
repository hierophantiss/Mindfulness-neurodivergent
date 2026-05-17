import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

import { dzogchenArticle } from '../data/dzogchenArticle';

export default function RabbitHole() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (location.state && (location.state as any).activeArticle) {
      setActiveArticle((location.state as any).activeArticle);
      setCurrentPage(0);
      // Clear the state so it doesn't reopen upon refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);
  
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
        "The Matryoshka Allegory: A journey from the material body to the air of pure consciousness.",
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
        "In the Tibetan tradition, the practice of *tsa lung* (channels and winds) teaches us that the energy of the mind, the 'wind', moves through the physical and energetic pathways of the body. This principle pervades all great traditions. Yoga was perhaps the first to systematize the union of body and breath, describing our existence as a 'Matryoshka': veils embracing one another.",
        "We find the same unification in Kung Fu (as taught by Bodhidharma to ground the scattered mind), in the arts of Qi Gong and Tai Chi, and in the sacred spinning of the Sufis.",
        "All these methods share a common goal: **regulating the nervous system so that open awareness can emerge effortlessly.** For a neurodivergent person, energy often moves violently between distraction and fixation. The goal is to learn to ride this wind, cultivating a calmness that cooperates with our brain instead of fighting it.",
        "**The Body as a Channel / The Veil of Matter (Annamaya Kosha)**\nThe journey begins with the physical body. The pressure of feeling different translates into chronic tightness. \n* Movement – through *tsa lung* or Tai Chi – unlocks the body.\n* By focusing on gravity, the nervous system receives its first message of safety and grounding.",
        "**Breath as Wind / The Veil of Breath (Pranamaya Kosha)**\nThe second Matryoshka is the breath.\n* A slow exhalation through the mouth sends safety signals via the vagus nerve. It reduces the 'fight or flight' response, allowing the brain to lower its defenses.",
        "**Rhythm & Brain Waves / The Veils of the Mind (Manomaya Kosha)**\nIn moments of hyperarousal, the mind emits chaotic Beta waves. To quiet this noise, we need rhythm. The Sufis, through rhythmic movements and the recitation of sacred sounds (*dhikr*), tune their nervous system to the frequency of love, bringing the center to the heart.",
        "Neurologically, this unification causes the **synchronization of the two hemispheres**. Chaotic waves give way to **Alpha and Theta waves**. Presence becomes total and effortless.",
        "**Open Space, Mahamudra, and 'One Taste' (Anandamaya Kosha)**\nWhen energy flows freely, we brush aside the final veil. There we find Space. In the Mahamudra tradition, this state is called **'One Taste'**. There is no longer a separation between the observer and the observed, between 'inside' and 'outside'. Everything – thoughts, sounds, emotions – has the same 'taste' of pure awareness.",
        "At this point, neuroscientists observe an explosion of **Gamma waves**, which are associated with absolute clarity and the experience of Oneness.",
        "You are not the Matryoshka you see from the outside. **You are the air in the smallest Matryoshka (in the heart), which is inseparably united with the infinite space.** In this open awareness, the mind may continue to think, but it stops carrying you away. You have learned to ride the wind."
      ] : [
        "Στην παράδοση του Θιβέτ, η πρακτική του *tsa lung* (κανάλια και άνεμοι) μας διδάσκει ότι η ενέργεια του νου, δηλαδή ο «άνεμος», κινείται μέσα από τα φυσικά και ενεργειακά μονοπάτια του σώματος.",
        "Αυτή η αρχή διαπερνά όλες τις μεγάλες παραδόσεις. Η Γιόγκα ήταν ίσως η πρώτη που συστηματοποίησε την ένωση σώματος και αναπνοής, περιγράφοντας την ύπαρξή μας σαν μια «Μπάμπουσκα»: πέπλα που το ένα αγκαλιάζει το άλλο.",
        "Την ίδια ενοποίηση συναντάμε στο Κουνγκ Φου (όπως το δίδαξε ο Μποντιντάρμα για να γειώσει τον διασκορπισμένο νου), στις τέχνες του Τσι Κονγκ και του Τάι Τσι, αλλά και στις ιερές περιστροφές των Σούφι.",
        "Όλες αυτές οι μέθοδοι μοιράζονται έναν κοινό στόχο: **τη ρύθμιση του νευρικού συστήματος, ώστε η ανοιχτή επίγνωση να αναδυθεί αβίαστα.**\n\nΓια έναν νευροαποκλίνοντα άνθρωπο, η ενέργεια συχνά κινείται βίαια ανάμεσα στη διάσπαση και την καθήλωση. Το ζητούμενο είναι να μάθουμε να ιππεύουμε αυτόν τον άνεμο, καλλιεργώντας μια ηρεμία που συνεργάζεται με τον εγκέφαλό μας αντί να τον πολεμά.",
        "**Το Σώμα ως Κανάλι / Το Πέπλο της Ύλης (Annamaya Kosha)**\nΗ διαδρομή ξεκινά από το φυσικό σώμα. Η πίεση του να νιώθουμε διαφορετικοί μεταφράζεται σε χρόνια σφιξίματα.\n* Η κίνηση –μέσα από το *tsa lung* ή το Τάι Τσι– ξεκλειδώνει το σώμα.\n* Εστιάζοντας στη βαρύτητα, το νευρικό σύστημα λαμβάνει το πρώτο μήνυμα ασφάλειας και γείωσης.",
        "**Η Αναπνοή ως Άνεμος / Το Πέπλο της Πνοής (Pranamaya Kosha)**\nΗ δεύτερη μπάμπουσκα είναι η πνοή.\n* Μια αργή εκπνοή από το στόμα στέλνει σήματα ασφαλείας μέσω του πνευμονογαστρικού νεύρου. Μειώνει την αντίδραση «πάλης ή φυγής», επιτρέποντας στον εγκέφαλο να ρίξει τις άμυνές του.",
        "**Ρυθμός & Εγκεφαλικά Κύματα / Τα Πέπλα του Νου (Manomaya Kosha)**\nΣε στιγμές υπερδιέγερσης, ο νους εκπέμπει χαοτικά κύματα Βήτα. Για να ησυχάσει αυτός ο θόρυβος, χρειαζόμαστε ρυθμό. Οι Σούφι, μέσα από ρυθμικές κινήσεις και την απαγγελία ιερών ήχων (*ζικρ*), συντονίζουν το νευρικό τους σύστημα με τη συχνότητα της αγάπης, φέρνοντας το κέντρο στην καρδιά.",
        "Νευρολογικά, αυτή η ενοποίηση προκαλεί τον **συγχρονισμό των δύο ημισφαιρίων**. Τα χαοτικά κύματα υποχωρούν για τα **κύματα Άλφα και Θήτα**. Η παρουσία γίνεται ολική και αβίαστη.",
        "**Ανοιχτός Χώρος, Μαχαμούντρα και «Μια Γεύση» (Anandamaya Kosha)**\nΌταν η ενέργεια ρέει ελεύθερα, παραμερίζουμε και το τελευταίο πέπλο. Εκεί βρίσκουμε τον Χώρο. Στην παράδοση της Μαχαμούντρα, αυτή η κατάσταση ονομάζεται **«Μια Γεύση» (One Taste)**. Δεν υπάρχει πλέον διαχωρισμός ανάμεσα στον παρατηρητή και το παρατηρούμενο, ανάμεσα στο «μέσα» και το «έξω». Τα πάντα –σκέψεις, ήχοι, συναισθήματα– έχουν την ίδια «γεύση» καθαρής επίγνωσης.",
        "Σε αυτό το σημείο, οι νευροεπιστήμονες παρατηρούν την έκρηξη των **κυμάτων Γάμμα**, που συνδέονται με την απόλυτη διαύγεια και την εμπειρία της Ενότητας.",
        "Δεν είσαι η μπάμπουσκα που βλέπεις απέξω. **Είσαι ο αέρας στην πιο μικρή μπάμπουσκα (στην καρδιά), που είναι αδιάσπαστα ενωμένος με τον άπειρο χώρο.** Σε αυτή την ανοιχτή επίγνωση, το μυαλό μπορεί να συνεχίσει να σκέφτεται, αλλά παύει να σε παρασύρει. Έχεις μάθει να ιππεύεις τον άνεμο.."
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
        <p className="text-white/40 text-sm md:text-base font-serif italic mb-10 text-center px-4 leading-relaxed">
          {language === 'en' 
            ? 'A collection of theoretical pieces, allegories, and insights from across the world charting the human path to the exploration of consciousness.'
            : 'Μια βιβλιοθήκη με θεωρητικά κείμενα, αλληγορίες και στοχασμούς από όλο τον κόσμο για την ανθρώπινη πορεία προς την εξερεύνηση της συνειδητότητας.'}
        </p>

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
                <h2 className="text-[20px] md:text-[24px] font-serif italic font-medium text-white/90 leading-snug tracking-tight group-hover:text-teal-100 transition-colors">{language === 'en' ? 'The Method & Symbols' : 'Η Μέθοδος & τα Σύμβολα'}</h2>
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/30 font-bold mt-1.5">{language === 'en' ? 'THE ELEPHANT & THE MONKEY' : 'Ο ΕΛΕΦΑΝΤΑΣ ΚΑΙ Η ΜΑΙΜΟΥ'}</p>
              </div>
            </div>
            <p className="text-white/50 text-sm md:text-[15px] leading-relaxed line-clamp-3 relative z-10 font-medium">
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
      </div>
    </div>
  );
}
