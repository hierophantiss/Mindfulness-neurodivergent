export type AxisType = 'body' | 'breath' | 'attention' | 'space';

export interface CompanionArticle {
  id: string;
  axis: AxisType;
  title: { en: string; el: string };
  summary: { en: string; el: string };
}

export const companionArticleIndex: CompanionArticle[] = [
  {
    id: 'soft-gaze-open-hearing',
    axis: 'attention',
    title: {
      en: 'Soft Gaze & Open Hearing',
      el: 'Μαλακό Βλέμμα & Ανοιχτή Ακοή'
    },
    summary: {
      en: 'How shifting visual focus and hearing can help regulate the nervous system.',
      el: 'Πώς η αλλαγή της οπτικής εστίασης και της ακοής μπορεί να βοηθήσει στη ρύθμιση του νευρικού συστήματος.'
    }
  },
  {
    id: 'polyvagal-middle-way',
    axis: 'body',
    title: {
      en: 'The Polyvagal Middle Way',
      el: 'Η Πολυεστιακή Μέση Οδός'
    },
    summary: {
      en: 'Understanding the nervous system through Polyvagal theory and finding the middle path.',
      el: 'Κατανόηση του νευρικού συστήματος μέσα από την Πολυβαγική θεωρία και η εύρεση της μέσης οδού.'
    }
  },
  {
    id: 'you-are-the-path',
    axis: 'space',
    title: {
      en: 'You Are the Path: The Map, the Territory & the Axis',
      el: 'Είσαι ο Δρόμος: Ο Χάρτης, το Έδαφος & ο Άξονας'
    },
    summary: {
      en: 'Exploring the map, the territory, and how to enter the present moment through the axis.',
      el: 'Εξερεύνηση του χάρτη, του εδάφους και πώς να μπείτε στην παρούσα στιγμή μέσω του άξονα.'
    }
  },
  {
    id: 'wave-and-sea',
    axis: 'space',
    title: {
      en: 'The Wave Is Not the Sea — Until It Lets Go',
      el: 'Το Κύμα Δεν Είναι η Θάλασσα — Ώσπου να Αφεθεί'
    },
    summary: {
      en: 'A reflection on mindfulness, awareness, and the journey from being a wave to realizing the sea.',
      el: 'Ένας στοχασμός πάνω στην ενσυνειδητότητα, την επίγνωση και τη διαδρομή από το κύμα στη θάλασσα.'
    }
  },
  {
    id: 'koshas-veils',
    axis: 'body',
    title: {
      en: 'The Veils of Being',
      el: 'Τα Πέπλα της Ύπαρξης'
    },
    summary: {
      en: 'The Matryoshka allegory of the five veils of being, from the physical body to pure consciousness.',
      el: 'Η αλληγορία της Μπάμπουσκα για τα πέντε πέπλα της ύπαρξης, από το φυσικό σώμα στην καθαρή συνείδηση.'
    }
  },
  {
    id: 'dzogchen-nature-of-mind',
    axis: 'space',
    title: {
      en: 'The Nature of Mind & Tregchod',
      el: 'Η Φύση του Νου & Η Λύση της Έντασης'
    },
    summary: {
      en: 'A guest article exploring the Nature of Mind, Tregchod, and neuroscience.',
      el: 'Ένα κείμενο που εξερευνά τη Φύση του Νου, το Tregchod και τη νευροεπιστήμη.'
    }
  },
  {
    id: 'what-is-sandbox',
    axis: 'attention',
    title: {
      en: 'What does Sandbox mean?',
      el: 'Τι σημαίνει Sandbox;'
    },
    summary: {
      en: 'Understanding the Sandbox concept as a safe internal space for self-exploration.',
      el: 'Κατανόηση της έννοιας του Sandbox ως ενός ασφαλούς εσωτερικού χώρου για αυτοεξερεύνηση.'
    }
  },
  {
    id: 'riding-the-wind',
    axis: 'breath',
    title: {
      en: 'Learning to Ride the Wind',
      el: 'Μαθαίνοντας να ιππεύεις τον άνεμο'
    },
    summary: {
      en: 'How ancient body-breath traditions like Tsa Lung help regulate the nervous system.',
      el: 'Πώς αρχαίες παραδόσεις σώματος-αναπνοής όπως το Tsa Lung βοηθούν στη ρύθμιση του νευρικού συστήματος.'
    }
  },
  {
    id: 'the-goose-is-out',
    axis: 'attention',
    title: {
      en: 'The Goose is Out',
      el: 'Η Χήνα Είναι Έξω'
    },
    summary: {
      en: 'A Zen allegory about masking, identity, and liberation for neurodivergent minds.',
      el: 'Μια αλληγορία Ζεν για το masking, την ταυτότητα και την απελευθέρωση για νευροδιαφορετικούς νους.'
    }
  },
  {
    id: 'quantum-void-awareness',
    axis: 'space',
    title: {
      en: 'The Seething Void',
      el: 'Το Κοχλάζον Κενό'
    },
    summary: {
      en: 'How quantum physics relates to the fourth axis of space and open awareness.',
      el: 'Πώς η κβαντική φυσική σχετίζεται με τον τέταρτο άξονα του χώρου και την ανοιχτή επίγνωση.'
    }
  },
  {
    id: 'forces-of-the-cosmos',
    axis: 'space',
    title: {
      en: 'The Forces of the Cosmos, the Axes of the Mind',
      el: 'Οι Δυνάμεις του Κόσμου, οι Άξονες του Νου'
    },
    summary: {
      en: 'Mapping the four fundamental forces of the cosmos to the four axes of the mind.',
      el: 'Η αντιστοίχιση των τεσσάρων θεμελιωδών δυνάμεων του σύμπαντος στους τέσσερις άξονες του νου.'
    }
  }
];
