import { Chapter } from './types';

export const CHAPTERS_DATA: Record<string, Chapter[]> = {
  en: [
    {num:1,title:"Body / Earth",sub:"The Stability of 'Here'",tag:"Here",color:"var(--color-axis-body)",hex:"#7A9E7E",icon:"⛰️",
     video:"/Basic.mp4",
     summary:"The body is the element of Earth, the undeniable foundation of the present moment. We learn to perceive gravity, our posture, and our grounded contact.",
     tldr:"The body (Earth) is the only point always in the 'Here'. Gravity is the direct proof of your presence. Feel your weight → calm the autopilot.",
     theorySections:[
       {title:"The Beginning: Relaxation and Grounding",paragraphs: ["The practice of the Fourfold Axis always begins with the body. The body is our stable base, the unquestionable 'Here' that connects us to the present time.", "Our body is not just a vehicle. It is a living archive of our experiences. The posture we have developed often carries the rejection, frustration, and tension we experienced because we felt different."]},
       {title:"Gravity: The Unquestionable 'Here'",paragraphs: ["Gravity{{gravity}} is not just a force — it is the proof of 'Here'. It shows us, without any doubt, exactly the point where we can exist in space, at this specific moment. Grounding{{grounding}} is the first act of relaxation."], interactive: "gravity_thoughts"},
       {title:"Grounding as a Somatic Anchor",paragraphs: ["The Default Mode Network{{dmn}} — the 'autopilot' — produces mental wandering, self-criticism, and repetition of old stories. Every time you feel gravity and your feet on the floor, you restore your physical sensation and activate your proprioceptive center{{proprioception}}.", "While the DMN does not completely stop with gravity alone—that requires hyperfocus and open awareness—grounding serves as the vital first anchor to bring the mind back to the present."]},
       {title:"The Echo in the Body",paragraphs: ["The tightness in the body, the tension, the voice saying 'you are not doing enough' — they were not born inside you. They are echoes of the past: words you heard, looks you received, expectations not met. Your nervous system stored them{{polyvagal}}.", "The method does not ask you to fight this echo. It asks you to recognize it: 'Ah, this is the old voice. I don\\'t need to follow it.' Self-criticism activates the same neural circuits as an external threat. Softness allows the nervous system to calm down{{parasympathetic}}."]},
       {title:"Escape from Concepts",paragraphs: ["Inside the body there are no concepts — only sensations{{interoception}}. Weight, warmth, pressure, pulse. When you turn to the body, you step out of thought without fighting thought.", "This transition — from words to sensations — is the foundation of every mindfulness practice."]},
       {title:"The Body, Space, and the Sense of Safety",paragraphs: ["Deep relaxation within the body is never an isolated act. It always presupposes awareness of space. True grounding (Body) is achieved only within a space that we feel holds us — the body and space work together{{gibson_1979}}. Our body, through sensory organs, constantly informs us about our position in space.", "When space is perceived as safe, the nervous system relaxes — and only then does the body truly let go."]}
     ],
     exercise:{title:"Exercise: The Book / Box",steps:["Stand upright comfortably.","Take a book or a box and place it on your head.","Notice how you need to stand so it doesn't fall. Feel how the weight goes down smoothly through the neck, spine, and pelvis.","Feel the weight, the touch of the soles on the ground, and the sense of the axis keeping you upright."]},
     insight:"Gravity is always here. The body is always here. That is enough to get started.",reflection:"What did I notice in my body after the exercise?"},
    {num:2,title:"Breath / Sky",sub:"The Energy of the Present Self",tag:"Energy",color:"var(--color-axis-breath)",hex:"#C07050",icon:"🫁",
     video:"/Basic.mp4",
     summary:"The breath is the element of the Sky, connecting us with the continuous rhythm of life and teaching the acceptance of transience.",
     tldr:"Breath (the Sky) is the rhythm of 'Now'. Exhalation is the relaxation switch. Do not control it, just feel the touch of the air.",
     theorySections:[
       {title:"The Rhythm of Existence",paragraphs: ["If the body unites us with the earth, the breath connects us with the sky and the ceaseless flow of the world.", "Each inhalation: a beginning. Each pause: now. Each exhalation: acceptance."], image: "/breathchapter.svg"},
       {title:"Inner Touch",paragraphs: ["The breath is not just air — it is touch. Feel the air in the nostrils, the expansion of the chest, the soft movement of the belly. This inner touch activates interoception{{interoception}} — the bridge between body and consciousness."], interactive: "eswterikhafh"},
       {title:"The Axis: Unquestionable Here & Ceaseless Flow",paragraphs: ["Body + Breath together form the vertical axis: gravity gives us the 'Here' (vertical stability), the breath the 'Now' (horizontal flow). This cross — Stability x Rhythm — is the foundation upon which attention is built."]},
       {title:"The Breath as an Indicator",paragraphs: ["If it is tight or shallow → tension. If it is slow and deep → relaxation. The breath is the indicator of our mental state."]},
       {title:"Regulation in Intense Anxiety",paragraphs: ["In moments of intense anxiety, we let the exhale{{slow_exhale}} come out through the mouth, slightly slower and more prolonged. The slow exhale activates the vagus nerve{{vagus_nerve}} — the 'brake' of the nervous system, helping us self-regulate{{corrigan_2010}}."]},
       {
         title: "Vocal Breath & Chanting",
         paragraphs: [
           "Producing sound (like humming) creates a vibration that massages the vagus nerve, calming the body. Sound naturally elongates the exhalation without effort."
         ],
         actionLink: {
           url: "/practice?category=vocal",
           label: "✨ Explore 'Chanting & Resonance' Practices"
         }
       }
     ],
     exercise:{title:"Exercise: The Active Return",steps:["Stand comfortably. Feel the gravity.","Turn your attention to the inhalation and exhalation.","Feel the air touching the nostrils.","On the exhale, let the belly contract gently.","If you feel anxious, let the exhalation come out slowly through the mouth."]},
     insight:"I observe without intervening. Every breath is a new beginning.",reflection:"How was my breath? (fast/slow, shallow/deep, tight/free)"},
    {num:3,title:"Attention / Fire",sub:"The Fire of Consciousness",tag:"Direction",color:"var(--color-axis-focus)",hex:"#C8922A",icon:"🔥",
     video:"/Basic.mp4",
     summary:"Attention is the element of Fire — it can focus with intense heat, illuminate, or scatter out of control.",
     tldr:"Attention is like a guiding Fire. Sometimes it gets stuck (hyperfocus), sometimes it scatters. The 'gentle return' trains the flame.",
     theorySections:[
       {title:"The Three Forms of Attention",paragraphs: ["• Focused (Closed): Like a flashlight — it illuminates a point with intensity.", "• Open: Like an open light — it illuminates many things together, without focusing.", "• Scattered: Like a strobe light — it jumps from thought to thought without returning."], interactive: "three_attention"},
       {title:"Anchored Attention (Hyperfocus)",paragraphs: ["The opposite extreme state: the mind locks onto a point and cannot leave. The world around disappears — space, body, time. Any hyperfocus{{hyperfocus}} needs a soft break.", "Tool: Space (soften the gaze, feel the space around{{vater_2022}}) + Body (feel gravity — it 'breaks' the tunnel)."], interactive: "camera_exercise"},
       {title:"Fourfold Attention",paragraphs: ["In full practice, attention doesn't work alone. It focuses on the vertical axis (Body + Breath), and from there it opens into Space. This means 'Fourfold Axis': four centers, one presence."], interactive: "samatha_attention"},
        {title:"Letting Go",paragraphs: ["Practically, 'letting go' means removing your attention from what you are stuck on. In the Fourfold Axis method, to 'let go' practically means to shift from narrow attention into open attention."]},
       {title:"The Power of Labeling",paragraphs: ["When a thought pulls you, label it{{labeling}}: 'Worry', 'Scenario', 'Criticism'. The label creates distance — you are not the thought, you are the one observing it. Then gently return{{gentle_return}} to the axis."]}
     ],
     exercise:{title:"Exercise: Stabilizing the Flashlight",steps:["Sit comfortably. Close your eyes.","Feel your body and the rhythm of your breath.","Open your eyes. Choose a fixed focal point.","Hold your attention there with body and breath awareness.","If you drift away: label it → gently return."]},
     insight:"The return of attention is not a failure — it is the exercise itself.",reflection:"Where does my attention tend to 'stick' or 'run'?"},
    {num:4,title:"Space / Water",sub:"The Infinite Cosmic Ocean",tag:"Opening",color:"var(--color-axis-space)",hex:"#B5A7D0",icon:"🌌",
     video:"/Basic.mp4",
     summary:"Space is the element of Water — the infinite cosmic ocean, the boundless space as trained in Tai Chi. We learn to remain open and fluid, containing all phenomena without resistance.",
     theorySections:[
       {title:"The Antidote to Overload",paragraphs: ["Open Attention{{open_awareness}} is the most powerful tool against overload. The opening of attention acts as a safety signal in the brain: 'there is no danger, there is space'.", "Peripheral vision{{peripheral_vision}}{{vater_2022}}, open hearing, the sense of space around — all these together 'turn off' the alarm signal."]},
       {title:"From Focus to Openness",paragraphs: ["The transition happens in 3 steps:", "1. Focus on a point (Attention).\n2. Soften your gaze — don't hold on.\n3. Let the space embrace you — sounds, body, air, all together.", "You don't try to see everything. You let everything exist."], interactive: "metronomos"},
       {title:"The Sky and the Clouds",paragraphs: ["The space of the sky{{sky_metaphor}} always remains open, just like the space of awareness (Maha Ati/Mahamudra{{mahamudra}}). Thoughts, emotions, sensations — they are clouds. They come and go. You are the space that holds them."], interactive: "openawareness"}
     ],
     exercise:{title:"Exercise: Broadening the Space",steps:["Sit comfortably. Close your eyes.","Feel your body and breath.","Focus on a fixed point for a few seconds.","Let your attention spread — as if embracing the whole field.","Listen, see, feel without focusing and without judgment."]},
     insight:"You are not the clouds. You are the space that holds them.",reflection:"What changed when my attention opened up?"},
    {num:5,title:"Neurodivergent Mind",sub:"Running and Locking",tag:"Focusing",color:"var(--teal-med)",hex:"#2E8B9A",icon:"🧠",
     summary:"The neurodivergent mind is not broken — it operates differently.",
     theorySections:[
       {title:"Your Mind is Not Broken",paragraphs: ["The neurodivergent mind is not defective — it functions differently. Intensity, distraction, locking are not weaknesses — they are patterns. And patterns can be recognized. Recent science{{kim_2025}} confirms that mindfulness is a highly effective intervention for core ADHD symptoms and adult functioning."], interactive: "racing_mind"},
       {title:"A Mind that Runs",paragraphs: ["Scattered Attention / Overload. The world becomes a chain of small hooks — every stimulus grabs a piece of attention.", "Tool: Body (Grounding{{grounding}}) + Breath (Rhythm). Gravity brings you 'here', rhythm brings you 'now'."]},
       {title:"A Mind that Locks",paragraphs: ["Anchored Attention / Hyperfocus{{hyperfocus}}. Like a tunnel of intense focus. Time disappears, the body is forgotten.", "Tool: Space (Release) + Attention (Return). Soften your gaze, feel the space around — it 'breaks' the tunnel."]},
       {title:"The Role of the Mechanical Mind",paragraphs: ["Many neurodivergent individuals develop a 'mechanical mind'{{mechanical_mind}} — an internal system of rules that replaces the missing automation. This is exhausting but brilliant.", "Locking (Hyperfocus) is often fueled by this Mechanical Mind, that part of the brain (Default Mode Network{{brewer_2011}}) that constantly analyzes the past and plans the future, without having a stable base in the present.", "The Mechanical Mind is not an enemy. It is a tool that has 'overheated' without the stabilizing influence of somatic presence. Mindfulness provides the necessary moments of rest to cool the system down."]},
       {title:"Kindness as an Exit from the Autopilot",paragraphs: ["Self-criticism{{self_criticism}} is not your truth — it is an echo. Words you heard, looks you received, expectations unmet. Your nervous system stored them, and now you reproduce the same criticism without even realizing it.", "Neuroscience shows: self-criticism activates the amygdala{{amygdala}} and cortisol — the same circuits as an external danger. Every time you judge yourself, the brain reacts as if under attack.", "The softness of this method is not accidental. It is the very attitude we need to keep towards ourselves. Growth here does not mean productivity — it means fulfilling unique potential, just as a flower blooms when it has suitable soil and space.", "Treat yourself as you would treat a struggling friend{{kindness}}."]}
     ],
     exercise:{title:"Reflection: My Patterns",steps:["When does your mind tend to 'run'?","When does it 'lock'?","What situations trigger it?"]},
     insight:"You do not fight your brain. You collaborate with it.",reflection:"What are the patterns of my own mind?"},
    {num:6,title:"Daily Life",sub:"Self-Regulation",tag:"Regulation",color:"var(--teal-dark)",hex:"#1A5F6E",icon:"☀",
     summary:"Practical tools for noisy environments, social situations, and moments of anxiety.",
     theorySections:[{title:"In Noisy Spaces",paragraphs: ["• Feel your feet on the ground — immediate grounding{{grounding}}.\n• 3 quiet breaths with exhale through the mouth.\n• Open peripheral vision{{peripheral_vision}}.\n• Headphones or fidget toy if needed."]},{title:"In Social Moments",paragraphs: ["• Choose a neutral point (e.g., a plant).\n• Feel your feet stable.\n• Tension in the jaw? Release it with an exhale{{slow_exhale}}."]}],
     exercise:{title:"Practice: With Anxiety or Tension",steps:["Ground: feel the weight and the axis.","10 breaths: inhale through nose, exhale through mouth, slowly.","Walk mindfully — rhythmic movement reduces anxiety."]},
     insight:"Small steps, every day. Consistency in invisible doses is more important than duration.",reflection:"Which situation challenges me the most?"},
    {num:7,title:"When the Wave Rises",sub:"Anxiety & Overload",tag:"Support",color:"var(--terra)",hex:"#C07050",icon:"🌊",
     summary:"Two practical protocols for intense anxiety and overload.",
     theorySections:[{title:"Protocol 1: Intense Anxiety",paragraphs: ["1. Grounding: feel the weight\n2. Breath: 3 deep inhales, slow exhale through mouth{{slow_exhale}}\n3. Label{{labeling}}: 'Worry' or 'Scenario'\n4. Space: open peripheral vision{{peripheral_vision}}"]},{title:"Protocol 2: Overload",paragraphs: ["1. Grounding: feel the soles\n2. Breath: stay in its flow\n3. Attention: a fixed point\n4. Space: soften the gaze — stimuli are clouds"]}],
     exercise:{title:"Reflection: My Body's Signals",steps:["What are the early signals when overload begins?","Where do you first feel tension? (jaw, shoulders, chest?)","Which protocol helps you the most?"]},
     insight:"You are not the clouds. You are the sky that holds them.",reflection:"What will I do differently next time?"},
    {num:8,title:"Cheat Sheet",sub:"The Practice of Presence",tag:"Application",color:"var(--teal-dark)",hex:"#1A5F6E",icon:"📋",
     summary:"A quick 4-step reference sheet — one for each center.",
     theorySections:[{title:"How to use it",paragraphs: ["Do the steps in order or pick the one you need now. Even one step shifts the state."]}],
     exercise:{title:"The 4 Steps of Presence",steps:["BODY: Feel your weight. Notice tensions.","BREATH: How is your breath? Do one exhale through the mouth{{slow_exhale}}.","ATTENTION: Where is your attention? Return to a fixed point.","SPACE: Soften your gaze. Remember the sky — you are the space."]},
     insight:"Goal: to return to 'now' in a few seconds.",reflection:"What did I notice today?"},
    {num:9,title:"The Four Stages",sub:"Step-by-Step Guide",tag:"Steps",color:"var(--gold)",hex:"#C8922A",icon:"👣",
     summary:"The complete, sequential exercise of the Fourfold Axis.",
     theorySections:[{title:"The Logic of Stages",paragraphs: ["Stage 1 → Body (Grounding)\nStage 2 → Breath (Regulation)\nStage 3 → Attention (Concentration)\nStage 4 → Space (Open Awareness)"]},{title:"The Attitude Behind the Steps",paragraphs: ["Before you begin the stages, remember: softness is not optional — it is the method itself. Every time you return without judgment, every time you accept distraction as part of the process — you practice kindness. Not as an idea, but as an action.", "Self-criticism{{self_criticism}} activates the same neural circuits as an external threat. The gentle return{{gentle_return}} calms them. This is the way: not fighting the autopilot, but giving it space to settle.", "Treat yourself as you would treat a struggling friend{{kindness}}."], interactive: "journey"}],
     exercise:{title:"Complete Exercise",steps:["STAGE 1 — Grounding: Sit comfortably. Feel the contact points.","STAGE 2 — Breath: Close your eyes. Inhale nose → lungs → belly.","STAGE 3 — Attention: Open eyes. Fixed point. Label thoughts if they come.","STAGE 4 — Space: Soften the gaze. Feel everything together."]},
     insight:"Presence does not take hours. It starts with victories of a few seconds.",reflection:"Which stage feels most natural to me?"},
    {num:10,title:"Science & Tradition",sub:"Theoretical Backing",tag:"Roots",color:"var(--lav)",hex:"#B5A7D0",icon:"🔬",
     summary:"Scientific and historical foundations of the Fourfold Axis method.",
     theorySections:[
       {title:"Neuroscience",paragraphs: [
         "The Fourfold Axis is backed by robust neuroscience. Learn more about the core mechanisms:",
         "• Proprioception: The sense of gravity activates the proprioceptive system{{proprioception}} — Craig (2002).",
         "• Vagus Nerve: Slow exhalation activates the vagus nerve{{vagus_nerve}} and parasympathetic nervous system, lowering heart rate — Gerritsen & Band (2018).",
         "• Default Mode Network: Mindfulness reduces the active DMN{{dmn}} to quiet mind-wandering and self-criticism — Brewer et al. (2011).",
         "• Neuroplasticity: Regular practice alters brain morphology{{neuroplasticity}}, strengthening your prefrontal cortex — Hölzel et al. (2011)."
       ]},
       {title:"Clinical Research Studies",paragraphs: [
         "To adapt mindfulness safely for neurodivergence, we rely on three pillars of clinical evidence:",
         "• ADHD & Mindfulness: Adapted, sensory-rich, and flexible practices are highly feasible and neurocognitively beneficial{{zylowska_2007}} — Zylowska et al. (2007).",
         "• Interoceptive Anchoring: Active somatic and physical anchoring regulates the insular cortex while avoiding anxiety{{gibson_2019}} — Gibson (2019).",
         "• Microdosing & Practice Habit: A longitudinal study of 280,000+ sessions shows small, consistent doses of focus are far superior to longer sessions for adherence{{cearns_2022}} — Cearns & Clark (2022)."
       ]},
       {title:"Spiritual Traditions",paragraphs: [
         "• Satipatthana Sutta (Theravada): The Four Foundations — body, feeling, mind, phenomena — correspond to the four axes.",
         "• Samatha & Vipassana: Calm abiding (focus) → insight (openness) — the classic progression from the 3rd to the 4th axis.",
         "• Dzogchen (Nyingma): Rigpa — the natural state of open awareness{{open_awareness}}. The 4th axis (Space) corresponds to the nature of the mind.",
         "• Sufism (Inayatiyya): Breath as the bridge between matter and spirit. Rhythm as a path to presence.",
         "• Tai Chi / Qi Gong: Grounding through movement — gravity as teacher. The vertical axis as foundation."
       ]}
     ],
     exercise:{title:"Reflection: My Practice",steps:["Which of the 4 centers comes to you most naturally?","Where do you struggle the most?","What has changed since you started?"]},
     insight:"Your brain can change. Every practice builds new neural pathways.",reflection:"What do I carry from this practice?"}
  ],
  el: [
    {num:1,title:'Σώμα / Γη',sub:'Η Σταθερότητα του «Εδώ»',tag:'Εδώ',color:'var(--color-axis-body)',hex:'#7A9E7E',icon:'⛰️',
     video:'/Basic.mp4',
     summary:'Το Σώμα είναι το στοιχείο της Γης, η αναμφισβήτητη βάση της παρούσας στιγμής. Μαθαίνουμε να αντιλαμβανόμαστε τη βαρύτητα, τη στάση μας και την επαφή μας με το έδαφος.',
     tldr:'Το Σώμα (Η Γη) είναι το μοναδικό σημείο που είναι πάντα στο «Εδώ». Η βαρύτητα είναι η άμεση απόδειξη της παρουσίας σου. Νιώσε το βάρος σου → ηρέμησε τον αυτόματο πιλότο.',
     theorySections:[
       {title:'Η Αρχή: Χαλάρωση και Γείωση',paragraphs: [`Η πρακτική του Τετραπλού Άξονα ξεκινά πάντα με το σώμα. Το σώμα είναι η σταθερή μας βάση, το αδιαμφίβολο «Εδώ» που μας συνδέει με τον παρόντα χρόνο.`, `Το σώμα μας δεν είναι απλώς ένα όχημα. Είναι ένα ζωντανό αρχείο των εμπειριών μας. Η στάση που έχουμε διαμορφώσει κουβαλά συχνά την απόρριψη, την απογοήτευση και την ένταση που βιώσαμε επειδή νιώθαμε διαφορετικοί.`]},
        {title:'Η Βαρύτητα: Το Αναμφίβολο «Εδώ»',paragraphs: [`Η βαρύτητα{{gravity}} δεν είναι απλώς μια δύναμη — είναι η απόδειξη του «Εδώ». Μας δείχνει, χωρίς καμία αμφιβολία, το ακριβές σημείο όπου μπορούμε να υπάρξουμε στον χώρο, αυτή τη συγκεκριμένη στιγμή. Η γείωση{{grounding}} είναι η πρώτη πράξη χαλάρωσης.`], interactive: "gravity_thoughts"},
        {title:'Η Γείωση ως Σωματική Άγκυρα',paragraphs: [`Το Default Mode Network{{dmn}} — ο «αυτόματος πιλότος» — παράγει νοητική περιπλάνηση, αυτοκριτική και επανάληψη παλιών ιστοριών. Κάθε φορά που νιώθεις τη βαρύτητα και τα πόδια σου στο πάτωμα, επαναφέρεις τη σωματική αίσθηση και ενεργοποιείς το ιδιοδεκτικό κέντρο{{proprioception}}.`, `Το DMN μπορεί να μην παύει οριστικά μόνο με τη βαρύτητα –αυτό επιτυγχάνεται μέσω της υπερ-εστίασης (hyperfocus) και της ανοιχτής επίγνωσης– αλλά η γείωση αποτελεί το πρώτο, αναγκαίο άγκιστρο που μας φέρνει πίσω στο παρόν.`]},
        {title:'Ο Απόηχος στο Σώμα',paragraphs: [`Το σφίξιμο στο σώμα, η ένταση, η φωνή που λέει «δεν κάνεις αρκετά» — δεν γεννήθηκαν μέσα σου. Είναι απόηχοι του παρελθόντος: λόγια που άκουσες, βλέμματα που δέχτηκες, προσδοκίες που δεν εκπληρώθηκαν. Το νευρικό σου σύστημα τα αποθήκευσε{{polyvagal}}.`, `Η μέθοδος δεν σου ζητά να πολεμήσεις αυτόν τον απόηχο. Σου ζητά να τον αναγνωρίσεις: «Α, αυτή είναι η παλιά φωνή. Δεν χρειάζεται να την ακολουθήσω». Η αυτοκριτική ενεργοποιεί τα ίδια νευρικά κυκλώματα με τον εξωτερικό κίνδυνο. Η απαλότητα επιτρέπει στο νευρικό σύστημα να ηρεμήσει{{parasympathetic}}.`]},
        {title:'Απόδραση από τις Έννοιες',paragraphs: [`Μέσα στο σώμα δεν υπάρχουν έννοιες — μόνο αισθήσεις{{interoception}}. Βάρος, ζεστασιά, πίεση, παλμός. Όταν στρέφεσαι στο σώμα, βγαίνεις από τη σκέψη χωρίς να πολεμήσεις τη σκέψη.`, `Αυτή η μετάβαση — από τις λέξεις στις αισθήσεις — είναι η βάση κάθε πρακτικής ενσυνειδητότητας.`]},
       {title:'Το Σώμα, ο Χώρος και η Αίσθηση Ασφάλειας',paragraphs: [`Η βαθιά χαλαρότητα μέσα στο σώμα δεν είναι ποτέ μια απομονωμένη πράξη. Προϋποθέτει πάντα την επίγνωση του χώρου. Η πραγματική γείωση (Σώμα) επιτυγχάνεται μόνο μέσα σε έναν χώρο που νιώθουμε ότι μας κρατά — το σώμα και ο χώρος λειτουργούν μαζί{{gibson_1979}}. Το σώμα μας, μέσω των αισθητηρίων οργάνων, μας πληροφορεί συνεχώς για τη θέση μας μέσα στον χώρο.`, `Όταν ο χώρος γίνεται αντιληπτός ως ασφαλής, το νευρικό σύστημα χαλαρεί — και μόνο τότε το σώμα αφήνεται πραγματικά.`]}
     ],
     exercise:{title:'Άσκηση: Το Βιβλίο / Κουτί',steps:['Σταθείτε όρθιοι με άνεση.','Πάρτε ένα βιβλίο ή κουτί και τοποθετήστε το στο κεφάλι σας.','Παρατηρήστε πώς χρειάζεται να σταθείτε για να μην πέσει. Νιώστε πώς το βάρος κατεβαίνει ομαλά μέσα από τον λαιμό, τη σπονδυλική στήλη και τη λεκάνη.','Νιώστε το βάρος, την αφή των πελμάτων στο έδαφος και την αίσθηση του άξονα που σας κρατά όρθιους.']},
     insight:'Η βαρύτητα είναι πάντα εδώ. Το σώμα είναι πάντα εδώ. Αυτό είναι αρκετό για να ξεκινήσουμε.',reflection:'Τι παρατήρησα στο σώμα μου μετά την άσκηση;'},
    {num:2,title:'Αναπνοή / Ουρανός',sub:'Η Ενέργεια του Εαυτού',tag:'Ενέργεια',color:'var(--color-axis-breath)',hex:'#C07050',icon:'🫁',
     video:'/Basic.mp4',
     summary:'Η Αναπνοή είναι ο Ουρανός, που μάς συνδέει με τον ρυθμό της ζωής και διδάσκει την αποδοχή της παροδικότητας.',
     tldr:'Η Αναπνοή (Ο Ουρανός) είναι ο ρυθμός του «Τώρα». Η εκπνοή είναι ο διακόπτης χαλάρωσης. Μην την ελέγχεις, απλώς νιώσε την αφή του αέρα.',
     theorySections:[
       {title:'Ο Ρυθμός της Ύπαρξης',paragraphs: [`Αν το σώμα μάς ενώνει με τη γη, η αναπνοή μάς συνδέει με τον ουρανό και την αδιάκοπη ροή του κόσμου.`, `Κάθε εισπνοή: αρχή. Κάθε παύση: τώρα. Κάθε εκπνοή: αποδοχή.`], image: '/breathchapter.svg'},
       {title:'Εσωτερική Αφή',paragraphs: [`Η αναπνοή δεν είναι μόνο αέρας — είναι αφή. Νιώσε τον αέρα στα ρουθούνια, τη διαστολή του στήθους, τη μαλακή κίνηση της κοιλιάς. Αυτή η εσωτερική αφή ενεργοποιεί τη δια-αίσθηση{{interoception}} (interoception) — τη γέφυρα μεταξύ σώματος και συνείδησης.`], interactive: "eswterikhafh"},
       {title:'Ο Άξονας: Αναμφίβολο Εδώ & Αδιάκοπη Ροή',paragraphs: [`Σώμα + Αναπνοή μαζί σχηματίζουν τον κατακόρυφο άξονα: η βαρύτητα μάς δίνει το «Εδώ» (κάθετη σταθερότητα), η αναπνοή το «Τώρα» (οριζόντια ροή). Αυτός ο σταυρός — Σταθερότητα x Ρυθμός — είναι η βάση πάνω στην οποία χτίζεται η προσοχή.`]},
       {title:'Η Αναπνοή ως Δείκτης',paragraphs: [`Αν είναι σφιγμένη ή ρηχή → ένταση. Αν είναι αργή και βαθιά → χαλάρωση. Η αναπνοή είναι ο δείκτης της ψυχικής μας κατάστασης.`]},
       {title:'Ρύθμιση σε Έντονο Άγχος',paragraphs: [`Σε στιγμές έντονου άγχους, αφήνουμε την εκπνοή{{slow_exhale}} να βγαίνει από το στόμα, λίγο πιο αργά και παρατεταμένα. Η αργή εκπνοή ενεργοποιεί το πνευμονογαστρικό νεύρο{{vagus_nerve}} — το «φρένο» του νευρικού συστήματος, προσφέροντας άμεση αυτορρύθμιση{{corrigan_2010}}.`]},
       {
         title: 'Ηχητική Αναπνοή (Ψάλσιμο)',
         paragraphs: [
           'Η παραγωγή ήχου (όπως το humming) δημιουργεί δόνηση που κάνει μασάζ στο πνευμονογαστρικό νεύρο, ηρεμώντας το σώμα. Ο ήχος επιμηκύνει φυσικά την εκπνοή χωρίς κόπο.'
         ],
         actionLink: {
           url: '/practice?category=vocal',
           label: '✨ Εξερεύνησε τις πρακτικές «Ψάλσιμο & Αντήχηση» (Humming)'
         }
       }
     ],
     exercise:{title:'Άσκηση: Η Ενεργή Επιστροφή',steps:['Στάσου άνετα. Νιώσε τη βαρύτητα.','Στρέψε την προσοχή στην εισπνοή και εκπνοή.','Νιώσε τον αέρα που αγγίζει τα ρουθούνια.','Στην εκπνοή, άφησε την κοιλιά να μαζευτεί ήπια.','Αν νιώθεις άγχος, άφησε την εκπνοή να βγαίνει αργά από το στόμα.']},
     insight:'Παρατηρώ χωρίς να επεμβαίνω. Κάθε αναπνοή είναι μια νέα αρχή.',reflection:'Πώς ήταν η αναπνοή μου; (γρήγορη/αργή, ρηχή/βαθιά, σφιγμένη/ελεύθερη)'},
    {num:3,title:'Προσοχή / Φωτιά',sub:'Η Φλόγα της Συνείδησης',tag:'Κατεύθυνση',color:'var(--color-axis-focus)',hex:'#C8922A',icon:'🔥',
     video:'/Basic.mp4',
     summary:'Η Προσοχή είναι το στοιχείο της Φωτιάς — μπορεί να εστιάζει ισχυρά, να ζεσταίνει ή να καίει ανεξέλεγκτα και να διασπάται.',
     tldr:'Η Προσοχή είναι σαν τη Φωτιά. Μερικές φορές κολλάει (hyperfocus{{hyperfocus}}), μερικές φορές σκορπίζει. Η «απαλή επιστροφή{{gentle_return}}» χωρίς κριτική γυμνάζει τη φλόγα.',
     theorySections:[
       {title:'Οι Τρεις Μορφές Προσοχής',paragraphs: [`• Εστιασμένη (Κλειστή): Σαν φακός — φωτίζει ένα σημείο με ένταση.`, `• Ανοιχτή: Σαν ανοιχτό φως — φωτίζει πολλά μαζί, χωρίς εστίαση.`, `• Διασπασμένη: Σαν στροβοσκόπιο — πηδά από σκέψη σε σκέψη χωρίς επιστροφή.`], interactive: "three_attention"},
       {title:'Αγκυλωμένη Προσοχή (Hyperfocus)',paragraphs: [`Η αντίθετη ακραία κατάσταση: ο νους κλειδώνει σε ένα σημείο και δεν μπορεί να φύγει. Ο κόσμος γύρω εξαφανίζεται — χώρος, σώμα, χρόνος.`, `Εργαλείο: Χώρος (μαλάκωσε το βλέμμα, νιώσε τον χώρο γύρω{{vater_2022}}) + Σώμα (νιώσε τη βαρύτητα — «σπάει» το τούνελ).`], interactive: "camera_exercise"},
       {title:'Τετραπλή Προσοχή',paragraphs: [`Στην πλήρη πρακτική, η προσοχή δεν λειτουργεί μόνη. Εστιάζει πάνω στον κατακόρυφο άξονα (Σώμα + Αναπνοή), και από εκεί ανοίγει στον Χώρο. Αυτό σημαίνει «Τετραπλός Άξονας»: τέσσερα κέντρα, μία παρουσία.`], interactive: "samatha_attention"},
        {title:'Το «Άφησέ το» (Let Go)',paragraphs: [`Πρακτικά, «άφησέ το» σημαίνει αφαίρεσε την προσοχή σου από αυτό που έχεις κολλήσει. Στη μέθοδο του τετραπλού άξονα, το «άφησέ το» πρακτικά σημαίνει να βγεις από την στενή προσοχή στην ανοιχτή προσοχή.`]},
       {title:'Η Δύναμη της Ταμπέλας',paragraphs: [`Όταν μια σκέψη σε τραβά, βάλε της ταμπέλα{{labeling}}: «Ανησυχία», «Σενάριο», «Κριτική». Η ταμπέλα δημιουργεί απόσταση — δεν είσαι η σκέψη, είσαι αυτός που την παρατηρεί. Μετά επέστρεψε απαλά στον άξονα.`]},
       {title:'Υπερφόρτωση Αισθήσεων',paragraphs: [`Προσομοιώνει τη διάσπαση προσοχής (sensory overload) για να καταλάβουμε την ανάγκη επιστροφής στον άξονα.`], interactive: "attention_dispersion"}
     ],
     exercise:{title:'Άσκηση: Σταθεροποίηση του Φακού',steps:['Κάθισε άνετα. Κλείσε τα μάτια.','Νιώσε το σώμα σου και τον ρυθμό της αναπνοής.','Άνοιξε τα μάτια. Επίλεξε ένα σταθερό σημείο εστίασης.','Κράτησε την προσοχή εκεί με επίγνωση σώματος και αναπνοής.','Αν παρασυρθείς: βάλε ταμπέλα → επέστρεψε απαλά.']},
     insight:'Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση.',reflection:'Πού τείνει να «κολλάει» ή να «τρέχει» η προσοχή μου;'},
    {num:4,title:'Χώρος / Νερό',sub:'Ο Άπειρος Κοσμικός Ωκεανός',tag:'Άνοιγμα',color:'var(--color-axis-space)',hex:'#B5A7D0',icon:'🌌',
     video:'/Basic.mp4',
     summary:'Ο Χώρος είναι το στοιχείο του Νερού – ο άπειρος κοσμικός ωκεανός, ο άπειρος χώρος όπως εκπαιδεύεται στο Τάι Τσι. Μαθαίνουμε να υπάρχουμε σε ανοιχτότητα, περιέχοντας τα πάντα χωρίς αντίσταση.',
     theorySections:[
       {title:'Το Αντίδοτο στην Υπερφόρτωση',paragraphs: [`Η Ανοιχτή Προσοχή{{open_awareness}} είναι το πιο ισχυρό εργαλείο ενάντια στην υπερφόρτωση. Το άνοιγμα της προσοχής λειτουργεί ως σήμα ασφάλειας στον εγκέφαλο: «δεν υπάρχει κίνδυνος, υπάρχει χώρος».`, `Η περιφερειακή όραση{{peripheral_vision}}{{vater_2022}}, η ανοιχτή ακοή, η αίσθηση του χώρου γύρω — όλα αυτά μαζί «σβήνουν» το σήμα συναγερμού.`]},
       {title:'Από την Εστίαση στην Ανοιχτότητα',paragraphs: [`Η μετάβαση γίνεται σε 3 βήματα:`, `1. Εστίασε σε ένα σημείο (Προσοχή).\n2. Μαλάκωσε το βλέμμα — μην κρατάς.\n3. Άφησε τον χώρο να σε αγκαλιάσει — ήχοι, σώμα, αέρας, όλα μαζί.`, `Δεν προσπαθείς να δεις τα πάντα. Αφήνεις τα πάντα να υπάρχουν.`], interactive: "metronomos"},
       {title:'Ο Ουρανός και τα Σύννεφα',paragraphs: [`Ο χώρος του ουρανού{{sky_metaphor}} μένει πάντα ανοιχτός, όπως και ο χώρος της επίγνωσης (Μάχα Άτι - Maha Ati/Mahamudra{{mahamudra}}). Σκέψεις, συναισθήματα, αισθήσεις — είναι σύννεφα. Έρχονται και φεύγουν. Εσύ είσαι ο χώρος που τα χωράει.`], interactive: "openawareness"}
     ],
     exercise:{title:'Άσκηση: Διεύρυνση του Χώρου',steps:['Κάθισε άνετα. Κλείσε τα μάτια.','Νιώσε το σώμα και την αναπνοή.','Εστίασε σε ένα σταθερό σημείο για λίγα δευτερόλεπτα.','Άφησε την προσοχή να απλωθεί — σαν να αγκαλιάζει όλο το πεδίο.','Άκου, δες, νιώσε χωρίς εστίαση και χωρίς κριτική.']},
     insight:'Δεν είσαι τα σύννεφα. Είσαι ο χώρος που τα χωράει.',reflection:'Τι άλλαξε όταν η προσοχή άνοιξε;'},
    {num:5,title:'Νευροδιαφορετικός Νους',sub:'Τρέξιμο & Αγκύλωση',tag:'Μοτίβα',color:'var(--gold-dark)',hex:'#B07B1E',icon:'🧠',
      video:'/Basic.mp4',
      summary:'Ο νευροδιαφορετικός νους μπορεί να λειτουργεί σε ακρότητες. Εργαλεία για όταν τρέχει με ταχύτητα ή όταν κλειδώνει σε hyperfocus.',
      theorySections:[
        {title:'Η Δυναμική του Νου: Ανάμεσα σε δύο Άκρα',paragraphs: [`Ο νους ενός νευροδιαφορετικού ανθρώπου σπάνια είναι στατικός. Συνήθως κινείται ανάμεσα σε δύο ακραίες καταστάσεις: <strong>«τρέχει»</strong> ή <strong>«κλειδώνει»</strong>. Η ενσυνειδητότητα δεν στοχεύει στο να σταματήσει αυτή την κίνηση, αλλά στο να σου δείξει πώς να στέκεσαι μέσα σε αυτές τις καταστάσεις χωρίς να χάνεσαι. Επιστημονικά δεδομένα{{kim_2025}} αποδεικνύουν πλέον ότι αποτελεί κλινικά αποτελεσματική παρέμβαση για τα συμπτώματα της ΔΕΠΥ.`], interactive: "racing_mind"},
        {title:'1. Όταν ο Νους ΤΡΕΧΕΙ (Διάσπαση & Υπερφόρτωση)',paragraphs: [`Ο νους γεμίζει με ταχύτητα από ιδέες, εικόνες και ερεθίσματα. Μπορεί να πηδά από νόημα σε νόημα, ξεκινώντας δέκα πράγματα ταυτόχρονα χωρίς να ολοκληρώνει κανένα. Ο κόσμος γίνεται μια αλυσίδα από μικρά άγκιστρα — κάθε ερέθισμα κρατά ένα κομμάτι της προσοχής σου. Συχνά, πολλά ερεθίσματα φτάνουν ταυτόχρονα χωρίς φίλτρο, δημιουργώντας μια αίσθηση υπερφόρτωσης και την ανάγκη για απομόνωση.`, `• <strong>Το Εργαλείο:</strong> <strong>Σώμα (Γείωση)</strong>.`, `• <strong>Η Πρακτική:</strong> Η βαρύτητα σε φέρνει «εδώ». Φέρε την προσοχή σου στο σώμα για να βρεις σταθερότητα μέσα στην ταχύτητα.`]},
        {title:'2. Όταν ο Νους ΚΛΕΙΔΩΝΕΙ (Hyperfocus & Αγκύλωση)',paragraphs: [`Είναι ένα τούνελ έντονης εστίασης που σε ενώνει με ένα μόνο αντικείμενο, ενώ ο εξωτερικός κόσμος φαίνεται να σβήνει. Αυτή η υπερ-συγκέντρωση είναι πηγή δημιουργίας και λύσεων, αλλά μπορεί να γίνει παγίδα αν το αντικείμενο της εστίασης είναι μια αγχώδης σκέψη ή μια εμμονή. Σε αυτή την κατάσταση, ο χρόνος εξαφανίζεται και το σώμα ξεχνιέται.`, `• <strong>Το Εργαλείο:</strong> <strong>Αναπνοή (Ρυθμός) & Χώρος (Απελευθέρωση)</strong>.`, `• <strong>Η Πρακτική:</strong> Ο ρυθμός της αναπνοής σε φέρνει στο «τώρα». Μαλάκωσε το βλέμμα και νιώσε τον χώρο γύρω σου για να «σπάσει» το τούνελ και να ανακτήσεις την ελευθερία σου.`]},
        {title:'Ο «Μηχανικός Νους» και η Ανάπαυση',paragraphs: [`Πολλοί νευροδιαφορετικοί άνθρωποι αναπτύσσουν έναν <strong>«μηχανικό νου»</strong>{{mechanical_mind}}: ένα εσωτερικό σύστημα κανόνων που αντικαθιστά τους αυτοματισμούς που λείπουν. Αν και εξυπνότατο, αυτό το σύστημα είναι εξαιρετικά κουραστικό.`, `Το «κλείδωμα» (Hyperfocus) συχνά τροφοδοτείται από αυτόν τον Μηχανικό Νου, το δίκτυο εκείνο του εγκεφάλου (Default Mode Network{{brewer_2011}}) που αναλύει συνεχώς το παρελθόν και σχεδιάζει το μέλλον, χωρίς να έχει σταθερή βάση στο παρόν.`, `Ο Μηχανικός Νους δεν είναι εχθρός. Είναι ένα εργαλείο που έχει «υπερθερμανθεί» χωρίς τη σταθεροποιητική επιρροή της σωματικής παρουσίας. Η ενσυνειδητότητα δεν τον αντικαθιστά — τον ανακουφίζει, προσφέροντας την απαραίτητη ανάπαυση.`]},
        {title:'Η Καλοσύνη ως Έξοδος από τον Αυτόματο Πιλότο',paragraphs: [`Η αυτοκριτική{{self_criticism}} δεν είναι η δική σου αλήθεια — είναι ένας απόηχος από λόγια, βλέμματα και προσδοκίες που δεν εκπληρώθηκαν. Η νευροεπιστήμη δείχνει ότι η αυτοκριτική ενεργοποιεί τα ίδια κυκλώματα στον εγκέφαλο (αμυγδαλή{{amygdala}} και κορτιζόλη) με τον εξωτερικό κίνδυνο. Κάθε φορά που κρίνεις αυστηρά τον εαυτό σου, ο εγκέφαλός σου αντιδρά σαν να δέχεσαι επίθεση.`, `Η απαλότητα αυτής της μεθόδου είναι η στάση που χρειάζεται να κρατάμε απέναντί μας. Η ανάπτυξη εδώ δεν σημαίνει παραγωγικότητα, αλλά την άνθιση του μοναδικού σου δυναμικού.`, `Θυμήσου: Οι σκέψεις και οι εμπειρίες σου συμβαίνουν μέσα σε έναν ευρύτερο χώρο επίγνωσης. Μέσα σε αυτόν τον ανοιχτό χώρο, μπορείς να αναγνωρίσεις τις πραγματικές τους διαστάσεις. Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται{{kindness}}.`]}
      ],
      exercise:{title:'Αναστοχασμός: Τα μοτίβα μου',steps:['Πότε τείνει να «τρέχει» ο νους σου;','Πότε «κλειδώνει»;','Ποιες καταστάσεις το προκαλούν;']},
      insight:'Δεν πολεμάς τον εγκέφαλό σου. Συνεργάζεσαι μαζί του.',reflection:'Ποια είναι τα μοτίβα του δικού μου νου;'},
     {num:6,title:'Καθημερινή ζωή',sub:'Αυτορρύθμιση',tag:'Ρύθμιση',color:'var(--teal-dark)',hex:'#1A5F6E',icon:'☀',
     summary:'Πρακτικά εργαλεία για θορυβώδεις χώρους, κοινωνικές καταστάσεις και στιγμές άγχους.',
     theorySections:[{title:'Σε Θορυβώδεις Χώρους',paragraphs: [`• Νιώσε τα πόδια στο έδαφος — άμεση γείωση.\n• 3 ήσυχες αναπνοές με εκπνοή από το στόμα.\n• Άνοιξε την περιφερειακή όραση.\n• Ακουστικά ή fidget toy αν χρειαστεί.`]},{title:'Σε Κοινωνικές Στιγμές',paragraphs: [`• Επίλεξε ένα ουδέτερο σημείο (π.χ. φυτό).\n• Νιώσε τα πόδια σταθερά.\n• Ένταση στο σαγόνι; Άφησέ την με εκπνοή.`]}],
     exercise:{title:'Πρακτική: Με Άγχος ή Ένταση',steps:['Γείωσε: νιώσε το βάρος και τον άξονα.','10 αναπνοές: εισπνοή από μύτη, εκπνοή από στόμα, αργά.','Περπάτα με επίγνωση — η ρυθμική κίνηση μειώνει το άγχος.']},
     insight:"Μικρά βήματα, κάθε μέρα. Η συνέπεια σε αόρατες δόσεις είναι πιο σημαντική από τη διάρκεια.",reflection:"Ποια κατάσταση με δυσκολεύει περισσότερο;"},
    {num:7,title:'Όταν το Κύμα Ανεβαίνει',sub:'Άγχος & Υπερφόρτωση',tag:'Στήριξη',color:'var(--terra)',hex:'#C07050',icon:'🌊',
     summary:'Δύο πρακτικά πρωτόκολλα για έντονο άγχος και υπερφόρτωση.',
     theorySections:[{title:'Πρωτόκολλο 1: Έντονο Άγχος',paragraphs: [`1. Γείωση: νιώσε το βάρος\n2. Αναπνοή: 3 βαθιές εισπνοές, αργή εκπνοή από στόμα{{slow_exhale}}\n3. Ταμπέλα{{labeling}}: «Ανησυχία» ή «Σενάριο»\n4. Χώρος: άνοιξε περιφερειακή όραση`]},{title:'Πρωτόκολλο 2: Υπερφόρτωση',paragraphs: [`1. Γείωση: νιώσε τα πέλματα\n2. Αναπνοή: μείνε στη ροή της\n3. Προσοχή: ένα σταθερό σημείο\n4. Χώρος: μαλάκωσε το βλέμμα — τα ερεθίσματα είναι σύννεφα`]}],
     exercise:{title:'Αναστοχασμός: Τα σήματα του σώματός μου',steps:['Ποια είναι τα πρώτα σήματα όταν αρχίζει η υπερφόρτωση;','Πού νιώθεις πρώτα την ένταση; (σαγόνι, ώμοι, στήθος;)','Ποιο πρωτόκολλο σε βοηθά περισσότερο;']},
     insight:'Δεν είσαι τα σύννεφα. Είσαι ο ουρανός που τα χωράει.',reflection:'Τι θα κάνω διαφορετικά την επόμενη φορά;'},
    {num:8,title:'Φύλλο Εργασίας',sub:'Η Πρακτική της Παρουσίας',tag:'Εφαρμογή',color:'var(--teal-dark)',hex:'#1A5F6E',icon:'📋',
     summary:'Ένα γρήγορο φύλλο αναφοράς 4 βημάτων — ένα για κάθε κέντρο.',
     theorySections:[{title:'Πώς να το χρησιμοποιήσεις',paragraphs: [`Κάνε τα βήματα με σειρά ή διάλεξε αυτό που χρειάζεσαι τώρα. Ακόμα και ένα βήμα αλλάζει την κατάσταση.`]}],
     exercise:{title:'Τα 4 Βήματα Παρουσίας',steps:['ΣΩΜΑ: Νιώσε το βάρος σου. Παρατήρησε εντάσεις.','ΑΝΑΠΝΟΗ: Πώς είναι η αναπνοή σου; Κάνε μία εκπνοή από το στόμα{{slow_exhale}}.','ΠΡΟΣΟΧΗ: Πού είναι η προσοχή σου; Επέστρεψε σε ένα σταθερό σημείο.','ΧΩΡΟΣ: Μαλάκωσε το βλέμμα. Θυμήσου τον ουρανό — είσαι ο χώρος.']},
     insight:'Στόχος: να επιστρέφεις στο «τώρα» σε λίγα δευτερόλεπτα.',reflection:'Τι παρατήρησα σήμερα;'},
    {num:9,title:'Τα Τέσσερα Στάδια',sub:'Οδηγός Βήμα-Βήμα',tag:'Βήματα',color:'var(--gold)',hex:'#C8922A',icon:'👣',
     summary:'Η πλήρης, διαδοχική άσκηση του Τετραπλού Άξονα.',
     theorySections:[{title:'Η Λογική των Σταδίων',paragraphs: [`Στάδιο 1 → Σώμα (Γείωση)\nΣτάδιο 2 → Αναπνοή (Ρύθμιση)\nΣτάδιο 3 → Προσοχή (Συγκέντρωση)\nΣτάδιο 4 → Χώρος (Ανοιχτή Επίγνωση)`]},{title:'Η Στάση Πίσω από τα Βήματα',paragraphs: [`Πριν ξεκινήσεις τα στάδια, θυμήσου: η απαλότητα δεν είναι προαιρετική — είναι η ίδια η μέθοδος. Κάθε φορά που επιστρέφεις χωρίς κριτική, κάθε φορά που δέχεσαι τη διάσπαση ως μέρος της διαδικασίας — εξασκείς καλοσύνη. Όχι ως ιδέα, ως πράξη.`, `Η αυτοκριτική ενεργοποιεί τα ίδια νευρικά κυκλώματα με τον εξωτερικό κίνδυνο. Η απαλή επιστροφή{{gentle_return}} τα ηρεμεί. Αυτός είναι ο δρόμος: όχι πολεμώντας τον αυτόματο πιλότο, αλλά dίνοντάς του χώρο να ηρεμήσει.`, `Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται{{kindness}}.`]}],
     exercise:{title:'Ολοκληρωμένη Άσκηση',steps:['ΣΤΑΔΙΟ 1 — Γείωση: Κάθισε άνετα. Νιώσε τα σημεία επαφής.','ΣΤΑΔΙΟ 2 — Αναπνοή: Κλείσε τα μάτια. Εισπνοή από τη μύτη → πνεύμονες → κοιλιά.','ΣΤΑΔΙΟ 3 — Προσοχή: Άνοιξε τα μάτια. Σταθερό σημείο. Ταμπέλα αν έρθουν σκέψεις.','ΣΤΑΔΙΟ 4 — Χώρος: Μαλάκωσε το βλέμμα. Νιώσε όλα μαζί.']},
     insight:'Η παρουσία δεν χρειάζεται ώρες. Ξεκινά με νίκες λίγων δευτερολέπτων.',reflection:'Ποιο στάδιο μου είναι πιο φυσικό;'},
    {num:10,title:'Επιστήμη & Σοφία',sub:'Το Υπόβαθρο',tag:'Βάθος',color:'var(--lav)',hex:'#B5A7D0',icon:'🔭',
     summary:'Η επιστήμη και η πνευματικότητα συμφωνούν — η ισορροπία ξεκινά από το σώμα.',
     theorySections:[
       {title:'Νευροεπιστήμη',paragraphs: [
         `• Ιδιοδεκτικότητα: Η αίσθηση βαρύτητας ενεργοποιεί το ιδιοδεκτικό σύστημα{{proprioception}} — Craig (2002) Nature Reviews Neuroscience.`,
         `• Πνευμονογαστρικό νεύρο: Η αργή εκπνοή ενεργοποιεί το vagus nerve{{vagus_nerve}}, μειώνει καρδιακό ρυθμό — Gerritsen & Band (2018).`,
         `• Default Mode Network: Η ενσυνειδητότητα μειώνει τη δραστηριότητα του DMN{{dmn}} — Brewer et al. (2011) PNAS.`,
         `• Προμετωπιαίος Φλοιός: Η εστιασμένη προσοχή ενισχύει τον PFC — θεμέλιο της αυτορρύθμισης.`,
         `• Νευροπλαστικότητα: 8 εβδομάδες πρακτικής αλλάζουν μετρήσιμα τη δομή του εγκεφάλου{{neuroplasticity}} — Hölzel et al. (2011).`
       ]},
       {title:'Κλινικές Μελέτες Έρευνας',paragraphs: [
         `Για να προσαρμόσουμε την ενσυνειδητότητα με ασφάλεια στη νευροδιαφορετικότητα, βασιζόμαστε σε τρεις πυλώνες κλινικής τεκμηρίωσης:`,
         `• ΔΕΠΥ & Προσαρμοσμένη Ενσυνειδητότητα: Οι σύντομες, ευέλικτες και αισθητηριακά πλούσιες πρακτικές είναι εξαιρετικά αποτελεσματικές και εφαρμόσιμες{{zylowska_2007}} — Zylowska et al. (2007).`,
         `• Σωματική Αγκύρωση & Δια-αίσθηση: Η ενεργή σωματική εστίαση (αντί για την παθητική παρατήρηση) ρυθμίζει τη Νήσο χωρίς να πυροδοτεί άγχος{{gibson_2019}} — Gibson (2019).`,
         `• Μικροδόσεις & Συνήθεια Πρακτικής: Μια τεράστια μελέτη σε 280.000+ συνεδρίες αποδεικνύει ότι οι σύντομες, καθημερινές «μικροδόσεις» είναι ανώτερες των μεγάλων σπάνιων συνεδριών για τη συμμόρφωση και τη μείωση του άγχους{{cearns_2022}} — Cearns & Clark (2022).`
       ]},
       {title:'Πνευματικές Παραδόσεις',paragraphs: [
         `• Satipatthana Sutta (Θεραβάντα): Τα Τέσσερα Θεμέλια — σώμα, αίσθηση, νους, φαινόμενα — αντιστοιχούν στους τέσσερις άξονες.`,
         `• Samatha & Vipassana: Γαλήνια παραμονή (εστίαση) → ενόραση (ανοιχτότητα) — η κλασική διαδρομή από τον 3ο στον 4ο άξονα.`,
         `• Dzogchen (Nyingma): Rigpa — η φυσική κατάσταση ανοιχτής επίγνωσης{{open_awareness}}. Ο 4ος άξονας (Χώρος) αντιστοιχεί στη φύση του νου.`,
         `• Σουφισμός (Inayatiyya): Η αναπνοή ως γέφυρα μεταξύ ύλης και πνεύματος. Ο ρυθμός ως δρόμος προς την παρουσία.`,
         `• Tai Chi / Qi Gong: Γείωση μέσω κίνησης — η βαρύτητα ως δάσκαλος. Ο κατακόρυφος άξονας ως θεμέλιο.`
       ]}
     ],
     exercise:{title:'Αναστοχασμός: Η διαδρομή μου',steps:['Ποιο από τα 4 κέντρα σου έρχεται πιο φυσικά;','Πού δυσκολεύεσαι περισσότερο;','Τι έχει αλλάξει από τότε που ξεκίνησες;']},
     insight:'Ο εγκέφαλός σου μπορεί να αλλάξει. Κάθε πρακτική χτίζει νέους νευρωνικούς διαδρόμους.',reflection:'Τι κουβαλάω από αυτή την πρακτική;'}
  ]
};

export const CHAPTER_PRACTICES = {
  // Mapping can go here if needed
};
