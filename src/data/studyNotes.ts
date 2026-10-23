// One honest note per study, shown with an asterisk under every
// "Why this works" line that cites it: who was studied, and what the study
// did not measure.

type T = { el: string; en: string };

export const STUDY_NOTES: Record<string, T> = {
  'study-lutz': {
    el: 'Η μελέτη έγινε σε 8 μοναχούς με πολλά χρόνια πρακτικής, στον διαλογισμό συμπόνιας. Δεν μετρήθηκε σε σύντομη άσκηση σαν αυτή.',
    en: 'The study was done with 8 monks with many years of practice, during compassion meditation. It was not measured in a short exercise like this one.',
  },
  'study-brewer': {
    el: 'Σε έμπειρους διαλογιστές με χρόνια πρακτικής, σε σύγκριση με αρχάριους.',
    en: 'In experienced meditators with years of practice, compared with beginners.',
  },
  'study-farb': {
    el: 'Σε ανθρώπους που είχαν ολοκληρώσει πρόγραμμα ενσυνειδητότητας 8 εβδομάδων.',
    en: 'In people who had completed an 8-week mindfulness programme.',
  },
  'study-porges': {
    el: 'Η Πολυβαγική Θεωρία είναι θεωρητικό πλαίσιο και συζητείται ακόμα στην επιστήμη· δεν μέτρησε αυτή την άσκηση.',
    en: 'Polyvagal Theory is a theoretical framework and is still debated; it did not measure this exercise.',
  },
  'study-corrigan': {
    el: 'Ανασκόπηση για το μοντέλο του παραθύρου ανοχής, όχι μέτρηση αυτής της άσκησης.',
    en: 'A review of the window-of-tolerance model, not a measurement of this exercise.',
  },
  'study-balban': {
    el: '108 ενήλικες, 5 λεπτά τη μέρα για 4 εβδομάδες. Η τεχνική με τη μακριά εκπνοή ήταν διπλή εισπνοή και μακριά εκπνοή, όχι ακριβώς αυτός ο ρυθμός.',
    en: '108 adults, 5 minutes a day for 4 weeks. The long-exhale technique was a double inhale with a long exhale, not exactly this rhythm.',
  },
  'study-trivedi': {
    el: 'Μικρή πιλοτική μελέτη (23 άτομα), χωρίς ομάδα σύγκρισης· μέτρησε τον καρδιακό ρυθμό στο βουητό και σε τρεις άλλες δραστηριότητες της μέρας.',
    en: 'A small pilot study (23 people) with no comparison group; it measured heart rhythm during humming and three other daily activities.',
  },
  'study-lane': {
    el: 'Μικρή μελέτη· τα ευρήματα για τα διωτικά κύματα είναι ακόμα ανάμεικτα.',
    en: 'A small study; findings on binaural beats are still mixed.',
  },
  'study-mackrous': {
    el: 'Βασική νευροεπιστημονική έρευνα για το πώς ο εγκέφαλος υπολογίζει τη βαρύτητα, όχι μελέτη αυτής της άσκησης.',
    en: 'Basic neuroscience on how the brain computes gravity, not a study of this exercise.',
  },
  'study-gibson': {
    el: 'Θεωρία της αντίληψης, όχι πειραματική μέτρηση.',
    en: 'A theory of perception, not an experimental measurement.',
  },
  'study-vater': {
    el: 'Ανασκόπηση για τον ρόλο της περιφερειακής όρασης· δεν μέτρησε το νευρικό σύστημα.',
    en: 'A review of the role of peripheral vision; it did not measure the nervous system.',
  },
  'study-zylowska': {
    el: 'Μικρή πιλοτική μελέτη (24 ενήλικες και 8 έφηβοι, χωρίς ομάδα ελέγχου), με πρόγραμμα 8 εβδομάδων.',
    en: 'A small pilot study (24 adults and 8 adolescents, no control group) of an 8-week programme.',
  },
  'study-ashinoff': {
    el: 'Ανασκόπηση που περιγράφει την υπερεστίαση· δεν εξέτασε κάποια άσκηση.',
    en: 'A review describing hyperfocus; it did not test any exercise.',
  },
  'study-zaccaro': {
    el: 'Ανασκόπηση 15 μικρών μελετών με διαφορετικούς ρυθμούς κάτω από 10 ανάσες το λεπτό· καμία δεν μέτρησε ακριβώς αυτή την άσκηση.',
    en: 'A review of 15 small studies with different rhythms under 10 breaths a minute; none measured exactly this exercise.',
  },
  'study-schooler': {
    el: 'Ανασκόπηση για την περιπλάνηση του νου, σε εργαστηριακές δοκιμασίες· δεν μέτρησε αυτή την άσκηση.',
    en: 'A review of mind-wandering in laboratory tasks; it did not measure this exercise.',
  },
  'study-lieberman': {
    el: 'Μελέτη fMRI με ονόματα σε συναισθήματα προσώπων, όχι σε σκέψεις· η ταμπέλα της μεθόδου πατά στην ίδια αρχή.',
    en: 'An fMRI study with names given to emotions on faces, not to thoughts; the label of the method rests on the same principle.',
  },
};
