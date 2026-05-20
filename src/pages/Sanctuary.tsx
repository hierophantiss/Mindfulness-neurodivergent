import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Wind, CloudRain, TreePine, Moon, ChevronLeft, Volume2, Timer, Info, Play, Youtube, X, ChevronRight, Music, Sparkles, Droplets, Flame, Film, Headphones } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';
import { useBinauralAudio } from '../hooks/useBinauralAudio';

export const sleepTracks = [
  // Sleep & Meditation Audio (The new files)
  { id: 'calming-zen', group: 'music', icon: Sparkles, label: { el: 'Ήρεμο Zen', en: 'Calming Zen' }, subtitle: { el: 'Απόλυτη Χαλάρωση', en: 'Absolute Relaxation' }, color: 'text-emerald-400', disableSynth: true, files: ['/music/atlasaudio-calming-zen-519422.mp3'] },
  { id: 'sleep-963', group: 'music', icon: Music, label: { el: 'Συχνότητα Ύπνου', en: 'Sleep Frequency' }, subtitle: { el: '963Hz Τοπίο', en: '963Hz Landscape' }, color: 'text-purple-400', disableSynth: true, files: ['/music/meditativetiger-sleep-music-963-hz-binaural-immersive-audio-426673.mp3'] },
  { id: 'beta-pure', group: 'music', icon: Wind, label: { el: 'Ισοχρονικός Τόνος', en: 'Isochronic Tone' }, subtitle: { el: 'Beta 20Hz', en: 'Beta 20Hz' }, color: 'text-rose-400', disableSynth: true, files: ['/music/purebinaural-purebinaural-20-hz-beta-isochronic-tones-pure-tone-496540.mp3'] },

  // Mixed Binaural & Nature
  { id: 'delta-pure', group: 'binaural', icon: Waves, label: { el: 'Delta Κύματα', en: 'Delta Waves' }, subtitle: { el: 'Βαθύς Ύπνος (Σκέτα)', en: 'Deep Sleep (Pure)' }, color: 'text-cyan-500', base: 100, beat: 2.5, pulse: 0.05, files: [] },
  { id: 'delta-cat', group: 'binaural', icon: Moon, label: { el: 'Delta & Γουργουρητό', en: 'Delta & Cat Purr' }, subtitle: { el: 'Θεραπεία & Ηρεμία', en: 'Healing & Calm' }, color: 'text-amber-500', base: 100, beat: 2.5, pulse: 0.05, files: ['/music/cat-purring-.mp3'] },
  { id: 'rain-theta', group: 'binaural', icon: CloudRain, label: { el: 'Βροχή & Theta', en: 'Rain & Theta' }, subtitle: { el: 'Χαλάρωση (6.3Hz)', en: 'Relaxation (6.3Hz)' }, color: 'text-indigo-500', base: 136.1, beat: 6.3, pulse: 0.1, files: ['/music/binaural-beats-25-hz-delta-with-rain-.mp3'] },
];

export default function Sanctuary() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');
  
  const [activeSound, setActiveSound] = useState<string | null>(() => {
    return searchParams.get('track') || null;
  });
  
  const [volume, setVolume] = useState(1.0);
  const [isDimmed, setIsDimmed] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const [mantraStep, setMantraStep] = useState<number>(0);
  const [activeAttentionStyles, setActiveAttentionStyles] = useState<string[]>([]);
  const [isVoidActive, setIsVoidActive] = useState(false);

  const videos = [
    // ... we keep exactly the same videos list ...
    {
      id: 'j1OOEwpLcDc', // Eckhart Tolle - Night Sky
      title: language === 'en' ? "Micro-Meditation: The Infinity of Space" : "Micro-Meditation: Η Απεραντότητα του Χώρου",
      author: "Eckhart Tolle",
      category: language === 'en' ? "Space & Emptiness" : "Χώρος & Κενό",
      thumbnail: "https://img.youtube.com/vi/j1OOEwpLcDc/maxresdefault.jpg",
      isSpaceMeditation: true,
      description: language === 'en' ? {
        intro: "In this teaching, Eckhart Tolle invites us to look at the night sky not for the stars, but for the vast space that contains them. A practice of connecting external space with the quiet dimension within.",
        points: [
          { time: "00:00", title: "Common Nature", text: "Focusing on external space connects you automatically with your internal space. There is a common quality of stillness and freedom." },
          { time: "00:21", title: "The Night Sky Analogy", text: "When you look at the night sky, what is most awesome is not the stars, but the vast expanse of space itself." },
          { time: "01:00", title: "The Presence of Void", text: "The most inconceivable of all is the vastness of space that allows everything to exist." }
        ],
        tip: "Space: Don't look AT the stars, look AT the space between them. Feel the same space between your thoughts.",
        bridge: "The space between stars is the same as the stillness within you.",
        bridgeTime: 21
      } : {
        intro: "Σε αυτή τη διδασκαλία, ο Eckhart Tolle μας καλεί να κοιτάξουμε τον νυχτερινό ουρανό όχι για τα αστέρια, αλλά για τον απέραντο χώρο που τα περιέχει. Μια πρακτική σύνδεσης του εξωτερικού χώρου με την ήσυχη διάσταση μέσα μας.",
        points: [
          { time: "00:00", title: "Η Κοινή Φύση", text: "Εστιάζοντας στον εξωτερικό χώρο, συνδέεσαι αυτόματα με τον εσωτερικό σου χώρο. Υπάρχει μια κοινή ποιότητα ησυχίας και ελευθερίας." },
          { time: "00:21", title: "Η Αναλογία του Νυχτερινού Ουρανού", text: "Όταν κοιτάζεις τον νυχτερινό ουρανό, αυτό που προκαλεί το μεγαλύτερο δέος δεν είναι τα αστέρια, αλλά η απέραντη έκταση του ίδιου του χώρου." },
          { time: "01:00", title: "Η Ύπαρξη του Κενού", text: "Το πιο ασύλληπτο από όλα είναι η απέραντη έκταση του ίδιου του χώρου που περιέχει όλα αυτά τα σώματα και τους επιτρέπει να υπάρχουν." }
        ],
        tip: "Χώρος: Μην κοιτάς ΤΑ αστέρια, κοίτα ΤΟΝ χώρο ανάμεσά τους. Νιώσε τον ίδιο χώρο ανάμεσα στις σκέψεις σου.",
        bridge: "Ο χώρος ανάμεσα στα αστέρια είναι η ίδια η σιωπή που υπάρχει μέσα σου.",
        bridgeTime: 21
      }
    },
    {
      id: 'MJ6m5DOER-c',
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
      id: '7Qbat52NE98',
      title: language === 'en' ? "Tai Chi Walking: Grounding Motion" : "Tai Chi Walking: Η Κίνηση της Γείωσης",
      author: "Master Gu",
      category: language === 'en' ? "Grounding & Motion" : "Γείωση & Κίνηση",
      thumbnail: "https://img.youtube.com/vi/7Qbat52NE98/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "Conscious walking through Tai Chi is a powerful grounding practice. Using the geometry of the feet and the transfer of weight, you return to the 'here and now'.",
        points: [
          { time: "01:10", title: "The Open Stance (Keeping the Qua Open)", text: "Start with toes slightly out and knees 'soft'. This protects joints and creates a stable, agile base." },
          { time: "01:52", title: "Weight Transfer (Heel-Toes-Weight)", text: "Every step is a conscious choice: heel first, then toes of the 'empty' foot [02:07], then transfer weight." },
          { time: "09:24", title: "The Flow Mantra", text: "Follow the rhythmic mantra: 'Heel, toes, forward, backward, out, tap' [09:26] to anchor your attention." }
        ],
        tip: "Observe how the rhythmic contact with the earth instantly stills the horizontal monkey mind.",
        bridge: "At the end [11:15], pause and observe the clarity and grounding of the present moment.",
        bridgeTime: 675,
        mantra: ["HEEL", "TOES", "FORWARD", "BACKWARD", "OUT", "TAP"],
        mantraEL: ["ΦΤΕΡΝΑ", "ΔΑΧΤΥΛΑ", "ΜΠΡΟΣΤΑ", "ΠΙΣΩ", "ΕΞΩ", "TAP"]
      } : {
        intro: "Η ενσυνείδητη βάδιση μέσω του Tai Chi είναι μια ισχυρή πρακτική γείωσης. Χρησιμοποιώντας τη γεωμετρία των ποδιών και τη μεταφορά του βάρους, επιστρέφεις στο 'εδώ και τώρα'.",
        points: [
          { time: "01:10", title: "Η Ανοιχτή Στάση (Keeping the Qua Open)", text: "Ξεκινάς με τα δάχτυλα των ποδιών στραμμένα ελαφρώς προς τα έξω και τα γόνατα 'μαλακά'. Αυτό δημιουργεί μια σταθερή βάση." },
          { time: "01:52", title: "Η Μεταφορά του Βάρους (Heel-Toes-Weight)", text: "Κάθε βήμα είναι συνειδητή επιλογή: ακουμπάς φτέρνα, μετά δάχτυλα του 'άδειου' ποδιού [02:07] και μετά βάρος." },
          { time: "09:24", title: "Η Μάντρα της Ροής", text: "Ακολούθησε τη ρυθμική μάντρα: «Φτέρνα, δάχτυλα, μπροστά, πίσω, έξω, tap» [09:26] για να γειώσεις την προσοχή." }
        ],
        tip: "Παρατήρησε πώς η ρυθμική επαφή με τη γη σταματά αμέσως την οριζόντια περιπλάνηση του νου.",
        bridge: "Στο τέλος [11:15], σταμάτησε και παρατήρησε την καθαρότητα και τη γείωση της παρούσας στιγμής.",
        bridgeTime: 675,
        mantra: ["HEEL", "TOES", "FORWARD", "BACKWARD", "OUT", "TAP"],
        mantraEL: ["ΦΤΕΡΝΑ", "ΔΑΧΤΥΛΑ", "ΜΠΡΟΣΤΑ", "ΠΙΣΩ", "ΕΞΩ", "TAP"]
      }
    },
    {
      id: 'no4x4ewf1dM',
      title: language === 'en' ? "Plum Village: The 10 Mindful Movements" : "Plum Village: Οι 10 Ενσυνείδητες Κινήσεις",
      author: "Plum Village",
      category: language === 'en' ? "Mindfulness & Motion" : "Ενσυνειδητότητα & Κίνηση",
      thumbnail: "https://img.youtube.com/vi/no4x4ewf1dM/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "The 10 Mindful Movements from the Plum Village tradition are a series of simple, flowing exercises that turn physical motion into living meditation. Each movement is designed to bring attention back to the body and regulate the breath.",
        points: [
          { time: "00:14", title: "Posture of Presence", text: "The exercise begins with a quiet, steady posture. Learn to stand with awareness, feeling the connection with the ground." },
          { time: "00:28", title: "Coordination of Motion & Breath", text: "Every physical movement is guided by the breath. When hands go up, you inhale; when down, you exhale." },
          { time: "01:05", title: "The Mental Mantra", text: "As you perform the movements, the mind quiets following the simple flow: 'Inhaling, I know I am inhaling. Exhaling, I know I am exhaling.'" }
        ],
        tip: "Space: At the end of each movement, return to the steady stance [01:19], feeling the quiet, open space created within.",
        bridge: "Return to the stance of presence. Feel the silence within.",
        bridgeTime: 79,
        movements: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Movement ${i + 1}`,
          nameEL: `Κίνηση ${i + 1}`,
        }))
      } : {
        intro: "Οι 10 Ενσυνείδητες Κινήσεις από την παράδοση του Plum Village είναι μια σειρά απλών, ρέουσων ασκήσεων που μετατρέπουν τη σωματική κίνηση σε ζωντανό διαλογισμό. Κάθε κίνηση είναι σχεδιασμένη για να επαναφέρει την προσοχή στο σώμα, να ρυθμίσει την αναπνοή και να ανοίξει τον εσωτερικό μας χώρο.",
        points: [
          { time: "00:14", title: "Η Στάση της Παρουσίας", text: "Η άσκηση ξεκινά με μια ήσυχη, σταθερή στάση του σώματος. Μαθαίνουμε να στεκόμαστε με επίγνωση, νιώθοντας τη σύνδεση με το έδαφος." },
          { time: "00:28", title: "Ο Συντονισμός Κίνησης & Πνοής", text: "Κάθε σωματική κίνηση καθοδηγείται από την αναπνοή. Όταν τα χέρια ανεβαίνουν, εισπνέουμε· όταν κατεβαίνουν, εκπνέουμε." },
          { time: "01:05", title: "Η Μάντρα του Νου", text: "Καθώς εκτελείς τις κινήσεις, ο νους ησυχάζει ακολουθώντας την απλή, εσωτερική ροή: «Εισπνέω, ξέρω ότι εισπνέω. Εκπνέω, ξέρω ότι εκπνέω»." }
        ],
        tip: "Χώρος: Στο τέλος κάθε κίνησης, επιστρέφεις στη σταθερή στάση [01:19], νιώθοντας τον ήσυχο, ανοιχτό χώρο που έχει δημιουργηθεί μέσα σου και γύρω σου.",
        bridge: "Επιστροφή στη στάση της παρουσίας. Νιώσε τη σιωπή μέσα σου.",
        bridgeTime: 79,
        movements: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Movement ${i + 1}`,
          nameEL: `Κίνηση ${i + 1}`,
        }))
      }
    },
    {
      id: 'HDoAuilRt3Q',
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
      id: 'tmgHDEypPAQ',
      title: language === 'en' ? "Open Focus: The Neuroscience of Diffuse Attention" : "Open Focus: Η Νευροεπιστήμη της Διάχυτης Προσοχής",
      author: "Dr. Les Fehmi",
      category: language === 'en' ? "Neuroscience & Attention" : "Νευροεπιστήμη & Προσοχή",
      thumbnail: "https://img.youtube.com/vi/tmgHDEypPAQ/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "When you try to focus persistently and narrowly (Narrow Focus), your nervous system unconsciously activates a 'fight or flight' state [01:00]. Open Focus teaches us that by changing how we attend, we can instantly change our biology.",
        points: [
          { time: "01:00", title: "Narrow Focus & Stress", text: "Persistent narrow focus increases cortisol and muscle tension, trapping us in a state of chronic alarm." },
          { time: "01:32", title: "Brain Wave Rhythms", text: "Changing focus style slows down brain waves, making them rhythmic and synchronous." },
          { time: "05:13", title: "Awareness of Awareness", text: "The peak state where you are aware of the process of being aware, leading to absolute clarity." }
        ],
        tip: "Space: Shift from 'Doing' [05:51] to authentic 'Being'. It is the essence of the Space Axis.",
        bridge: "When you combine all attention styles [05:06], the mind passes from effort to pure existence.",
        bridgeTime: 306,
        attentionStyles: [
          { id: 'narrow', name: 'Narrow Focus', nameEL: 'Στενή Προσοχή', time: '01:00', desc: 'Single object, excluding all else.', descEL: 'Εστίαση σε ένα μόνο αντικείμενο, αποκλείοντας όλα τα άλλα.' },
          { id: 'diffuse', name: 'Diffuse Focus', nameEL: 'Διάχυτη Προσοχή', time: '02:21', desc: 'Including space, sounds, and sensations.', descEL: 'Συμπερίληψη του χώρου, των ήχων και των αισθήσεων γύρω μας.' },
          { id: 'immersed', name: 'Immersed Focus', nameEL: 'Απορροφημένη Προσοχή', time: '02:29', desc: 'Full union with the experience (e.g., dance, a hug).', descEL: 'Πλήρης εμβάθυνση και ένωση με την εμπειρία (π.χ. χορός, μια αγκαλιά).' },
          { id: 'separate', name: 'Separate Focus', nameEL: 'Αποστασιοποιημένη Προσοχή', time: '02:54', desc: 'Observation from a distance, like an objective judge.', descEL: 'Παρατήρηση από απόσταση, σαν αντικειμενικός κριτής.' }
        ]
      } : {
        intro: "Όταν προσπαθείς να εστιάσεις επίμονα και στενά (Narrow Focus), το νευρικό σου σύστημα ενεργοποιεί ασυνείδητα την κατάσταση 'μάχης ή φυγής' [01:00]. Η μέθοδος του Open Focus μας διδάσκει ότι αλλάζοντας τον τρόπο που προσέχουμε, αλλάζουμε αμέσως τη βιολογία μας.",
        points: [
          { time: "01:00", title: "Στενή Προσοχή & Στρες", text: "Η επίμονη στενή εστίαση αυξάνει την κορτιζόλη και την ένταση, παγιδεύοντάς μας σε μια κατάσταση συναγερμού." },
          { time: "01:32", title: "Ρυθμοί Εγκεφαλικών Κυμάτων", text: "Η αλλαγή στυλ προσοχής επιβραδύνει τα εγκεφαλικά κύματα, κάνοντάς τα ρυθμικά και συγχρονισμένα." },
          { time: "05:13", title: "Επίγνωση της Επίγνωσης", text: "Η κορυφαία κατάσταση όπου έχεις επίγνωση της ίδιας της διαδικασίας της επίγνωσης." }
        ],
        tip: "Χώρος: Πέρασμα από το κουραστικό 'κάνω' [05:51] στο αυθεντικό 'είμαι'. Είναι η ουσία του Άξονα του Χώρου.",
        bridge: "Όταν συνδυάζεις και τα 4 στυλ ταυτόχρονα [05:06], ο νους περνά από την προσπάθεια στην καθαρή ύπαρξη.",
        bridgeTime: 306,
        attentionStyles: [
          { id: 'narrow', name: 'Narrow Focus', nameEL: 'Στενή Προσοχή', time: '01:00', desc: 'Single object, excluding all else.', descEL: 'Εστίαση σε ένα μόνο αντικείμενο, αποκλείοντας όλα τα άλλα.' },
          { id: 'diffuse', name: 'Diffuse Focus', nameEL: 'Διάχυτη Προσοχή', time: '02:21', desc: 'Including space, sounds, and sensations.', descEL: 'Συμπερίληψη του χώρου, των ήχων και των αισθήσεων γύρω μας.' },
          { id: 'immersed', name: 'Immersed Focus', nameEL: 'Απορροφημένη Προσοχή', time: '02:29', desc: 'Full union with the experience (e.g., dance, a hug).', descEL: 'Πλήρης εμβάθυνση και ένωση με την εμπειρία (π.χ. χορός, μια αγκαλιά).' },
          { id: 'separate', name: 'Separate Focus', nameEL: 'Αποστασιοποιημένη Προσοχή', time: '02:54', desc: 'Observation from a distance, like an objective judge.', descEL: 'Παρατήρηση από απόσταση, σαν αντικειμενικός κριτής.' }
        ]
      }
    },
    {
      id: 'i1z6L1IsZlg',
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

  const activeTrackDef = useMemo(() => sleepTracks.find(t => t.id === activeSound), [activeSound]);

  // Handle playing state
  const { startAudio, stopAudio, isPlaying, setGlobalVolume } = useBinauralAudio({
    base: activeTrackDef?.base || 110,
    beat: activeTrackDef?.beat || 6.3,
    pulse: activeTrackDef?.pulse || 0.1,
    disableSynth: activeTrackDef?.disableSynth,
    ambientLayers: activeTrackDef?.files || []
  });

  useEffect(() => {
    setGlobalVolume(volume);
  }, [volume, setGlobalVolume]);

  // Handle deep-linked audio start
  useEffect(() => {
    if (activeSound) {
      const trackDef = sleepTracks.find(t => t.id === activeSound);
      if (trackDef) {
        startAudio({
          base: trackDef.base || 110,
          beat: trackDef.beat || 6.3,
          pulse: trackDef.pulse || 0.1,
          disableSynth: trackDef.disableSynth,
          ambientLayers: trackDef.files || []
        });
      }
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      stopAudio();
      setActiveSound(null);
      setTimeLeft(null);
      setTimer(null);
    }
    
  const videos = [
    // ... we keep exactly the same videos list ...
    {
      id: 'j1OOEwpLcDc', // Eckhart Tolle - Night Sky
      title: language === 'en' ? "Micro-Meditation: The Infinity of Space" : "Micro-Meditation: Η Απεραντότητα του Χώρου",
      author: "Eckhart Tolle",
      category: language === 'en' ? "Space & Emptiness" : "Χώρος & Κενό",
      thumbnail: "https://img.youtube.com/vi/j1OOEwpLcDc/maxresdefault.jpg",
      isSpaceMeditation: true,
      description: language === 'en' ? {
        intro: "In this teaching, Eckhart Tolle invites us to look at the night sky not for the stars, but for the vast space that contains them. A practice of connecting external space with the quiet dimension within.",
        points: [
          { time: "00:00", title: "Common Nature", text: "Focusing on external space connects you automatically with your internal space. There is a common quality of stillness and freedom." },
          { time: "00:21", title: "The Night Sky Analogy", text: "When you look at the night sky, what is most awesome is not the stars, but the vast expanse of space itself." },
          { time: "01:00", title: "The Presence of Void", text: "The most inconceivable of all is the vastness of space that allows everything to exist." }
        ],
        tip: "Space: Don't look AT the stars, look AT the space between them. Feel the same space between your thoughts.",
        bridge: "The space between stars is the same as the stillness within you.",
        bridgeTime: 21
      } : {
        intro: "Σε αυτή τη διδασκαλία, ο Eckhart Tolle μας καλεί να κοιτάξουμε τον νυχτερινό ουρανό όχι για τα αστέρια, αλλά για τον απέραντο χώρο που τα περιέχει. Μια πρακτική σύνδεσης του εξωτερικού χώρου με την ήσυχη διάσταση μέσα μας.",
        points: [
          { time: "00:00", title: "Η Κοινή Φύση", text: "Εστιάζοντας στον εξωτερικό χώρο, συνδέεσαι αυτόματα με τον εσωτερικό σου χώρο. Υπάρχει μια κοινή ποιότητα ησυχίας και ελευθερίας." },
          { time: "00:21", title: "Η Αναλογία του Νυχτερινού Ουρανού", text: "Όταν κοιτάζεις τον νυχτερινό ουρανό, αυτό που προκαλεί το μεγαλύτερο δέος δεν είναι τα αστέρια, αλλά η απέραντη έκταση του ίδιου του χώρου." },
          { time: "01:00", title: "Η Ύπαρξη του Κενού", text: "Το πιο ασύλληπτο από όλα είναι η απέραντη έκταση του ίδιου του χώρου που περιέχει όλα αυτά τα σώματα και τους επιτρέπει να υπάρχουν." }
        ],
        tip: "Χώρος: Μην κοιτάς ΤΑ αστέρια, κοίτα ΤΟΝ χώρο ανάμεσά τους. Νιώσε τον ίδιο χώρο ανάμεσα στις σκέψεις σου.",
        bridge: "Ο χώρος ανάμεσα στα αστέρια είναι η ίδια η σιωπή που υπάρχει μέσα σου.",
        bridgeTime: 21
      }
    },
    {
      id: 'MJ6m5DOER-c',
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
      id: '7Qbat52NE98',
      title: language === 'en' ? "Tai Chi Walking: Grounding Motion" : "Tai Chi Walking: Η Κίνηση της Γείωσης",
      author: "Master Gu",
      category: language === 'en' ? "Grounding & Motion" : "Γείωση & Κίνηση",
      thumbnail: "https://img.youtube.com/vi/7Qbat52NE98/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "Conscious walking through Tai Chi is a powerful grounding practice. Using the geometry of the feet and the transfer of weight, you return to the 'here and now'.",
        points: [
          { time: "01:10", title: "The Open Stance (Keeping the Qua Open)", text: "Start with toes slightly out and knees 'soft'. This protects joints and creates a stable, agile base." },
          { time: "01:52", title: "Weight Transfer (Heel-Toes-Weight)", text: "Every step is a conscious choice: heel first, then toes of the 'empty' foot [02:07], then transfer weight." },
          { time: "09:24", title: "The Flow Mantra", text: "Follow the rhythmic mantra: 'Heel, toes, forward, backward, out, tap' [09:26] to anchor your attention." }
        ],
        tip: "Observe how the rhythmic contact with the earth instantly stills the horizontal monkey mind.",
        bridge: "At the end [11:15], pause and observe the clarity and grounding of the present moment.",
        bridgeTime: 675,
        mantra: ["HEEL", "TOES", "FORWARD", "BACKWARD", "OUT", "TAP"],
        mantraEL: ["ΦΤΕΡΝΑ", "ΔΑΧΤΥΛΑ", "ΜΠΡΟΣΤΑ", "ΠΙΣΩ", "ΕΞΩ", "TAP"]
      } : {
        intro: "Η ενσυνείδητη βάδιση μέσω του Tai Chi είναι μια ισχυρή πρακτική γείωσης. Χρησιμοποιώντας τη γεωμετρία των ποδιών και τη μεταφορά του βάρους, επιστρέφεις στο 'εδώ και τώρα'.",
        points: [
          { time: "01:10", title: "Η Ανοιχτή Στάση (Keeping the Qua Open)", text: "Ξεκινάς με τα δάχτυλα των ποδιών στραμμένα ελαφρώς προς τα έξω και τα γόνατα 'μαλακά'. Αυτό δημιουργεί μια σταθερή βάση." },
          { time: "01:52", title: "Η Μεταφορά του Βάρους (Heel-Toes-Weight)", text: "Κάθε βήμα είναι συνειδητή επιλογή: ακουμπάς φτέρνα, μετά δάχτυλα του 'άδειου' ποδιού [02:07] και μετά βάρος." },
          { time: "09:24", title: "Η Μάντρα της Ροής", text: "Ακολούθησε τη ρυθμική μάντρα: «Φτέρνα, δάχτυλα, μπροστά, πίσω, έξω, tap» [09:26] για να γειώσεις την προσοχή." }
        ],
        tip: "Παρατήρησε πώς η ρυθμική επαφή με τη γη σταματά αμέσως την οριζόντια περιπλάνηση του νου.",
        bridge: "Στο τέλος [11:15], σταμάτησε και παρατήρησε την καθαρότητα και τη γείωση της παρούσας στιγμής.",
        bridgeTime: 675,
        mantra: ["HEEL", "TOES", "FORWARD", "BACKWARD", "OUT", "TAP"],
        mantraEL: ["ΦΤΕΡΝΑ", "ΔΑΧΤΥΛΑ", "ΜΠΡΟΣΤΑ", "ΠΙΣΩ", "ΕΞΩ", "TAP"]
      }
    },
    {
      id: 'no4x4ewf1dM',
      title: language === 'en' ? "Plum Village: The 10 Mindful Movements" : "Plum Village: Οι 10 Ενσυνείδητες Κινήσεις",
      author: "Plum Village",
      category: language === 'en' ? "Mindfulness & Motion" : "Ενσυνειδητότητα & Κίνηση",
      thumbnail: "https://img.youtube.com/vi/no4x4ewf1dM/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "The 10 Mindful Movements from the Plum Village tradition are a series of simple, flowing exercises that turn physical motion into living meditation. Each movement is designed to bring attention back to the body and regulate the breath.",
        points: [
          { time: "00:14", title: "Posture of Presence", text: "The exercise begins with a quiet, steady posture. Learn to stand with awareness, feeling the connection with the ground." },
          { time: "00:28", title: "Coordination of Motion & Breath", text: "Every physical movement is guided by the breath. When hands go up, you inhale; when down, you exhale." },
          { time: "01:05", title: "The Mental Mantra", text: "As you perform the movements, the mind quiets following the simple flow: 'Inhaling, I know I am inhaling. Exhaling, I know I am exhaling.'" }
        ],
        tip: "Space: At the end of each movement, return to the steady stance [01:19], feeling the quiet, open space created within.",
        bridge: "Return to the stance of presence. Feel the silence within.",
        bridgeTime: 79,
        movements: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Movement ${i + 1}`,
          nameEL: `Κίνηση ${i + 1}`,
        }))
      } : {
        intro: "Οι 10 Ενσυνείδητες Κινήσεις από την παράδοση του Plum Village είναι μια σειρά απλών, ρέουσων ασκήσεων που μετατρέπουν τη σωματική κίνηση σε ζωντανό διαλογισμό. Κάθε κίνηση είναι σχεδιασμένη για να επαναφέρει την προσοχή στο σώμα, να ρυθμίσει την αναπνοή και να ανοίξει τον εσωτερικό μας χώρο.",
        points: [
          { time: "00:14", title: "Η Στάση της Παρουσίας", text: "Η άσκηση ξεκινά με μια ήσυχη, σταθερή στάση του σώματος. Μαθαίνουμε να στεκόμαστε με επίγνωση, νιώθοντας τη σύνδεση με το έδαφος." },
          { time: "00:28", title: "Ο Συντονισμός Κίνησης & Πνοής", text: "Κάθε σωματική κίνηση καθοδηγείται από την αναπνοή. Όταν τα χέρια ανεβαίνουν, εισπνέουμε· όταν κατεβαίνουν, εκπνέουμε." },
          { time: "01:05", title: "Η Μάντρα του Νου", text: "Καθώς εκτελείς τις κινήσεις, ο νους ησυχάζει ακολουθώντας την απλή, εσωτερική ροή: «Εισπνέω, ξέρω ότι εισπνέω. Εκπνέω, ξέρω ότι εκπνέω»." }
        ],
        tip: "Χώρος: Στο τέλος κάθε κίνησης, επιστρέφεις στη σταθερή στάση [01:19], νιώθοντας τον ήσυχο, ανοιχτό χώρο που έχει δημιουργηθεί μέσα σου και γύρω σου.",
        bridge: "Επιστροφή στη στάση της παρουσίας. Νιώσε τη σιωπή μέσα σου.",
        bridgeTime: 79,
        movements: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Movement ${i + 1}`,
          nameEL: `Κίνηση ${i + 1}`,
        }))
      }
    },
    {
      id: 'HDoAuilRt3Q',
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
      id: 'tmgHDEypPAQ',
      title: language === 'en' ? "Open Focus: The Neuroscience of Diffuse Attention" : "Open Focus: Η Νευροεπιστήμη της Διάχυτης Προσοχής",
      author: "Dr. Les Fehmi",
      category: language === 'en' ? "Neuroscience & Attention" : "Νευροεπιστήμη & Προσοχή",
      thumbnail: "https://img.youtube.com/vi/tmgHDEypPAQ/maxresdefault.jpg",
      description: language === 'en' ? {
        intro: "When you try to focus persistently and narrowly (Narrow Focus), your nervous system unconsciously activates a 'fight or flight' state [01:00]. Open Focus teaches us that by changing how we attend, we can instantly change our biology.",
        points: [
          { time: "01:00", title: "Narrow Focus & Stress", text: "Persistent narrow focus increases cortisol and muscle tension, trapping us in a state of chronic alarm." },
          { time: "01:32", title: "Brain Wave Rhythms", text: "Changing focus style slows down brain waves, making them rhythmic and synchronous." },
          { time: "05:13", title: "Awareness of Awareness", text: "The peak state where you are aware of the process of being aware, leading to absolute clarity." }
        ],
        tip: "Space: Shift from 'Doing' [05:51] to authentic 'Being'. It is the essence of the Space Axis.",
        bridge: "When you combine all attention styles [05:06], the mind passes from effort to pure existence.",
        bridgeTime: 306,
        attentionStyles: [
          { id: 'narrow', name: 'Narrow Focus', nameEL: 'Στενή Προσοχή', time: '01:00', desc: 'Single object, excluding all else.', descEL: 'Εστίαση σε ένα μόνο αντικείμενο, αποκλείοντας όλα τα άλλα.' },
          { id: 'diffuse', name: 'Diffuse Focus', nameEL: 'Διάχυτη Προσοχή', time: '02:21', desc: 'Including space, sounds, and sensations.', descEL: 'Συμπερίληψη του χώρου, των ήχων και των αισθήσεων γύρω μας.' },
          { id: 'immersed', name: 'Immersed Focus', nameEL: 'Απορροφημένη Προσοχή', time: '02:29', desc: 'Full union with the experience (e.g., dance, a hug).', descEL: 'Πλήρης εμβάθυνση και ένωση με την εμπειρία (π.χ. χορός, μια αγκαλιά).' },
          { id: 'separate', name: 'Separate Focus', nameEL: 'Αποστασιοποιημένη Προσοχή', time: '02:54', desc: 'Observation from a distance, like an objective judge.', descEL: 'Παρατήρηση από απόσταση, σαν αντικειμενικός κριτής.' }
        ]
      } : {
        intro: "Όταν προσπαθείς να εστιάσεις επίμονα και στενά (Narrow Focus), το νευρικό σου σύστημα ενεργοποιεί ασυνείδητα την κατάσταση 'μάχης ή φυγής' [01:00]. Η μέθοδος του Open Focus μας διδάσκει ότι αλλάζοντας τον τρόπο που προσέχουμε, αλλάζουμε αμέσως τη βιολογία μας.",
        points: [
          { time: "01:00", title: "Στενή Προσοχή & Στρες", text: "Η επίμονη στενή εστίαση αυξάνει την κορτιζόλη και την ένταση, παγιδεύοντάς μας σε μια κατάσταση συναγερμού." },
          { time: "01:32", title: "Ρυθμοί Εγκεφαλικών Κυμάτων", text: "Η αλλαγή στυλ προσοχής επιβραδύνει τα εγκεφαλικά κύματα, κάνοντάς τα ρυθμικά και συγχρονισμένα." },
          { time: "05:13", title: "Επίγνωση της Επίγνωσης", text: "Η κορυφαία κατάσταση όπου έχεις επίγνωση της ίδιας της διαδικασίας της επίγνωσης." }
        ],
        tip: "Χώρος: Πέρασμα από το κουραστικό 'κάνω' [05:51] στο αυθεντικό 'είμαι'. Είναι η ουσία του Άξονα του Χώρου.",
        bridge: "Όταν συνδυάζεις και τα 4 στυλ ταυτόχρονα [05:06], ο νους περνά από την προσπάθεια στην καθαρή ύπαρξη.",
        bridgeTime: 306,
        attentionStyles: [
          { id: 'narrow', name: 'Narrow Focus', nameEL: 'Στενή Προσοχή', time: '01:00', desc: 'Single object, excluding all else.', descEL: 'Εστίαση σε ένα μόνο αντικείμενο, αποκλείοντας όλα τα άλλα.' },
          { id: 'diffuse', name: 'Diffuse Focus', nameEL: 'Διάχυτη Προσοχή', time: '02:21', desc: 'Including space, sounds, and sensations.', descEL: 'Συμπερίληψη του χώρου, των ήχων και των αισθήσεων γύρω μας.' },
          { id: 'immersed', name: 'Immersed Focus', nameEL: 'Απορροφημένη Προσοχή', time: '02:29', desc: 'Full union with the experience (e.g., dance, a hug).', descEL: 'Πλήρης εμβάθυνση και ένωση με την εμπειρία (π.χ. χορός, μια αγκαλιά).' },
          { id: 'separate', name: 'Separate Focus', nameEL: 'Αποστασιοποιημένη Προσοχή', time: '02:54', desc: 'Observation from a distance, like an objective judge.', descEL: 'Παρατήρηση από απόσταση, σαν αντικειμενικός κριτής.' }
        ]
      }
    },
    {
      id: 'i1z6L1IsZlg',
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

  

  return () => clearInterval(interval);
  }, [timeLeft, stopAudio]);

  const handleSoundToggle = (id: string) => {
    if (activeSound === id) {
      stopAudio();
      setActiveSound(null);
      searchParams.delete('track');
      setSearchParams(searchParams, { replace: true });
    } else {
      stopAudio();
      setActiveSound(id);
      searchParams.set('track', id);
      setSearchParams(searchParams, { replace: true });
      
      const newTrackDef = sleepTracks.find(t => t.id === id);
      if (newTrackDef) {
        startAudio({
          base: newTrackDef.base || 110,
          beat: newTrackDef.beat || 6.3,
          pulse: newTrackDef.pulse || 0.1,
          disableSynth: newTrackDef.disableSynth,
          ambientLayers: newTrackDef.files || []
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const t = {
    videosTitle: language === 'en' ? 'Cinema of Consciousness' : 'Σινεμά της Συνειδητότητας',
    videosSubtitle: language === 'en' ? 'Visual insights and philosophical explorations' : 'Οπτικές αναζητήσεις και φιλοσοφικές εξερευνήσεις',
    musicTitle: language === 'en' ? 'Binaural Beats & Sleep Music' : 'Ήχοι Ύπνου & Binaural Beats',
    musicSubtitle: language === 'en' ? 'Curated states of rest and deep relaxation' : 'Επιλεγμένες συνθέσεις για βαθιά χαλάρωση',
    groups: {
      music: language === 'en' ? 'Sleep Music & Frequencies' : 'Μουσική Ύπνου & Συχνότητες',
      binaural: language === 'en' ? 'Binaural & Nature' : 'Binaural & Ήχοι Φύσης',
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-y-auto flex flex-col pt-16 custom-scrollbar pb-32">
      <AnimatePresence>
        {isDimmed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex justify-center flex-col items-center">
            <h1 className="text-[26px] font-serif italic text-white/90 leading-none">
              {language === 'el' ? 'Το Καταφύγιο' : 'The Sanctuary'}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4a9eca] mt-1.5">
              {language === 'el' ? 'ΧΩΡΟΣ ΑΝΑΠΑΥΣΗΣ' : 'SPACE OF REST'}
            </p>
          </div>
          <button 
            onClick={() => setIsDimmed(!isDimmed)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300",
              isDimmed ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Custom Tabs */}
        {!isDimmed && (
          <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-8">
            <button
              onClick={() => setActiveTab('audio')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'audio' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Headphones size={16} />
              {language === 'el' ? 'ΗΧΗΤΙΚΑ ΤΟΠΙΑ' : 'SOUNDSCAPES'}
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === 'video' 
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.05]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <Film size={16} />
              {language === 'el' ? 'ΒΙΝΤΕΟ' : 'VIDEO'}
            </button>
          </div>
        )}

        {/* Visual Focus (Rendered only on audio tab) */}
        {activeTab === 'audio' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              <motion.div 
                animate={{ 
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                  opacity: isPlaying ? [0.4, 0.7, 0.4] : 0.2
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/30"
              />
              <div className="absolute inset-0 rounded-full border border-teal-500/10" />
            </div>
            
            <div className="flex flex-col items-center gap-2 mb-8 text-center px-4">
              <h2 className="text-[22px] font-serif italic text-white/90">
                {activeTrackDef ? (language === 'el' ? activeTrackDef.label.el : activeTrackDef.label.en) : (language === 'el' ? 'Επιλέξτε ήχο' : 'Select a sound')}
              </h2>
              <p className="text-[11px] font-bold tracking-[0.15em] text-[#4a9eca] uppercase">
                {activeTrackDef ? (language === 'el' ? activeTrackDef.subtitle.el : activeTrackDef.subtitle.en) : ''}
              </p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <button 
                onClick={() => {
                  if (!activeTrackDef) return;
                  const currentIndex = sleepTracks.findIndex(t => t.id === activeTrackDef.id);
                  const prevIndex = (currentIndex - 1 + sleepTracks.length) % sleepTracks.length;
                  handleSoundToggle(sleepTracks[prevIndex].id);
                  if (!isPlaying) handleSoundToggle(sleepTracks[prevIndex].id); // To ensure playing
                }}
                className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors", !activeTrackDef && "opacity-50 pointer-events-none")}
              >
                <ChevronLeft size={20} />
              </button>
              
              <button 
                onClick={() => {
                  if (activeTrackDef) {
                    if (isPlaying) stopAudio();
                    else handleSoundToggle(activeTrackDef.id);
                  } else if (sleepTracks.length > 0) {
                    handleSoundToggle(sleepTracks[0].id);
                  }
                }}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 transition-colors"
              >
                {isPlaying ? <span className="flex gap-1.5"><span className="w-1.5 h-4 bg-current rounded-full" /><span className="w-1.5 h-4 bg-current rounded-full" /></span> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>

              <button 
                onClick={() => {
                  if (!activeTrackDef) return;
                  const currentIndex = sleepTracks.findIndex(t => t.id === activeTrackDef.id);
                  const nextIndex = (currentIndex + 1) % sleepTracks.length;
                  handleSoundToggle(sleepTracks[nextIndex].id);
                  if (!isPlaying) handleSoundToggle(sleepTracks[nextIndex].id); // To ensure playing
                }}
                className={cn("w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white transition-colors", !activeTrackDef && "opacity-50 pointer-events-none")}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button 
              onClick={() => {
                // simple cycle timer: null -> 10 -> 20 -> 30 -> null
                if (timer === null) { setTimer(10); setTimeLeft(10 * 60); }
                else if (timer === 10) { setTimer(20); setTimeLeft(20 * 60); }
                else if (timer === 20) { setTimer(30); setTimeLeft(30 * 60); }
                else { setTimer(null); setTimeLeft(null); }
              }}
              className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[12px] font-medium text-white/60 hover:bg-white/[0.1] transition-colors"
            >
               {timeLeft !== null ? `· ${formatTime(timeLeft)} · ` : '· '}
               {language === 'el' ? 'Χρονοδιακόπτης' : 'Timer'}
               {timeLeft === null ? ' ·' : ''}
            </button>
          </div>
        )}

        {/* Volume & Timer Controls */}
        {activeTab === 'audio' && activeSound && !isDimmed && (
          <div className="flex flex-col gap-5 px-6 py-5 bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-xl mb-8 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <Volume2 size={20} className="text-white/40" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-teal-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Sound Cards */}
        {activeTab === 'audio' && !isDimmed && (
          <div className="flex flex-col gap-10 pb-24">
            {['music', 'binaural'].map(group => (
              <div key={group} className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4a9eca] pl-2">
                  {group === 'music' 
                    ? (language === 'el' ? 'ΜΟΥΣΙΚΗ & ΣΥΧΝΟΤΗΤΕΣ' : 'MUSIC & FREQUENCIES')
                    : (language === 'el' ? 'BINAURAL ΚΥΜΑΤΑ' : 'BINAURAL WAVES')
                  }
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {sleepTracks.filter(s => s.group === group).map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundToggle(sound.id)}
                      className={cn(
                        "flex justify-between items-center p-4 rounded-[1.5rem] border transition-all duration-300 active:scale-[0.98] text-left overflow-hidden relative group",
                        activeSound === sound.id 
                          ? "bg-[#1a3832]/60 border-teal-500/30" 
                          : "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex items-center gap-4 relative z-10 w-full">
                        <div className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0 transition-colors",
                          activeSound === sound.id ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.05] text-white/40 group-hover:text-white/70"
                        )}>
                          <sound.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[17px] font-serif italic leading-tight mb-1",
                            activeSound === sound.id ? "text-white" : "text-white/80 group-hover:text-white"
                          )}>
                            {language === 'el' ? sound.label.el : sound.label.en}
                          </span>
                          <span className="text-[10px] font-medium text-white/40 tracking-[0.1em] uppercase">
                            {language === 'el' ? sound.subtitle.el : sound.subtitle.en}
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 pr-2">
                         {activeSound === sound.id ? (
                           <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                         ) : (
                           <span className="text-white/30 text-lg font-light">∞</span>
                         )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Library Section */}
        {activeTab === 'video' && !isDimmed && (
          <div className="flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Youtube size={20} />
              </div>
              <div>
                <h2 className="text-[20px] font-serif italic text-white/90 leading-tight">{t.videosTitle}</h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">{t.videosSubtitle}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {videos.map((video) => (
                <button 
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video.id);
                    setVideoStartTime(0);
                    setMantraStep(0);
                    setActiveAttentionStyles([]);
                    setIsVoidActive(false);
                  }}
                  className="group flex flex-col md:flex-row gap-5 p-4 md:p-5 bg-[#0f1117] border border-white/10 rounded-[1.5rem] overflow-hidden hover:border-white/20 transition-all text-left w-full active:scale-[0.98]"
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
                      {video.category}
                    </span>
                    <h3 className="text-[17px] font-serif italic text-white/90 leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest font-black text-white/30 truncate">
                      {video.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>
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

          {/* Header Bar */}
          <div className={cn(
            "flex-none flex items-center justify-between px-6 h-20 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 transition-all duration-1000",
            isVoidActive ? "bg-transparent border-transparent opacity-20 hover:opacity-100" : "bg-black/40 backdrop-blur-md/80"
          )}>
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
                   {videos.find(v => v.id === activeVideo)?.title}
                 </h2>
                 <p className="text-lg text-white/30 font-medium font-serif italic">
                   {videos.find(v => v.id === activeVideo)?.author}
                 </p>
              </div>
            </div>

            {/* Description / Insights Sidebar */}
            <div className={cn(
              "flex-1 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-300 transition-opacity duration-1000",
              isVoidActive ? "opacity-20 hover:opacity-100" : "opacity-100"
            )}>
              {(() => {
                const videoData = videos.find(v => v.id === activeVideo);
                if (videoData?.description) {
                  const desc = videoData.description;
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
                                 {language === 'el' ? desc.mantraEL[mantraStep] : desc.mantra[mantraStep]}
                               </h4>
                             </div>

                             <div className="flex items-center justify-center gap-4 relative z-10">
                               <button 
                                 onClick={() => setMantraStep((prev) => (prev > 0 ? prev - 1 : desc.mantra!.length - 1))}
                                 className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                               >
                                 <ChevronLeft size={20} />
                               </button>
                               <button 
                                 onClick={() => setMantraStep((prev) => (prev < desc.mantra!.length - 1 ? prev + 1 : 0))}
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
                                   {language === 'el' ? `ΚΙΝΗΣΗ ${desc.movements[mantraStep].id} / 10` : `MOVEMENT ${desc.movements[mantraStep].id} / 10`}
                                 </span>
                                 <h4 className="text-xl font-serif italic text-white/90">
                                   {language === 'el' ? desc.movements[mantraStep].nameEL : desc.movements[mantraStep].name}
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
                                        {language === 'el' ? style.nameEL : style.name}
                                      </span>
                                      <p className="text-[10px] text-white/30 leading-tight">
                                        {language === 'el' ? style.descEL : style.desc}
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
