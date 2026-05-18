import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('section-nav');
  const main = document.getElementById('content-area');
  const sectionContent = document.getElementById('section-content');
  const btnBack = document.getElementById('btn-back');
  const header = document.querySelector('header');
  
  // Audio controls
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const ambientAudio = document.getElementById('ambient-audio');
  let isAudioPlaying = false;

  const sections = {
    'btn-know-thyself': {
      title: 'Γνώθι Σαυτόν',
      content: `
        <h3 class="text-2xl text-[var(--color-accent)] mb-4">Αναστοχασμός</h3>
        <p class="text-[var(--color-text)] mb-4 leading-relaxed">
          Αυτό το κεφάλαιο είναι ένα λογοτεχνικό και φιλοσοφικό ταξίδι στον εαυτό. Πάρε το χρόνο σου, δεν υπάρχει βιασύνη.
        </p>
      `
    },
    'btn-practice': {
      title: 'Πρακτική',
      content: `
        <h3 class="text-2xl text-[var(--color-accent)] mb-4">Εστίαση</h3>
        <p class="text-[var(--color-text)] mb-6 leading-relaxed border-l-2 border-[var(--color-accent-light)] pl-4">
          Βαρύτητα. Αναπνοή. Προσοχή. Χώρος.
        </p>
        <div class="flex flex-col gap-3">
          <button class="text-left w-full p-4 rounded-lg bg-[var(--color-bg)] hover:bg-opacity-80 touch-target">Εξάσκηση Βαρύτητας</button>
          <button class="text-left w-full p-4 rounded-lg bg-[var(--color-bg)] hover:bg-opacity-80 touch-target">Ασκήσεις Αναπνοής</button>
        </div>
      `
    },
    'btn-rabbit-hole': {
      title: 'Η Τρύπα του Κουνελιού',
      content: `
        <h3 class="text-2xl text-[var(--color-accent)] mb-4">Το Βάθος</h3>
        <p class="text-[var(--color-text)] leading-relaxed">
          Εδώ θα βρεις πιο σύνθετες σκέψεις και θεωρίες. Ένα μέρος για όταν το μυαλό σου χρειάζεται να απασχοληθεί με έννοιες πυκνές και πολυδιάστατες.
        </p>
      `
    },
    'btn-sanctuary': {
      title: 'Το Ιερό',
      content: `
        <h3 class="text-2xl text-[var(--color-accent)] mb-4">Ασφάλεια</h3>
        <p class="text-[var(--color-text)] leading-relaxed">
          Ανάπνευσε. Είσαι ασφαλής εδώ. Δεν υπάρχουν προσδοκίες, δεν υπάρχει τίποτα που "πρέπει" να κάνεις.
        </p>
        <div class="mt-8 flex justify-center">
          <div class="w-16 h-16 rounded-full bg-[var(--color-accent)] opacity-20 animate-pulse" style="animation-duration: 4s;"></div>
        </div>
      `
    },
    'btn-journal': {
      title: 'Ημερολόγιο',
      content: `
        <h3 class="text-2xl text-[var(--color-accent)] mb-4">Οι Σκέψεις Σου</h3>
        <textarea 
          class="w-full bg-[var(--color-bg)] text-[var(--color-text)] p-4 rounded-lg border border-[var(--color-text-muted)] focus:border-[var(--color-accent)] min-h-[200px] resize-y mb-4" 
          placeholder="Γράψε ό,τι θέλεις. Όλα μένουν εδώ..."
          id="journal-input"
        ></textarea>
        <button class="bg-[var(--color-accent)] text-[var(--color-bg)] px-6 py-3 rounded-lg font-medium touch-target hover:bg-[var(--color-accent-light)] transition-colors">
          Αποθήκευση (Τοπικά)
        </button>
      `
    }
  };

  // Setup navigation
  Object.keys(sections).forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Hide nav, show content
      nav.classList.add('hidden');
      header.classList.add('hidden');
      main.classList.remove('hidden');
      
      // Inject content
      const data = sections[id];
      sectionContent.innerHTML = `
        <h2 class="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-6" style="font-family: var(--font-body); font-style: normal;">${data.title}</h2>
        ${data.content}
      `;
      main.style.animation = 'fadeIn 0.4s ease-out forwards';
    });
  });

  // Setup back button
  btnBack.addEventListener('click', () => {
    main.classList.add('hidden');
    nav.classList.remove('hidden');
    header.classList.remove('hidden');
    nav.style.animation = 'fadeIn 0.4s ease-out forwards';
    header.style.animation = 'fadeIn 0.4s ease-out forwards';
  });

  // Setup Audio
  btnAudioToggle.addEventListener('click', () => {
    if (isAudioPlaying) {
      ambientAudio.pause();
      isAudioPlaying = false;
      btnAudioToggle.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      `;
      btnAudioToggle.classList.remove('text-[var(--color-accent)]');
    } else {
      ambientAudio.play().catch(e => {
        console.warn('Audio play failed (maybe no file or interactions required):', e);
      });
      isAudioPlaying = true;
      btnAudioToggle.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      `;
      btnAudioToggle.classList.add('text-[var(--color-accent)]');
    }
  });
  
});
