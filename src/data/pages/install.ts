// The words of the Install page (pages/Install.tsx), also written into its
// prerendered HTML for search engines: one text, two readers.
export const T = {
  el: {
    title: 'Εγκατάσταση',
    lead: 'Η εφαρμογή είναι δωρεάν και δεν θέλει λογαριασμό. Δουλεύει και μέσα στον browser, αλλά αν την εγκαταστήσεις μπαίνει στην αρχική οθόνη ή στο μενού Έναρξη, ανοίγει σε όλη την οθόνη και λειτουργεί και χωρίς σύνδεση.',
    yours: 'Η συσκευή σου',
    installed: 'Η εφαρμογή είναι ήδη εγκατεστημένη σε αυτή τη συσκευή.',
    now: 'Εγκατάσταση τώρα',
    store: 'Λήψη από το Microsoft Store',
    apk: 'Κατέβασε την εφαρμογή',
    apkSize: 'APK · περίπου 12 MB',
    or: 'ή',
    sections: {
      windows: {
        name: 'Υπολογιστής με Windows',
        intro: 'Ο πιο απλός τρόπος είναι το Microsoft Store.',
        steps: ['Άνοιξε τη σελίδα της εφαρμογής στο Microsoft Store και πάτα «Λήψη».', 'Χωρίς το Store: άνοιξε τον ιστότοπο στο Edge ή στο Chrome και πάτα το εικονίδιο εγκατάστασης δεξιά στη γραμμή διεύθυνσης, ή Μενού (⋯ ή ⋮) → «Εφαρμογές» → «Εγκατάσταση».'],
      },
      androidApk: {
        name: 'Κινητό ή tablet Android',
        intro: 'Η εφαρμογή για Android, η ίδια με του Google Play: έχει μέσα όλο το περιεχόμενο, δουλεύει χωρίς σύνδεση και παίρνει μόνη της τις ενημερώσεις.',
        steps: ['Πάτα «Κατέβασε την εφαρμογή» και άνοιξε το αρχείο όταν κατέβει (από την ειδοποίηση ή από τις Λήψεις).', 'Αν το κινητό ρωτήσει, επίτρεψε στον browser να εγκαθιστά εφαρμογές («Άγνωστες εφαρμογές» → «Να επιτρέπεται») και γύρνα πίσω.', 'Πάτα «Εγκατάσταση».'],
        note: 'Αν το Play Protect ρωτήσει, είναι η ίδια εφαρμογή με του Google Play, υπογεγραμμένη από την Google. Θες χωρίς αρχείο; Άνοιξε τον ιστότοπο στο Chrome → τρεις τελείες (⋮) → «Εγκατάσταση εφαρμογής» (στο Samsung Internet: Μενού → «Προσθήκη σελίδας σε» → «Αρχική οθόνη»).',
      },
      android: {
        name: 'Κινητό ή tablet Android',
        intro: 'Από το Chrome, σε λίγα δευτερόλεπτα.',
        steps: ['Άνοιξε τον ιστότοπο στο Chrome.', 'Πάτα τις τρεις τελείες (⋮) πάνω δεξιά.', 'Πάτα «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη».', 'Στο Samsung Internet: το βελάκι λήψης στη γραμμή διεύθυνσης, ή Μενού → «Προσθήκη σελίδας σε» → «Αρχική οθόνη».'],
      },
      ios: {
        name: 'iPhone ή iPad',
        intro: 'Από το Safari, με το κουμπί Κοινοποίηση.',
        steps: ['Άνοιξε τον ιστότοπο στο Safari.', 'Πάτα το κουμπί Κοινοποίηση (το τετράγωνο με το βέλος προς τα πάνω).', 'Κατέβα και πάτα «Προσθήκη στην οθόνη αφετηρίας», μετά «Προσθήκη».'],
        note: 'Στο iPhone αξίζει να την προσθέσεις: αλλιώς το Safari σβήνει την πρόοδο και το ημερολόγιό σου, αν περάσουν 7 μέρες χωρίς να την ανοίξεις.',
      },
      mac: {
        name: 'Mac',
        intro: 'Από το Safari, το Chrome ή το Edge.',
        steps: ['Safari: μενού Αρχείο → «Προσθήκη στο Dock».', 'Chrome ή Edge: το εικονίδιο εγκατάστασης δεξιά στη γραμμή διεύθυνσης.'],
      },
      other: {
        name: 'Άλλη συσκευή',
        intro: 'Σε Chrome ή Edge, σε κάθε σύστημα.',
        steps: ['Άνοιξε τον ιστότοπο και πάτα το εικονίδιο εγκατάστασης στη γραμμή διεύθυνσης, ή Μενού → «Εγκατάσταση εφαρμογής».'],
      },
    },
    shareTitle: 'Στείλε τη σε κάποιον',
    shareText: 'Στείλε αυτή τη σελίδα: όποιος την ανοίξει βλέπει πρώτα τα βήματα για τη δική του συσκευή.',
    share: 'Κοινοποίηση',
    copied: 'Ο σύνδεσμος αντιγράφηκε',
    back: 'Πίσω',
  },
  en: {
    title: 'Install the app',
    lead: 'The app is free and needs no account. It works in the browser too, but once installed it sits on your home screen or Start menu, opens full screen and works offline.',
    yours: 'Your device',
    installed: 'The app is already installed on this device.',
    now: 'Install now',
    store: 'Get it from the Microsoft Store',
    apk: 'Download the app',
    apkSize: 'APK · about 12 MB',
    or: 'or',
    sections: {
      windows: {
        name: 'Windows computer',
        intro: 'The simplest way is the Microsoft Store.',
        steps: ['Open the app’s page in the Microsoft Store and choose “Get”.', 'Without the Store: open the site in Edge or Chrome and click the install icon at the right of the address bar, or Menu (⋯ or ⋮) → “Apps” → “Install”.'],
      },
      androidApk: {
        name: 'Android phone or tablet',
        intro: 'The Android app, the same as on Google Play: everything is inside it, it works offline and it updates itself.',
        steps: ['Tap “Download the app” and open the file when it has downloaded (from the notification or from Downloads).', 'If the phone asks, let the browser install apps (“Unknown apps” → “Allow”) and go back.', 'Tap “Install”.'],
        note: 'If Play Protect asks, it is the same app as on Google Play, signed by Google. Rather not use a file? Open the site in Chrome → the three dots (⋮) → “Install app” (in Samsung Internet: Menu → “Add page to” → “Home screen”).',
      },
      android: {
        name: 'Android phone or tablet',
        intro: 'From Chrome, in a few seconds.',
        steps: ['Open the site in Chrome.', 'Tap the three dots (⋮) at the top right.', 'Tap “Install app” or “Add to Home screen”.', 'In Samsung Internet: the download arrow in the address bar, or Menu → “Add page to” → “Home screen”.'],
      },
      ios: {
        name: 'iPhone or iPad',
        intro: 'From Safari, with the Share button.',
        steps: ['Open the site in Safari.', 'Tap the Share button (the square with the arrow pointing up).', 'Scroll down, tap “Add to Home Screen”, then “Add”.'],
        note: 'On iPhone it is worth adding it: otherwise Safari clears your progress and journal after 7 days without a visit.',
      },
      mac: {
        name: 'Mac',
        intro: 'From Safari, Chrome or Edge.',
        steps: ['Safari: File menu → “Add to Dock”.', 'Chrome or Edge: the install icon at the right of the address bar.'],
      },
      other: {
        name: 'Another device',
        intro: 'In Chrome or Edge, on any system.',
        steps: ['Open the site and click the install icon in the address bar, or Menu → “Install app”.'],
      },
    },
    shareTitle: 'Send it to someone',
    shareText: 'Send this page: whoever opens it sees the steps for their own device first.',
    share: 'Share',
    copied: 'Link copied',
    back: 'Back',
  },
};
