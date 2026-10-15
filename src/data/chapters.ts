import { Chapter } from './types';

// Chapters 1–6 and 8–11 follow book/workbook_el.md (the master); the English
// text is translated from the Greek app text. Concept markers {{id}} open the
// matching entry in concepts.ts.
export const CHAPTERS_DATA: Record<string, Chapter[]> = {
  "en": [
    {
      "num": 1,
      "title": "Body",
      "sub": "The Stability of \"Here\"",
      "tag": "Here",
      "color": "var(--color-axis-body)",
      "hex": "#7A9E7E",
      "icon": "⚓",
      "video": "/Basic.mp4",
      "summary": "The body is the undeniable ground of the present moment. You learn to perceive gravity, your posture and your contact with space, as the starting point of every practice.",
      "tldr": "The body is the only place that is always \"Here\". Gravity is the direct proof of your presence. Feel your weight, and the mind finds somewhere to stand.",
      "theorySections": [
        {
          "title": "The Beginning: Relaxation and Grounding",
          "paragraphs": [
            "The practice of the Fourfold Axis always begins with the body. The body is your stable base, the undeniable \"Here\" that connects you with the present. We begin with conscious grounding, because relaxation comes before awareness.",
            "Your body is not just a vehicle. It is a living archive of your experiences. The posture you have formed often carries the rejection, the disappointment and the tension you lived through because you felt different. These experiences get \"locked in\" as chronic tightness in the shoulders, the back, the pelvis and the jaw."
          ]
        },
        {
          "title": "Gravity: The Undeniable \"Here\"",
          "paragraphs": [
            "Gravity{{gravity}} is not just a force. It is the proof of \"Here\". It shows you, beyond any doubt, exactly the point where you can exist in space, at this very moment. Grounding{{grounding}} is the first act of relaxation."
          ],
          "interactive": "gravity_thoughts"
        },
        {
          "title": "Your Goal",
          "paragraphs": [
            "• <strong>Not:</strong> to achieve a specific, perfect posture.\n• <strong>Not:</strong> to stop your thoughts.\n• <strong>Yes:</strong> to be comfortable, grounded and relaxed within your body."
          ]
        },
        {
          "title": "The Body, Space and the Sense of Safety",
          "paragraphs": [
            "Deep relaxation in the body is never an isolated act. It always presupposes awareness of space. Through the senses, your body keeps informing you of your position in space{{proprioception}}.",
            "When space is perceived as open and welcoming, the body is given permission to let go of tightness and relax. True grounding happens only in a space you feel can hold you. The body and space work together{{gibson_1979}}."
          ]
        },
        {
          "title": "Escaping the Concepts",
          "paragraphs": [
            "Inside the body there are no concepts, only sensations{{interoception}}: weight, warmth, pressure, pulse. When you turn to the body, you step out of thinking without fighting thinking.",
            "When the mind has no stable, undeniable base in the present, it often falls into the trap of inner analysis and scenarios. Focusing on gravity gives you a way out of these mental scenarios.",
            "Analysis and observation come in their own time, once stability is there.",
            "This is a good moment to name two functions you will meet throughout this guide. The <strong>Mechanical Mind</strong>{{mechanical_mind}} is the part of the mind that analyses the past and plans the future: a useful tool, but with no sense of now. The <strong>Open Mind</strong> is its complementary function: it observes without analysing, embraces without judging, sees beyond the scenarios. The content of the Mechanical Mind is recognised and let go, if it is not useful or if it is harmful, without any need for analysis. You will meet both again, in detail, in Chapter 5.",
            "<strong>An undeniable \"Here\" and a ceaseless flow.</strong> While gravity gives you an unshakeable \"Here\", on a larger scale there is only movement and flow (like the Earth around the Sun). Mindfulness teaches you to embrace both poles: the stability of gravity and the ceaseless flow of life.",
            "<strong>An important note on time.</strong> Changing posture and tension takes a good while. The habit was built over years and the body has been moulded. Do not rush and do not push yourself. Persistence in gentleness is the greatest act of self-regulation."
          ]
        },
        {
          "title": "Four Exercises for Earth",
          "paragraphs": [
            "From a single moment to a few minutes. Start with whichever suits you.",
            "1. <strong>The drop of weight</strong> (1 second) — Wherever you are, stop for a moment and let your weight \"drop\" towards the earth. That is all.\n2. <strong>The soles</strong> (20 seconds) — Bring your attention to the soles of your feet. Feel the contact with the ground, the weight spreading, the earth holding you.\n3. <strong>The axis</strong> (1 minute) — Feel the imaginary vertical line from the crown of your head to your soles. With each exhale, soften your jaw and shoulders around it.\n4. <strong>Slow walking</strong> (2–3 minutes) — Walk more slowly than usual, feeling each sole touch down and push off. The earth holds you at every step."
          ],
          "actionLink": {
            "url": "/practice/grounding",
            "label": "Guided grounding exercise"
          }
        }
      ],
      "exercise": {
        "title": "The Book / Box",
        "steps": [
          "Position: Stand comfortably upright.",
          "Prop (optional): Take a book or a box and place it on your head.",
          "Focus: Notice how you need to stand so that it does not fall. Feel the weight descend smoothly through the neck, the spine and the pelvis.",
          "Sensation: Feel the weight, the touch of your soles on the ground and the sense of the axis that keeps you upright."
        ]
      },
      "insight": "Gravity is always here. The body is always here. That is enough to begin.",
      "reflection": "After the exercise, what did I notice in my body?"
    },
    {
      "num": 2,
      "title": "Breath",
      "sub": "The Rhythm of Life",
      "tag": "Energy",
      "color": "var(--color-axis-breath)",
      "hex": "#C07050",
      "icon": "🫁",
      "video": "/Basic.mp4",
      "summary": "The breath connects you with the rhythm of life and teaches the acceptance of impermanence. Every inhale and exhale is a small rehearsal of beginning and ending.",
      "tldr": "The breath is the rhythm that is always with you. You do not correct it; you observe it. The tool is always the exhale.",
      "theorySections": [
        {
          "title": "The Rhythm of Existence",
          "paragraphs": [
            "If the body joins you to the earth, the breath connects you with the air and the ceaseless flow of the world. It is the rhythm that accompanies you from birth to the end.",
            "Observing the breath teaches you the natural rhythm of existence and the acceptance of impermanence. Each inhale is held for a moment and then let go with the exhale.",
            "• <strong>INHALE — The Beginning:</strong> birth, receiving.\n• <strong>PAUSE — The Moment:</strong> existing in the now.\n• <strong>EXHALE — The Ending:</strong> release, acceptance.",
            "This matters for the neurodivergent mind: when you feel an intense emotion, it can feel permanent. By observing the rhythm of the breath, you learn that every state is passing."
          ],
          "image": "/breathchapter.svg"
        },
        {
          "title": "The Act of Observation — Inner Touch",
          "paragraphs": [
            "The first step is acceptance. You do not need to control your breath. It is enough to observe it as it is: deep or shallow, slow or fast, free or tight. Notice:",
            "• The feeling of the air touching the nostrils{{interoception}}.\n• The expansion and contraction of the chest.\n• The movement of the belly.\n• The small change in the body's posture with each inhale and exhale.",
            "<strong>The breath as an indicator.</strong> If it is tight or shallow, it shows tension. If it is slow and deep, it shows relaxation. The breath is the indicator of your inner state."
          ],
          "interactive": "eswterikhafh"
        },
        {
          "title": "The Three Rhythms",
          "paragraphs": [
            "Throughout this guide you will meet three breathing rhythms. They do not compete: each has its own job.",
            "• <strong>5-5</strong> (inhale 5, exhale 5): daily, in a neutral state; balance and steadying; restless air becomes a current\n• <strong>4-6</strong> (inhale 4, exhale 6): at the peak, when the wind picks up; the longer exhale tells the nervous system \"we are safe\"\n• <strong>4-2-7</strong> (inhale 4, hold 2, exhale 7): in a quiet moment, for deep relaxation; a pause and a very long exhale; the strongest regulator",
            "In the app's breathing exercises you will also find the 4-7-8 variation, which works on the same principle as 4-2-7: a long exhale after a pause.",
            "One rule holds for all three: <strong>the exhale is the tool, not the inhale.</strong>{{slow_exhale}} You never need to force the air in."
          ]
        },
        {
          "title": "Regulating in Intense Anxiety",
          "paragraphs": [
            "In moments of intense anxiety or overload, the breath can become a direct tool of regulation. Let the exhale leave through the mouth, a little more slowly and for longer{{vagus_nerve}}. Allow the belly to soften and draw gently inwards."
          ]
        },
        {
          "title": "The Winds of Emotion",
          "paragraphs": [
            "We have seen the breath as an indicator. But there is a second, old reading too: emotions are winds. They are not ideas in the head; they are weather in the body and in the breath. That is where you can read them, before you find words for them.",
            "• <strong>Anger</strong> — a strong, rising wind: it swells the chest, lifts the breath and makes it shallow.\n• <strong>Anxiety</strong> — a wind that keeps changing direction: breath unsteady, short, without rhythm.\n• <strong>Sadness</strong> — stillness and damp: the air grows heavy, the breath thins out, with sighs that come on their own.\n• <strong>Numbness</strong> — thick fog in still air: breath so faint it is almost forgotten.\n• <strong>Calm and joy</strong> — a light, steady breeze: breath deep and unforced. The map does not only show bad weather.",
            "If the question \"what are you feeling?\" brings you a blank, nothing is missing in you. You were simply asked to translate the weather into words without first being taught to observe it.",
            "<strong>First you read the weather.</strong> What wind is it? Where do I feel it in the body? How long has it been blowing? No \"why\", no stories. Just the weather, now. Recognition is already regulation{{corrigan_2010}}: a wind you have seen does not rule you the way a wind you deny is blowing does.",
            "<strong>Then you accompany the wind.</strong> You do not stop it; you give it a rhythm:",
            "• At the peak (anger rising, anxiety getting away from you): <strong>4-6</strong>.\n• When it eases a little: <strong>5-5</strong>.\n• <strong>Chanting or humming on the exhale:</strong> a long exhale with vibration. The body calms the body. If you already hum instinctively when you are under pressure, you knew this before you read it."
          ],
          "actionLink": {
            "url": "/practice?category=vocal",
            "label": "Chanting & Resonance"
          }
        },
        {
          "title": "Gusts, Systems, Climate",
          "paragraphs": [
            "An honest word: not all winds obey the same tools.",
            "• <strong>Gusts (minutes):</strong> a sudden irritation, a wave of anxiety. The breath softens them right away.\n• <strong>Weather systems (days):</strong> the anger or hurt after a rejection may still be blowing tomorrow. If the breathing does not put it out, you have not failed: this wind has its own duration. Here the goal changes. Not to change the weather, but to keep the boat seaworthy. Food, sleep, a person to talk to, reading the weather again. That is success.\n• <strong>Climate (years):</strong> the long patterns that come from far back. They are not solved in a day, and for the deepest ones it is worth having a professional alongside you. But knowing your climate changes what happens in between: when the wind rises out of proportion to its trigger, you do not conclude \"something is wrong with me\", you recognise \"I know this pattern\". The pain stays; what goes is the second pain, the confusion and the self-blame.",
            "None of this means you are broken. It means you have weather, like everyone. Now you also have a map."
          ],
          "actionLink": {
            "url": "/rabbithole/riding-the-wind",
            "label": "In the Rabbit Hole: Learning to Ride the Wind"
          }
        },
        {
          "title": "The Axis of Presence",
          "paragraphs": [
            "Through its movement, the breath strengthens the axis of presence that rests on gravity. It works as a counterweight to the flow of thoughts: while the mind may be racing, the breath keeps the body in the now.",
            "The tool here is twofold: to recognise the rhythm and quality of your breath, and to feel how its movement supports the body–gravity axis, bringing you back against the flow of thoughts.",
            "The breath teaches you to observe without intervening. That ability is the bridge to the next step: Attention."
          ]
        },
        {
          "title": "Four Exercises for Air",
          "paragraphs": [
            "1. <strong>One breath</strong> (1 breath) — Observe a single inhale and exhale, without changing anything. Just see it as it is.\n2. <strong>The air at the nostrils</strong> (30 seconds) — Feel the cool stream on the inhale, the warmer one on the exhale. Only the point where the air touches.\n3. <strong>Soft belly</strong> (1 minute) — Let the belly soften. On the exhale, let the air out slowly through the mouth (4-6 rhythm). Feel the belly draw in gently.\n4. <strong>Humming on the exhale</strong> (1–2 minutes) — Take a quiet inhale and, on the exhale, make a soft \"mmm\". Feel the vibration. The body calms the body."
          ],
          "actionLink": {
            "url": "/practice",
            "label": "Guided breathing"
          }
        }
      ],
      "exercise": {
        "title": "The Active Return",
        "steps": [
          "Grounding (Body): Stand upright or sit comfortably. Feel gravity, the contact with the ground.",
          "Awareness (Breath): Turn your attention to the inhale and exhale. Feel the air touching the nostrils.",
          "On the exhale: Let the belly draw gently inwards, as if letting all the tension out with the air.",
          "Acceptance: Do not try to change the breath. Awareness is enough.",
          "Regulation (optional): If you feel a lot of anxiety, move into the 4-6 rhythm, with the exhale leaving through the mouth."
        ]
      },
      "insight": "I observe without intervening. Every breath is a new beginning. The tool is always the exhale.",
      "reflection": "How was my breath during the exercise? (fast/slow, shallow/deep, tight/free)"
    },
    {
      "num": 3,
      "title": "Attention",
      "sub": "The Lens of Consciousness",
      "tag": "Direction",
      "color": "var(--color-axis-focus)",
      "hex": "#C8922A",
      "icon": "🔦",
      "video": "/Basic.mp4",
      "summary": "Attention is the lens of the mind: it can focus, open, scatter or get stuck. You learn to recognise where it is and to bring it back gently, without self-criticism.",
      "tldr": "Attention is the lens: it focuses, opens, scatters, gets stuck. You do not scold it; you see it and bring it back gently.",
      "theorySections": [
        {
          "title": "The Four Forms of Attention",
          "paragraphs": [
            "Attention is the third centre of consciousness and the tool that decides where the mind will settle. The body is the base, the breath the rhythm, and attention is the lens that lights up the present moment.",
            "<strong>Closed Attention.</strong> The beam gathers on one point. Useful for concentration. For example, you look steadily at an object.",
            "<strong>Open Attention.</strong> The beam opens and lights up many things at once. You hear the sounds, feel the body, breathe. Everything fits in the same awareness.",
            "<strong>Scattered Attention.</strong> Attention is like a monkey leaping from branch to branch. The aim is not to \"kill\" it but to rein it in gently.",
            "<strong>Stuck Attention.</strong> The beam gets stuck{{hyperfocus}} on an outer object or on mental content: a thought, a worry. Excessive self-reference (\"why do I feel like this? what does it mean?\") is its typical form. It is the state that deserves the most attention, and the next section is devoted to it."
          ],
          "interactive": "three_attention"
        },
        {
          "title": "The Vicious Circles: \"Otherwise\" and \"Should\"",
          "paragraphs": [
            "Where exactly does the beam get stuck? Most of the time, in two patterns:",
            "• <strong>\"How things could have been\"</strong> — the mind replays the past with a different script: if I had said, if I had done, if it had gone otherwise.\n• <strong>\"How things should be\"</strong> — the mind compares the real with an ideal: this is how the day, the work, the others, I should have been.",
            "These patterns are circles that lead nowhere. Not from weakness, but by construction: they compare the real with something that does not exist, and what does not exist never answers. The beam can circle the same orbit for hours without arriving anywhere.",
            "And they do something more: <strong>they sustain and enlarge emotions.</strong> Remember the winds of the previous chapter. A wind that would have died down on its own in a few minutes is fanned up again by the circle every time it starts to fall. The circle is the wind's bellows. That is why some emotions last for days: it is not the weather blowing, it is us.",
            "The way out is not to analyse the circle; \"why am I thinking this?\" is a circle too. The way out is recognising the orbit: you see that the beam has entered the familiar bend, you give it a label, \"Otherwise\" or \"Should\", and you return gently to the steady point{{gentle_return}}. You do not need to win the argument with what does not exist. It is enough to see that it is an argument with what does not exist.",
            "If these circles are very familiar to you, it is not a flaw in your logic. It is an ability working overtime. The mind that runs scenarios is the same mind that predicts, plans and creates. And the \"should\" is often not even yours: it is years of other people's expectations speaking in your voice. We do not fight the scenario machine; we learn to see when it is spinning in empty space."
          ]
        },
        {
          "title": "Fourfold Attention",
          "paragraphs": [
            "At this stage, attention becomes fourfold. You hold awareness of four levels at once:",
            "• <strong>Body</strong> — which gives a base and stability to the present moment.\n• <strong>Breath</strong> — which gives rhythm and brings you back to now.\n• <strong>Attention itself</strong> — which learns to steady itself and to notice where it goes.\n• <strong>Thoughts</strong> — which are recognised without carrying you away; simply observed."
          ],
          "interactive": "samatha_attention"
        },
        {
          "title": "The Power of the Label (Thought Labelling)",
          "paragraphs": [
            "When a thought pulls at you, simply going back to the breath can be hard. <strong>Labelling</strong>{{labeling}} gives you an in-between step: instead of getting involved in the content of the thought, give it a simple, one-word label and then return to the steady point.",
            "• You are thinking about what you have to do tomorrow → \"Planning\"\n• You are thinking about something you said that was wrong → \"Criticism\" or \"Past\"\n• You are worrying about something in the future → \"Worry\" or \"Scenario\""
          ],
          "actionLink": {
            "url": "/practice/microdoses",
            "label": "Attention microdoses"
          }
        },
        {
          "title": "Sensory Overload",
          "paragraphs": [
            "A small simulation of scattered attention (sensory overload), so you can feel why the return to the axis is needed."
          ],
          "interactive": "attention_dispersion"
        },
        {
          "title": "Four Exercises for Fire",
          "paragraphs": [
            "1. <strong>The visual anchor</strong> (10 seconds) — Choose a quiet point in front of you and look at it with a soft, steady gaze. When you drift, come back gently.\n2. <strong>Label and return</strong> (30 seconds) — When a thought pulls you, give it a word (\"Planning\", \"Worry\") and come back to your point.\n3. <strong>Triple focus</strong> (1 minute) — Hold three things at once: the soles of your feet, the breath, and the point in front of you. If one slips, bring it back.\n4. <strong>Switching the lens</strong> (1–2 minutes) — Focus narrowly on one point; then open your gaze to take in the whole room; then narrow again. Zoom in, zoom out."
          ],
          "actionLink": {
            "url": "/rabbithole/soft-gaze",
            "label": "In the Rabbit Hole: The Soft Gaze"
          }
        }
      ],
      "exercise": {
        "title": "Steadying the Lens",
        "steps": [
          "Body & Breath: Stand or sit comfortably. Close your eyes. Feel your body and the rhythm of your breath.",
          "Steady point: Open your eyes and choose a point of focus (visual, auditory or bodily).",
          "Fourfold awareness: Keep your attention there, while staying aware of body, breath and thoughts.",
          "Gentle return: If you drift, notice it (with a label if needed) and come back gently: body → breath → steady point."
        ]
      },
      "insight": "Bringing attention back is not failure; it is the exercise itself. Every \"gentle return\" builds new neural pathways.",
      "reflection": "The journey of my attention: where does it tend to \"stick\" or to \"race\"?"
    },
    {
      "num": 4,
      "title": "Space",
      "sub": "Open Awareness",
      "tag": "Opening",
      "color": "var(--color-axis-space)",
      "hex": "#B5A7D0",
      "icon": "🌌",
      "video": "/Basic.mp4",
      "summary": "The first three centres were something you do. Space is something that already exists. Here you get to know awareness, the open field in which experience happens, and you learn to rest in it.",
      "tldr": "The first three centres are something you do; Space is something that already exists. Attention is the point, awareness the field. Short moments, many times, always on a grounded body.",
      "theorySections": [
        {
          "title": "How You Drive",
          "paragraphs": [
            "The Body gave you stability, the Breath rhythm, Attention the return. All three are acts, something you direct. The fourth is of a different nature: not one more technique, but the discovery of the field in which the first three were working.",
            "Think of how you drive. Your attention is closed on the road ahead; that is where you keep precision. Together with it, an open, peripheral attention{{peripheral_vision}} sees further, right, left; and from time to time, the mirrors, behind. Ahead, around, behind, all at once. They are not two skills you switch between; they are one contact with the world, in which closed attention gives the point and open attention the space in which the point makes sense.",
            "If you do not drive, you do the same when you walk through a busy place, the underground or a crowded square: you look where you are stepping, but at the same time you take in all the movement around you, panoramically, to find your way through. Point and space, together.",
            "Notice what happens when you \"drift off\" into a thought. The periphery fades, the mirrors are forgotten, and, most insidiously, even the road ahead blurs. You did not trade breadth for precision; you lost both. You already know open awareness; you simply forget it when you close in."
          ]
        },
        {
          "title": "The Point and the Field",
          "paragraphs": [
            "<strong>Attention</strong> is the point. It always takes a local, bounded piece (a room, an area, a thought), gives it a name and a border, and it tires, because it works. <strong>Awareness</strong>{{open_awareness}} is the field in which the point moves: universal space, without border, without name, without a clear edge. It does not choose, it holds on to nothing; it simply knows, and so it does not tire. The difference is not size: a country is huge, but it is still bounded. Awareness is not a bigger piece; it is the boundless in which all the pieces fit.",
            "Our usual state is absorption in the contents: a thought comes and we become the thought. The fourth step is a shift of centre: from the point to the field. Until now you were the lens moving from object to object; now, by opening the periphery with the axis of gravity at the centre, you become the space where the lens works. In experience, you add nothing; you stop covering it over.",
            "It is a shift from the <strong>egocentric</strong> to the <strong>spacecentric</strong>. Egocentrically, everything revolves around me. Spacecentrically, I move within something vast, and each thing exists at its own rhythm, independent of me. Just as, in truth, the sun does not \"rise\"; the earth turns and brings me into the light.",
            "That is why the three steps were needed first: practice steadies the ground, and on steady ground awareness is recognised by itself. First the earth, then the sky."
          ]
        },
        {
          "title": "You Have Already Met It",
          "paragraphs": [
            "Remember the \"gentle return\"{{gentle_return}} of Chapter 3. The mind drifts, and at some moment that \"oh, I was gone\" arrives. You made the return. But nobody made the moment of recognition; if you could decide it, you would not have been gone. It arose by itself.",
            "Researchers of mind-wandering call it <strong>meta-awareness</strong>: the moment the mind notices by itself where it is. Nobody produces it; it appears. The fourth stage does not ask you to acquire anything new; it asks you to notice what has been alerting you from the start."
          ]
        },
        {
          "title": "The Tunnel: A Source That Needs Care",
          "paragraphs": [
            "This closed, intense focus, the tunnel,{{hyperfocus}} is not an enemy. For many of us it is the strongest tool we have: the place where we concentrate, work, create. The question is not whether to abandon it, but whether it takes care of you while you are inside it: whether it rests on a grounded body and rest, or whether it burns you.",
            "When it is left untended, without body and breath, the periphery fades and the centre blurs; there it stops being a source and becomes a trap. (The same happens in intense anxiety: the mind narrows and magnifies the threat — Chapter 8.) The fourth step does not switch the tunnel off; it takes care of it. You open the periphery, ground yourself, rest, and go back in clear, not burnt out. Open awareness does not replace focus; it is the place where focus refills."
          ]
        },
        {
          "title": "The Space That Dwells in Truth",
          "paragraphs": [
            "You do not imagine this field. The four anchors are not constructions of the mind: the earth holds you with its gravity whether you remember it or not, the air comes and goes by itself, light and space exist before you. They are truths, not images, and that is why they have stability and rhythm. An image you make flickers and takes effort; a truth is simply there. You do not hold it; it holds you.",
            "Here lies the most common misunderstanding. One thing is the space the mind makes, a beautiful blue vastness you paint, which is just one more content. Another is the space that dwells in truth: the real space around you now. The first you imagine; the second you inhabit. The sky here is a pointer, not a destination, like the finger pointing at the moon.",
            "This is how recollectedness is completed. You were not gathering thoughts about the body, the breath, attention; you were coming into contact with them, one by one. Contact, not remembering. And now the same contact opens into the space that contains them all."
          ]
        },
        {
          "title": "The Rhythm of Open Attention",
          "paragraphs": [
            "The shift from narrow to open also leaves a measurable trace. Les Fehmi's work on Open Focus{{davidson_2004}} observed that, when attention spreads out and becomes peripheral, large areas of the brain can synchronise at a slower rhythm: the alpha band, which has been associated with relaxed alertness.",
            "And the quickest way there is not effort, but a question without an object:",
            "<strong>Can you feel the space between your two eyes?</strong>",
            "Attention moved, but found nothing to grasp. Space has no edge, no weight. And with nowhere to hook on, the grip loosened by itself and opened. That is all: when you give attention space as its \"object\", it becomes awareness.",
            "Many of the breathing exercises here, in the sound space, come with binaural beats in the alpha band, as support for this relaxed, open attention."
          ],
          "interactive": "metronomos"
        },
        {
          "title": "Short Moments, Many Times",
          "paragraphs": [
            "Awareness does not need duration. You do not need to \"stay\" in the open field for hours, or even for minutes. One moment of recognition is complete, however short; two seconds of open field are two whole seconds, not a failed version of ten minutes.",
            "What seems to matter is not duration but repetition: many short moments, scattered through the day, build familiarity with the open more steadily than one long, effortful session. The microdoses and the final weeks of the programme here, in the app, are built on this.",
            "One condition, always — the golden rule of every exercise in this guide: <strong>opening is safe only on a grounded body.</strong>",
            "<strong>If at some point you feel yourself \"drifting away\"</strong> If, as you open, you feel disconnected or as if you are moving away from yourself, that is not the goal. Open your eyes, feel your soles on the ground and the weight of your body, say where you are right now. You come back to the earth. <strong>First the earth, then the sky.</strong>"
          ]
        },
        {
          "title": "The Same Water",
          "paragraphs": [
            "The first three centres were not an \"antechamber\" we leave behind. Narrow focus and open awareness are complementary, the way the zoom and the wide-angle lens are the same camera. The tunnel was never the enemy; it is the zoom lens. You will use both all your life; freedom is not getting stuck in either.",
            "Over time the distinction softens: the return becomes effortless, focus stops being a clench, and mindfulness and awareness stop being two things. The wave does not stop being a wave when it remembers it is water. It simply stops fighting the sea."
          ],
          "interactive": "openawareness"
        },
        {
          "title": "The Drop and the Ocean",
          "paragraphs": [
            "The simplest example is water. A drop is no less water than the ocean; it is exactly the same thing, at another scale. In the same way, a moment of presence, here, two seconds long, is not a smaller awareness. It is whole. That is why short moments are enough, and why there is no such thing as \"a little\" presence.",
            "And that is why the way always passes through the body, never through imagination. The \"here\" of the drop is not an idea; it is the weight in your soles. If at some point the opening pulls you outwards, you have not gone deeper; you have lost the drop. Come back to the weight, and the ocean is there again, because it never left."
          ]
        },
        {
          "title": "∞",
          "paragraphs": [
            "Each axis has its shape: a line for the earth, a circle for the breath, a triangle for attention. The fourth has ∞.",
            "\"Infinite\" here does not mean something far away. It means <strong>without end</strong>, without limit. And ∞ has no beginning and no end, yet it passes through a point at the centre. That centre is not up high; it is at the heart: open space centred here, grounded, at the height of the heart."
          ],
          "actionLink": {
            "url": "/rabbithole",
            "label": "In the Rabbit Hole: The Wave Is Not the Sea · You Are the Path · The Seething Void"
          }
        },
        {
          "title": "Four Exercises for Water",
          "paragraphs": [
            "Always with a grounded body. First the earth, then the sky.",
            "1. <strong>The space between the eyes</strong> (10 seconds) — Ask: \"Can I feel the space between my eyes?\" Do not look for an answer. Let the grip loosen.\n2. <strong>Gazing at the sky</strong> (30 seconds) — Raise your gaze to the sky or the horizon and soften it. Let the field open in every direction.\n3. <strong>Short moment</strong> (2–5 seconds, many times) — For a few seconds, leave everything exactly as it is. Nothing to fix, nothing to correct.\n4. <strong>Thoughts like clouds</strong> (1–2 minutes) — Let thoughts pass like clouds. They come, stay a little, leave. You are the space that holds them."
          ],
          "actionLink": {
            "url": "/practice/microdoses",
            "label": "Space microdoses"
          }
        }
      ],
      "exercise": {
        "title": "Widening the Space",
        "steps": [
          "Grounding: Sit comfortably. Close or lower your eyes. Feel the weight of your body and the rhythm of your breath.",
          "Focus: Settle on one point (an image, a sound or a sensation) for a few seconds.",
          "The question without an object: \"Can I feel the space between my eyes?\" Do not look for an answer; let the question loosen the grip.",
          "Widening: As when driving you open from the road to the surroundings and the mirrors, let your attention spread in every direction. The axis of gravity stays the centre.",
          "Acceptance: Listen, see, feel, without focusing, without judging. Contents come and go. You are the field.",
          "Return: If you get lost, the flash will come, \"oh, I was gone\". That flash is awareness. Come back to the open."
        ]
      },
      "insight": "Attention is the point; awareness the field in which it moves. The fourth step shifts the centre from the point to the field, from the egocentric to the spacecentric, with the body grounded and present. Short moments, many times.",
      "reflection": "What changed in my attention when it had nowhere to hook on?"
    },
    {
      "num": 5,
      "title": "The Neurodivergent Mind",
      "sub": "Defence, Racing, the Mask",
      "tag": "Focusing",
      "color": "var(--teal-med)",
      "hex": "#2E8B9A",
      "icon": "🧠",
      "summary": "The neurodivergent mind is not broken; it works differently. You come to understand its two main states (racing and locking), the setting that lies beneath them, and the cost of the mask.",
      "tldr": "The neurodivergent mind races or locks, and underneath there is a setting: defence. It does not come down through arguments, but through signals of safety and through time. The mask was always a function, never an identity.",
      "theorySections": [
        {
          "title": "The Racing Mind, the Locking Mind",
          "paragraphs": [
            "A neurodivergent person's mind is rarely static. It usually moves between two extreme states: it \"races\" or it \"locks\".",
            "<strong>THE RACING MIND</strong> — Scattered Attention / Overload. The world becomes a chain of small hooks. Many stimuli arrive at once, unfiltered. Tool: Body (Grounding) + Breath (Rhythm).",
            "<strong>THE LOCKING MIND</strong> — Stuck Attention / hyperfocus. Like a tunnel of intense focus. It can become a trap if its object is an anxious thought or an obsession. Tool: Body (Grounding) + Space (Release). Attention frees itself.",
            "<strong>Strategy for obsession:</strong> Use Open Awareness (Space). Remember that your thoughts happen within a wider space. You can recognise their real proportions and gain freedom, without being smothered by them."
          ],
          "interactive": "racing_mind"
        },
        {
          "title": "Defence: The Setting Underneath",
          "paragraphs": [
            "Racing and locking are not two independent kinds of weather. They change character according to a setting that lies beneath them: whether the system is in defence or not.",
            "Defence is not an episode. For many of us it is the resting state, the point the system returns to when nothing is happening. There is a reason for this, and it deserves respect. Years in sensory environments you could not predict. Years of corrections for reactions that seemed natural to you. When you do not know which of your moves will be judged wrong, the system draws the only logical conclusion: the world needs constant monitoring.",
            "So defence stays switched on. And because it stays on, it costs all the time, even when nothing is happening.",
            "What it is like from inside: nothing is going wrong, and yet everything is one notch louder. A small thing lands big. A neutral face reads as a verdict. You are tired without having done anything.",
            "And here is the crucial point. <strong>Defence does not produce your thoughts; it selects them.</strong> Your mind does not run to danger because it is negative; it runs there because the search has been given the parameter \"find the threat\". It is the same mind that plans, predicts and creates. The setting changed, not the mind. That is why the vicious circles of Chapter 3 catch more easily on some days: you have not grown weaker; the system is searching.",
            "This changes what makes sense to do. You do not win the argument with the content, because the content is not the cause; it is the result. It comes down through signals, not arguments{{polyvagal}}: the weight in your soles, a long exhale, the space around you, an environment that does not hit you. And through time. A setting built over years does not change in an afternoon.",
            "Defence is not character. You are not \"too much\" or \"oversensitive\". You are a system that learned a lesson well, and it can learn, little by little, that right now it is not needed."
          ]
        },
        {
          "title": "The Role of the Mechanical Mind",
          "paragraphs": [
            "Locking (hyperfocus) is often fuelled by the <strong>Mechanical Mind</strong>{{mechanical_mind}}, the part of the mind that constantly analyses the past and plans the future, without a stable base in the present (we met it in Chapter 1). The Mechanical Mind is not an enemy; it is a tool that has \"overheated\" without the steadying effect of presence.",
            "The practice does not try to stop the Mechanical Mind, but to complement it with an <strong>Open Mind</strong>: a mind that observes without analysing, embraces without judging, sees beyond the scenarios and perceives the causes."
          ]
        },
        {
          "title": "The Mask: The Bottle",
          "paragraphs": [
            "Defence also has a social form. It is called the <strong>mask</strong> or <strong>masking</strong>: the daily performance of being someone else, so that the people around you feel comfortable.",
            "It is work, and heavy work. You check every word before it comes out. You calculate whether your reaction is \"too much\" or \"not enough\". You pretend the noise does not bother you. You smile while your nervous system is screaming. In research, chronic masking is linked with exhaustion, anxiety and depression. Not from weakness, but because no function can bear to run all the time.",
            "Zen has an image for this, 1,200 years old. An official asks the master: if you put a gosling in a glass bottle and feed it until it grows, how do you get it out without breaking the glass and without killing the goose? The master does not solve the problem. He claps his hands and calls the man's name. The man turns round by reflex, and hears: \"See, the goose is already out.\"",
            "The bottle is form: the body, the constructed mind, the roles, the identifications. The goose is awareness, the open space of Chapter 4. And the master's answer says something very specific: <strong>you never became the bottle. The mask was a function, never an identity.</strong>",
            "A clear distinction. Nothing here tells you to take the mask off out there. Where and when is your decision, and it depends on your safety, your work, the people around you, things only you know. What the practice suggests is inward: to stop believing you are the bottle, and to find the spaces where you can loosen it safely.",
            "And there is a guide, a bodily one. The mask is not worn on the face alone; it is worn in the jaw, in the shoulders, in the breath held a little high. You can measure this cost. It is the same barometer as in Chapter 8: when the jaw started to tighten, when the breath rose. You do not need to decide anything about your identity to notice it.",
            "We do not break the glass. We loosen the bottle: we create the conditions of safety so that the system can come down from defence. And there, without anything being added, what was always free becomes visible."
          ],
          "actionLink": {
            "url": "/rabbithole/the-goose-is-out",
            "label": "In the Rabbit Hole: The Goose Is Out"
          }
        },
        {
          "title": "Kindness as an Exit from Autopilot",
          "paragraphs": [
            "Self-criticism{{self_criticism}} is not your truth; it is an echo of words, looks and expectations that were not met. Research shows that intense self-criticism can activate the same threat-response circuits that react to outer danger, with the involvement of the amygdala{{amygdala}} and stress hormones such as cortisol. Every time you judge yourself harshly, your brain reacts as if you were under attack.",
            "The gentleness of this method is the stance you need to hold towards yourself. Growth here does not mean productivity, but the flowering of your unique potential.",
            "Remember: your thoughts and experiences happen within a wider space of awareness. Within this open space, you can recognise their real proportions. <strong>Treat yourself the way you would treat a friend who is struggling.</strong>{{kindness}}"
          ]
        }
      ],
      "exercise": {
        "title": "My Patterns",
        "steps": [
          "When does my mind tend to \"race\"?",
          "When does it \"lock\"?",
          "What situations trigger it?",
          "Where do I feel the mask in my body: in the jaw, the shoulders, the breath?"
        ]
      },
      "insight": "Defence does not make your thoughts; it selects them. It does not come down through arguments, but through signals of safety and through time. And the mask was always a function, never an identity.",
      "reflection": "My own patterns: when does my mind tend to \"race\"? When does it \"lock\"? What situations trigger it?"
    },
    {
      "num": 6,
      "title": "Daily Life",
      "sub": "Self-Regulation",
      "tag": "Regulation",
      "color": "var(--teal-dark)",
      "hex": "#1A5F6E",
      "icon": "☀",
      "summary": "Why daily practice is called contact, and where a mind stands once it stops standing on its own constructions. Together with practical tools for noisy places, social moments, transitions, low-energy states and the spaces you live in.",
      "tldr": "Daily practice is called contact: a fine thread to your soles, your breath and the space around you, running beneath whatever you do. Thinking goes on, but it stops being the floor.",
      "theorySections": [
        {
          "title": "Where Do You Stand?",
          "paragraphs": [
            "Every mind needs somewhere to stand, a base from which it perceives the world and itself. And here it is worth saying clearly: in many neurodivergent people, that base has become thinking itself. The scenarios, the analyses, the inner constructions are not just habits. They are the ground you stand on.",
            "There is a reason for this, and it deserves honour. When the body lives in constant alarm and the sensory world feels unreliable, the mind becomes the only room that is wholly yours, the only ground you can control. Making thought your base was not a defect. It was the best solution available, and for years, perhaps the only one.",
            "But a base made of thought has a cost: it does not hold itself up. You have to build it again, moment by moment, for it to go on existing. Here is one reason the mind never stops. If it stops, the floor disappears. The vicious circles of Chapter 3, the \"Otherwise\" and the \"Should\", now appear from another angle: they are not just circles. They are foundation work on ground that does not exist.",
            "Sometimes this base narrows into what is called a <strong>reality tunnel</strong>{{hyperfocus}}: a hyperfocus that has turned against you. The tunnel is not the enemy in itself; it is the same ability that lets you dive deep into what you love. But when its object is a fear, a wound, an obsession, the tunnel becomes the whole world, and the world becomes a tunnel.",
            "And here is the crucial point: <strong>you cannot use attention to get out of a trap made of attention.</strong> The function that got stuck cannot also be the rescue crew. Inside the tunnel, attention is already working overtime; if you ask it to design the exit as well, you feed the overstimulation. The way out goes through the other two centres:",
            "• <strong>Below — gravity.</strong> The earth is the only base{{gravity}} that needs neither construction nor attention to exist. It holds you whether you think of it or not. The whole difference is here: thought is a base that you hold up; the earth is a base that holds you.\n• <strong>Around — awareness.</strong> The tunnel has no door at its far end, but it has no walls all around either. Space was never interrupted (Chapter 4); the tunnel exists within it. A moment without an object, the space between the eyes, the room around the sounds, and the walls turn out to be clouds.",
            "Nothing here asks you to stop thinking; that is impossible, and unnecessary. What changes is where the weight rests. Thinking goes on, but it stops being the floor: it becomes weather above ground you do not have to build yourself. And the mind, relieved of the job of holding you upright, is free to do what it does best: create, predict, play."
          ]
        },
        {
          "title": "Contact, not Remembering",
          "paragraphs": [
            "That is why the daily form of the practice is not \"remembering to practise\". It is <strong>contact</strong>{{grounding}}: a fine, living thread to the points of anchoring (the soles, the breath, the space all around) that runs beneath whatever you do. Not instead of your life; within it.",
            "Contact is not a state you construct, nor concentration. It costs nothing (Chapter 4: awareness does not tire). It is more like the way you know, without checking, that the floor is under your feet.",
            "The thread will break. That is not failure; that is how it is designed. The moment you notice, the small flash of \"oh, I was gone\", is the bridge: you cross it (soles, one exhale, space) and you are in contact again. Remembering is only the moment of the bridge. Contact is the country the bridge leads to, the place you live from.",
            "<strong>Two seconds of real contact, many times a day.</strong> That is the whole practice of this chapter.",
            "Self-regulation is the ability to bring your nervous system back from overstimulation or shutdown to a state of balance. It begins with contact on four levels:",
            "1. <strong>Contact with the Body</strong> — You feel the earth, the weight, the axis.\n2. <strong>Contact with the Breath</strong> — You see whether the rhythm is fast, shallow or calm.\n3. <strong>Contact with Attention</strong> — You see where the mind has got stuck (scattering or locking).\n4. <strong>Contact with Space</strong> — You feel whether there is openness and safety."
          ]
        },
        {
          "title": "In noisy places (sensory overload)",
          "paragraphs": [
            "• Feel your feet on the ground. Immediate grounding in the chaos.\n• Take 3 quiet breaths, exhaling through the mouth.\n• Open your peripheral vision{{peripheral_vision}}. Soften your gaze instead of focusing.\n• Use headphones or a fidget toy if you need to."
          ]
        },
        {
          "title": "In social moments (overstimulation and fatigue)",
          "paragraphs": [
            "• Choose a neutral point (for example a plant) as a visual reference.\n• Feel your feet steady. If you feel tension in your jaw, let it go with an exhale.\n• Use peripheral vision to keep your presence."
          ]
        },
        {
          "title": "With anxiety or tension (immediate regulation)",
          "paragraphs": [
            "• Ground: feel your weight and the axis.\n• Take 10 breaths in the 4-6 rhythm: inhale through the nose, exhale through the mouth, slowly{{slow_exhale}}.\n• Walk with awareness. Rhythmic movement \"burns off\" anxiety."
          ]
        },
        {
          "title": "When the system shuts down (gentle activation)",
          "paragraphs": [
            "Until now the tools pointed in one direction: downwards, towards calm. But regulation is a dimmer, not a brake. \"Shutting down\", the flat, foggy, disconnected state, is dysregulation too, and it needs the opposite movement: gentle activation. When the fire has gone out, you do not blow on it hard. You add kindling:",
            "• Sway gently. Rhythm wakes the system without startling it.\n• Hum on the exhale. Vibration is movement from within.\n• Raise your gaze to the horizon or the sky. The body reads distance as an invitation.\n• Walk slowly, feeling the push of each sole, and let the rhythm rise by itself.\n• Warmth, light, a favourite song. Small, warm, rhythmic: that is the recipe.",
            "The aim is not to force energy, but to let the wind rise again by itself."
          ],
          "actionLink": {
            "url": "/practice/microdoses",
            "label": "Microdoses for every axis"
          }
        },
        {
          "title": "Transitions: The Practice of the Threshold",
          "paragraphs": [
            "For many neurodivergent people, the hardest moments of the day are not the activities; they are the seams between them: stopping one thing, starting another. The nervous system is asked to change gear without a clutch.",
            "Every door, literal or not, can become a <strong>threshold</strong>. Before you cross: feel your soles, one longer exhale, notice the space of the room you are entering. Three seconds. The system gets what it rarely gets, a boundary marked, not smudged. Closing the laptop, the end of a call, the front door shutting behind you: all thresholds, all invitations to contact."
          ]
        },
        {
          "title": "Building the Harbour",
          "paragraphs": [
            "Self-regulation is not only what you do in the moment; it is also the conditions you set up before it. A boat stays seaworthy more easily in a harbour than on the open sea.",
            "Light, sound and textures matter more than you were taught to admit. Adjusting them is regulation, not fussiness. And after every social open sea, plan a <strong>decompression harbour</strong>: half an hour that is familiar, quiet, without demands. It is not avoidance, nor a luxury. It is maintenance of the boat."
          ]
        }
      ],
      "exercise": {
        "title": "The Threshold",
        "steps": [
          "Before you cross a door, literal or not, feel your soles.",
          "Let out one longer exhale.",
          "Notice the space of the room you are entering.",
          "Three seconds. Then you cross."
        ]
      },
      "insight": "Contact is the base. The earth holds you without effort on your part; the sky opens without construction on your part. You can stand on what is real, and let thinking be weather, not floor.",
      "reflection": "What are my own thresholds during the day? Where could I add three seconds?"
    },
    {
      "num": 7,
      "title": "The New Driver",
      "sub": "Avoidance and Procrastination",
      "tag": "Starting",
      "color": "var(--teal-med)",
      "hex": "#2E8B9A",
      "icon": "🧭",
      "summary": "When the distance between a decision and the act becomes an abyss: how to move through the body, without waiting to want it.",
      "tldr": "You don't wait for the 'want'. Feel gravity, let out one quiet exhale, see the space, and take one step. Keep the act, let go of the outcome.",
      "theorySections": [
        {
          "title": "If You're Stuck Right Now",
          "paragraphs": [
            "Start here; the explanation can wait. The Pocket Card in Chapter 8 is for inside the wave. This one is for when you can't begin:\n<strong>GRAVITY — BREATH — SPACE — ONE STEP</strong>",
            "1. Gravity: feel your weight, the axis, the ground{{gravity}}. Let the tension go. Stay in the now, adding nothing to it and taking nothing away — this is point zero.\n2. Breath: one quiet breath, with a slow exhale{{slow_exhale}}.\n3. Space: see the space you are about to move through.\n4. One step: the movement begins gently from the belly and the pelvis, and the limbs follow. One movement at a time; what you want to do stays at the edge of the mind.",
            "If you feel yourself drifting away or going numb, stop and come back to your weight and the ground. That too is part of the practice, not a failure."
          ]
        },
        {
          "title": "If You Can't Feel Your Body",
          "paragraphs": [
            "With difficulty sensing the body, with disconnection, pain or fatigue, 'feel your weight' may find nowhere to land. Nothing is missing in you; use another door:\n• The fabric on your skin, the air on your hands.\n• The farthest sound and the nearest.\n• Your gaze moving from the farthest point of the room to the nearest.",
            "One point of contact is enough. And if even that doesn't come, 'I feel nothing' is itself an observation, and it is enough to stand on."
          ]
        },
        {
          "title": "The Old Driver",
          "paragraphs": [
            "Every act needs something to say 'now'. For many of us that driver has been <strong>pressure and anxiety</strong>. If it is the only one you know, you start only when it shows up — usually at the last minute, with the deadline over your head. Procrastination is not laziness: it is waiting for the only driver you know.",
            "And it doesn't bring only pressure. It brings the past: old rejections, old fears, the pressure to function 'normally'. But it worked, so you don't dismiss it with one decision; you replace it slowly."
          ]
        },
        {
          "title": "The Mountain",
          "paragraphs": [
            "The act itself is rarely hard: getting up, turning on the tap, making a call. What makes it hard is the weight the mechanical mind{{mechanical_mind}} adds: 'it'll take ages', 'what if it doesn't come out right'. Each such thought tries to control the outcome before the act, until the thing becomes a mountain. Putting it off brings a moment of relief, and that is why it repeats.",
            "You don't fight the refusal; you simply don't feed it, keeping your attention on what you are doing now."
          ]
        },
        {
          "title": "Desire, Intention, Will",
          "paragraphs": [
            "• <strong>Desire</strong>: aimed at the result, it lives in mood, and in that moment it may be absent. You feel it high up, in the chest and the head.\n• <strong>Intention</strong>: the direction you chose. It stays at the edge of the mind and orients you without paralyzing you.\n• <strong>The will of the act</strong>: not strain. The strength belongs to the body, its vital energy, and you direct it gently with intention. You feel it low, in the belly.",
            "Mood and thoughts you may not control. The body, most of the time, you can move; and when even it won't move, a point of contact remains. You keep the act and let go of the outcome — the outcome, not the act."
          ]
        },
        {
          "title": "The New Driver",
          "paragraphs": [
            "The new driver is <strong>mindfulness</strong>. It doesn't push you or frighten you; it is available now, and it doesn't need to burn you out to work. It lives in point zero, so the act no longer carries the verdict of all the previous times: you meet it fresh.",
            "Presence is shared among body, breath, thoughts and space, and none of them takes the wheel. The new driver treats you the way you would stand beside a neurodivergent child who is learning: without pressure, without blame, without hurry{{kindness}}."
          ]
        },
        {
          "title": "Play and Practice",
          "paragraphs": [
            "Avoidance feeds on the stakes: every act feels like an exam. Play removes the stakes; you aren't being tested, you are trying. Practice adds the other half: no attempt is a verdict. Without hurry means without inner agony, not slowly.",
            "The brakes stay. Avoiding a place that floods you with sensory input, or something that wakes trauma{{trauma}}, is protection. When what you are putting off touches something heavy, go little by little, only as far as you can comfortably bear."
          ]
        },
        {
          "title": "When It Isn't Avoidance",
          "paragraphs": [
            "For many neurodivergent people, the difficulty of starting also has a neurological basis:\n• <strong>Avoidance</strong>: you think of it and feel weight, fear, shame.\n• <strong>Executive dysfunction</strong>: you want it, you feel no resistance, and you simply don't move. Gentleness helps, but something outside you is also needed.\n• Often both: you work with both layers together.",
            "External supports — conditions you set up beforehand: a five-minute timer, a list of just three steps, someone beside you doing their own work too (body doubling), a reminder on your phone, a quieter environment.",
            "If procrastination costs you work, relationships or health, or comes together with depression, active trauma or substance use, talk to a therapist or someone who specializes in neurodivergence. It is not a failure of the practice."
          ]
        },
        {
          "title": "Why It Changes Over Time",
          "paragraphs": [
            "When every start comes with pressure and self-criticism{{self_criticism}}, the act becomes linked with threat and the mind learns to avoid it. When you do things through the body, with attention on the moment rather than the result, that link slowly loosens.",
            "The method doesn't change how your brain is made, and it doesn't cure avoidance; it embraces and supports it."
          ]
        }
      ],
      "exercise": {
        "title": "Big Goal: Information, Not Scenarios",
        "steps": [
          "Once, write down what it involves: what is needed, in what order, whom you ask.",
          "Information, not scenarios: not 'how will I feel', but 'what is there'.",
          "Put the map at the edge of the mind.",
          "Take only the next step. For a driving license: first, go to the instructor."
        ]
      },
      "insight": "Keep the act, let go of the outcome, and move one step at a time, without hurry.",
      "reflection": "What am I putting off? Is the act itself hard, or the mountain around it?"
    },
    {
      "num": 8,
      "title": "When the Wave Rises",
      "sub": "Anxiety, Overload",
      "tag": "Support",
      "color": "var(--terra)",
      "hex": "#C07050",
      "icon": "🌊",
      "summary": "Two practical protocols, for intense anxiety and for overload, together with what comes before the wave, and what comes after.",
      "tldr": "Catch the wind early: at the first signals, one long exhale may be enough. Inside the wave, four words: grounding, long exhale, label, opening. Afterwards, kindness.",
      "theorySections": [
        {
          "title": "The Barometer: Before the Storm",
          "paragraphs": [
            "Every wave announces itself; the announcement is simply silent. A jaw that tightens. Breath that rises high into the chest. Irritation at sounds you tolerated an hour ago. The same sentence read three times. These are the readings of your <strong>barometer</strong>{{interoception}}.",
            "The earlier you catch the wind, the less force it takes: at the first signals, one long exhale may be enough; at the peak, the whole protocol is needed. Learn your own three first signs. The reflection at the end of the chapter asks for them. Take that question as field research for the week."
          ]
        },
        {
          "title": "Protocol 1: Immediate Response to Intense Anxiety",
          "paragraphs": [
            "Intense anxiety is a \"fight or flight\" state that calls for an immediate signal of safety to the nervous system, through body and breath.",
            "1. <strong>Grounding (Body)</strong> — Feel the weight of the body, its posture, its tensions, without verbal analysis. Simply notice where you are holding the tension.\n2. <strong>Regulation (Breath)</strong> — Close your eyes and move into the 4-6 rhythm. Let the exhale leave slowly through the mouth{{slow_exhale}}, as if gently blowing on a flame. Do not force the inhale; work only with the exhale.\n3. <strong>Labelling (Attention)</strong> — If the mind gets stuck in a scenario, use a label{{labeling}} (\"Worry\", \"Scenario\") and return to the breath.\n4. <strong>Opening (Space)</strong> — Open your peripheral vision and notice the space around you. Widening reduces the sense of being trapped.\n5. <strong>Movement & Axis</strong> — If you can, walk a little, feeling your soles. Keep the sense of the vertical axis. Open gaze and awareness of space."
          ]
        },
        {
          "title": "Protocol 2: Managing Overload",
          "paragraphs": [
            "When everything falls on you at once, the aim is to find space to hold the stimuli without reacting. Instead of focusing on reducing anxiety, you focus on widening awareness.",
            "1. <strong>Grounding (Stage 1)</strong> — Feel your soles, your weight. Reset your position, as if pressing your body's reset button.\n2. <strong>Breath (Stage 2)</strong> — Stay with its flow. Exhaling through the mouth is optional, but recommended if you feel tight.\n3. <strong>Attention (Stage 3)</strong> — Keep your attention in front of you. Instead of being carried away by every detail, choose one steady point as your anchor.\n4. <strong>Opening (Space — Stage 4)</strong> — Soften your gaze (peripheral vision){{peripheral_vision}}. Remember the sky: all the stimuli, sounds, lights, thoughts, are clouds passing through the open space of your awareness.",
            "<strong>Keep the distance:</strong> remember, you are not the clouds. You are the space that holds them. Simply recognising this immediately lowers the sense of danger.",
            "<strong>If at some point you feel yourself \"drifting away\"</strong> If, inside the wave, you feel disconnected or as if you are moving away from yourself, stop the opening. Open your eyes, feel your soles on the ground and the weight of your body, say out loud where you are right now. <strong>First the earth, then the sky.</strong>"
          ]
        },
        {
          "title": "What Not to Do",
          "paragraphs": [
            "One more honest word, because inside the wave all of the following seem reasonable:",
            "• <strong>Do not try to think your way out.</strong> The way out does not go through the content (Chapter 6: the function that got stuck cannot also be the rescue crew).\n• <strong>Do not analyse in the middle of the wave.</strong> \"Why am I like this?\" is a bellows, not an investigation. Analysis can come later, if it is still needed, which is rarer than it seems.\n• <strong>Do not force deep inhalations.</strong> Forceful deep breaths can heighten the alarm. The tool is the long exhale, gently.\n• <strong>Do not suppress your self-regulating movements (stims).</strong>{{movement_vs_breathwork}} Rocking, pacing, moving your hands: this is the body's own self-regulation, already at work. Let it be.\n• <strong>Do not demand calm as proof of success.</strong> Success is the boat staying seaworthy (Chapter 2)."
          ]
        },
        {
          "title": "After the Wave",
          "paragraphs": [
            "No protocol says what happens afterwards, and afterwards matters. When the wave has passed, the mind often turns round to bite: \"why did I let it happen again?\". Recognise it: it is the \"Should\" with a life jacket, the bellows that fans up the wind that has just died down.",
            "After the wave: water, food, rest. A wave is physical strain; treat it as such. No analysis for a few hours; let the water settle before you look at the bottom. If the wave splashed someone, one short sentence of repair later (\"that was my overload talking, not you\") is worth more than a perfect apology. And kindness{{kindness}}: you did not fail an exam. Weather passed through, and you kept the boat."
          ]
        },
        {
          "title": "The Pocket Card",
          "paragraphs": [
            "Inside the wave, nobody reads paragraphs. Four words, in order:",
            "<strong>GROUNDING — LONG EXHALE — LABEL — OPENING</strong>  (Soles. Through the mouth, slowly. Name the scenario. Peripheral vision.)",
            "If you keep just one thing from this chapter, keep these four words. They are the version for inside the wave. For inside the day there is the Worksheet (Ch. 9); for a quiet moment, the Four Stages (Ch. 10)."
          ],
          "actionLink": {
            "url": "/rabbithole/lute-string",
            "label": "In the Rabbit Hole: The Lute String"
          }
        }
      ],
      "exercise": {
        "title": "The Pocket Card",
        "steps": [
          "Grounding: the soles of your feet.",
          "Long exhale: through the mouth, slowly.",
          "Label: name the scenario.",
          "Opening: peripheral vision."
        ]
      },
      "insight": "Catch the wind early, keep the boat seaworthy, and treat yourself with kindness afterwards. The wave is weather, not a verdict.",
      "reflection": "What are the first signals my body gives when overload begins?"
    },
    {
      "num": 9,
      "title": "Presence Worksheet",
      "sub": "The Practice of Presence",
      "tag": "Application",
      "color": "var(--teal-dark)",
      "hex": "#1A5F6E",
      "icon": "📋",
      "summary": "A one-page sheet you can fill in. It is the short version of the practice, for inside the day. The full, seated version is Chapter 10; the version for inside the wave is the Pocket Card (Ch. 8).",
      "tldr": "The short version of the practice, for inside the day: four centres, four questions. You do not need to do them all; one, done well, is enough.",
      "theorySections": [
        {
          "title": "How to Use It",
          "paragraphs": [
            "<strong>Goal:</strong> to come back to \"now\" within a few seconds. Do them in order or choose the one you need."
          ]
        },
        {
          "title": "1. Body / Base",
          "paragraphs": [
            "• <strong>Observation:</strong> I stand or sit. I feel my weight. I notice tensions (e.g. the jaw).\n• <strong>Tool:</strong> I feel the axis: from the soles, up through the spine, to the crown of the head. I soften my jaw and shoulders{{grounding}}.",
            "<strong>What did I feel in my body just now?</strong>"
          ]
        },
        {
          "title": "2. Breath / Rhythm",
          "paragraphs": [
            "• <strong>Observation:</strong> How is my breath? Fast, shallow, tight?\n• <strong>Tool:</strong> An exhale through the mouth, a little slower{{slow_exhale}} (4-6 rhythm). I feel my belly draw in gently.",
            "<strong>How did my breath change?</strong>"
          ]
        },
        {
          "title": "3. Attention / Steadying",
          "paragraphs": [
            "• <strong>Observation:</strong> Where is my attention? Is it racing? Is it stuck somewhere?\n• <strong>Tool:</strong> I return to a steady point. I label the thought{{labeling}} and return.",
            "<strong>Where was my attention?</strong>"
          ]
        },
        {
          "title": "4. Space / Widening",
          "paragraphs": [
            "• <strong>Observation:</strong> Do I feel trapped? Is my attention like a tunnel?\n• <strong>Tool:</strong> I soften my gaze{{peripheral_vision}}. I let my attention spread. Thoughts = clouds.",
            "<strong>What changed when the space opened?</strong>"
          ]
        }
      ],
      "exercise": {
        "title": "The Four Steps of Presence",
        "steps": [
          "Body: Feel your weight. Soften your jaw and shoulders.",
          "Breath: An exhale through the mouth, a little slower (4-6 rhythm).",
          "Attention: Come back to one steady point. If a thought pulls you, give it a label.",
          "Space: Soften your gaze. Let your attention spread."
        ]
      },
      "insight": "Four centres, four questions. You do not need to do them all. One, done well, is enough.",
      "reflection": "Which of the four centres helped me today?"
    },
    {
      "num": 10,
      "title": "The Four Stages",
      "sub": "Step-by-Step Guide",
      "tag": "Steps",
      "color": "var(--gold)",
      "hex": "#C8922A",
      "icon": "👣",
      "summary": "The full, sequential exercise of the Fourfold Axis, for a quiet moment. It works best in a quiet position, but the steps can be applied at any moment. The short version for inside the day is the Worksheet (Ch. 9); the version for inside the wave is the Pocket Card (Ch. 8).",
      "tldr": "The full, seated exercise of the Fourfold Axis: earth, rhythm, point, field. And underneath it all, gentleness.",
      "theorySections": [
        {
          "title": "The Stance Behind the Steps",
          "paragraphs": [
            "Before you begin the stages, remember: gentleness is not optional; it is the method itself. Every time you return without criticism{{gentle_return}}, every time you accept distraction as part of the process, you practise kindness{{kindness}}. Not as an idea, as an act.",
            "We saw why in Chapter 5: intense self-criticism appears to activate the same threat circuits as outer danger. The gentle return soothes them. This is the way: not by fighting the autopilot, but by giving it room to settle."
          ],
          "interactive": "journey",
          "actionLink": {
            "url": "/program",
            "label": "The structured step-by-step programme"
          }
        },
        {
          "title": "Stage 1 — Feel the Earth (Grounding)",
          "paragraphs": [
            "• Sit or stand comfortably. Back upright but not rigid.\n• Feel the points of contact: soles, back against the seat.\n• Let the weight sink into the earth.\n• With each exhale, soften the neck, jaw and shoulders.\n• <strong>Goal:</strong> to feel the vertical axis, your base."
          ]
        },
        {
          "title": "Stage 2 — Feel the Breath (Regulation)",
          "paragraphs": [
            "• Close or half-close your eyes.\n• Feel the path: inhale through the nose → lungs → belly, exhale the other way round.\n• Under tension: move into the 4-6 rhythm, with the exhale slowly through the mouth, as if blowing out a candle.\n• <strong>Goal:</strong> a natural, unbroken rhythm; calm in the nervous system."
          ]
        },
        {
          "title": "Stage 3 — Focus Forward (Concentration)",
          "paragraphs": [
            "• Open your eyes. Choose a quiet point in front of you.\n• Look at it with a soft, steady gaze.\n• If thoughts come: recognise → label → return gently.\n• <strong>Goal:</strong> training attention to steady itself."
          ]
        },
        {
          "title": "Stage 4 — Open into Space (Open Awareness)",
          "paragraphs": [
            "• Soften your gaze. Open your peripheral vision{{peripheral_vision}}.\n• See the whole visual field: right, left, up, down.\n• Feel at the same time: body, breath, earth, sky.\n• <strong>Goal:</strong> a direct sense of presence, without words or effort."
          ],
          "actionLink": {
            "url": "/rabbithole",
            "label": "In the Rabbit Hole: Dzogchen · The Nature of Mind & the Release of Tension"
          }
        }
      ],
      "exercise": {
        "title": "The Complete Exercise",
        "steps": [
          "Stage 1 — Earth: Sit comfortably. Feel the points of contact and let the weight sink.",
          "Stage 2 — Breath: Close or half-close your eyes. Feel the path of the air. Under tension, the 4-6 rhythm.",
          "Stage 3 — Focus: Open your eyes onto a quiet point in front of you. If thoughts come: recognise, label, return gently.",
          "Stage 4 — Space: Soften your gaze. Feel body, breath and the space around you, all at once."
        ]
      },
      "insight": "Four stages, in order: earth, rhythm, point, field. And underneath it all, gentleness.",
      "reflection": "Which stage feels most natural to me? Where do I struggle most?"
    },
    {
      "num": 11,
      "title": "The Background",
      "sub": "Science and Wisdom",
      "tag": "Roots",
      "color": "var(--lav)",
      "hex": "#B5A7D0",
      "icon": "🔬",
      "summary": "The \"how\" (neuroscience) and the \"why\" (contemplative tradition) behind the \"what\" of the exercises. Optional for the practice, useful for trust.",
      "tldr": "The \"how\" from neuroscience and the \"why\" from contemplative tradition. The method does not ask you to believe anything; it asks you to try and to observe.",
      "theorySections": [
        {
          "title": "The Philosophy of the Research",
          "paragraphs": [
            "This guide is not just a book of exercises. For the neurodivergent mind, which is not satisfied with \"do it because I say so\", it tries to show the how, the what and the why. It does not ask for trust; it builds it through understanding.",
            "<strong>The philosophy of the research.</strong> Classic mindfulness techniques can bring anxiety or \"freezing\" to neurodivergent people, because they often ask for immediate stillness and passive observation. This method starts from the other end: from the body upwards{{movement_vs_breathwork}} (somatic, bottom-up). First the nervous system is regulated, then observation comes. Research on contemplative traditions describes the same order: stable, focused attention is cultivated first, and open observation comes after.\nSource: Lutz et al. (2008). Trends in Cognitive Sciences. DOI: 10.1016/j.tics.2008.01.005"
          ]
        },
        {
          "title": "The Four Centres in Research",
          "paragraphs": [
            "<strong>Body — Grounding & Gravity.</strong> The brain continually computes gravity and the body's relationship to the ground, with the cerebellum playing a central role in this computation{{mackrous_2019}}. In practice, turning attention to gravity and the points of support gives the nervous system a steady, familiar reference: a sense of \"here\" that needs no thinking.\nSource: Mackrous et al. (2019). Current Biology. DOI: 10.1016/j.cub.2019.07.006",
            "<strong>Breath — The Vagus Nerve.</strong> The slow, prolonged exhale activates the \"ventral\" side of the vagus nerve{{vagus_nerve}}, which is associated with states of calm and safety. You do not need to \"convince\" yourself that you are safe; in experience, the exhale sends the signal by itself.\nSource: Porges, S. W. (1995). Psychophysiology. DOI: 10.1111/j.1469-8986.1995.tb01213.x",
            "<strong>Attention — A Quiet DMN.</strong> The Default Mode Network (DMN) is associated with mind-wandering, rumination and self-criticism, and is often overactive in neurodivergent brains. Farb and colleagues showed that shifting from \"narrative\" to direct, experiential attention (what am I feeling now) is linked with reduced DMN activity{{farb_2007}}. Labelling and returning to sensation are exactly this shift.\nSource: Farb et al. (2007). Social Cognitive and Affective Neuroscience. DOI: 10.1093/scan/nsm030",
            "<strong>Space — Open Awareness.</strong> In experienced meditators, increased synchronisation of <strong>gamma</strong> brainwaves has been observed during open-awareness practice{{davidson_2004}}. Separately, Open Focus research links the widening of attention with a stronger <strong>alpha</strong> rhythm. In experience, both feel like \"unsticking\" from narrow hyperfocus: less exhaustion, more spaciousness.\nSource: Lutz et al. (2004). PNAS. DOI: 10.1073/pnas.0407401101",
            "That these change with repetition rests on <strong>neuroplasticity</strong>{{neuroplasticity}}, the brain's ability to reorganise itself through practice."
          ]
        },
        {
          "title": "Further Studies",
          "paragraphs": [
            "• Effectiveness in adult ADHD — Kim & Jung (2025). Medicine. DOI: 10.1097/MD.0000000000044308\n• Neurobiology & neuroplasticity of mindfulness — Calderone et al. (2024). Biomedicines. DOI: 10.3390/biomedicines12112613\n• DMN connectivity & meditation — Brewer et al. (2011). PNAS. DOI: 10.1073/pnas.1112029108\n• An 8-week programme specifically for ADHD — Zylowska et al. (2008). Journal of Attention Disorders. DOI: 10.1177/1087054707308502\n• Mindfulness in autism: a systematic review, with encouraging results from studies still of low to moderate quality — Simione et al. (2024). Brain Sciences. DOI: 10.3390/brainsci14101001\n• Hyperfocus as \"all or nothing\" regulation — Ashinoff & Abu-Akel (2019). Psychological Research. DOI: 10.1007/s00426-019-01245-8\n• Peripheral vision & soft gaze — Vater et al. (2022). Psychonomic Bulletin & Review. DOI: 10.3758/s13423-022-02117-w\n• Ecological perception & the ground — Gibson, J. J. (1979/2014). The Ecological Approach to Visual Perception. Psychology Press. DOI: 10.4324/9781315740218\n• Brainwave entrainment (binaural) — Lane et al. (1998). Physiology & Behavior. DOI: 10.1016/S0031-9384(97)00436-8"
          ]
        },
        {
          "title": "For Chapter 7: Avoidance and Procrastination",
          "paragraphs": [
            "• Procrastination as short-term mood regulation — Sirois & Pychyl (2013). Social and Personality Psychology Compass. DOI: 10.1111/spc3.12011\n• Self-forgiveness for procrastinating reduces future procrastination — Wohl, Pychyl & Bennett (2010). Personality and Individual Differences. DOI: 10.1016/j.paid.2010.01.029\n• Stress impairs prefrontal cortex function — Arnsten (2009). Nature Reviews Neuroscience. DOI: 10.1038/nrn2648\n• New learning that changes the link between act and threat (inhibitory learning) — Craske et al. (2014). Behaviour Research and Therapy. DOI: 10.1016/j.brat.2014.04.006\n• The pressure to appear \"normal\" (camouflaging) — Hull et al. (2017). Journal of Autism and Developmental Disorders. DOI: 10.1007/s10803-017-3166-5\n• Autistic burnout — Raymaker et al. (2020). Autism in Adulthood. DOI: 10.1089/aut.2019.0079"
          ]
        },
        {
          "title": "The Spiritual Background",
          "paragraphs": [
            "<strong>Mahāsatipaṭṭhāna Sutta.</strong> The Four Foundations of Mindfulness (Body, Feelings, Mind, Mental Phenomena) correspond directly to the four stages of the method.",
            "<strong>Dzogchen.</strong> Traditions such as Dzogchen speak of recognising the \"open space\" of consciousness, in which thoughts and emotions appear and disappear without confining us.",
            "<strong>Sufism.</strong> Sufism reminds us of the importance of grounding and of the heart as centre: the connection of spirit and body."
          ]
        },
        {
          "title": "The Transmission Lineage",
          "paragraphs": [
            "The practices this method rests on were not learned from books. They were given in person, by teachers, in this order. The list contains two different things: transmissions of practice, and religious commitments (refuge). They are marked separately, because they are not the same.",
            "• <strong>Tai Chi / Qi Gong</strong> (training) — The Great Form, from Petros Kouropoulos.\n• <strong>Sufism, Inayatiyya</strong> (initiation) — Initiation and naming from Dimitris Magriotis, the tradition's appointed teacher in Greece; participation over years.\n• <strong>Dzogchen</strong> (transmission) — First transmission from Chögyal Namkhai Norbu.\n• <strong>Karma Kagyu</strong> (refuge) — At the Karma Kunkhyabling Centre, Athens, with a bond to the 17th Karmapa, Ogyen Trinley Dorje.\n• <strong>Nyingma / Palyul</strong> (refuge) — From Khenpo Efstathios I. Liakopoulos (Kunzang Trinley Dorje Tsal, †2023), founder of the Buddhist Studies Centre \"King Menander\".\n• <strong>Dzogchen, continued</strong> (transmissions) — From Keith Dowman; and over the last two years, two transmissions from Yeshi Namkhai, who continues his father's lineage.",
            "None of these lineages has endorsed this book, and none bears responsibility for its form. The method is my own distillation of what was given to me.",
            "<strong>Conclusion:</strong> science and spirituality converge. Balance begins in the body, is regulated by the breath, is steadied by attention and expands into a sense of vastness."
          ]
        },
        {
          "title": "Resources & Further Reading",
          "paragraphs": [
            "• Open Focus — https://openfocus.com/home/\n• Short Moments of Open Intelligence — https://www.holybooks.com/wp-content/uploads/Short-Moments-of-Open-Intelligence.pdf\n• Lama Lena — Dzogchen — https://lamalenateachings.com/\n• Merigar — International Dzogchen Community (Chögyal Namkhai Norbu) — https://www.merigar.it/en/dzogchen-community/\n• Sufism — https://sufi.gr/"
          ]
        }
      ],
      "exercise": {
        "title": "My Journey",
        "steps": [
          "Which of the four centres comes most naturally to me?",
          "Where do I struggle most?",
          "What has changed since I began?"
        ]
      },
      "insight": "The method does not ask you to believe anything. It asks you to try and to observe. Science explains why it works; tradition explains where it came from.",
      "reflection": "What do I carry with me from this practice?"
    }
  ],
  "el": [
    {
      "num": 1,
      "title": "Σώμα",
      "sub": "Η Σταθερότητα του «Εδώ»",
      "tag": "Εδώ",
      "color": "var(--color-axis-body)",
      "hex": "#7A9E7E",
      "icon": "⚓",
      "video": "/Basic.mp4",
      "summary": "Το σώμα είναι η αναμφίβολη βάση της παρούσας στιγμής. Μαθαίνεις να αντιλαμβάνεσαι τη βαρύτητα, τη στάση σου και την επαφή με τον χώρο, ως αφετηρία κάθε πρακτικής.",
      "tldr": "Το σώμα είναι το μοναδικό σημείο που είναι πάντα στο «Εδώ». Η βαρύτητα είναι η άμεση απόδειξη της παρουσίας σου. Νιώσε το βάρος σου, και ο νους βρίσκει πού να σταθεί.",
      "theorySections": [
        {
          "title": "Η Αρχή: Χαλάρωση και Γείωση",
          "paragraphs": [
            "Η πρακτική του Τετραπλού Άξονα ξεκινά πάντα με το σώμα. Το σώμα είναι η σταθερή σου βάση, το αναμφίβολο «Εδώ» που σε συνδέει με τον παρόντα χρόνο. Ξεκινάμε με τη συνειδητή γείωση, καθώς η χαλάρωση προηγείται της επίγνωσης.",
            "Το σώμα σου δεν είναι απλώς ένα όχημα. Είναι ένα ζωντανό αρχείο των εμπειριών σου. Η στάση που έχεις διαμορφώσει κουβαλά συχνά την απόρριψη, την απογοήτευση και την ένταση που βίωσες επειδή ένιωθες διαφορετικός/ή. Αυτές οι εμπειρίες «κλειδώνονται» ως χρόνιο σφίξιμο στους ώμους, την πλάτη, τη λεκάνη και το σαγόνι."
          ]
        },
        {
          "title": "Η Βαρύτητα: Το Αναμφίβολο «Εδώ»",
          "paragraphs": [
            "Η βαρύτητα{{gravity}} δεν είναι απλώς μια δύναμη. Είναι η απόδειξη του «Εδώ». Σου δείχνει, χωρίς καμία αμφιβολία, ακριβώς το σημείο στο οποίο μπορείς να υπάρξεις στον χώρο, αυτή τη συγκεκριμένη στιγμή. Η γείωση{{grounding}} είναι η πρώτη πράξη χαλάρωσης."
          ],
          "interactive": "gravity_thoughts"
        },
        {
          "title": "Ο Στόχος σου",
          "paragraphs": [
            "• <strong>Όχι:</strong> να πετύχεις μια συγκεκριμένη, τέλεια στάση.\n• <strong>Όχι:</strong> να σταματήσεις τις σκέψεις.\n• <strong>Ναι:</strong> να είσαι άνετος/η, γειωμένος/η και χαλαρός/ή μέσα στο σώμα σου."
          ]
        },
        {
          "title": "Το Σώμα, ο Χώρος και η Αίσθηση Ασφάλειας",
          "paragraphs": [
            "Η βαθιά χαλαρότητα μέσα στο σώμα δεν είναι ποτέ μια απομονωμένη πράξη. Προϋποθέτει πάντα την επίγνωση του χώρου. Το σώμα σου, μέσω των αισθητηρίων οργάνων, σε πληροφορεί συνεχώς για τη θέση σου μέσα στον χώρο{{proprioception}}.",
            "Όταν ο χώρος γίνεται αντιληπτός ως ανοιχτός και δεκτικός, το σώμα λαμβάνει την άδεια να αφήσει το σφίξιμο και να χαλαρώσει. Η αληθινή γείωση επιτυγχάνεται μόνο μέσα σε έναν χώρο που νιώθεις ότι σε χωρά. Το σώμα και ο χώρος συνεργάζονται{{gibson_1979}}."
          ]
        },
        {
          "title": "Απόδραση από τις Έννοιες",
          "paragraphs": [
            "Μέσα στο σώμα δεν υπάρχουν έννοιες, μόνο αισθήσεις{{interoception}}: βάρος, ζεστασιά, πίεση, παλμός. Όταν στρέφεσαι στο σώμα, βγαίνεις από τη σκέψη χωρίς να πολεμήσεις τη σκέψη.",
            "Όταν ο νους δεν έχει μια σταθερή, αναμφίβολη βάση στο παρόν, συχνά πέφτει στην παγίδα της εσωτερικής ανάλυσης και των σεναρίων. Η εστίαση στη βαρύτητα σού δίνει τη δυνατότητα να βγεις από αυτά τα νοητικά σενάρια.",
            "Η ανάλυση και η παρατήρηση γίνονται με την ησυχία τους, αφού πρώτα υπάρξει η σταθερότητα.",
            "Εδώ αξίζει να ονομάσουμε δύο λειτουργίες που θα συναντάς σε όλο τον οδηγό. Ο <strong>Μηχανικός Νους</strong>{{mechanical_mind}} είναι το μέρος του νου που αναλύει το παρελθόν και σχεδιάζει το μέλλον· χρήσιμο εργαλείο, αλλά χωρίς αίσθηση του τώρα. Ο <strong>Ανοιχτός Νους</strong> είναι η συμπληρωματική του λειτουργία: παρατηρεί χωρίς να αναλύει, αγκαλιάζει χωρίς να κρίνει, βλέπει πέρα από τα σενάρια. Το περιεχόμενο του Μηχανικού Νου αναγνωρίζεται και αφήνεται, αν δεν είναι χρήσιμο ή αν είναι βλαβερό, χωρίς την ανάγκη για ανάλυση. Θα τους ξανασυναντήσεις αναλυτικά στο Κεφάλαιο 5.",
            "<strong>Αναμφίβολο «Εδώ» και αδιάκοπη ροή.</strong> Ενώ η βαρύτητα σού δίνει ένα ακλόνητο «Εδώ», σε μεγαλύτερη κλίμακα υπάρχει μόνο κίνηση και ροή (όπως η Γη γύρω από τον Ήλιο). Η ενσυνειδητότητα σε διδάσκει να αγκαλιάζεις και τους δύο πόλους: τη σταθερότητα της βαρύτητας και την αδιάκοπη ροή της ζωής.",
            "<strong>Σημαντική σημείωση για τον χρόνο.</strong> Η αλλαγή της στάσης και της έντασης παίρνει αρκετό χρόνο. Η συνήθεια έχει χτιστεί επί χρόνια και το σώμα έχει καλουπωθεί. Μη βιαστείς και μην πιέζεις τον εαυτό σου. Η επιμονή στην ηπιότητα είναι η μεγαλύτερη πράξη αυτορρύθμισης."
          ]
        },
        {
          "title": "Τέσσερις Ασκήσεις για τη Γη",
          "paragraphs": [
            "Από τη μία στιγμή ως τα λίγα λεπτά. Ξεκίνα από όποια σε βολεύει.",
            "1. <strong>Η πτώση του βάρους</strong> (1 δευτερόλεπτο) — Όπου κι αν βρίσκεσαι, σταμάτα για μία στιγμή και άσε το βάρος σου να «πέσει» προς τη γη. Αυτό είναι όλο.\n2. <strong>Τα πέλματα</strong> (20 δευτερόλεπτα) — Φέρε την προσοχή στα πέλματα. Νιώσε την επαφή με το έδαφος, το βάρος να μοιράζεται, τη γη να σε κρατά.\n3. <strong>Ο άξονας</strong> (1 λεπτό) — Νιώσε τη νοητή κατακόρυφη γραμμή από την κορυφή του κεφαλιού ως τα πέλματα. Με κάθε εκπνοή, χαλάρωσε σαγόνι και ώμους γύρω της.\n4. <strong>Αργό περπάτημα</strong> (2–3 λεπτά) — Περπάτα πιο αργά απ' το συνηθισμένο, νιώθοντας κάθε πέλμα να ακουμπά και να σπρώχνει. Η γη σε κρατά σε κάθε βήμα."
          ],
          "actionLink": {
            "url": "/practice/grounding",
            "label": "Άσκηση γείωσης με καθοδήγηση"
          }
        }
      ],
      "exercise": {
        "title": "Το Βιβλίο / Κουτί",
        "steps": [
          "Θέση: Στάσου όρθιος/η με άνεση.",
          "Εργαλείο (προαιρετικό): Πάρε ένα βιβλίο ή κουτί και τοποθέτησέ το στο κεφάλι σου.",
          "Εστίαση: Παρατήρησε πώς χρειάζεται να σταθείς για να μην πέσει. Νιώσε πώς το βάρος κατεβαίνει ομαλά μέσα από τον λαιμό, τη σπονδυλική στήλη και τη λεκάνη.",
          "Αίσθηση: Νιώσε το βάρος, την αφή των πελμάτων στο έδαφος και την αίσθηση του άξονα που σε κρατά όρθιο/η."
        ]
      },
      "insight": "Η βαρύτητα είναι πάντα εδώ. Το σώμα είναι πάντα εδώ. Αυτό είναι αρκετό για να ξεκινήσουμε.",
      "reflection": "Μετά την άσκηση, τι παρατήρησα στο σώμα μου;"
    },
    {
      "num": 2,
      "title": "Αναπνοή",
      "sub": "Ο Ρυθμός της Ζωής",
      "tag": "Ενέργεια",
      "color": "var(--color-axis-breath)",
      "hex": "#C07050",
      "icon": "🫁",
      "video": "/Basic.mp4",
      "summary": "Η αναπνοή σε συνδέει με τον ρυθμό της ζωής και διδάσκει την αποδοχή της παροδικότητας. Κάθε εισπνοή και εκπνοή είναι μια μικρή πρόβα αρχής και τέλους.",
      "tldr": "Η αναπνοή είναι ο ρυθμός που σε συνοδεύει πάντα. Δεν τη διορθώνεις· την παρατηρείς. Το εργαλείο είναι πάντα η εκπνοή.",
      "theorySections": [
        {
          "title": "Ο Ρυθμός της Ύπαρξης",
          "paragraphs": [
            "Αν το σώμα σε ενώνει με τη γη, η αναπνοή σε συνδέει με τον αέρα και την αδιάκοπη ροή του κόσμου. Είναι ο ρυθμός που σε συνοδεύει από τη γέννηση μέχρι το τέλος.",
            "Η παρατήρηση της αναπνοής σού διδάσκει τον φυσικό ρυθμό της ύπαρξης και την αποδοχή της παροδικότητας. Κάθε εισπνοή συγκρατείται για μια στιγμή και στη συνέχεια αφήνεται με την εκπνοή.",
            "• <strong>ΕΙΣΠΝΟΗ — Η Αρχή:</strong> η γέννηση, η λήψη.\n• <strong>ΠΑΥΣΗ — Η Στιγμή:</strong> η ύπαρξη στο τώρα.\n• <strong>ΕΚΠΝΟΗ — Το Τέλος:</strong> η απελευθέρωση, η αποδοχή.",
            "Αυτό είναι κρίσιμο για τον νευροδιαφορετικό νου: όταν νιώθεις ένα έντονο συναίσθημα, μπορεί να μοιάζει μόνιμο. Παρατηρώντας τον ρυθμό της αναπνοής, μαθαίνεις ότι κάθε κατάσταση είναι παροδική."
          ],
          "image": "/breathchapter.svg"
        },
        {
          "title": "Η Πράξη της Παρατήρησης — Εσωτερική Αφή",
          "paragraphs": [
            "Το πρώτο βήμα είναι η αποδοχή. Δεν χρειάζεται να ελέγξεις την αναπνοή σου. Αρκεί να την παρατηρήσεις όπως είναι: βαθιά ή ρηχή, αργή ή γρήγορη, ελεύθερη ή σφιγμένη. Παρατήρησε:",
            "• Την αίσθηση του αέρα που αγγίζει τα ρουθούνια{{interoception}}.\n• Τη διαστολή και συστολή του θώρακα.\n• Την κίνηση της κοιλιάς.\n• Τη μικρή αλλαγή στη στάση του σώματος με κάθε εισπνοή και εκπνοή.",
            "<strong>Η αναπνοή ως δείκτης.</strong> Αν είναι σφιγμένη ή ρηχή, δείχνει ένταση. Αν είναι αργή και βαθιά, δείχνει χαλάρωση. Η αναπνοή είναι ο δείκτης της ψυχικής σου κατάστασης."
          ],
          "interactive": "eswterikhafh"
        },
        {
          "title": "Οι Τρεις Ρυθμοί",
          "paragraphs": [
            "Σε όλο τον οδηγό θα συναντήσεις τρεις ρυθμούς αναπνοής. Δεν είναι ανταγωνιστικοί: ο καθένας έχει τη δουλειά του.",
            "• <strong>5-5</strong> (εισπνοή 5, εκπνοή 5): καθημερινά, σε ουδέτερη κατάσταση· ισορροπία και σταθεροποίηση· ο άστατος αέρας γίνεται ρεύμα\n• <strong>4-6</strong> (εισπνοή 4, εκπνοή 6): στην κορύφωση, όταν ο άνεμος δυναμώνει· η μακρύτερη εκπνοή λέει στο νευρικό σύστημα «είμαστε ασφαλείς»\n• <strong>4-2-7</strong> (εισπνοή 4, κράτημα 2, εκπνοή 7): σε ήσυχη στιγμή, για βαθιά χαλάρωση· παύση και πολύ μακριά εκπνοή· ο πιο έντονος ρυθμιστής",
            "Στις ασκήσεις αναπνοής της εφαρμογής θα βρεις και την παραλλαγή 4-7-8, που δουλεύει με την ίδια αρχή όπως το 4-2-7: μακριά εκπνοή μετά από παύση.",
            "Ένας κανόνας που ισχύει και για τους τρεις: <strong>η εκπνοή είναι το εργαλείο, όχι η εισπνοή.{{slow_exhale}}</strong> Δεν χρειάζεται ποτέ να πιέσεις τον αέρα μέσα."
          ]
        },
        {
          "title": "Ρύθμιση σε Έντονο Άγχος",
          "paragraphs": [
            "Σε στιγμές έντονου άγχους ή υπερφόρτωσης, η αναπνοή μπορεί να γίνει άμεσο εργαλείο ρύθμισης. Άφησε την εκπνοή να βγαίνει από το στόμα, λίγο πιο αργά και παρατεταμένα{{vagus_nerve}}. Επίτρεψε στην κοιλιά να μαλακώσει και να συσπαστεί ελαφρά προς τα μέσα."
          ]
        },
        {
          "title": "Οι Άνεμοι του Συναισθήματος",
          "paragraphs": [
            "Είδαμε την αναπνοή ως δείκτη. Υπάρχει όμως και μια δεύτερη, παλιά ανάγνωση: τα συναισθήματα είναι άνεμοι. Δεν είναι ιδέες στο κεφάλι, είναι καιρικά φαινόμενα στο σώμα και στην αναπνοή. Εκεί μπορείς να τα διαβάσεις, πριν βρεις λέξεις γι' αυτά.",
            "• <strong>Θυμός</strong> — δυνατός, ανοδικός άνεμος: φουσκώνει το στήθος, ανεβάζει και ρηχαίνει την αναπνοή.\n• <strong>Άγχος</strong> — άνεμος που αλλάζει διαρκώς κατεύθυνση: αναπνοή άστατη, κοντή, χωρίς ρυθμό.\n• <strong>Λύπη</strong> — άπνοια και υγρασία: ο αέρας βαραίνει, η αναπνοή αραιώνει, με αναστεναγμούς που έρχονται μόνοι τους.\n• <strong>Μούδιασμα</strong> — πυκνή ομίχλη σε ακίνητο αέρα: αναπνοή τόσο αχνή που σχεδόν ξεχνιέται.\n• <strong>Γαλήνη και χαρά</strong> — ελαφρύ, σταθερό αεράκι: αναπνοή βαθιά και αβίαστη. Ο χάρτης δεν έχει μόνο κακοκαιρία.",
            "Αν η ερώτηση «τι νιώθεις;» σού φέρνει κενό, δεν σου λείπει κάτι. Απλώς σου ζητούσαν να μεταφράσεις τον καιρό σε λόγια, χωρίς να σου μάθουν πρώτα να τον παρατηρείς.",
            "<strong>Πρώτα διαβάζεις τον καιρό.</strong> Τι άνεμος είναι; Πού τον νιώθω στο σώμα; Πόση ώρα φυσάει; Χωρίς «γιατί», χωρίς ιστορίες. Μόνο ο καιρός, τώρα. Η αναγνώριση είναι ήδη ρύθμιση{{corrigan_2010}}: ένας άνεμος που τον έχεις δει δεν σε κυβερνά όπως ένας άνεμος που αρνείσαι ότι φυσάει.",
            "<strong>Μετά συνοδεύεις τον άνεμο.</strong> Δεν τον σταματάς, του δίνεις ρυθμό:",
            "• Στην κορύφωση (θυμός που ανεβαίνει, άγχος που ξεφεύγει): <strong>4-6</strong>.\n• Όταν κοπάσει λίγο: <strong>5-5</strong>.\n• <strong>Ψάλσιμο ή βουητό (humming) πάνω στην εκπνοή:</strong> μακριά εκπνοή με δόνηση. Το σώμα ηρεμεί το σώμα. Αν βουίζεις ήδη ενστικτωδώς όταν πιέζεσαι, το ήξερες πριν το διαβάσεις."
          ],
          "actionLink": {
            "url": "/practice?category=vocal",
            "label": "Ψάλσιμο & Αντήχηση"
          }
        },
        {
          "title": "Ριπές, Συστήματα, Κλίμα",
          "paragraphs": [
            "Μια τίμια κουβέντα: δεν υπακούν όλοι οι άνεμοι στα ίδια εργαλεία.",
            "• <strong>Ριπές (λεπτά):</strong> ένας ξαφνικός εκνευρισμός, ένα κύμα άγχους. Η αναπνοή τα μαλακώνει άμεσα.\n• <strong>Συστήματα καιρού (μέρες):</strong> ο θυμός ή ο πόνος μετά από μια απόρριψη μπορεί να φυσάει και αύριο. Αν οι αναπνοές δεν τον σβήσουν, δεν απέτυχες: αυτός ο άνεμος έχει τη δική του διάρκεια. Εδώ ο στόχος αλλάζει. Όχι να αλλάξεις τον καιρό, αλλά να κρατήσεις το σκάφος πλεύσιμο. Φαγητό, ύπνος, ένας άνθρωπος να μιλήσεις, ξανά ανάγνωση του καιρού. Αυτό είναι επιτυχία.\n• <strong>Κλίμα (χρόνια):</strong> τα μακριά μοτίβα που έρχονται από παλιά. Δεν λύνονται σε μια μέρα, και για τα βαθύτερα αξίζει συνοδεία από επαγγελματία. Όμως το να ξέρεις το κλίμα σου αλλάζει το ενδιάμεσο: όταν ο άνεμος σηκώνεται δυσανάλογα με την αφορμή, δεν συμπεραίνεις «κάτι δεν πάει καλά με μένα», αναγνωρίζεις «αυτό το μοτίβο το ξέρω». Ο πόνος μένει· φεύγει ο δεύτερος πόνος, η σύγχυση και η αυτοκατηγορία.",
            "Τίποτα από αυτά δεν σημαίνει ότι είσαι χαλασμένος/η. Σημαίνει ότι έχεις καιρό, όπως όλοι. Τώρα έχεις και χάρτη."
          ],
          "actionLink": {
            "url": "/rabbithole/riding-the-wind",
            "label": "Στην Κουνελότρυπα: Μαθαίνοντας να ιππεύεις τον άνεμο"
          }
        },
        {
          "title": "Ο Άξονας της Παρουσίας",
          "paragraphs": [
            "Με την κίνησή της, η αναπνοή δυναμώνει τον άξονα της παρουσίας που στηρίζεται στη βαρύτητα. Λειτουργεί σαν αντίβαρο απέναντι στη ροή των σκέψεων: ενώ το μυαλό μπορεί να τρέχει, η αναπνοή στηρίζει το σώμα στο τώρα.",
            "Το εργαλείο εδώ είναι διπλό: να αναγνωρίζεις τον ρυθμό και την ποιότητα της αναπνοής σου, και να νιώθεις πώς η κίνησή της στηρίζει τον άξονα σώμα–βαρύτητα, επαναφέροντάς σε απέναντι στη ροή των σκέψεων.",
            "Η αναπνοή σε διδάσκει να παρατηρείς χωρίς να επεμβαίνεις. Αυτή η ικανότητα είναι η γέφυρα για το επόμενο βήμα: την Προσοχή."
          ]
        },
        {
          "title": "Τέσσερις Ασκήσεις για τον Αέρα",
          "paragraphs": [
            "1. <strong>Μία αναπνοή</strong> (1 αναπνοή) — Παρατήρησε μία μόνο εισπνοή και εκπνοή, χωρίς να αλλάξεις τίποτα. Απλώς δες την όπως είναι.\n2. <strong>Ο αέρας στα ρουθούνια</strong> (30 δευτερόλεπτα) — Νιώσε το δροσερό ρεύμα στην εισπνοή, το πιο ζεστό στην εκπνοή. Μόνο το σημείο όπου ο αέρας αγγίζει.\n3. <strong>Μαλακή κοιλιά</strong> (1 λεπτό) — Άσε την κοιλιά να μαλακώσει. Στην εκπνοή, βγάλε τον αέρα αργά από το στόμα (ρυθμός 4-6). Νιώσε την κοιλιά να μαζεύεται ήπια.\n4. <strong>Βουητό στην εκπνοή</strong> (1–2 λεπτά) — Πάρε μια ήσυχη εισπνοή και, στην εκπνοή, βγάλε ένα απαλό «μμμ». Νιώσε τη δόνηση. Το σώμα ηρεμεί το σώμα."
          ],
          "actionLink": {
            "url": "/practice",
            "label": "Καθοδηγούμενη αναπνοή"
          }
        }
      ],
      "exercise": {
        "title": "Η Ενεργή Επιστροφή",
        "steps": [
          "Γείωση (Σώμα): Στάσου όρθιος/η ή κάθισε άνετα. Νιώσε τη βαρύτητα, την επαφή με το έδαφος.",
          "Επίγνωση (Αναπνοή): Στρέψε την προσοχή στην εισπνοή και εκπνοή. Νιώσε τον αέρα που αγγίζει τα ρουθούνια.",
          "Στην εκπνοή: Άφησε την κοιλιά να μαζευτεί ήπια προς τα μέσα, σαν να βγάζεις όλη την ένταση μαζί με τον αέρα.",
          "Αποδοχή: Μην προσπαθήσεις να αλλάξεις την αναπνοή. Αρκεί η επίγνωση.",
          "Ρύθμιση (προαιρετικό): Αν νιώθεις πολύ άγχος, πέρασε στον ρυθμό 4-6, με την εκπνοή να βγαίνει από το στόμα."
        ]
      },
      "insight": "Παρατηρώ χωρίς να επεμβαίνω. Κάθε αναπνοή είναι μια νέα αρχή. Το εργαλείο είναι πάντα η εκπνοή.",
      "reflection": "Πώς ήταν η αναπνοή μου στην άσκηση; (γρήγορη/αργή, ρηχή/βαθιά, σφιγμένη/ελεύθερη)"
    },
    {
      "num": 3,
      "title": "Προσοχή",
      "sub": "Ο Φακός της Συνείδησης",
      "tag": "Κατεύθυνση",
      "color": "var(--color-axis-focus)",
      "hex": "#C8922A",
      "icon": "🔦",
      "video": "/Basic.mp4",
      "summary": "Η προσοχή είναι ο φακός του νου: μπορεί να εστιάζει, να ανοίγει, να διασπάται ή να αγκυλώνεται. Μαθαίνεις να αναγνωρίζεις πού βρίσκεται και να την επιστρέφεις απαλά, χωρίς αυτοκριτική.",
      "tldr": "Η προσοχή είναι ο φακός: εστιάζει, ανοίγει, διασπάται, αγκυλώνεται. Δεν τη μαλώνεις· τη βλέπεις και την επιστρέφεις απαλά.",
      "theorySections": [
        {
          "title": "Οι Τέσσερις Μορφές Προσοχής",
          "paragraphs": [
            "Η προσοχή είναι το τρίτο κέντρο συνείδησης και το εργαλείο που καθορίζει πού θα σταθεί ο νους. Το σώμα είναι η βάση, η αναπνοή ο ρυθμός, και η προσοχή είναι ο φακός που φωτίζει την παρούσα στιγμή.",
            "<strong>Κλειστή Προσοχή.</strong> Η δέσμη μαζεύεται σε ένα σημείο. Χρήσιμη για συγκέντρωση. Π.χ. κοιτάς σταθερά ένα αντικείμενο.",
            "<strong>Ανοιχτή Προσοχή.</strong> Η δέσμη ανοίγει και φωτίζει πολλά μαζί. Ακούς τους ήχους, νιώθεις το σώμα, αναπνέεις. Όλα χωράνε στην ίδια επίγνωση.",
            "<strong>Διασπασμένη Προσοχή.</strong> Η προσοχή μοιάζει με μαϊμού που πηδά από κλαδί σε κλαδί. Ο στόχος δεν είναι να τη «σκοτώσεις» αλλά να τη χαλιναγωγήσεις απαλά.",
            "<strong>Αγκυλωμένη Προσοχή.</strong> Η δέσμη κολλάει{{hyperfocus}} σε εξωτερικό αντικείμενο ή σε ψυχικό περιεχόμενο: μια σκέψη, μια ανησυχία. Η υπερβολική αυτοαναφορικότητα («γιατί νιώθω έτσι; τι σημαίνει αυτό;») είναι η χαρακτηριστική της μορφή. Είναι η κατάσταση που αξίζει τη μεγαλύτερη προσοχή, και σε αυτήν αφιερώνεται η επόμενη ενότητα."
          ],
          "interactive": "three_attention"
        },
        {
          "title": "Οι Φαύλοι Κύκλοι: «Αλλιώς» και «Έπρεπε»",
          "paragraphs": [
            "Πού ακριβώς αγκυλώνεται η δέσμη; Τις περισσότερες φορές, σε δύο μοτίβα:",
            "• <strong>«Πώς θα μπορούσαν να ήταν τα πράγματα»</strong> — ο νους ξαναπαίζει το παρελθόν με άλλο σενάριο: αν είχα πει, αν είχα κάνει, αν είχε γίνει αλλιώς.\n• <strong>«Πώς θα έπρεπε να είναι τα πράγματα»</strong> — ο νους συγκρίνει το πραγματικό με ένα ιδεατό: έτσι έπρεπε να είναι η μέρα, η δουλειά, οι άλλοι, εγώ.",
            "Αυτά τα μοτίβα είναι κύκλοι που δεν οδηγούν πουθενά. Όχι από αδυναμία, αλλά από κατασκευή: συγκρίνουν το πραγματικό με κάτι που δεν υπάρχει, και το ανύπαρκτο δεν απαντά ποτέ. Η δέσμη μπορεί να γυρίζει στην ίδια τροχιά για ώρες χωρίς να φτάνει κάπου.",
            "Και κάνουν κάτι ακόμη: <strong>συντηρούν και μεγαλώνουν τα συναισθήματα.</strong> Θυμήσου τους ανέμους του προηγούμενου κεφαλαίου. Ένας άνεμος που θα κόπαζε μόνος του σε λίγα λεπτά, με τον κύκλο ξαναφουσκώνει κάθε φορά που πάει να πέσει. Ο κύκλος είναι το φυσερό του ανέμου. Γι' αυτό κάποια συναισθήματα κρατούν μέρες: δεν φυσάει ο καιρός, φυσάμε εμείς.",
            "Η έξοδος δεν είναι να αναλύσεις τον κύκλο· το «γιατί το σκέφτομαι αυτό;» είναι κι αυτό κύκλος. Η έξοδος είναι η αναγνώριση της τροχιάς: βλέπεις ότι η δέσμη μπήκε στη γνωστή στροφή, της βάζεις ταμπέλα, «Αλλιώς» ή «Έπρεπε», και επιστρέφεις απαλά στο σταθερό σημείο{{gentle_return}}. Δεν χρειάζεται να κερδίσεις τη συζήτηση με το ανύπαρκτο. Αρκεί να δεις ότι είναι συζήτηση με το ανύπαρκτο.",
            "Αν αυτοί οι κύκλοι σού είναι πολύ οικείοι, δεν είναι ελάττωμα λογικής. Είναι υπερλειτουργία μιας ικανότητας. Ο νους που τρέχει σενάρια είναι ο ίδιος νους που προβλέπει, σχεδιάζει, δημιουργεί. Και το «έπρεπε» συχνά δεν είναι καν δικό σου: είναι χρόνια προσδοκιών των άλλων που μιλούν με τη φωνή σου. Δεν πολεμάμε τη μηχανή των σεναρίων· μαθαίνουμε να βλέπουμε πότε γυρίζει στο κενό."
          ]
        },
        {
          "title": "Η Τετραπλή Προσοχή",
          "paragraphs": [
            "Σε αυτό το στάδιο, η προσοχή γίνεται τετραπλή. Κρατάς ταυτόχρονα επίγνωση τεσσάρων επιπέδων:",
            "• <strong>Σώμα</strong> — που δίνει βάση και σταθερότητα στην παρούσα στιγμή.\n• <strong>Αναπνοή</strong> — που δίνει ρυθμό και επαναφέρει στο τώρα.\n• <strong>Ίδια η Προσοχή</strong> — που μαθαίνει να σταθεροποιείται, να παρατηρεί πού πηγαίνει.\n• <strong>Σκέψεις</strong> — που αναγνωρίζονται χωρίς να παρασύρουν, απλώς παρατηρούνται."
          ],
          "interactive": "samatha_attention"
        },
        {
          "title": "Η Δύναμη της Ταμπέλας (thought labelling)",
          "paragraphs": [
            "Όταν μια σκέψη σε τραβάει, το να επιστρέψεις απλώς στην αναπνοή μπορεί να είναι δύσκολο. Η <strong>ετικετοποίηση</strong>{{labeling}} σού δίνει ένα ενδιάμεσο βήμα: αντί να εμπλακείς στο περιεχόμενο της σκέψης, βάλε της μια απλή, μονολεκτική ταμπέλα και μετά επέστρεψε στο σταθερό σημείο.",
            "• Σκέφτεσαι τι πρέπει να κάνεις αύριο → «Σχεδιασμός»\n• Σκέφτεσαι κάτι που είπες και ήταν λάθος → «Κριτική» ή «Παρελθόν»\n• Ανησυχείς για κάτι μελλοντικό → «Ανησυχία» ή «Σενάριο»"
          ],
          "actionLink": {
            "url": "/practice/microdoses",
            "label": "Μικρο-δόσεις προσοχής"
          }
        },
        {
          "title": "Υπερφόρτωση Αισθήσεων",
          "paragraphs": [
            "Μια μικρή προσομοίωση της διασπασμένης προσοχής (αισθητηριακή υπερφόρτωση, sensory overload), για να νιώσεις γιατί χρειάζεται η επιστροφή στον άξονα."
          ],
          "interactive": "attention_dispersion"
        },
        {
          "title": "Τέσσερις Ασκήσεις για τη Φωτιά",
          "paragraphs": [
            "1. <strong>Η οπτική άγκυρα</strong> (10 δευτερόλεπτα) — Διάλεξε ένα ήσυχο σημείο μπροστά σου και κοίταξέ το με απαλό, σταθερό βλέμμα. Όταν φύγεις, γύρνα απαλά.\n2. <strong>Ετικέτα και επιστροφή</strong> (30 δευτερόλεπτα) — Όταν μια σκέψη σε τραβήξει, δώσ' της μια λέξη («Σχεδιασμός», «Ανησυχία») και γύρνα στο σημείο σου.\n3. <strong>Τριπλή εστίαση</strong> (1 λεπτό) — Κράτα ταυτόχρονα τρία πράγματα: τα πέλματα, την αναπνοή, και το σημείο μπροστά σου. Αν χαθεί ένα, ξαναφέρ' το.\n4. <strong>Εναλλαγή φακού</strong> (1–2 λεπτά) — Εστίασε στενά σε ένα σημείο· μετά άνοιξε το βλέμμα να χωρέσει όλο το δωμάτιο· μετά ξανά στενά. Ζουμ μέσα, ζουμ έξω."
          ],
          "actionLink": {
            "url": "/rabbithole/soft-gaze",
            "label": "Στην Κουνελότρυπα: Το Μαλακό Βλέμμα"
          }
        }
      ],
      "exercise": {
        "title": "Σταθεροποίηση του Φακού",
        "steps": [
          "Σώμα & Αναπνοή: Στάσου ή κάθισε με άνεση. Κλείσε τα μάτια. Νιώσε το σώμα σου και τον ρυθμό της αναπνοής.",
          "Σταθερό Σημείο: Άνοιξε τα μάτια και επίλεξε ένα σημείο εστίασης (οπτικό, ακουστικό ή σωματικό).",
          "Τετραπλή Επίγνωση: Κράτησε την προσοχή εκεί, διατηρώντας παράλληλα επίγνωση σώματος, αναπνοής και σκέψεων.",
          "Απαλή Επιστροφή: Αν παρασυρθείς, αναγνώρισέ το (με ταμπέλα αν χρειάζεται) και επέστρεψε απαλά: σώμα → αναπνοή → σταθερό σημείο."
        ]
      },
      "insight": "Η επιστροφή της προσοχής δεν είναι αποτυχία, είναι η ίδια η άσκηση. Κάθε «απαλή επιστροφή» χτίζει νέες νευρικές διαδρομές.",
      "reflection": "Το ταξίδι της προσοχής μου — πού τείνει να «κολλάει» ή να «τρέχει»;"
    },
    {
      "num": 4,
      "title": "Χώρος",
      "sub": "Η Ανοιχτή Επίγνωση",
      "tag": "Άνοιγμα",
      "color": "var(--color-axis-space)",
      "hex": "#B5A7D0",
      "icon": "🌌",
      "video": "/Basic.mp4",
      "summary": "Τα τρία πρώτα κέντρα ήταν κάτι που κάνεις. Ο Χώρος είναι κάτι που ήδη υπάρχει. Εδώ γνωρίζεις την επίγνωση, το ανοιχτό πεδίο μέσα στο οποίο συμβαίνει η εμπειρία, και μαθαίνεις να αναπαύεσαι σε αυτό.",
      "tldr": "Τα τρία πρώτα κέντρα είναι κάτι που κάνεις· ο Χώρος είναι κάτι που ήδη υπάρχει. Η προσοχή είναι το σημείο, η επίγνωση το πεδίο. Σύντομες στιγμές, πολλές φορές, πάντα πάνω σε γειωμένο σώμα.",
      "theorySections": [
        {
          "title": "Πώς Οδηγείς",
          "paragraphs": [
            "Το Σώμα σού έδωσε σταθερότητα, η Αναπνοή ρυθμό, η Προσοχή την επιστροφή. Και τα τρία είναι πράξεις, κάτι που κατευθύνεις. Το τέταρτο είναι διαφορετικής φύσης: όχι μια ακόμα τεχνική, αλλά η ανακάλυψη του πεδίου μέσα στο οποίο δούλευαν οι τρεις πρώτες.",
            "Σκέψου πώς οδηγείς. Η προσοχή σου είναι κλειστή στον δρόμο μπροστά· εκεί κρατάς την ακρίβεια. Μαζί, μια ανοιχτή, περιφερειακή προσοχή{{peripheral_vision}} βλέπει πιο μακριά, δεξιά, αριστερά· και ανά διαστήματα, οι καθρέφτες, πίσω. Μπροστά, γύρω, πίσω, όλα μαζί. Δεν είναι δύο δεξιότητες που εναλλάσσεις· είναι μία επαφή με τον κόσμο, όπου η κλειστή προσοχή δίνει το σημείο και η ανοιχτή τον χώρο μέσα στον οποίο το σημείο έχει νόημα.",
            "Αν δεν οδηγείς, το ίδιο κάνεις όταν περπατάς σε πολυσύχναστο μέρος, στο μετρό ή σε μια γεμάτη πλατεία: κοιτάς πού πατάς, αλλά ταυτόχρονα υπολογίζεις πανοραμικά όλη την κίνηση γύρω σου για να βρεις πώς θα περάσεις. Σημείο και χώρος, μαζί.",
            "Πρόσεξε τι γίνεται όταν «φεύγεις» σε μια σκέψη. Η περιφέρεια σβήνει, οι καθρέφτες ξεχνιούνται, και το πιο ύπουλο: ακόμα κι εκείνο το μπροστά θολώνει. Δεν αντάλλαξες πλάτος για ακρίβεια· τα έχασες και τα δύο. Την ανοιχτή επίγνωση την ξέρεις ήδη· απλώς την ξεχνάς όταν κλείνεσαι."
          ]
        },
        {
          "title": "Το Σημείο και το Πεδίο",
          "paragraphs": [
            "Η <strong>προσοχή</strong> είναι το σημείο. Παίρνει πάντα ένα τοπικό, οριοθετημένο κομμάτι (ένα δωμάτιο, μια περιοχή, μια σκέψη), του δίνει όνομα και σύνορο, και κουράζεται, γιατί δουλεύει. Η <strong>επίγνωση</strong>{{open_awareness}} είναι το πεδίο μέσα στο οποίο κινείται το σημείο: ο συμπαντικός χώρος, χωρίς σύνορο, χωρίς όνομα, χωρίς σαφές όριο. Δεν διαλέγει, δεν κρατά τίποτα· απλώς γνωρίζει, γι' αυτό δεν κουράζει. Η διαφορά δεν είναι το μέγεθος: μια χώρα είναι τεράστια, αλλά παραμένει οριοθετημένη. Η επίγνωση δεν είναι μεγαλύτερο κομμάτι· είναι το άνευ ορίου μέσα στο οποίο χωρούν όλα τα κομμάτια.",
            "Η συνηθισμένη μας κατάσταση είναι η απορρόφηση στα περιεχόμενα: μια σκέψη έρχεται και γινόμαστε η σκέψη. Το τέταρτο βήμα είναι μια μετατόπιση του κέντρου: από το σημείο, στο πεδίο. Ως τώρα ήσουν ο φακός που κινείται από αντικείμενο σε αντικείμενο· τώρα, ανοίγοντας την περιφέρεια με κέντρο τον άξονα της βαρύτητας, γίνεσαι ο χώρος όπου ο φακός δουλεύει. Στην εμπειρία, δεν προσθέτεις τίποτα· σταματάς να το σκεπάζεις.",
            "Είναι μια μετατόπιση από το <strong>εγωκεντρικό</strong> στο <strong>χωροκεντρικό</strong>. Εγωκεντρικά, όλα περιστρέφονται γύρω μου. Χωροκεντρικά, εγώ κινούμαι μέσα σε κάτι απέραντο, και το καθένα υπάρχει με τον δικό του ρυθμό, ανεξάρτητα από μένα. Όπως, στην αλήθεια, δεν «ανατέλλει ο ήλιος»· η γη γυρίζει και με φέρνει στο φως.",
            "Γι' αυτό χρειάστηκαν πρώτα τα τρία βήματα: η άσκηση σταθεροποιεί το έδαφος, και πάνω σε σταθερό έδαφος η επίγνωση αναγνωρίζεται από μόνη της. Πρώτα η γη, μετά ο ουρανός."
          ]
        },
        {
          "title": "Την Έχεις Ήδη Συναντήσει",
          "paragraphs": [
            "Θυμήσου την «απαλή επιστροφή»{{gentle_return}} του Κεφαλαίου 3. Ο νους παρασύρεται, και κάποια στιγμή έρχεται εκείνο το «α, είχα χαθεί». Την επιστροφή την έκανες εσύ. Αλλά τη στιγμή της αναγνώρισης δεν την έκανε κανείς· αν μπορούσες να την αποφασίσεις, δεν θα είχες χαθεί. Αναδύθηκε μόνη της.",
            "Οι ερευνητές της περιπλάνησης του νου την ονομάζουν <strong>μετα-επίγνωση</strong>: τη στιγμή που ο νους αντιλαμβάνεται μόνος του πού βρίσκεται. Κανείς δεν την παράγει· εμφανίζεται. Το τέταρτο στάδιο δεν σου ζητά να αποκτήσεις κάτι νέο· σου ζητά να προσέξεις αυτό που σε ειδοποιούσε από την αρχή."
          ]
        },
        {
          "title": "Το Τούνελ: Πηγή που Θέλει Φροντίδα",
          "paragraphs": [
            "Αυτή η κλειστή, έντονη εστίαση, το τούνελ,{{hyperfocus}} δεν είναι εχθρός. Για πολλούς από εμάς είναι το ισχυρότερο εργαλείο που έχουμε: ο τόπος όπου συγκεντρωνόμαστε, δουλεύουμε, δημιουργούμε. Το ζήτημα δεν είναι να το εγκαταλείψεις, αλλά αν σε φροντίζει όσο είσαι μέσα του: αν πατάει σε γειωμένο σώμα και ξεκούραση, ή αν σε καίει.",
            "Όταν μένει αφρόντιστο, χωρίς σώμα και ανάσα, η περιφέρεια σβήνει και το κέντρο θολώνει· εκεί σταματά να είναι πηγή και γίνεται παγίδα. (Το ίδιο και στο έντονο άγχος: ο νους στενεύει και μεγεθύνει την απειλή — Κεφάλαιο 8.) Το τέταρτο βήμα δεν σβήνει το τούνελ· το φροντίζει. Ανοίγεις την περιφέρεια, γειώνεσαι, ξεκουράζεσαι, και ξαναμπαίνεις καθαρός, όχι καμένος. Η ανοιχτή επίγνωση δεν αντικαθιστά την εστίαση· είναι ο τόπος όπου η εστίαση ξαναγεμίζει."
          ]
        },
        {
          "title": "Ο Χώρος που Κατοικεί στην Αλήθεια",
          "paragraphs": [
            "Αυτό το πεδίο δεν το φαντάζεσαι. Οι τέσσερις άγκυρες δεν είναι κατασκευές του νου: η γη σε κρατά με τη βαρύτητά της είτε τη θυμάσαι είτε όχι, ο αέρας μπαινοβγαίνει μόνος του, το φως και ο χώρος υπάρχουν πριν από σένα. Είναι αλήθειες, όχι εικόνες, γι' αυτό έχουν σταθερότητα και ρυθμό. Μια εικόνα που φτιάχνεις τρεμοπαίζει και θέλει προσπάθεια· μια αλήθεια απλώς είναι εκεί. Δεν την κρατάς εσύ, σε κρατά εκείνη.",
            "Εδώ κρύβεται η πιο συνηθισμένη παρανόηση. Άλλο ο χώρος που φτιάχνει ο νους, μια όμορφη γαλάζια απεραντοσύνη που ζωγραφίζεις, που είναι απλώς ένα ακόμα περιεχόμενο. Κι άλλο ο χώρος που κατοικεί στην αλήθεια: ο πραγματικός χώρος που σε περιβάλλει τώρα. Τον πρώτο τον φαντάζεσαι· τον δεύτερο τον κατοικείς. Ο ουρανός εδώ είναι δείκτης, όχι προορισμός, σαν το δάχτυλο που δείχνει το φεγγάρι.",
            "Έτσι ολοκληρώνεται η περισυλλογή. Δεν μάζευες σκέψεις για το σώμα, την αναπνοή, την προσοχή· ερχόσουν σε επαφή μαζί τους, ένα προς ένα. Επαφή, όχι ενθύμηση. Και τώρα η ίδια επαφή ανοίγει στον χώρο που τα περιέχει όλα."
          ]
        },
        {
          "title": "Ο Ρυθμός της Ανοιχτής Προσοχής",
          "paragraphs": [
            "Η στροφή από το στενό στο ανοιχτό έχει και ένα μετρήσιμο αποτύπωμα. Το έργο του Les Fehmi για την Ανοιχτή Εστίαση (Open Focus){{davidson_2004}} παρατήρησε ότι, όταν η προσοχή απλώνεται και γίνεται περιφερειακή, μεγάλες περιοχές του εγκεφάλου μπορούν να συγχρονιστούν σε έναν πιο αργό ρυθμό: τη ζώνη άλφα, που έχει συσχετιστεί με τη χαλαρή εγρήγορση.",
            "Και ο πιο γρήγορος δρόμος προς τα εκεί δεν είναι η προσπάθεια, αλλά μια ερώτηση χωρίς αντικείμενο:",
            "<strong>Μπορείς να νιώσεις τον χώρο ανάμεσα στα δύο σου μάτια;</strong>",
            "Η προσοχή κινήθηκε, αλλά δεν βρήκε τίποτα να πιάσει. Ο χώρος δεν έχει άκρη, δεν έχει βάρος. Και χωρίς κάπου να γαντζωθεί, η λαβή λύθηκε μόνη της κι άνοιξε. Αυτό είναι όλο: όταν δίνεις στην προσοχή τον χώρο ως «αντικείμενο», γίνεται επίγνωση.",
            "Πολλές ασκήσεις αναπνοής εδώ, στον χώρο ήχου, συνοδεύονται από binaural beats στη ζώνη άλφα, ως υποστήριξη γι' αυτή τη χαλαρή, ανοιχτή προσοχή."
          ],
          "interactive": "metronomos"
        },
        {
          "title": "Σύντομες Στιγμές, Πολλές Φορές",
          "paragraphs": [
            "Η επίγνωση δεν χρειάζεται διάρκεια. Δεν χρειάζεται να «μείνεις» στο ανοιχτό πεδίο επί ώρα, ούτε επί λεπτά. Μία στιγμή αναγνώρισης είναι πλήρης, όσο σύντομη κι αν είναι· δύο δευτερόλεπτα ανοιχτού πεδίου είναι δύο δευτερόλεπτα ολόκληρα, όχι μια αποτυχημένη εκδοχή των δέκα λεπτών.",
            "Αυτό που φαίνεται να μετράει δεν είναι η διάρκεια αλλά η επανάληψη: πολλές σύντομες στιγμές, σκόρπιες μέσα στη μέρα, χτίζουν την οικειότητα με το ανοιχτό πιο σταθερά από μία μεγάλη, επίπονη συνεδρία. Πάνω σε αυτό είναι χτισμένες οι μικρο-δόσεις και οι τελευταίες εβδομάδες του προγράμματος εδώ, στην εφαρμογή.",
            "Μία προϋπόθεση, πάντα — ο χρυσός κανόνας κάθε άσκησης αυτού του οδηγού: <strong>το άνοιγμα γίνεται με ασφάλεια μόνο πάνω σε γειωμένο σώμα.</strong>",
            "<strong>Αν κάποια στιγμή νιώσεις να «φεύγεις»</strong> Αν ανοίγοντας νιώσεις αποσυνδεδεμένος/η ή σαν να απομακρύνεσαι από τον εαυτό σου, αυτό δεν είναι ο στόχος. Άνοιξε τα μάτια, νιώσε τα πέλματα στο έδαφος και το βάρος του σώματος, πες πού βρίσκεσαι τώρα. Επιστρέφεις στη γη. <strong>Πρώτα η γη, μετά ο ουρανός.</strong>"
          ]
        },
        {
          "title": "Το Ίδιο Νερό",
          "paragraphs": [
            "Τα τρία πρώτα κέντρα δεν ήταν «προθάλαμος» που ξεπερνάμε. Στενή εστίαση και ανοιχτή επίγνωση είναι συμπληρωματικές, όπως το ζουμ και ο ευρύς φακός είναι η ίδια κάμερα. Το τούνελ δεν ήταν ποτέ ο εχθρός· είναι ο φακός του ζουμ. Θα χρησιμοποιείς και τα δύο σε όλη σου τη ζωή· η ελευθερία είναι να μην κολλάς σε κανένα.",
            "Με τον καιρό η διάκριση μαλακώνει: η επιστροφή γίνεται αβίαστη, η εστίαση παύει να είναι σφίξιμο, και ενσυνειδητότητα και επίγνωση παύουν να είναι δύο πράγματα. Το κύμα δεν σταματά να είναι κύμα όταν θυμηθεί ότι είναι νερό. Απλώς παύει να παλεύει με τη θάλασσα."
          ],
          "interactive": "openawareness"
        },
        {
          "title": "Η Σταγόνα και ο Ωκεανός",
          "paragraphs": [
            "Το πιο απλό παράδειγμα είναι το νερό. Μια σταγόνα δεν είναι λιγότερο νερό από τον ωκεανό· είναι ακριβώς το ίδιο πράγμα, σε άλλη κλίμακα. Έτσι και μια στιγμή παρουσίας, εδώ, δύο δευτερολέπτων, δεν είναι μικρότερη επίγνωση. Είναι ολόκληρη. Γι' αυτό οι σύντομες στιγμές αρκούν, και γι' αυτό δεν υπάρχει «λίγη» παρουσία.",
            "Και γι' αυτό ο δρόμος περνά πάντα από το σώμα, ποτέ από τη φαντασία. Το «εδώ» της σταγόνας δεν είναι ιδέα· είναι το βάρος στα πέλματα. Αν κάποια στιγμή το άνοιγμα σε τραβήξει προς τα έξω, δεν πήγες πιο βαθιά· έχασες τη σταγόνα. Γύρνα στο βάρος, κι ο ωκεανός είναι πάλι εκεί, γιατί δεν έφυγε ποτέ."
          ]
        },
        {
          "title": "∞",
          "paragraphs": [
            "Κάθε άξονας έχει το σχήμα του: μια γραμμή για τη γη, έναν κύκλο για την αναπνοή, ένα τρίγωνο για την προσοχή. Ο τέταρτος έχει το ∞.",
            "«Άπειρο» εδώ δεν σημαίνει κάτι μακρινό. Σημαίνει <strong>χωρίς πέρας</strong>, χωρίς όριο. Και το ∞ δεν έχει αρχή ούτε τέλος, μα περνά από ένα σημείο στο κέντρο. Αυτό το κέντρο δεν βρίσκεται ψηλά· βρίσκεται στην καρδιά: ο ανοιχτός χώρος με κέντρο εδώ, γειωμένο, στο ύψος της καρδιάς."
          ],
          "actionLink": {
            "url": "/rabbithole",
            "label": "Στην Κουνελότρυπα: Το Κύμα Δεν Είναι η Θάλασσα · Είσαι ο Δρόμος · Το Κοχλάζον Κενό"
          }
        },
        {
          "title": "Τέσσερις Ασκήσεις για το Νερό",
          "paragraphs": [
            "Πάντα με γειωμένο σώμα. Πρώτα η γη, μετά ο ουρανός.",
            "1. <strong>Ο χώρος ανάμεσα στα μάτια</strong> (10 δευτερόλεπτα) — Ρώτησε: «Μπορώ να νιώσω τον χώρο ανάμεσα στα μάτια μου;» Μην ψάξεις απάντηση. Άσε τη λαβή να λυθεί.\n2. <strong>Κοίταγμα του ουρανού</strong> (30 δευτερόλεπτα) — Σήκωσε το βλέμμα στον ουρανό ή στον ορίζοντα και μαλάκωσέ το. Άσε το πεδίο να ανοίξει προς όλες τις μεριές.\n3. <strong>Στιγμιαία παύση</strong> (2–5 δευτερόλεπτα, πολλές φορές) — Για λίγα δευτερόλεπτα, άσε τα πάντα ακριβώς όπως είναι. Τίποτα να φτιάξεις, τίποτα να διορθώσεις.\n4. <strong>Σκέψεις σαν σύννεφα</strong> (1–2 λεπτά) — Άφησε τις σκέψεις να περνούν σαν σύννεφα. Έρχονται, μένουν λίγο, φεύγουν. Εσύ είσαι ο χώρος που τις χωρά."
          ],
          "actionLink": {
            "url": "/practice/microdoses",
            "label": "Μικρο-δόσεις Χώρου"
          }
        }
      ],
      "exercise": {
        "title": "Η Διεύρυνση του Χώρου",
        "steps": [
          "Γείωση: Κάθισε άνετα. Κλείσε ή χαμήλωσε τα μάτια. Νιώσε το βάρος του σώματος και τον ρυθμό της αναπνοής.",
          "Εστίαση: Σταθεροποιήσου σε ένα σημείο (εικόνα, ήχο ή αίσθηση) για λίγα δευτερόλεπτα.",
          "Η ερώτηση χωρίς αντικείμενο: «Μπορώ να νιώσω τον χώρο ανάμεσα στα μάτια μου;» Μην ψάξεις απάντηση· άφησε την ερώτηση να λύσει τη λαβή.",
          "Διεύρυνση: Όπως στην οδήγηση ανοίγεις από τον δρόμο στο γύρω και στους καθρέφτες, άφησε την προσοχή να απλωθεί προς όλες τις κατευθύνσεις. Κέντρο μένει ο άξονας της βαρύτητας.",
          "Αποδοχή: Άκου, δες, νιώσε, χωρίς να εστιάζεις, χωρίς να κρίνεις. Τα περιεχόμενα έρχονται και φεύγουν. Εσύ είσαι το πεδίο.",
          "Επιστροφή: Αν χαθείς, θα έρθει η αναλαμπή, «α, είχα χαθεί». Αυτή η αναλαμπή είναι η επίγνωση. Ξαναγύρισε στο ανοιχτό."
        ]
      },
      "insight": "Η προσοχή είναι το σημείο· η επίγνωση το πεδίο μέσα στο οποίο κινείται. Το τέταρτο βήμα μετατοπίζει το κέντρο από το σημείο στο πεδίο, από το εγωκεντρικό στο χωροκεντρικό, με το σώμα γειωμένο και παρόν. Σύντομες στιγμές, πολλές φορές.",
      "reflection": "Τι άλλαξε στην προσοχή μου όταν δεν είχε πού να γαντζωθεί;"
    },
    {
      "num": 5,
      "title": "Ο Νευροδιαφορετικός Νους",
      "sub": "Άμυνα, Τρέξιμο, Μάσκα",
      "tag": "Μοτίβα",
      "color": "var(--gold-dark)",
      "hex": "#B07B1E",
      "icon": "🧠",
      "video": "/Basic.mp4",
      "summary": "Ο νευροδιαφορετικός νους δεν είναι σπασμένος· έχει διαφορετική λειτουργία. Κατανοείς τις δύο κύριες καταστάσεις (τρέξιμο και κλείδωμα), τη ρύθμιση που βρίσκεται από κάτω τους, και το κόστος της μάσκας.",
      "tldr": "Ο νευροδιαφορετικός νους τρέχει ή κλειδώνει, και από κάτω υπάρχει μια ρύθμιση: η άμυνα. Δεν χαμηλώνει με επιχειρήματα, αλλά με σήματα ασφάλειας και με χρόνο. Η μάσκα ήταν πάντα λειτουργία, ποτέ ταυτότητα.",
      "theorySections": [
        {
          "title": "Ο Νους που Τρέχει, ο Νους που Κλειδώνει",
          "paragraphs": [
            "Ο νους ενός νευροδιαφορετικού ανθρώπου σπάνια είναι στατικός. Συνήθως κινείται ανάμεσα σε δύο ακραίες καταστάσεις: «τρέχει» ή «κλειδώνει».",
            "<strong>ΝΟΥΣ ΠΟΥ ΤΡΕΧΕΙ</strong> — Διασπασμένη Προσοχή / Υπερφόρτωση. Ο κόσμος γίνεται αλυσίδα από μικρά άγκιστρα. Πολλά ερεθίσματα φτάνουν ταυτόχρονα χωρίς φίλτρο. Εργαλείο: Σώμα (Γείωση) + Αναπνοή (Ρυθμός).",
            "<strong>ΝΟΥΣ ΠΟΥ ΚΛΕΙΔΩΝΕΙ</strong> — Αγκυλωμένη Προσοχή / υπερεστίαση (hyperfocus). Σαν τούνελ έντονης εστίασης. Μπορεί να γίνει παγίδα αν το αντικείμενο είναι αγχώδης σκέψη ή εμμονή. Εργαλείο: Σώμα (Γείωση) + Χώρος (Απελευθέρωση). Η προσοχή ελευθερώνεται μόνη της.",
            "<strong>Στρατηγική για εμμονή:</strong> Χρησιμοποίησε την Ανοιχτή Επίγνωση (Χώρος). Θυμήσου ότι οι σκέψεις σου συμβαίνουν μέσα σε έναν ευρύτερο χώρο. Μπορείς να αναγνωρίσεις τις πραγματικές τους διαστάσεις και να αποκτήσεις ελευθερία, χωρίς να σε καταπνίγουν."
          ],
          "interactive": "racing_mind"
        },
        {
          "title": "Η Άμυνα: Η Ρύθμιση από Κάτω",
          "paragraphs": [
            "Το τρέξιμο και το κλείδωμα δεν είναι δύο ανεξάρτητα καιρικά φαινόμενα. Αλλάζουν χαρακτήρα ανάλογα με μία ρύθμιση που βρίσκεται από κάτω τους: αν το σύστημα βρίσκεται σε άμυνα ή όχι.",
            "Η άμυνα δεν είναι επεισόδιο. Για πολλούς από εμάς είναι η κατάσταση ηρεμίας, το σημείο στο οποίο επιστρέφει το σύστημα όταν δεν συμβαίνει τίποτα. Υπάρχει λόγος γι' αυτό, και αξίζει σεβασμό. Χρόνια σε αισθητηριακά περιβάλλοντα που δεν μπορούσες να προβλέψεις. Χρόνια διορθώσεων για αντιδράσεις που σου φαίνονταν φυσιολογικές. Όταν δεν ξέρεις ποια από τις κινήσεις σου θα κριθεί λάθος, το σύστημα βγάζει το μόνο λογικό συμπέρασμα: ο κόσμος χρειάζεται συνεχή επιτήρηση.",
            "Έτσι, η άμυνα μένει ανοιχτή. Και επειδή μένει ανοιχτή, κοστίζει διαρκώς, ακόμη κι όταν δεν συμβαίνει τίποτα.",
            "Πώς μοιάζει από μέσα: τίποτα δεν πάει στραβά, κι όμως όλα είναι μια σκάλα πιο δυνατά. Ένα μικρό πράγμα προσγειώνεται μεγάλο. Ένα ουδέτερο πρόσωπο διαβάζεται ως ετυμηγορία. Είσαι κουρασμένος/η χωρίς να έχεις κάνει κάτι.",
            "Και εδώ είναι το κρίσιμο. <strong>Η άμυνα δεν παράγει τις σκέψεις σου· τις επιλέγει.</strong> Δεν τρέχει ο νους σου στον κίνδυνο επειδή είναι αρνητικός· τρέχει επειδή η αναζήτηση έχει πάρει την παράμετρο «βρες την απειλή». Είναι ο ίδιος νους που σχεδιάζει, προβλέπει και δημιουργεί. Άλλαξε η ρύθμιση, όχι ο νους. Γι' αυτό οι φαύλοι κύκλοι του Κεφαλαίου 3 πιάνουν ευκολότερα σε κάποιες μέρες: δεν εξασθένησες, το σύστημα ψάχνει.",
            "Αυτό αλλάζει το τι έχει νόημα να κάνεις. Δεν κερδίζεις τη διαφωνία με το περιεχόμενο, γιατί το περιεχόμενο δεν είναι η αιτία, είναι το αποτέλεσμα. Χαμηλώνει με σήματα, όχι με επιχειρήματα{{polyvagal}}: το βάρος στα πέλματα, μια μακριά εκπνοή, ο χώρος γύρω, ένα περιβάλλον που δεν σε χτυπάει. Και με χρόνο. Μια ρύθμιση που χτίστηκε σε χρόνια δεν αλλάζει σε ένα απόγευμα.",
            "Η άμυνα δεν είναι χαρακτήρας. Δεν είσαι «υπερβολικός/ή» ούτε «ευαίσθητος/η». Είσαι ένα σύστημα που έμαθε καλά ένα μάθημα, και μπορεί να μάθει, σιγά σιγά, ότι αυτή τη στιγμή δεν χρειάζεται."
          ]
        },
        {
          "title": "Ο Ρόλος του Μηχανικού Νου",
          "paragraphs": [
            "Το κλείδωμα (υπερεστίαση) συχνά τροφοδοτείται από τον <strong>Μηχανικό Νου</strong>{{mechanical_mind}}, εκείνο το μέρος του νου που συνεχώς αναλύει το παρελθόν και σχεδιάζει το μέλλον, χωρίς να έχει σταθερή βάση στο παρόν (τον συναντήσαμε στο Κεφάλαιο 1). Ο Μηχανικός Νους δεν είναι εχθρός· είναι ένα εργαλείο που έχει «υπερθερμανθεί» χωρίς τη σταθεροποιητική επίδραση της παρουσίας.",
            "Η πρακτική δεν προσπαθεί να σταματήσει τον Μηχανικό Νου, αλλά να τον συμπληρώσει με έναν <strong>Ανοιχτό Νου</strong>: έναν νου που παρατηρεί χωρίς να αναλύει, που αγκαλιάζει χωρίς να κρίνει, που βλέπει πέρα από τα σενάρια και αντιλαμβάνεται τις αιτίες."
          ]
        },
        {
          "title": "Η Μάσκα: Το Μπουκάλι",
          "paragraphs": [
            "Η άμυνα έχει και κοινωνική μορφή. Λέγεται <strong>μάσκα</strong> ή <strong>μασκάρισμα</strong> (masking): η καθημερινή παράσταση του να είσαι κάποιος άλλος, ώστε οι γύρω σου να νιώθουν άνετα.",
            "Είναι δουλειά, και μάλιστα βαριά. Ελέγχεις κάθε λέξη πριν βγει. Υπολογίζεις αν η αντίδρασή σου είναι «υπερβολική» ή «ανεπαρκής». Προσποιείσαι ότι ο θόρυβος δεν σε ενοχλεί. Χαμογελάς ενώ το νευρικό σου σύστημα ουρλιάζει. Η χρόνια μάσκα συνδέεται στην έρευνα με εξουθένωση, άγχος και κατάθλιψη. Όχι από αδυναμία, αλλά επειδή καμία λειτουργία δεν αντέχει να τρέχει συνέχεια.",
            "Το Ζεν έχει μια εικόνα γι' αυτό, 1.200 χρόνια παλιά. Ένας αξιωματούχος ρωτά τον δάσκαλο: αν βάλεις ένα χηνόπουλο σε ένα γυάλινο μπουκάλι και το ταΐσεις μέχρι να μεγαλώσει, πώς το βγάζεις χωρίς να σπάσεις το γυαλί και χωρίς να σκοτώσεις τη χήνα; Ο δάσκαλος δεν λύνει το πρόβλημα. Χτυπά τα χέρια του και φωνάζει το όνομά του. Ο άλλος γυρίζει αντανακλαστικά, και ακούει: «Δες, η χήνα είναι ήδη έξω.»",
            "Το μπουκάλι είναι η μορφή: το σώμα, ο κατασκευασμένος νους, οι ρόλοι, οι ταυτίσεις. Η χήνα είναι η επίγνωση, ο ανοιχτός χώρος του Κεφαλαίου 4. Και η απάντηση του δασκάλου λέει κάτι πολύ συγκεκριμένο: <strong>δεν έγινες ποτέ το μπουκάλι. Η μάσκα ήταν λειτουργία, ποτέ ταυτότητα.</strong>",
            "Μια σαφής διάκριση. Τίποτε εδώ δεν σου λέει να βγάλεις τη μάσκα εκεί έξω. Το πού και το πότε είναι δική σου απόφαση, και εξαρτάται από την ασφάλειά σου, τη δουλειά σου, τους ανθρώπους γύρω σου, πράγματα που ξέρεις μόνο εσύ. Αυτό που προτείνει η πρακτική είναι εσωτερικό: να πάψεις να πιστεύεις ότι είσαι το μπουκάλι, και να βρεις τους χώρους όπου μπορείς να το χαλαρώσεις με ασφάλεια.",
            "Και υπάρχει ένας οδηγός, σωματικός. Η μάσκα δεν φοριέται στο πρόσωπο μόνο· φοριέται στο σαγόνι, στους ώμους, στην αναπνοή που κρατιέται λίγο ψηλά. Αυτό το κόστος το μετράς. Είναι το ίδιο βαρόμετρο του Κεφαλαίου 8: πότε άρχισε να σφίγγει το σαγόνι, πότε ανέβηκε η αναπνοή. Δεν χρειάζεται να αποφασίσεις τίποτα για την ταυτότητά σου για να το προσέξεις.",
            "Δεν σπάμε το γυαλί. Χαλαρώνουμε το μπουκάλι: φτιάχνουμε τις συνθήκες ασφάλειας ώστε το σύστημα να μπορέσει να κατέβει από την άμυνα. Και εκεί, χωρίς να έχει προστεθεί τίποτα, φαίνεται αυτό που ήταν πάντα ελεύθερο."
          ],
          "actionLink": {
            "url": "/rabbithole/the-goose-is-out",
            "label": "Στην Κουνελότρυπα: Η Χήνα Είναι Έξω"
          }
        },
        {
          "title": "Η Καλοσύνη ως Έξοδος από τον Αυτόματο Πιλότο",
          "paragraphs": [
            "Η αυτοκριτική{{self_criticism}} δεν είναι η δική σου αλήθεια· είναι ένας απόηχος από λόγια, βλέμματα και προσδοκίες που δεν εκπληρώθηκαν. Έρευνες δείχνουν ότι η έντονη αυτοκριτική μπορεί να ενεργοποιήσει τα ίδια κυκλώματα απόκρισης σε απειλή που αντιδρούν και σε εξωτερικό κίνδυνο, με τη συμμετοχή της αμυγδαλής{{amygdala}} και ορμονών του στρες όπως η κορτιζόλη. Κάθε φορά που κρίνεις αυστηρά τον εαυτό σου, ο εγκέφαλός σου αντιδρά σαν να δέχεσαι επίθεση.",
            "Η απαλότητα αυτής της μεθόδου είναι η στάση που χρειάζεται να κρατάς απέναντι στον εαυτό σου. Η ανάπτυξη εδώ δεν σημαίνει παραγωγικότητα, αλλά την άνθιση του μοναδικού σου δυναμικού.",
            "Θυμήσου: οι σκέψεις και οι εμπειρίες σου συμβαίνουν μέσα σε έναν ευρύτερο χώρο επίγνωσης. Μέσα σε αυτόν τον ανοιχτό χώρο, μπορείς να αναγνωρίσεις τις πραγματικές τους διαστάσεις. <strong>Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται.{{kindness}}</strong>"
          ]
        }
      ],
      "exercise": {
        "title": "Τα Μοτίβα μου",
        "steps": [
          "Πότε τείνει να «τρέχει» ο νους μου;",
          "Πότε «κλειδώνει»;",
          "Ποιες καταστάσεις το προκαλούν;",
          "Πού νιώθω τη μάσκα στο σώμα: στο σαγόνι, στους ώμους, στην αναπνοή;"
        ]
      },
      "insight": "Η άμυνα δεν φτιάχνει τις σκέψεις σου, τις επιλέγει. Δεν χαμηλώνει με επιχειρήματα, αλλά με σήματα ασφάλειας και με χρόνο. Και η μάσκα ήταν πάντα λειτουργία, ποτέ ταυτότητα.",
      "reflection": "Τα δικά μου μοτίβα — πότε τείνει να «τρέχει» ο νους μου; Πότε «κλειδώνει»; Ποιες καταστάσεις το προκαλούν;"
    },
    {
      "num": 6,
      "title": "Στην Καθημερινή Ζωή",
      "sub": "Αυτορρύθμιση",
      "tag": "Ρύθμιση",
      "color": "var(--teal-dark)",
      "hex": "#1A5F6E",
      "icon": "☀",
      "summary": "Γιατί η καθημερινή πρακτική λέγεται επαφή, και πού πατάει ένας νους όταν πάψει να πατάει στις κατασκευές του. Μαζί με πρακτικά εργαλεία για θορυβώδεις χώρους, κοινωνικές στιγμές, μεταβάσεις, καταστάσεις χαμηλής ενέργειας και τους χώρους όπου ζεις.",
      "tldr": "Η καθημερινή πρακτική λέγεται επαφή: ένα λεπτό νήμα προς τα πέλματα, την ανάσα και τον χώρο, κάτω από ό,τι κάνεις. Η σκέψη συνεχίζει, αλλά παύει να είναι το πάτωμα.",
      "theorySections": [
        {
          "title": "Πού Πατάς;",
          "paragraphs": [
            "Κάθε νους χρειάζεται ένα σημείο για να πατήσει, μια βάση από την οποία αντιλαμβάνεται τον κόσμο και τον εαυτό του. Και εδώ αξίζει να ειπωθεί καθαρά: σε πολλούς νευροδιαφορετικούς ανθρώπους, αυτή η βάση έχει γίνει η ίδια η σκέψη. Τα σενάρια, οι αναλύσεις, οι εσωτερικές κατασκευές δεν είναι απλώς συνήθειες. Είναι το έδαφος όπου στέκεσαι.",
            "Υπάρχει λόγος γι' αυτό, και του αξίζει τιμή. Όταν το σώμα ζει σε συνεχή συναγερμό και ο αισθητηριακός κόσμος μοιάζει αναξιόπιστος, ο νους γίνεται το μόνο δωμάτιο που είναι ολόκληρο δικό σου, το μόνο έδαφος που μπορείς να ελέγξεις. Το να κάνεις τη σκέψη βάση σου δεν ήταν βλάβη. Ήταν η καλύτερη διαθέσιμη λύση, και για χρόνια, ίσως η μόνη.",
            "Μια βάση όμως φτιαγμένη από σκέψη έχει ένα κόστος: δεν κρατιέται μόνη της. Πρέπει να τη χτίζεις ξανά, στιγμή τη στιγμή, για να συνεχίσει να υπάρχει. Ιδού ένας λόγος που ο νους δεν σταματά ποτέ. Αν σταματήσει, το πάτωμα χάνεται. Οι φαύλοι κύκλοι του Κεφαλαίου 3, το «Αλλιώς» και το «Έπρεπε», φαίνονται τώρα από άλλη γωνία: δεν είναι απλώς κύκλοι. Είναι εργασίες θεμελίωσης σε έδαφος που δεν υπάρχει.",
            "Κάποτε αυτή η βάση στενεύει σε αυτό που ονομάζεται <strong>τούνελ πραγματικότητας</strong>{{hyperfocus}}: μια υπερεστίαση που έχει στραφεί εναντίον σου. Το τούνελ δεν είναι από μόνο του ο εχθρός· είναι η ίδια ικανότητα που σε αφήνει να βουτάς βαθιά σε ό,τι αγαπάς. Όταν όμως το αντικείμενό του είναι ένας φόβος, μια πληγή, μια εμμονή, το τούνελ γίνεται ολόκληρος ο κόσμος, και ο κόσμος γίνεται τούνελ.",
            "Και εδώ είναι το κρίσιμο: <strong>δεν μπορείς να χρησιμοποιήσεις την προσοχή για να βγεις από παγίδα φτιαγμένη από προσοχή.</strong> Η λειτουργία που κόλλησε δεν μπορεί να είναι και το σωστικό συνεργείο. Μέσα στο τούνελ, η προσοχή ήδη υπερλειτουργεί· αν της ζητήσεις να σχεδιάσει και την έξοδο, τροφοδοτείς την υπερδιέγερση. Η έξοδος περνά από τα άλλα δύο κέντρα:",
            "• <strong>Κάτω — η βαρύτητα.</strong> Η γη είναι η μόνη βάση{{gravity}} που δεν χρειάζεται ούτε κατασκευή ούτε προσοχή για να υπάρχει. Σε κρατά είτε τη σκέφτεσαι είτε όχι. Όλη η διαφορά είναι εδώ: η σκέψη είναι βάση που την κρατάς εσύ· η γη είναι βάση που σε κρατά.\n• <strong>Γύρω — η επίγνωση.</strong> Το τούνελ δεν έχει πόρτα στο βάθος, αλλά δεν έχει και τοίχους ολόγυρα. Ο χώρος δεν διακόπηκε ποτέ (Κεφάλαιο 4)· το τούνελ υπάρχει μέσα του. Μια στιγμή χωρίς αντικείμενο, ο χώρος ανάμεσα στα μάτια, το δωμάτιο γύρω από τους ήχους, και οι τοίχοι αποκαλύπτονται σύννεφα.",
            "Τίποτα εδώ δεν σου ζητά να σταματήσεις να σκέφτεσαι· είναι αδύνατο, και περιττό. Αυτό που αλλάζει είναι πού ακουμπά το βάρος. Η σκέψη συνεχίζει, αλλά παύει να είναι το πάτωμα: γίνεται καιρός πάνω από έδαφος που δεν χρειάζεται να το χτίζεις εσύ. Και ο νους, ανακουφισμένος από τη δουλειά να σε κρατά όρθιο, ελευθερώνεται να κάνει αυτό που ξέρει καλύτερα: να δημιουργεί, να προβλέπει, να παίζει."
          ]
        },
        {
          "title": "Επαφή, όχι Ενθύμηση",
          "paragraphs": [
            "Γι' αυτό η καθημερινή μορφή της πρακτικής δεν είναι «να θυμάμαι να ασκούμαι». Είναι η <strong>επαφή</strong>{{grounding}}: ένα λεπτό, ζωντανό νήμα προς τα σημεία αγκύρωσης (τα πέλματα, την ανάσα, τον χώρο ολόγυρα) που τρέχει κάτω από οτιδήποτε κάνεις. Όχι αντί για τη ζωή σου· μέσα της.",
            "Η επαφή δεν είναι κατάσταση που κατασκευάζεις, ούτε συγκέντρωση. Δεν κοστίζει τίποτα (Κεφάλαιο 4: η επίγνωση δεν κουράζεται). Μοιάζει περισσότερο με τον τρόπο που ξέρεις, χωρίς να ελέγξεις, ότι το πάτωμα βρίσκεται κάτω από τα πόδια σου.",
            "Το νήμα θα κόβεται. Δεν είναι αποτυχία, έτσι είναι σχεδιασμένο. Η στιγμή που το προσέχεις, η μικρή λάμψη «α, είχα φύγει», είναι η γέφυρα: την περνάς (πέλματα, μία εκπνοή, χώρος) και είσαι ξανά σε επαφή. Η ενθύμηση είναι μόνο η στιγμή της γέφυρας. Η επαφή είναι η χώρα όπου οδηγεί η γέφυρα, το μέρος από όπου ζεις.",
            "<strong>Δύο δευτερόλεπτα αληθινής επαφής, πολλές φορές τη μέρα.</strong> Αυτή είναι ολόκληρη η πρακτική αυτού του κεφαλαίου.",
            "Η αυτορρύθμιση είναι η ικανότητα να επαναφέρεις το νευρικό σου σύστημα από την υπερδιέγερση ή την υπολειτουργία σε κατάσταση ισορροπίας. Ξεκινά με επαφή σε τέσσερα επίπεδα:",
            "1. <strong>Επαφή με το Σώμα</strong> — Νιώθεις τη γη, το βάρος, τον άξονα.\n2. <strong>Επαφή με την Αναπνοή</strong> — Βλέπεις αν ο ρυθμός είναι γρήγορος, ρηχός ή ήρεμος.\n3. <strong>Επαφή με την Προσοχή</strong> — Βλέπεις πού έχει κολλήσει ο νους (διάσπαση ή αγκύλωση).\n4. <strong>Επαφή με τον Χώρο</strong> — Νιώθεις αν υπάρχει ανοιχτότητα και ασφάλεια."
          ]
        },
        {
          "title": "Σε θορυβώδεις χώρους (αισθητηριακή υπερφόρτωση)",
          "paragraphs": [
            "• Νιώσε τα πόδια σου στο έδαφος. Άμεση γείωση στο χάος.\n• Κάνε 3 ήσυχες αναπνοές με εκπνοή από το στόμα.\n• Άνοιξε την περιφερειακή όραση{{peripheral_vision}}. Μαλάκωσε το βλέμμα αντί να εστιάζεις.\n• Χρησιμοποίησε ακουστικά ή ένα αντικείμενο αποφόρτισης (fidget toy) αν χρειαστεί."
          ]
        },
        {
          "title": "Σε κοινωνικές στιγμές (υπερδιέγερση και κόπωση)",
          "paragraphs": [
            "• Επίλεξε ένα ουδέτερο σημείο (π.χ. ένα φυτό) ως οπτική αναφορά.\n• Νιώσε τα πόδια σταθερά. Αν νιώθεις ένταση στο σαγόνι, άφησέ την με μια εκπνοή.\n• Χρησιμοποίησε περιφερειακή όραση για να κρατήσεις την παρουσία σου."
          ]
        },
        {
          "title": "Με άγχος ή ένταση (άμεση ρύθμιση)",
          "paragraphs": [
            "• Γείωσε: νιώσε το βάρος και τον άξονα.\n• Κάνε 10 αναπνοές στον ρυθμό 4-6: εισπνοή από τη μύτη, εκπνοή από το στόμα, αργά{{slow_exhale}}.\n• Περπάτα με επίγνωση. Η ρυθμική κίνηση «καίει» το άγχος."
          ]
        },
        {
          "title": "Όταν το σύστημα σβήνει (ήπια ενεργοποίηση)",
          "paragraphs": [
            "Ως εδώ τα εργαλεία έδειχναν προς μία κατεύθυνση: προς τα κάτω, προς την ηρεμία. Η ρύθμιση όμως είναι ροοστάτης, όχι φρένο. Το «σβήσιμο», η επίπεδη, ομιχλώδης, αποσυνδεδεμένη κατάσταση, είναι κι αυτό απορρύθμιση, και χρειάζεται την αντίθετη κίνηση: ήπια ενεργοποίηση. Όταν η φωτιά έχει σβήσει, δεν τη φυσάς δυνατά. Βάζεις προσάναμμα:",
            "• Λικνίσου απαλά. Ο ρυθμός ξυπνά το σύστημα χωρίς να το τρομάζει.\n• Βούισε στην εκπνοή. Η δόνηση είναι κίνηση από μέσα.\n• Σήκωσε το βλέμμα στον ορίζοντα ή στον ουρανό. Το σώμα διαβάζει την απόσταση ως πρόσκληση.\n• Περπάτα αργά, νιώθοντας το σπρώξιμο κάθε πέλματος, και άφησε τον ρυθμό να ανέβει μόνος του.\n• Ζεστασιά, φως, ένα αγαπημένο τραγούδι. Μικρό, ζεστό, ρυθμικό: αυτή είναι η συνταγή.",
            "Στόχος δεν είναι να πιέσεις ενέργεια, αλλά να αφήσεις τον άνεμο να ξανασηκωθεί μόνος του."
          ],
          "actionLink": {
            "url": "/practice/microdoses",
            "label": "Μικρο-δόσεις για κάθε άξονα"
          }
        },
        {
          "title": "Μεταβάσεις: Η Πρακτική του Κατωφλιού",
          "paragraphs": [
            "Για πολλούς νευροδιαφορετικούς, οι δυσκολότερες στιγμές της μέρας δεν είναι οι δραστηριότητες, είναι οι ραφές ανάμεσά τους: να σταματήσεις κάτι, να ξεκινήσεις κάτι άλλο. Ζητείται από το νευρικό σύστημα να αλλάξει ταχύτητα χωρίς συμπλέκτη.",
            "Κάθε πόρτα, κυριολεκτική ή όχι, μπορεί να γίνει <strong>κατώφλι</strong>. Πριν περάσεις: νιώσε τα πέλματα, μία μακρύτερη εκπνοή, πρόσεξε τον χώρο του δωματίου όπου μπαίνεις. Τρία δευτερόλεπτα. Το σύστημα παίρνει αυτό που σπάνια παίρνει, ένα όριο σημαδεμένο, όχι μουτζουρωμένο. Το κλείσιμο του φορητού υπολογιστή, το τέλος μιας κλήσης, η εξώπορτα που κλείνει πίσω σου: όλα κατώφλια, όλα προσκλήσεις σε επαφή."
          ]
        },
        {
          "title": "Χτίζοντας το Λιμάνι",
          "paragraphs": [
            "Η αυτορρύθμιση δεν είναι μόνο ό,τι κάνεις τη στιγμή· είναι και οι συνθήκες που στήνεις πριν από αυτήν. Ένα σκάφος κρατιέται πλεύσιμο ευκολότερα σε λιμάνι παρά σε ανοιχτή θάλασσα.",
            "Το φως, ο ήχος και οι υφές μετράνε περισσότερο απ' όσο σου έμαθαν να παραδέχεσαι. Το να τα ρυθμίζεις είναι ρύθμιση, όχι ιδιοτροπία. Και μετά από κάθε κοινωνικό πέλαγος, σχεδίασε <strong>λιμάνι αποσυμπίεσης</strong>: μισή ώρα γνωστή, ήσυχη, χωρίς απαιτήσεις. Δεν είναι αποφυγή, ούτε πολυτέλεια. Είναι συντήρηση του σκάφους."
          ]
        }
      ],
      "exercise": {
        "title": "Το Κατώφλι",
        "steps": [
          "Πριν περάσεις μια πόρτα, κυριολεκτική ή όχι, νιώσε τα πέλματα.",
          "Άφησε μία μακρύτερη εκπνοή.",
          "Πρόσεξε τον χώρο του δωματίου όπου μπαίνεις.",
          "Τρία δευτερόλεπτα. Μετά περνάς."
        ]
      },
      "insight": "Η επαφή είναι η βάση. Η γη σε κρατά χωρίς προσπάθειά σου, ο ουρανός ανοίγει χωρίς κατασκευή σου. Μπορείς να πατήσεις στο αληθινό, και να αφήσεις τη σκέψη να είναι καιρός, όχι πάτωμα.",
      "reflection": "Ποια είναι τα δικά μου κατώφλια μέσα στη μέρα; Πού θα μπορούσα να προσθέσω τρία δευτερόλεπτα;"
    },
    {
      "num": 7,
      "title": "Ο Νέος Οδηγός",
      "sub": "Αποφυγή και Αναβολή",
      "tag": "Εκκίνηση",
      "color": "var(--teal-med)",
      "hex": "#2E8B9A",
      "icon": "🧭",
      "summary": "Όταν η απόσταση ανάμεσα στην απόφαση και στην πράξη γίνεται άβυσσος: πώς κινείσαι με το σώμα, χωρίς να περιμένεις να το θες.",
      "tldr": "Δεν περιμένεις το «θέλω». Νιώθεις τη βαρύτητα, αφήνεις μια ήσυχη εκπνοή, βλέπεις τον χώρο και κάνεις ένα βήμα. Κρατάς την πράξη, αφήνεις την έκβαση.",
      "theorySections": [
        {
          "title": "Αν Έχεις Κολλήσει Τώρα",
          "paragraphs": [
            "Ξεκίνα από εδώ· η εξήγηση μπορεί να περιμένει. Η Κάρτα της Τσέπης του Κεφαλαίου 8 είναι για μέσα στο κύμα. Αυτή είναι για όταν δεν μπορείς να ξεκινήσεις:\n<strong>ΒΑΡΥΤΗΤΑ — ΑΝΑΠΝΟΗ — ΧΩΡΟΣ — ΕΝΑ ΒΗΜΑ</strong>",
            "1. Βαρύτητα: νιώσε το βάρος σου, τον άξονα, το έδαφος{{gravity}}. Άφησε την ένταση. Μείνε στο τώρα, χωρίς να του προσθέτεις ή να του αφαιρείς τίποτα — αυτό είναι το σημείο μηδέν.\n2. Αναπνοή: μία ήσυχη ανάσα, με αργή εκπνοή{{slow_exhale}}.\n3. Χώρος: δες τον χώρο μέσα στον οποίο θα κινηθείς.\n4. Ένα βήμα: η κίνηση ξεκινά απαλά από την κοιλιά και τη λεκάνη, και τα άκρα ακολουθούν. Μία κίνηση τη φορά· αυτό που θες να κάνεις μένει στην άκρη του μυαλού.",
            "Αν νιώσεις να φεύγεις ή να μουδιάζεις, σταμάτα και γύρνα στο βάρος σου και στο έδαφος. Κι αυτό είναι μέρος της άσκησης, όχι αποτυχία."
          ]
        },
        {
          "title": "Αν Δεν Νιώθεις το Σώμα",
          "paragraphs": [
            "Με δυσκολία στην αίσθηση του σώματος, με αποσύνδεση, πόνο ή κόπωση, το «νιώσε το βάρος» μπορεί να μη βρει πού να πατήσει. Δεν σου λείπει κάτι· άλλαξε πόρτα:\n• Το ύφασμα στο δέρμα, ο αέρας στα χέρια.\n• Ο πιο μακρινός ήχος και ο πιο κοντινός.\n• Το βλέμμα από το μακρινό σημείο του δωματίου στο κοντινό.",
            "Αρκεί ένα σημείο επαφής. Κι αν ούτε αυτό έρχεται, το ίδιο το «δεν νιώθω τίποτα» είναι παρατήρηση, και φτάνει για να σταθείς."
          ]
        },
        {
          "title": "Ο Παλιός Οδηγός",
          "paragraphs": [
            "Κάθε πράξη χρειάζεται κάποιον να πει «τώρα». Για πολλούς από εμάς αυτός ο οδηγός ήταν η <strong>πίεση και η αγωνία</strong>. Αν είναι ο μόνος που γνωρίζεις, ξεκινάς μόνο όταν εμφανιστεί, και εμφανίζεται την τελευταία στιγμή, με την προθεσμία πάνω στο κεφάλι. Η αναβολή δεν είναι τεμπελιά: είναι αναμονή του μόνου οδηγού που ξέρεις.",
            "Και δεν φέρνει μόνο πίεση. Φέρνει το παρελθόν: παλιές απορρίψεις, παλιούς φόβους, την πίεση να λειτουργήσεις «φυσιολογικά». Δούλευε όμως, γι' αυτό δεν τον διώχνεις με μια απόφαση· τον αντικαθιστάς σιγά σιγά."
          ]
        },
        {
          "title": "Το Βουνό",
          "paragraphs": [
            "Η ίδια η πράξη σπάνια είναι δύσκολη: να σηκωθείς, να ανοίξεις τη βρύση, να πάρεις ένα τηλέφωνο. Δύσκολο γίνεται το βάρος που της προσθέτει ο μηχανικός νους{{mechanical_mind}}: «θα πάρει ώρα», «κι αν δεν βγει όπως πρέπει». Κάθε τέτοια σκέψη προσπαθεί να ελέγξει την έκβαση πριν από την πράξη, ώσπου το πράγμα γίνεται βουνό. Η αναβολή ανακουφίζει για λίγο, και γι' αυτό επαναλαμβάνεται.",
            "Δεν παλεύεις την άρνηση· απλώς δεν της δίνεις υλικό, κρατώντας την προσοχή σε αυτό που κάνεις τώρα."
          ]
        },
        {
          "title": "Επιθυμία, Πρόθεση, Θέληση",
          "paragraphs": [
            "• <strong>Επιθυμία</strong>: στραμμένη στο αποτέλεσμα, ζει στη διάθεση, και εκείνη τη στιγμή μπορεί να λείπει. Τη νιώθεις ψηλά, στο στήθος και στο κεφάλι.\n• <strong>Πρόθεση</strong>: η κατεύθυνση που διάλεξες. Μένει στην άκρη του μυαλού και σε προσανατολίζει, χωρίς να σε παραλύει.\n• <strong>Θέληση της πράξης</strong>: όχι ζόρι. Η δύναμη είναι του σώματος, η ζωτική του ενέργεια, και την κατευθύνεις απαλά με την πρόθεση. Τη νιώθεις χαμηλά, στην κοιλιά.",
            "Τη διάθεση και τις σκέψεις μπορεί να μην τις ελέγχεις. Το σώμα, τις περισσότερες φορές, το κινείς· κι όταν ούτε αυτό κινείται, μένει σημείο επαφής. Κρατάς την πράξη και αφήνεις την έκβαση — την έκβαση, όχι την πράξη."
          ]
        },
        {
          "title": "Ο Νέος Οδηγός",
          "paragraphs": [
            "Ο νέος οδηγός είναι η <strong>ενσυνειδητότητα</strong>. Δεν σε σπρώχνει και δεν σε τρομάζει· είναι διαθέσιμη τώρα, χωρίς να σε κάψει. Ζει στο σημείο μηδέν, γι' αυτό η πράξη δεν κουβαλά την ετυμηγορία των προηγούμενων φορών: τη συναντάς καινούργια.",
            "Η παρουσία μοιράζεται σε σώμα, αναπνοή, σκέψεις και χώρο, και κανένα δεν παίρνει το τιμόνι. Ο νέος οδηγός σού φέρεται όπως θα στεκόσουν δίπλα σε ένα παιδί νευροδιαφορετικό που μαθαίνει: χωρίς πίεση, χωρίς κατάκριση, χωρίς βιασύνη{{kindness}}."
          ]
        },
        {
          "title": "Παιχνίδι και Εξάσκηση",
          "paragraphs": [
            "Η αποφυγή τρέφεται από το διακύβευμα: κάθε πράξη μοιάζει με εξέταση. Το παιχνίδι το αφαιρεί· δεν δοκιμάζεσαι, δοκιμάζεις. Η εξάσκηση προσθέτει το άλλο μισό: καμία προσπάθεια δεν είναι ετυμηγορία. Χωρίς βιασύνη σημαίνει χωρίς ψυχική αγωνία, όχι αργά.",
            "Τα φρένα μένουν. Η αποφυγή ενός χώρου που σε κατακλύζει αισθητηριακά, ή κάποιου πράγματος που ξυπνά τραύμα{{trauma}}, είναι προστασία. Όταν αυτό που αναβάλλεις αγγίζει κάτι βαρύ, πας λίγο λίγο, όσο αντέχεις άνετα."
          ]
        },
        {
          "title": "Πότε Δεν Είναι Αποφυγή",
          "paragraphs": [
            "Για πολλούς νευροδιαφορετικούς η δυσκολία της εκκίνησης έχει και νευρολογική βάση:\n• <strong>Αποφυγή</strong>: το σκέφτεσαι και νιώθεις βάρος, φόβο, ντροπή.\n• <strong>Εκτελεστική δυσλειτουργία</strong>: το θέλεις, δεν νιώθεις αντίσταση, και απλώς δεν κινείσαι. Η απαλότητα βοηθά, αλλά χρειάζεται και κάτι από έξω.\n• Συχνά και τα δύο: δουλεύεις τις δύο στρώσεις μαζί.",
            "Εξωτερικά στηρίγματα, το Λιμάνι του Κεφαλαίου 6 εφαρμοσμένο στην εκκίνηση: χρονόμετρο πέντε λεπτών, λίστα με τρία μόνο βήματα, κάποιος δίπλα σου που κάνει κι αυτός τη δουλειά του (body doubling), υπενθύμιση στο τηλέφωνο, ησυχότερο περιβάλλον.",
            "Αν η αναβολή σού κοστίζει δουλειά, σχέσεις ή υγεία, ή συνυπάρχει με κατάθλιψη, ενεργό τραύμα ή ουσίες, μίλησε με έναν θεραπευτή ή κάποιον εξειδικευμένο στη νευροδιαφορετικότητα. Δεν είναι αποτυχία της πρακτικής."
          ]
        },
        {
          "title": "Γιατί Αλλάζει με τον Καιρό",
          "paragraphs": [
            "Όταν κάθε ξεκίνημα συνοδεύεται από πίεση και αυτοκριτική{{self_criticism}}, η πράξη συνδέεται με απειλή και ο νους μαθαίνει να την αποφεύγει. Όταν κάνεις τα πράγματα σωματικά, με την προσοχή στη στιγμή και όχι στο αποτέλεσμα, αυτή η σύνδεση χαλαρώνει σιγά σιγά.",
            "Η μέθοδος δεν αλλάζει το πώς είναι φτιαγμένος ο εγκέφαλός σου και δεν θεραπεύει την αποφυγή· την αγκαλιάζει και τη στηρίζει."
          ]
        }
      ],
      "exercise": {
        "title": "Μεγάλος Στόχος: Πληροφορίες, όχι Σενάρια",
        "steps": [
          "Μία φορά, κατέγραψε τι περιλαμβάνει: τι χρειάζεται, με ποια σειρά, ποιον ρωτάς.",
          "Πληροφορίες, όχι σενάρια: όχι «πώς θα νιώσω», αλλά «τι υπάρχει».",
          "Βάλε τον χάρτη στην άκρη του μυαλού.",
          "Κάνε μόνο το επόμενο βήμα. Για ένα δίπλωμα: πρώτα πας στον δάσκαλο."
        ]
      },
      "insight": "Κρατάς την πράξη, αφήνεις την έκβαση, και κινείσαι ένα βήμα τη φορά, χωρίς βιασύνη.",
      "reflection": "Τι αναβάλλω; Δύσκολη είναι η ίδια η πράξη ή το βουνό γύρω της;"
    },
    {
      "num": 8,
      "title": "Όταν το Κύμα Ανεβαίνει",
      "sub": "Άγχος, Υπερφόρτωση",
      "tag": "Στήριξη",
      "color": "var(--terra)",
      "hex": "#C07050",
      "icon": "🌊",
      "summary": "Δύο πρακτικά πρωτόκολλα, για έντονο άγχος και για υπερφόρτωση, μαζί με ό,τι έρχεται πριν από το κύμα, και ό,τι έρχεται μετά.",
      "tldr": "Πιάσε τον άνεμο νωρίς: στα πρώτα σήματα, μία μακριά εκπνοή ίσως αρκεί. Μέσα στο κύμα, τέσσερις λέξεις: γείωση, μακριά εκπνοή, ταμπέλα, άνοιγμα. Μετά, καλοσύνη.",
      "theorySections": [
        {
          "title": "Το Βαρόμετρο: Πριν από την Καταιγίδα",
          "paragraphs": [
            "Κάθε κύμα προαναγγέλλεται· απλώς η αναγγελία είναι σιωπηλή. Ένα σαγόνι που σφίγγει. Ανάσα που ανεβαίνει ψηλά στο στήθος. Ενόχληση από ήχους που πριν από μία ώρα ανεχόσουν. Η ίδια πρόταση διαβασμένη τρεις φορές. Αυτές είναι οι ενδείξεις του <strong>βαρόμετρού</strong>{{interoception}} σου.",
            "Όσο νωρίτερα πιάσεις τον άνεμο, τόσο λιγότερη δύναμη χρειάζεται: στα πρώτα σήματα, μία μακριά εκπνοή ίσως αρκεί· στην κορυφή, χρειάζεται ολόκληρο το πρωτόκολλο. Μάθε τα δικά σου τρία πρώτα σημάδια. Ο αναστοχασμός στο τέλος του κεφαλαίου τα ζητά. Πάρε αυτή την ερώτηση ως έρευνα πεδίου για την εβδομάδα."
          ]
        },
        {
          "title": "Πρωτόκολλο 1: Άμεση Αντιμετώπιση Έντονου Άγχους",
          "paragraphs": [
            "Το έντονο άγχος είναι μια κατάσταση «πάλης ή φυγής» που απαιτεί άμεση σηματοδότηση ασφάλειας στο νευρικό σύστημα μέσω σώματος και αναπνοής.",
            "1. <strong>Γείωση (Σώμα)</strong> — Νιώσε το βάρος του σώματος, τη στάση του, τις εντάσεις, χωρίς λεκτική ανάλυση. Απλώς παρατήρησε πού κρατάς την ένταση.\n2. <strong>Ρύθμιση (Αναπνοή)</strong> — Κλείσε τα μάτια και πέρασε στον ρυθμό 4-6. Άφησε την εκπνοή να βγει αργά από το στόμα{{slow_exhale}}, σαν να φυσάς απαλά μια φλόγα. Μην πιέζεις την εισπνοή· δούλεψε μόνο με την εκπνοή.\n3. <strong>Ετικετοποίηση (Προσοχή)</strong> — Αν ο νους κολλήσει σε σενάριο, χρησιμοποίησε ταμπέλα{{labeling}} («Ανησυχία», «Σενάριο») και επέστρεψε στην αναπνοή.\n4. <strong>Άνοιγμα (Χώρος)</strong> — Άνοιξε την περιφερειακή όραση και παρατήρησε τον χώρο γύρω. Η διεύρυνση μειώνει την αίσθηση παγίδευσης.\n5. <strong>Κίνηση & Άξονας</strong> — Αν μπορείς, περπάτα λίγο νιώθοντας τα πέλματα. Διατήρησε την αίσθηση του κατακόρυφου άξονα. Ανοιχτό βλέμμα και επίγνωση χώρου."
          ]
        },
        {
          "title": "Πρωτόκολλο 2: Διαχείριση Υπερφόρτωσης",
          "paragraphs": [
            "Όταν όλα πέφτουν πάνω σου, ο στόχος είναι να βρεις χώρο για να χωρέσεις τα ερεθίσματα χωρίς να αντιδράσεις. Αντί να εστιάζεις στη μείωση του άγχους, εστιάζεις στη διεύρυνση της επίγνωσης.",
            "1. <strong>Γείωση (Στ. 1)</strong> — Νιώσε τα πέλματα, το βάρος σου. Μηδένισε τη θέση σου, σαν να πατάς το κουμπί επαναφοράς του σώματός σου.\n2. <strong>Αναπνοή (Στ. 2)</strong> — Μείνε στη ροή της. Η εκπνοή από στόμα είναι προαιρετική, αλλά συνιστάται αν νιώθεις σφίξιμο.\n3. <strong>Προσοχή (Στ. 3)</strong> — Κράτησε την προσοχή μπροστά. Αντί να παρασυρθείς από κάθε λεπτομέρεια, επίλεξε ένα σταθερό σημείο ως άγκυρά σου.\n4. <strong>Άνοιγμα (Χώρος — Στ. 4)</strong> — Μαλάκωσε το βλέμμα (περιφερειακή όραση){{peripheral_vision}}. Θυμήσου τον ουρανό: όλα τα ερεθίσματα, ήχοι, φώτα, σκέψεις, είναι σύννεφα που περνούν στον ανοιχτό χώρο της επίγνωσής σου.",
            "<strong>Κράτησε την απόσταση:</strong> θυμήσου, δεν είσαι τα σύννεφα. Είσαι ο χώρος που τα χωράει. Η απλή αναγνώριση αυτού μειώνει άμεσα την αίσθηση κινδύνου.",
            "<strong>Αν κάποια στιγμή νιώσεις να «φεύγεις»</strong> Αν μέσα στο κύμα νιώσεις αποσυνδεδεμένος/η ή σαν να απομακρύνεσαι από τον εαυτό σου, σταμάτα το άνοιγμα. Άνοιξε τα μάτια, νιώσε τα πέλματα στο έδαφος και το βάρος του σώματος, πες δυνατά πού βρίσκεσαι τώρα. <strong>Πρώτα η γη, μετά ο ουρανός.</strong>"
          ]
        },
        {
          "title": "Τι να Μην Κάνεις",
          "paragraphs": [
            "Άλλη μία ειλικρινής κουβέντα, γιατί μέσα στο κύμα όλα τα παρακάτω μοιάζουν λογικά:",
            "• <strong>Μην προσπαθήσεις να σκεφτείς την έξοδο.</strong> Η έξοδος δεν περνά από το περιεχόμενο (Κεφάλαιο 6: η λειτουργία που κόλλησε δεν μπορεί να είναι και το σωστικό συνεργείο).\n• <strong>Μην αναλύεις εν μέσω κύματος.</strong> Το «γιατί είμαι έτσι;» είναι φυσερό, όχι διερεύνηση. Η ανάλυση μπορεί να γίνει αργότερα, αν χρειάζεται ακόμα, που είναι σπανιότερο απ' όσο φαίνεται.\n• <strong>Μην πιέζεις βαθιές εισπνοές.</strong> Οι βίαιες βαθιές ανάσες μπορεί να ενισχύσουν τον συναγερμό. Το εργαλείο είναι η μακριά εκπνοή, απαλά.\n• <strong>Μην καταπιέζεις τις αυτορρυθμιστικές σου κινήσεις (stims).</strong>{{movement_vs_breathwork}} Το λίκνισμα, ο βηματισμός, η κίνηση των χεριών: είναι η αυτορρύθμιση του ίδιου του σώματος, ήδη σε λειτουργία. Άφησέ την.\n• <strong>Μην απαιτείς ηρεμία ως απόδειξη επιτυχίας.</strong> Επιτυχία είναι το σκάφος να μένει πλεύσιμο (Κεφάλαιο 2)."
          ]
        },
        {
          "title": "Μετά το Κύμα",
          "paragraphs": [
            "Κανένα πρωτόκολλο δεν λέει τι γίνεται μετά, και το μετά μετράει. Όταν το κύμα περάσει, ο νους συχνά γυρίζει να δαγκώσει: «γιατί το άφησα να ξανασυμβεί;». Αναγνώρισέ το: είναι το «Έπρεπε» με σωσίβιο, το φυσερό που ξαναφουσκώνει τον άνεμο που μόλις έπεσε.",
            "Μετά το κύμα: νερό, φαγητό, ξεκούραση. Ένα κύμα είναι σωματική καταπόνηση· αντιμετώπισέ το ως τέτοια. Καμία ανάλυση για λίγες ώρες· άφησε το νερό να ησυχάσει πριν κοιτάξεις τον βυθό. Αν το κύμα πιτσίλισε κάποιον, μία σύντομη φράση επανόρθωσης αργότερα («ήταν η υπερφόρτωσή μου που μιλούσε, όχι εσύ») αξίζει περισσότερο από έναν τέλειο απολογητικό λόγο. Και καλοσύνη{{kindness}}: δεν απέτυχες σε εξέταση. Πέρασε καιρός, κι εσύ κράτησες το σκάφος."
          ]
        },
        {
          "title": "Η Κάρτα της Τσέπης",
          "paragraphs": [
            "Μέσα στο κύμα, κανείς δεν διαβάζει παραγράφους. Τέσσερις λέξεις, με τη σειρά:",
            "<strong>ΓΕΙΩΣΗ — ΜΑΚΡΙΑ ΕΚΠΝΟΗ — ΤΑΜΠΕΛΑ — ΑΝΟΙΓΜΑ</strong>  (Πέλματα. Από το στόμα, αργά. Ονόμασε το σενάριο. Περιφερειακή όραση.)",
            "Αν κρατήσεις ένα μόνο πράγμα από αυτό το κεφάλαιο, κράτησε αυτές τις τέσσερις λέξεις. Είναι η εκδοχή για μέσα στο κύμα. Για μέσα στη μέρα υπάρχει το Φύλλο Εργασίας (Κεφ. 9)· για ήσυχη στιγμή, τα Τέσσερα Στάδια (Κεφ. 10)."
          ],
          "actionLink": {
            "url": "/rabbithole/lute-string",
            "label": "Στην Κουνελότρυπα: Η Χορδή του Λαούτου"
          }
        }
      ],
      "exercise": {
        "title": "Η Κάρτα της Τσέπης",
        "steps": [
          "Γείωση: τα πέλματα.",
          "Μακριά εκπνοή: από το στόμα, αργά.",
          "Ταμπέλα: ονόμασε το σενάριο.",
          "Άνοιγμα: περιφερειακή όραση."
        ]
      },
      "insight": "Πιάσε τον άνεμο νωρίς, κράτα το σκάφος πλεύσιμο, και φέρσου με καλοσύνη μετά. Το κύμα είναι καιρός, όχι ετυμηγορία.",
      "reflection": "Ποια είναι τα πρώτα σήματα του σώματός μου όταν αρχίζει η υπερφόρτωση;"
    },
    {
      "num": 9,
      "title": "Φύλλο Εργασίας της Παρουσίας",
      "sub": "Η Πρακτική της Παρουσίας",
      "tag": "Εφαρμογή",
      "color": "var(--teal-dark)",
      "hex": "#1A5F6E",
      "icon": "📋",
      "summary": "Ένα φύλλο μιας σελίδας που μπορείς να συμπληρώνεις. Είναι η σύντομη εκδοχή της πρακτικής, για μέσα στη μέρα. Η πλήρης, καθιστή εκδοχή είναι το Κεφάλαιο 10· η εκδοχή για μέσα στο κύμα είναι η Κάρτα της Τσέπης (Κεφ. 8).",
      "tldr": "Η σύντομη εκδοχή της πρακτικής, για μέσα στη μέρα: τέσσερα κέντρα, τέσσερις ερωτήσεις. Δεν χρειάζεται να τα κάνεις όλα· ένα, καλά, αρκεί.",
      "theorySections": [
        {
          "title": "Πώς να το Χρησιμοποιήσεις",
          "paragraphs": [
            "<strong>Στόχος:</strong> να επιστρέφεις στο «τώρα» σε λίγα δευτερόλεπτα. Κάν' τα με σειρά ή διάλεξε αυτό που χρειάζεσαι."
          ]
        },
        {
          "title": "1. Σώμα / Βάση",
          "paragraphs": [
            "• <strong>Παρατήρηση:</strong> Στέκομαι ή κάθομαι. Νιώθω το βάρος μου. Παρατηρώ εντάσεις (π.χ. σαγόνι).\n• <strong>Εργαλείο:</strong> Νιώθω τον άξονα: από τα πέλματα, μέσα από τη σπονδυλική, ως την κορυφή του κεφαλιού. Χαλαρώνω σαγόνι και ώμους{{grounding}}.",
            "<strong>Τι ένιωσα στο σώμα μου τώρα;</strong>"
          ]
        },
        {
          "title": "2. Αναπνοή / Ρυθμός",
          "paragraphs": [
            "• <strong>Παρατήρηση:</strong> Πώς είναι η αναπνοή μου; Γρήγορη, ρηχή, σφιγμένη;\n• <strong>Εργαλείο:</strong> Εκπνοή από στόμα, λίγο πιο αργή{{slow_exhale}} (ρυθμός 4-6). Νιώθω την κοιλιά να μαζεύεται ήπια.",
            "<strong>Πώς άλλαξε η αναπνοή μου;</strong>"
          ]
        },
        {
          "title": "3. Προσοχή / Σταθεροποίηση",
          "paragraphs": [
            "• <strong>Παρατήρηση:</strong> Πού είναι η προσοχή μου; Τρέχει; Κολλάει κάπου;\n• <strong>Εργαλείο:</strong> Επιστρέφω σε σταθερό σημείο. Ετικετοποιώ τη σκέψη{{labeling}} και επιστρέφω.",
            "<strong>Πού ήταν η προσοχή μου;</strong>"
          ]
        },
        {
          "title": "4. Χώρος / Επέκταση",
          "paragraphs": [
            "• <strong>Παρατήρηση:</strong> Νιώθω παγιδευμένος/η; Η προσοχή είναι σαν τούνελ;\n• <strong>Εργαλείο:</strong> Μαλακώνω το βλέμμα{{peripheral_vision}}. Αφήνω την προσοχή να απλωθεί. Σκέψεις = σύννεφα.",
            "<strong>Τι άλλαξε όταν άνοιξε ο χώρος;</strong>"
          ]
        }
      ],
      "exercise": {
        "title": "Τα Τέσσερα Βήματα Παρουσίας",
        "steps": [
          "Σώμα: Νιώσε το βάρος σου. Χαλάρωσε σαγόνι και ώμους.",
          "Αναπνοή: Εκπνοή από το στόμα, λίγο πιο αργή (ρυθμός 4-6).",
          "Προσοχή: Επίστρεψε σε ένα σταθερό σημείο. Αν σε τραβήξει μια σκέψη, δώσ' της μια ταμπέλα.",
          "Χώρος: Μαλάκωσε το βλέμμα. Άφησε την προσοχή να απλωθεί."
        ]
      },
      "insight": "Τέσσερα κέντρα, τέσσερις ερωτήσεις. Δεν χρειάζεται να τα κάνεις όλα. Ένα, καλά, αρκεί.",
      "reflection": "Ποιο από τα τέσσερα κέντρα με βοήθησε σήμερα;"
    },
    {
      "num": 10,
      "title": "Τα Τέσσερα Στάδια",
      "sub": "Οδηγός Βήμα-Βήμα",
      "tag": "Βήματα",
      "color": "var(--gold)",
      "hex": "#C8922A",
      "icon": "👣",
      "summary": "Η πλήρης, διαδοχική άσκηση του Τετραπλού Άξονα, για ήσυχη στιγμή. Εκτελείται καλύτερα σε ήσυχη θέση, αλλά τα βήματα μπορούν να εφαρμοστούν οποιαδήποτε στιγμή. Η σύντομη εκδοχή για μέσα στη μέρα είναι το Φύλλο Εργασίας (Κεφ. 9)· η εκδοχή για μέσα στο κύμα είναι η Κάρτα της Τσέπης (Κεφ. 8).",
      "tldr": "Η πλήρης, καθιστή άσκηση του Τετραπλού Άξονα: γη, ρυθμός, σημείο, πεδίο. Και από κάτω, σε όλα, η απαλότητα.",
      "theorySections": [
        {
          "title": "Η Στάση Πίσω από τα Βήματα",
          "paragraphs": [
            "Πριν ξεκινήσεις τα στάδια, θυμήσου: η απαλότητα δεν είναι προαιρετική, είναι η ίδια η μέθοδος. Κάθε φορά που επιστρέφεις χωρίς κριτική{{gentle_return}}, κάθε φορά που δέχεσαι τη διάσπαση ως μέρος της διαδικασίας, εξασκείς καλοσύνη{{kindness}}. Όχι ως ιδέα, ως πράξη.",
            "Είδαμε στο Κεφάλαιο 5 γιατί: η έντονη αυτοκριτική φαίνεται να ενεργοποιεί τα ίδια κυκλώματα απειλής με τον εξωτερικό κίνδυνο. Η απαλή επιστροφή τα καταπραΰνει. Αυτός είναι ο δρόμος: όχι πολεμώντας τον αυτόματο πιλότο, αλλά δίνοντάς του χώρο να ηρεμήσει."
          ],
          "interactive": "journey",
          "actionLink": {
            "url": "/program",
            "label": "Το δομημένο πρόγραμμα βήμα-βήμα"
          }
        },
        {
          "title": "Στάδιο 1 — Νιώσε τη Γη (Γείωση)",
          "paragraphs": [
            "• Κάθισε ή στάσου άνετα. Πλάτη όρθια αλλά όχι σφιγμένη.\n• Νιώσε τα σημεία επαφής: πέλματα, πλάτη στο κάθισμα.\n• Άφησε το βάρος να βυθιστεί στη γη.\n• Με κάθε εκπνοή, χαλάρωσε λαιμό, σαγόνι, ώμους.\n• <strong>Στόχος:</strong> να νιώσεις τον κατακόρυφο άξονα, τη βάση σου."
          ]
        },
        {
          "title": "Στάδιο 2 — Νιώσε την Αναπνοή (Ρύθμιση)",
          "paragraphs": [
            "• Κλείσε ή μισόκλεισε τα μάτια.\n• Νιώσε τη διαδρομή: εισπνοή από τη μύτη → πνεύμονες → κοιλιά, εκπνοή αντίστροφα.\n• Σε ένταση: πέρασε στον ρυθμό 4-6, με την εκπνοή αργά από το στόμα, σαν να φυσάς ένα κερί.\n• <strong>Στόχος:</strong> φυσικός αδιάκοπος ρυθμός, ηρεμία του νευρικού συστήματος."
          ]
        },
        {
          "title": "Στάδιο 3 — Εστίασε Μπροστά (Συγκέντρωση)",
          "paragraphs": [
            "• Άνοιξε τα μάτια. Διάλεξε ήσυχο σημείο μπροστά σου.\n• Κοίταξέ το με απαλό, σταθερό βλέμμα.\n• Αν έρθουν σκέψεις: αναγνώρισε → ταμπέλα → επέστρεψε απαλά.\n• <strong>Στόχος:</strong> εκπαίδευση της προσοχής να σταθεροποιείται."
          ]
        },
        {
          "title": "Στάδιο 4 — Άνοιξε στον Χώρο (Ανοιχτή Επίγνωση)",
          "paragraphs": [
            "• Μαλάκωσε το βλέμμα. Άνοιξε την περιφερειακή όραση{{peripheral_vision}}.\n• Δες όλο το οπτικό πεδίο: δεξιά, αριστερά, πάνω, κάτω.\n• Νιώσε ταυτόχρονα: σώμα, αναπνοή, γη, ουρανό.\n• <strong>Στόχος:</strong> άμεση αίσθηση παρουσίας χωρίς λέξεις ή προσπάθεια."
          ],
          "actionLink": {
            "url": "/rabbithole",
            "label": "Στην Κουνελότρυπα: Ντζόγκτσεν · Η Φύση του Νου & Η Λύση της Έντασης"
          }
        }
      ],
      "exercise": {
        "title": "Ολοκληρωμένη Άσκηση",
        "steps": [
          "Στάδιο 1 — Γη: Κάθισε άνετα. Νιώσε τα σημεία επαφής και άφησε το βάρος να βυθιστεί.",
          "Στάδιο 2 — Αναπνοή: Κλείσε ή μισόκλεισε τα μάτια. Νιώσε τη διαδρομή του αέρα. Σε ένταση, ρυθμός 4-6.",
          "Στάδιο 3 — Εστίαση: Άνοιξε τα μάτια σε ένα ήσυχο σημείο μπροστά σου. Αν έρθουν σκέψεις: αναγνώρισε, ταμπέλα, επέστρεψε απαλά.",
          "Στάδιο 4 — Χώρος: Μαλάκωσε το βλέμμα. Νιώσε ταυτόχρονα σώμα, αναπνοή και τον χώρο γύρω σου."
        ]
      },
      "insight": "Τέσσερα στάδια, με σειρά: γη, ρυθμός, σημείο, πεδίο. Και από κάτω, σε όλα, η απαλότητα.",
      "reflection": "Ποιο στάδιο μου φαίνεται πιο φυσικό; Πού δυσκολεύομαι περισσότερο;"
    },
    {
      "num": 11,
      "title": "Το Υπόβαθρο",
      "sub": "Επιστήμη και Σοφία",
      "tag": "Βάθος",
      "color": "var(--lav)",
      "hex": "#B5A7D0",
      "icon": "🔭",
      "summary": "Το «πώς» (νευροεπιστήμη) και το «γιατί» (στοχαστική παράδοση) πίσω από το «τι» των ασκήσεων. Προαιρετικό για την πρακτική, χρήσιμο για την εμπιστοσύνη.",
      "tldr": "Το «πώς» από τη νευροεπιστήμη και το «γιατί» από τη στοχαστική παράδοση. Η μέθοδος δεν ζητά να πιστέψεις τίποτα· ζητά να δοκιμάσεις και να παρατηρήσεις.",
      "theorySections": [
        {
          "title": "Η Φιλοσοφία της Έρευνας",
          "paragraphs": [
            "Αυτός ο οδηγός δεν είναι απλώς ένα βιβλίο ασκήσεων. Για τον νευροδιαφορετικό νου, που δεν αρκείται στο «κάνε το γιατί το λέω εγώ», προσπαθεί να δείξει και το πώς, και το τι, και το γιατί. Δεν ζητά εμπιστοσύνη· την οικοδομεί μέσα από την κατανόηση.",
            "<strong>Η φιλοσοφία της έρευνας.</strong> Οι κλασικές τεχνικές ενσυνειδητότητας μπορεί να φέρουν άγχος ή «πάγωμα» σε νευροδιαφορετικά άτομα, επειδή συχνά ζητούν άμεση ακινησία και παθητική παρατήρηση. Αυτή η μέθοδος ξεκινά από την άλλη άκρη: από το σώμα προς τα πάνω{{movement_vs_breathwork}} (σωματική, «από κάτω προς τα πάνω» προσέγγιση — somatic, bottom-up). Πρώτα ρυθμίζεται το νευρικό σύστημα, μετά έρχεται η παρατήρηση. Την ίδια σειρά περιγράφει και η έρευνα για τις διαλογιστικές παραδόσεις: πρώτα καλλιεργείται η σταθερή, εστιασμένη προσοχή, και η ανοιχτή παρατήρηση έρχεται μετά.\nΠηγή: Lutz et al. (2008). Trends in Cognitive Sciences. DOI: 10.1016/j.tics.2008.01.005"
          ]
        },
        {
          "title": "Τα Τέσσερα Κέντρα στην Έρευνα",
          "paragraphs": [
            "<strong>Σώμα — Γείωση & Βαρύτητα.</strong> Ο εγκέφαλος υπολογίζει διαρκώς τη βαρύτητα και τη σχέση του σώματος με το έδαφος, με την παρεγκεφαλίδα να παίζει κεντρικό ρόλο σε αυτόν τον υπολογισμό{{mackrous_2019}}. Στην πρακτική, η στροφή της προσοχής στη βαρύτητα και στα σημεία στήριξης δίνει στο νευρικό σύστημα μια σταθερή, οικεία αναφορά: μια αίσθηση «εδώ» που δεν χρειάζεται σκέψη.\nΠηγή: Mackrous et al. (2019). Current Biology. DOI: 10.1016/j.cub.2019.07.006",
            "<strong>Αναπνοή — Το Πνευμονογαστρικό Νεύρο.</strong> Η αργή, παρατεταμένη εκπνοή ενεργοποιεί την «κοιλιακή» πλευρά του πνευμονογαστρικού νεύρου{{vagus_nerve}}, που συνδέεται με καταστάσεις ηρεμίας και ασφάλειας. Δεν χρειάζεται να «πείσεις» τον εαυτό σου ότι είναι ασφαλής· στην εμπειρία, η εκπνοή στέλνει το σήμα από μόνη της.\nΠηγή: Porges, S. W. (1995). Psychophysiology. DOI: 10.1111/j.1469-8986.1995.tb01213.x",
            "<strong>Προσοχή — Ήσυχο DMN.</strong> Το Δίκτυο Προεπιλεγμένης Λειτουργίας (Default Mode Network, DMN) συνδέεται με τη νοητική περιπλάνηση, τον μηρυκασμό και την αυτοκριτική, και είναι συχνά υπερδραστήριο σε νευροδιαφορετικούς εγκεφάλους. Ο Farb και οι συνεργάτες του έδειξαν ότι η στροφή από την «αφηγηματική» στην άμεση, βιωματική προσοχή (τι νιώθω τώρα) σχετίζεται με μειωμένη δραστηριότητα του DMN{{farb_2007}}. Η ετικετοποίηση και η επιστροφή στην αίσθηση είναι ακριβώς αυτή η στροφή.\nΠηγή: Farb et al. (2007). Social Cognitive and Affective Neuroscience. DOI: 10.1093/scan/nsm030",
            "<strong>Χώρος — Ανοιχτή Επίγνωση.</strong> Σε έμπειρους διαλογιστές έχει παρατηρηθεί αυξημένος συγχρονισμός εγκεφαλικών κυμάτων <strong>γάμμα</strong> κατά τη διάρκεια πρακτικών ανοιχτής επίγνωσης{{davidson_2004}}. Παράλληλα, η έρευνα της Ανοιχτής Εστίασης (Open Focus) συνδέει τη διεύρυνση της προσοχής με ενίσχυση του ρυθμού <strong>άλφα</strong>. Στην εμπειρία, και τα δύο μοιάζουν με «ξεκόλλημα» από τη στενή υπερεστίαση: λιγότερη εξάντληση, περισσότερη ευρυχωρία.\nΠηγή: Lutz et al. (2004). PNAS. DOI: 10.1073/pnas.0407401101",
            "Ότι αυτά αλλάζουν με την επανάληψη στηρίζεται στη <strong>νευροπλαστικότητα</strong>{{neuroplasticity}}, την ικανότητα του εγκεφάλου να αναδιοργανώνεται με την πρακτική."
          ]
        },
        {
          "title": "Περισσότερες Μελέτες",
          "paragraphs": [
            "• Αποτελεσματικότητα στη ΔΕΠΥ ενηλίκων — Kim & Jung (2025). Medicine. DOI: 10.1097/MD.0000000000044308\n• Νευροβιολογία & νευροπλαστικότητα της ενσυνειδητότητας — Calderone et al. (2024). Biomedicines. DOI: 10.3390/biomedicines12112613\n• Συνδεσιμότητα DMN & διαλογισμός — Brewer et al. (2011). PNAS. DOI: 10.1073/pnas.1112029108\n• 8-εβδομαδιαίο πρόγραμμα ειδικά για ΔΕΠΥ — Zylowska et al. (2008). Journal of Attention Disorders. DOI: 10.1177/1087054707308502\n• Ενσυνειδητότητα στον αυτισμό: συστηματική ανασκόπηση, με ενθαρρυντικά αποτελέσματα και μελέτες ακόμα χαμηλής έως μέτριας ποιότητας — Simione et al. (2024). Brain Sciences. DOI: 10.3390/brainsci14101001\n• Υπερεστίαση ως ρύθμιση «όλα ή τίποτα» — Ashinoff & Abu-Akel (2019). Psychological Research. DOI: 10.1007/s00426-019-01245-8\n• Περιφερειακή όραση & μαλακό βλέμμα — Vater et al. (2022). Psychonomic Bulletin & Review. DOI: 10.3758/s13423-022-02117-w\n• Οικολογική αντίληψη & έδαφος — Gibson, J. J. (1979/2014). The Ecological Approach to Visual Perception. Psychology Press. DOI: 10.4324/9781315740218\n• Ακουστική παράσυρση εγκεφαλικών ρυθμών (binaural) — Lane et al. (1998). Physiology & Behavior. DOI: 10.1016/S0031-9384(97)00436-8"
          ]
        },
        {
          "title": "Για το Κεφάλαιο 7: Αποφυγή και Αναβολή",
          "paragraphs": [
            "• Η αναβολή ως βραχυπρόθεσμη ρύθμιση της διάθεσης — Sirois & Pychyl (2013). Social and Personality Psychology Compass. DOI: 10.1111/spc3.12011\n• Η αυτοσυγχώρεση για μια αναβολή μειώνει την επόμενη — Wohl, Pychyl & Bennett (2010). Personality and Individual Differences. DOI: 10.1016/j.paid.2010.01.029\n• Το στρες δυσκολεύει τη λειτουργία του προμετωπιαίου φλοιού — Arnsten (2009). Nature Reviews Neuroscience. DOI: 10.1038/nrn2648\n• Νέα μάθηση που αλλάζει τη σύνδεση πράξης και απειλής (ανασταλτική μάθηση, inhibitory learning) — Craske et al. (2014). Behaviour Research and Therapy. DOI: 10.1016/j.brat.2014.04.006\n• Η πίεση να φαίνεσαι «φυσιολογικός/ή» (μασκάρισμα, camouflaging) — Hull et al. (2017). Journal of Autism and Developmental Disorders. DOI: 10.1007/s10803-017-3166-5\n• Αυτιστική εξουθένωση (autistic burnout) — Raymaker et al. (2020). Autism in Adulthood. DOI: 10.1089/aut.2019.0079"
          ]
        },
        {
          "title": "Το Πνευματικό Υπόβαθρο",
          "paragraphs": [
            "<strong>Mahāsatipaṭṭhāna Sutta.</strong> Τα Τέσσερα Θεμέλια της Ενσυνειδητότητας (Σώμα, Αισθήσεις, Νους, Ψυχικά Φαινόμενα) αντιστοιχούν άμεσα στα τέσσερα στάδια της μεθόδου.",
            "<strong>Ντζόγκτσεν (Dzogchen).</strong> Παραδόσεις όπως το Ντζόγκτσεν μιλούν για την αναγνώριση του «ανοιχτού χώρου» της συνείδησης, στον οποίο σκέψεις και συναισθήματα εμφανίζονται και εξαφανίζονται χωρίς να μας περιορίζουν.",
            "<strong>Σουφισμός.</strong> Ο Σουφισμός υπενθυμίζει τη σημασία της γείωσης και της καρδιάς ως κέντρου: τη σύνδεση πνεύματος και σώματος."
          ]
        },
        {
          "title": "Η Γραμμή Μετάδοσης",
          "paragraphs": [
            "Οι πρακτικές στις οποίες πατά αυτή η μέθοδος δεν μαθεύτηκαν από βιβλία. Δόθηκαν ζωντανά, από δασκάλους, με αυτή τη σειρά. Η λίστα περιλαμβάνει δύο διαφορετικά πράγματα: μεταδόσεις πρακτικής και θρησκευτικούς δεσμούς (καταφύγιο). Σημειώνονται ξεχωριστά, γιατί δεν είναι το ίδιο.",
            "• <strong>Τάι Τσι / Τσι Γκονγκ</strong> (εκπαίδευση) — Η Μεγάλη Φόρμα, από τον Πέτρο Κουρόπουλο.\n• <strong>Σουφισμός, Inayatiyya</strong> (μύηση) — Μύηση και ονοματοδοσία από τον Δημήτρη Μαγκριώτη, επίσημο δάσκαλο της παράδοσης στην Ελλάδα· συμμετοχή για χρόνια.\n• <strong>Ντζόγκτσεν (Dzogchen)</strong> (μετάδοση) — Πρώτη μετάδοση από τον Chögyal Namkhai Norbu.\n• <strong>Κάρμα Κάγκιου</strong> (καταφύγιο) — Στο Κέντρο Karma Kunkhyabling Αθηνών, με δεσμό στον 17ο Κάρμαπα, Ogyen Trinley Dorje.\n• <strong>Νιίνγκμα / Παλγιούλ</strong> (καταφύγιο) — Από τον Khenpo Ευστάθιο Η. Λιακόπουλο (Kunzang Trinley Dorje Tsal, †2023), ιδρυτή του Κέντρου Βουδιστικών Μελετών «ο Βασιλεύς Μένανδρος».\n• <strong>Ντζόγκτσεν, συνέχεια</strong> (μεταδόσεις) — Από τον Keith Dowman· και τα δύο τελευταία χρόνια, δύο μεταδόσεις από τον Yeshi Namkhai, που συνεχίζει τη γραμμή του πατέρα του.",
            "Καμία από αυτές τις γραμμές δεν έχει εγκρίνει αυτό το βιβλίο και καμία δεν φέρει ευθύνη για τη μορφή του. Η μέθοδος είναι δική μου απόσταξη από ό,τι μου δόθηκε.",
            "<strong>Συμπέρασμα:</strong> η επιστήμη και η πνευματικότητα συγκλίνουν. Η ισορροπία ξεκινά από το σώμα, ρυθμίζεται από την αναπνοή, σταθεροποιείται από την προσοχή και επεκτείνεται σε αίσθηση απεραντοσύνης."
          ]
        },
        {
          "title": "Πόροι & Συνέχεια",
          "paragraphs": [
            "• Open Focus — https://openfocus.com/home/\n• Short Moments of Open Intelligence — https://www.holybooks.com/wp-content/uploads/Short-Moments-of-Open-Intelligence.pdf\n• Lama Lena — Ντζόγκτσεν — https://lamalenateachings.com/\n• Merigar — Παγκόσμια Κοινότητα Ντζόγκτσεν (Chögyal Namkhai Norbu) — https://www.merigar.it/en/dzogchen-community/\n• Σουφισμός — https://sufi.gr/"
          ]
        }
      ],
      "exercise": {
        "title": "Η Διαδρομή μου",
        "steps": [
          "Ποιο από τα τέσσερα κέντρα μού έρχεται πιο φυσικά;",
          "Πού δυσκολεύομαι περισσότερο;",
          "Τι έχει αλλάξει από τότε που ξεκίνησα;"
        ]
      },
      "insight": "Η μέθοδος δεν ζητά να πιστέψεις τίποτα. Ζητά να δοκιμάσεις και να παρατηρήσεις. Η επιστήμη εξηγεί γιατί δουλεύει· η παράδοση εξηγεί από πού ήρθε.",
      "reflection": "Τι κουβαλάω από αυτή την πρακτική;"
    }
  ]
};

export const CHAPTER_PRACTICES = {
  // Mapping can go here if needed
};
