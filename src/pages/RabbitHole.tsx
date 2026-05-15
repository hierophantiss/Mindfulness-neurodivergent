import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ChevronLeft, ChevronRight, X, Play, Youtube, Info } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function RabbitHole() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
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
    videosTitle: language === 'en' ? 'Cinema of Consciousness' : 'Σινεμά της Συνειδητότητας',
    videosSubtitle: language === 'en' ? 'Visual insights and philosophical explorations' : 'Οπτικές αναζητήσεις και φιλοσοφικές εξερευνήσεις',
  };

  const videos = [
    {
      id: 'MJ6m5DOER-c', // Eckhart Tolle
      title: language === 'en' ? "Eckhart Tolle: The Ocean of Pure Awareness" : "Eckhart Tolle: Ο Ωκεανός της Καθαρής Επίγνωσης",
      author: "Eckhart Tolle",
      category: language === 'en' ? "Presence & Being" : "Παρουσία & Οντότητα",
      thumbnail: "https://img.youtube.com/vi/MJ6m5DOER-c/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "You are not just an isolated wave on the surface of life; you are the ocean itself manifesting for a moment as a wave. Eckhart Tolle guides us beyond the noise of the thinking mind to the discovery of our timeless essence: pure consciousness.",
        points: [
          { time: "02:42", title: "The Anatomy of 'Human Being'", text: "Tolle breaks the term in two. 'Human' is your form, body, and thoughts. 'Being' is your formless dimension, the pure presence connecting you with the whole." },
          { time: "05:21", title: "Observation without Labels", text: "To step out of thinking, look at a tree, a flower, or the sky without putting a mental label on it. This breaks the duality of subject/object." },
          { time: "07:03", title: "Inner Vitality (The Inner Body)", text: "Feel the energy and vitality pervading every cell of your body. This inner body awareness acts as your anchor to the present moment." }
        ],
        tip: "Body & Breath synchronize through Inner Body awareness. Attention is the ability to observe without labels. Space is the revelation of 'Being'.",
        bridge: "Space is the revelation of Being. Where the wave (personality) recedes and you realize you are the vast, quiet Ocean of Consciousness.",
        bridgeTime: 162
      } : {
        intro: "Δεν είσαι απλώς ένα απομονωμένο κύμα στην επιφάνεια της ζωής· είσαι ο ίδιος ο ωκεανός που εκδηλώνεται για λίγο ως κύμα. Ο Eckhart Tolle μας καθοδηγεί πέρα από τον θόρυβο του σκεπτόμενου νου, στην ανακάλυψη της άχρονης ουσίας μας: της καθαρής συνείδησης.",
        points: [
          { time: "02:42", title: "Η Ανατομία του 'Human Being'", text: "Ο Tolle σπάει τον όρο στα δύο. Το Human είναι η μορφή σου, το σώμα και οι σκέψεις σου. Το Being είναι η άμορφη διάσταση, η καθαρή παρουσία που σε συνδέει με το όλον." },
          { time: "05:21", title: "Παρατήρηση χωρίς Ετικέτες", text: "Για να βγεις από τη σκέψη, κοίταξε ένα δέντρο ή τον ουρανό χωρίς να του βάλεις νοητική ετικέτα (label). Αυτό σπάει τον δυισμό." },
          { time: "07:03", title: "Η Εσωτερική Ζωντάνια (The Inner Body)", text: "Νιώσε την ενέργεια που διαπερνά κάθε κύτταρο του σώματός σου. Αυτή η εσωτερική αίσθηση λειτουργεί ως η απόλυτη 'άγκυρα' για το Τώρα." }
        ],
        tip: "Σώμα & Αναπνοή: Ταυτίζονται με την Εσωτερική Ζωντάνια. Προσοχή: Η ικανότητα παρατήρησης χωρίς ετικέτες. Χώρος: Η αποκάλυψη του Being.",
        bridge: "Ο Χώρος είναι η αποκάλυψη του Being. Εκεί όπου το κύμα υποχωρεί και συνειδητοποιείς ότι είσαι ο απέραντος, ήσυχος Ωκεανός της Συνείδησης.",
        bridgeTime: 162
      }
    },
    {
      id: 'HDoAuilRt3Q', // Complete Breathing
      title: language === 'en' ? "Complete Breathing Experience" : "Η Βιωματική Εμπειρία της Πλήρους Αναπνοής",
      author: "Fabio Andrico",
      category: language === 'en' ? "Breath & Presence" : "Αναπνοή & Παρουσία",
      thumbnail: "https://img.youtube.com/vi/HDoAuilRt3Q/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "Complete breathing is not a theory or an idea to be forced—it is a natural state of flow that begins below the diaphragm. In this guide, Fabio Andrico introduces simple exercises that 'unlock' the breathing space, allowing the body and mind to synchronize automatically.",
        points: [
          { time: "03:19", title: "Observation without Judgment", text: "Before changing anything, simply observe your breath. How does the body react? How does the mind move? This simple awareness is the first step." },
          { time: "05:13", title: "Body Posture (Kneeling/Chair)", text: "Sitting on your knees (or a chair), lean forward with an aligned spine, placing your elbows in front of your knees. This natural geometry opens the lungs without needing to 'try' to breathe deeply." },
          { time: "12:51", title: "Opening the Space", text: "When we open space in the breath, we automatically open space in the body and mind. Our energy begins to flow freely, releasing tension." }
        ],
        tip: "Observe how the movement of the body 'sculpts' your breath, turning effort into a flowing, natural state of being.",
        bridge: "At [13:37], the teacher calls us to 'let go of everything'. You don't fix the body, you don't fix the breath, you don't fix the mind. You simply exist within Space.",
        bridgeTime: 817
      } : {
        intro: "Η πλήρης αναπνοή δεν είναι μια θεωρία ή μια ιδέα που πρέπει να εκτελέσεις με το ζόρι—είναι μια φυσική κατάσταση ροής που ξεκινά κάτω από το διάφραγμα. Σε αυτόν τον οδηγό, ο Fabio Andrico μας εισάγει σε απλές ασκήσεις που 'ξεκλειδώνουν' τον χώρο της αναπνοής, επιτρέποντας στο σώμα και στον νου να συντονιστούν αυτόματα.",
        points: [
          { time: "03:19", title: "Η Παρατήρηση χωρίς Κριτική", text: "Πριν αλλάξεις οτιδήποτε, απλώς παρατήρησε την αναπνοή σου. Πώς αντιδρά το σώμα; Πώς κινείται ο νους; Αυτή η απλή επίγνωση είναι το πρώτο βήμα." },
          { time: "05:13", title: "Η Στάση του Σώματος (Kneeling/Chair)", text: "Καθίζοντας στα γόνατα (ή σε μια καρέκλα), γέρνεις μπροστά με ευθυγραμμισμένη σπονδυλική στήλη, τοποθετώντας τους αγκώνες μπροστά από τα γόνατα. Αυτή η φυσική γεωμετρία ανοίγει τον χώρο στους πνεύμονες χωρίς να χρειάζεται να 'προσπαθήσεις' να αναπνεύσεις βαθιά." },
          { time: "12:51", title: "Το Άνοιγμα του Χώρου", text: "Όταν ανοίγουμε χώρο στην αναπνοή, ανοίγουμε αυτόματα χώρο στο σώμα και στον νου. Η ενέργειά μας αρχίζει να ρέει ελεύθερα, απελευθερώνοντας την ένταση." }
        ],
        tip: "Παρατήρησε πώς η ίδια η κίνηση του σώματος 'σμιλεύει' την αναπνοή σου, μετατρέποντας την προσπάθεια σε μια ρέουσα, φυσική κατάσταση ύπαρξης.",
        bridge: "Στο τέλος της άσκησης [13:37], ο δάσκαλος μας καλεί να 'αφήσουμε τα πάντα ελεύθερα' (let go of everything). Δεν διορθώνεις το σώμα, δεν διορθώνεις την αναπνοή, δεν διορθώνεις τον νου. Απλώς υπάρχεις μέσα στον Χώρο.",
        bridgeTime: 817
      }
    },
    {
      id: 'H6Y8eG6iZ6Q', // Open Focus - Les Fehmi
      title: language === 'en' ? "Effortless Awareness" : "Άκοπη Επίγνωση",
      author: "Dr. Les Fehmi",
      category: language === 'en' ? "Neuroscience" : "Νευροεπιστήμη",
      thumbnail: "https://img.youtube.com/vi/H6Y8eG6iZ6Q/maxresdefault.jpg"
    },
    {
      id: 'i1z6L1IsZlg', // Yantra Yoga
      title: language === 'en' ? "Yantra Yoga: The 8 Movements" : "Yantra Yoga: Οι 8 Κινήσεις",
      author: "Chögyal Namkhai Norbu",
      category: language === 'en' ? "Yoga & Energy" : "Yoga & Ενέργεια",
      thumbnail: "https://img.youtube.com/vi/i1z6L1IsZlg/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "In the Yantra Yoga tradition, body, breath, and mind are inextricably linked. This ancient guide presents the 8 fundamental movements (Andrico), which are not simple physical exercises, but a tool for the full coordination of our vital energy (Prana).",
        points: [
          { time: "07:55", title: "The Bottle Analogy", text: "Learn to breathe 'filling from the bottom up', like water falling into a bottle (diaphragmatic and full breath)." },
          { time: "17:43", title: "The 8 Movements", text: "Each of the 8 movements has a specific rhythm and pattern (usually in 4-second counts), guiding inhalation, retention, and exhalation without pressure." },
          { time: "04:33", title: "Impact on Mind", text: "Body movement is used to calm energy, and balanced energy is what ultimately brings the mind to a natural state of peace and clear awareness (Space)." }
        ],
        tip: "Observe how the movement of the body 'sculpts' your breath, turning effort into a flowing, natural state of being.",
        bridge: "At [55:06], the teacher mentions 'Let go of everything' (body, breath, mind) — the perfect bridge to the Space Axis!",
        bridgeTime: 3306
      } : {
        intro: "Στην παράδοση της Yantra Yoga, το σώμα, η αναπνοή και ο νους είναι άρρηκτα συνδεδεμένα. Αυτός ο αρχαίος οδηγός παρουσιάζει τις 8 θεμελιώδεις κινήσεις (Andrico), οι οποίες δεν αποτελούν απλές σωματικές ασκήσεις, αλλά ένα εργαλείο για τον πλήρη συντονισμό της ζωτικής μας ενέργειας (Prana).",
        points: [
          { time: "07:55", title: "Η Αναλογία της Φιάλης", text: "Μαθαίνεις να αναπνέεις 'γεμίζοντας από κάτω προς τα πάνω', όπως το νερό που πέφτει σε ένα μπουκάλι (διαφραγματική και πλήρης αναπνοή)." },
          { time: "17:43", title: "Οι 8 Κινήσεις", text: "Κάθε μία από τις 8 κινήσεις έχει έναν συγκεκριμένο ρυθμό και μοτίβο (συνήθως σε μετρήσεις των 4 δευτερολέπτων), που καθοδηγεί την εισπνοή, το κράτημα και την εκπνοή χωρίς πίεση." },
          { time: "04:33", title: "Η Επίδραση στον Νου", text: "Η κίνηση του σώματος χρησιμοποιείται για να ηρεμήσει η ενέργεια, και η ισορροπημένη ενέργεια είναι αυτή που τελικά φέρνει τον νου σε μια φυσική κατάσταση γαλήνης και καθαρής επίγνωσης (Χώρος)." }
        ],
        tip: "Παρατήρησε πώς η ίδια η κίνηση του σώματος 'σμιλεύει' την αναπνοή σου, μετατρέποντας την προσπάθεια σε μια ρέουσα, φυσική κατάσταση ύπαρξης.",
        bridge: "Στο τέλος του βίντεο [55:06] ο δάσκαλος αναφέρει το 'Let go of everything' — την τέλεια γέφυρα για τον Άξονα του Χώρου!",
        bridgeTime: 3306
      }
    }
  ];

  const articles = [
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
      <div className="fixed inset-0 z-[9999] bg-[#0f1117] text-white flex flex-col animate-in fade-in duration-300">
        
        {/* Top Progress Bar & Header */}
        <div className="pt-safe px-4 pb-3 flex items-center justify-between border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-md relative z-20">
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
      <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
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
            className="w-full md:col-span-2 bg-[#12141c] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl block text-left transition-all duration-300 active:scale-[0.98] hover:bg-white/[0.04] hover:border-teal-500/20 relative overflow-hidden group"
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
            const isNew = article.id === 'koshas-veils';
            return (
              <button 
                key={article.id}
                onClick={() => { setActiveArticle(article.id); setCurrentPage(0); }}
                className={`w-full border rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col text-left transition-all duration-300 active:scale-[0.98] hover:shadow-2xl relative overflow-hidden group ${
                  isNew 
                    ? 'bg-[#12141c] border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-950/20' 
                    : 'bg-[#12141c] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
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

          {/* Section Header for Videos */}
          <div className="md:col-span-2 pt-16 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 shadow-inner">
                <Youtube size={20} />
              </div>
              <div>
                <h2 className="text-[22px] md:text-[28px] font-serif italic font-medium text-white/90 leading-tight">{t.videosTitle}</h2>
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/30 font-bold mt-1">{t.videosSubtitle}</p>
              </div>
            </div>
          </div>

          {videos.map((video) => (
            <button 
              key={video.id}
              onClick={() => {
                setActiveVideo(video.id);
                setVideoStartTime(0);
              }}
              className="group relative aspect-video bg-[#12141c] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-teal-500/30 active:scale-[0.98] shadow-lg"
            >
              <div className="absolute inset-0 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 bg-center bg-cover" style={{ backgroundImage: `url(${video.thumbnail})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/40 to-transparent group-hover:via-[#0f1117]/20 transition-all duration-500" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transform group-hover:scale-110 group-hover:bg-teal-500/80 group-hover:border-teal-400/50 transition-all duration-500">
                  <Play size={28} className="ml-1" fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">
                    {video.category}
                  </span>
                </div>
                <h3 className="text-[16px] md:text-[18px] font-serif italic text-white/90 leading-snug group-hover:text-white transition-colors">{video.title}</h3>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mt-1 font-bold">{video.author}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Portal Modal */}
      {activeVideo && createPortal(
        <div className="fixed inset-0 z-[10000] bg-[#0f1117] flex flex-col animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
          {/* Header Bar */}
          <div className="flex-none flex items-center justify-between px-6 h-20 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Youtube size={16} />
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

          <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
            {/* Player Container */}
            <div className="flex-[2] space-y-6">
              <div className="w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10 relative group">
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

              <div className="hidden md:block">
                 <h2 className="text-3xl md:text-4xl font-serif italic text-white/95 mb-2">
                   {videos.find(v => v.id === activeVideo)?.title}
                 </h2>
                 <p className="text-lg text-white/30 font-medium font-serif italic">
                   {videos.find(v => v.id === activeVideo)?.author}
                 </p>
              </div>
            </div>

            {/* Description / Insights Sidebar */}
            <div className="flex-1 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-300">
              {(() => {
                const videoData = videos.find(v => v.id === activeVideo);
                if (videoData?.description) {
                  const desc = videoData.description;
                  return (
                    <div className="space-y-8 pb-12">
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

                      <div className="space-y-4">
                        <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-all group">
                           <button 
                             onClick={() => setVideoStartTime(desc.bridgeTime)}
                             className="text-[13px] font-serif italic text-white/80 leading-relaxed text-center group-hover:text-white transition-colors block w-full mb-4 cursor-pointer outline-none"
                           >
                              "{desc.bridge}"
                           </button>
                           <Link 
                             to="/practice"
                             className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                           >
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                 {language === 'el' ? 'ΜΕΤΑΒΑΣΗ ΣΤΟΝ ΧΩΡΟ' : 'BRIDGE TO SPACE'}
                              </span>
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-6">
                    <div className="md:hidden">
                       <h2 className="text-2xl font-serif italic text-white/95 mb-2">
                         {videoData?.title}
                       </h2>
                       <p className="text-sm text-white/30 font-medium">
                         {videoData?.author} • {videoData?.category}
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
