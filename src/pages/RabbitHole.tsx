import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function RabbitHole() {
  const { language } = useLanguage();
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const touchStartX = useRef(0);

  const t = {
    title: language === 'en' ? 'The Rabbit Hole' : 'Η Τρύπα του Λαγού',
    subtitle: language === 'en' ? 'Allegories of the World' : 'Αλληγορίες του Κόσμου',
    back: language === 'en' ? 'Back' : 'Πίσω',
    startReading: language === 'en' ? 'Start Reading' : 'Έναρξη Ανάγνωσης',
    close: language === 'en' ? 'Close' : 'Κλείσιμο',
  };

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
  });

  // Story Viewer Render
  if (activeArticle) {
    const article = articles.find(a => a.id === activeArticle);
    if (!article) return null;

    return (
      <div className="fixed inset-0 z-50 bg-[#1E1B18] text-white flex flex-col animate-in fade-in duration-300">
        
        {/* Top Progress Bar & Header */}
        <div className="pt-safe px-4 pb-3 flex items-center justify-between border-b border-pine-800/40 bg-[#1E1B18]/80 backdrop-blur-md relative z-20">
          <button 
            onClick={() => setActiveArticle(null)} 
            className="p-2 -ml-2 text-pine-400 hover:text-white transition-colors active:scale-95"
            aria-label={t.close}
          >
            <X size={24} />
          </button>
          <div className="flex-1 px-4 text-center">
            <h2 className="text-[14px] font-bold text-pine-100 truncate">{article.title}</h2>
          </div>
          <div className="w-10 text-xs text-teal-400 font-mono text-right font-medium tracking-wide">
            {currentPage + 1}<span className="text-pine-600">/{article.pages.length}</span>
          </div>
        </div>

        {/* Progress Indicator Lines */}
        <div className="flex gap-1.5 px-4 py-3 opacity-80 z-20">
          {article.pages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i === currentPage 
                  ? 'bg-teal-400 scale-y-125' 
                  : i < currentPage 
                    ? 'bg-teal-500/50' 
                    : 'bg-pine-800/60'
              }`} 
            />
          ))}
        </div>

        {/* Reading Area */}
        <div 
          className="flex-1 relative flex items-center justify-center px-6 md:px-16 pb-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Text Content */}
          <div 
            key={currentPage} 
            className="max-w-xl w-full animate-in fade-in zoom-in-[0.98] duration-300 ease-out"
          >
            <BookOpen size={24} className="text-teal-500/20 mx-auto justify-center mb-6" />
            <p className="text-[19px] md:text-[22px] leading-[1.8] font-serif text-pine-100 text-center tracking-wide whitespace-pre-line" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.4)"}}>
              {article.pages[currentPage]}
            </p>
          </div>

          {/* Invisible Hitboxes with glowing subtle chevrons */}
          <button 
            className="absolute top-0 left-0 w-[40%] h-full z-10 flex flex-col justify-center items-start pl-2 md:pl-6 group outline-none"
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
            className="absolute top-0 right-0 w-[40%] h-full z-10 flex flex-col justify-center items-end pr-2 md:pr-6 group outline-none"
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

        </div>
      </div>
    );
  }

  // List View Render (when activeArticle is null)
  return (
    <div className="flex flex-col min-h-screen bg-[#1E1B18] animate-in fade-in pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#1E1B18]/80 backdrop-blur-xl border-b border-pine-800/60 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <Link 
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pine-900/50 text-pine-200 hover:text-white transition-colors active:scale-95"
            aria-label={t.back}
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="flex flex-col items-center flex-1">
            <h1 className="text-sm font-bold text-pine-100 tracking-wide uppercase flex items-center gap-2">
              <span className="text-xl">🐇🕳️</span> {t.title}
            </h1>
            <p className="text-[10px] text-pine-400 uppercase tracking-widest">{t.subtitle}</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 pt-6 max-w-4xl mx-auto w-full">
        <p className="text-pine-300/80 text-sm italic mb-8 text-center px-4 leading-relaxed">
          {language === 'en' 
            ? 'A collection of theoretical pieces, allegories, and insights from across the world charting the human path to the exploration of consciousness.'
            : 'Μια βιβλιοθήκη με θεωρητικά κείμενα, αλληγορίες και στοχασμούς από όλο τον κόσμο για την ανθρώπινη πορεία προς την εξερεύνηση της συνειδητότητας.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Link to Method & Symbols */}
          <Link 
            to="/method"
            className="w-full md:col-span-2 bg-gradient-to-br from-pine-800/60 to-pine-900/80 border border-pine-600/40 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] block text-left transition-all duration-500 active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(20,184,166,0.15)] hover:border-teal-500/30 relative overflow-hidden group backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500">
              <span className="text-[100px] md:text-[140px]">🐘</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-pine-950/80 flex items-center justify-center border border-white/5 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <span className="text-[24px] drop-shadow-md">🐘</span>
              </div>
              <div>
                <h2 className="text-[19px] md:text-[22px] font-heading font-medium text-white leading-snug tracking-wide group-hover:text-teal-50 transition-colors">{language === 'en' ? 'The Method & Symbols' : 'Η Μέθοδος & τα Σύμβολα'}</h2>
                <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-teal-400/80 font-bold mt-1.5">{language === 'en' ? 'THE ELEPHANT & THE MONKEY' : 'Ο ΕΛΕΦΑΝΤΑΣ ΚΑΙ Η ΜΑΙΜΟΥ'}</p>
              </div>
            </div>
            <p className="text-pine-200/90 text-sm md:text-base leading-relaxed line-clamp-3 relative z-10 font-medium">
              {language === 'en' 
                ? "Dive into the allegorical framework that structures the practice. Understanding how the mind wanders and returns."
                : "Εξερευνήστε το αλληγορικό πλαίσιο που δομεί την πρακτική. Πώς ο νους περιπλανάται και πώς επιστρέφει."}
            </p>
            <div className="mt-6 pt-5 border-t border-pine-700/50 flex justify-between items-center text-teal-300 font-bold text-[13px] md:text-sm relative z-10 group-hover:text-teal-200 transition-colors">
              <span className="flex items-center gap-2">
                {language === 'en' ? 'Explore Symbols' : 'Εξερεύνηση Συμβόλων'} <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {articles.map((article) => {
            const isNew = article.id === 'koshas-veils';
            return (
              <button 
                key={article.id}
                onClick={() => { setActiveArticle(article.id); setCurrentPage(0); }}
                className={`w-full border rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col text-left transition-all duration-500 active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group backdrop-blur-md ${
                  isNew 
                    ? 'bg-gradient-to-br from-teal-900/40 to-pine-950/80 border-teal-500/30' 
                    : 'bg-gradient-to-b from-pine-900/50 to-pine-950/80 border-pine-700/40 hover:border-pine-600/60'
                }`}
              >
                {isNew && (
                  <div className="absolute top-4 right-4 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest z-20 shadow-lg animate-pulse">
                    {language === 'en' ? 'New Reflection' : 'Νέος Στοχασμός'}
                  </div>
                )}
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-15 transition-all duration-500">
                  <BookOpen className={`w-[80px] h-[80px] md:w-[120px] md:h-[120px] ${isNew ? 'text-teal-400' : ''}`} />
                </div>
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group-hover:scale-110 transition-transform duration-500 ${isNew ? 'bg-teal-500/20' : 'bg-pine-950/80'}`}>
                    <BookOpen size={24} className={`${isNew ? 'text-teal-300' : 'text-teal-400'} drop-shadow-md`} />
                  </div>
                  <div>
                    <h2 className="text-[19px] md:text-[22px] font-heading font-medium text-white leading-snug tracking-wide group-hover:text-pine-50 transition-colors">{article.title}</h2>
                    <p className={`text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mt-1.5 ${isNew ? 'text-teal-400/80' : 'text-pine-400/90'}`}>{article.author}</p>
                  </div>
                </div>
                <p className="text-pine-200/90 text-sm md:text-base leading-relaxed line-clamp-3 relative z-10 font-medium italic">
                  "{article.pages[0]}"
                </p>
                <div className="mt-auto pt-6">
                  <div className="pt-5 border-t border-pine-800/80 flex justify-between items-center text-teal-400 font-bold text-[13px] md:text-sm relative z-10 group-hover:text-teal-300 transition-colors">
                    <span className="flex items-center gap-2">
                      {t.startReading} <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] text-pine-400/80 font-bold tracking-[0.2em] uppercase">
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
