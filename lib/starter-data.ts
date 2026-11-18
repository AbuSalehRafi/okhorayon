import { Article, Book, InterstitialQuote, Poem, Poster, ResearchPaper, SiteProfile } from './types';

export const sampleProfile: SiteProfile = {
  name: "Rafi",
  name_bn: "রাফি",
  philosophy_statement: "Thinking in the margin of silence; observing where thought meets stillness.",
  philosophy_statement_bn: "নীরবতার প্রান্তে চিন্তার বিস্তার; যেখানে ভাব এসে স্থিরতায় মেশে।",
  bio: "A writer, essayist, and researcher exploring metaphysics, aesthetics, consciousness, and the architecture of inner solitude."
};

export const sampleQuotes: InterstitialQuote[] = [
  {
    id: "quote-1",
    quote_text: "The silence that precedes speech is not empty; it is pregnant with all that cannot be uttered.",
    quote_text_bn: "কথার আগের নীরবতা শূন্য নয়; তা অকথিত সমস্ত কিছুর গর্ভে নিমগ্ন।",
    author: "Rafi",
    source: "Notebooks on Solitude [Sample]",
    display_order: 1,
    is_active: true
  },
  {
    id: "quote-2",
    quote_text: "He who has a why to live can bear almost any how.",
    quote_text_bn: "যার বাঁচার একটি কারণ আছে, সে প্রায় যেকোনো পরিস্থিতিই সহ্য করতে পারে।",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    display_order: 2,
    is_active: true
  },
  {
    id: "quote-3",
    quote_text: "Philosophy is a battle against the bewitchment of our intelligence by means of language.",
    quote_text_bn: "ভাষার মায়াজালে আমাদের বুদ্ধিমত্তার বন্দিদশার বিরুদ্ধে এক নিরন্তর সংগ্রামই দর্শন।",
    author: "Ludwig Wittgenstein",
    source: "Philosophical Investigations",
    display_order: 3,
    is_active: true
  },
  {
    id: "quote-4",
    quote_text: "We do not see things as they are, we see them as we are.",
    quote_text_bn: "আমরা জিনিসগুলোকে যেভাবে তারা বিদ্যমান সেভাবে দেখি না, বরং আমরা যেভাবে আছি সেভাবেই দেখি।",
    author: "Anthroposophical Note",
    source: "Reflections [Sample]",
    display_order: 4,
    is_active: true
  }
];

export const samplePoems: Poem[] = [
  {
    id: "poem-1",
    slug: "nocturne-of-the-unspoken",
    title: "Nocturne of the Unspoken [Sample]",
    title_bn: "অনুক্ত সুরের নিশুতি [নমুনা]",
    published_at: "2026-10-14T22:00:00Z",
    status: "published",
    is_sample: true,
    tags: ["solitude", "night", "metaphysics"],
    notes: "Preserving line breaks and stanza intervals.",
    content: `The lamp casts a circle of amber sand
upon the wooden grain of midnight.
Between the hand and the paper
lies an ocean without shores.

We name the star to tame its falling,
we speak of dawn to quiet the dark,
yet beneath every syllable
a cathedral of quiet stands untouched.

Turn the lamp low;
let the ink dry into silver;
what was not said
remains the only truth.`
  },
  {
    id: "poem-2",
    slug: "shadows-over-the-river",
    title: "Shadows Over the River [Sample]",
    title_bn: "নদীর বুকে ছায়া [নমুনা]",
    published_at: "2026-10-02T19:30:00Z",
    status: "published",
    is_sample: true,
    tags: ["bengali", "river", "impermanence"],
    content: `নদীর গভীর জলে ভাসে মেঘের দল,
কখনো আলো, কখনো বা ঘোর আঁধার।
যেই জল ছোঁয়া হলো ক্ষণিকের ভুলে,
সে জল চলে গেছে দূর সীমানায়।

আমরা শুধু দাঁড়িয়ে থাকি তীরে,
স্মৃতির নুড়িপাথর কুড়িয়ে রাখি বুকে;
চিরন্তন প্রবাহের মাঝে একবিন্দু নিস্তব্ধতা—
এইটুকুই হয়তো আমাদের পরিচয়।`
  },
  {
    id: "poem-3",
    slug: "the-stone-and-the-pendulum",
    title: "The Stone and the Pendulum [Sample]",
    title_bn: "পাথর ও দোলক [নমুনা]",
    published_at: "2026-09-18T14:15:00Z",
    status: "published",
    is_sample: true,
    tags: ["time", "existentialism"],
    content: `A pendulum counts what cannot stay,
carving slices from the air.
The stone lies motionless in the dust,
unbothered by the hour.

Which of the two has understood
the weight of eternity?
One moves forever to arrive nowhere;
the other arrives by remaining.`
  },
  {
    id: "poem-4",
    slug: "echoes-in-the-library",
    title: "Echoes in the Library [Sample]",
    title_bn: "গ্রন্থাগারের প্রতিধ্বনি [নমুনা]",
    published_at: "2026-08-30T20:00:00Z",
    status: "published",
    is_sample: true,
    tags: ["memory", "books"],
    content: `Rows of sleeping spines,
leather bound and breathing softly.
Centuries folded into calfskin,
waiting for an accidental eye.

I walk these aisles as an intruder
upon the deliberations of ghosts.`
  }
];

export const sampleArticles: Article[] = [
  {
    id: "article-1",
    slug: "on-the-architecture-of-inner-silence",
    title: "On the Architecture of Inner Silence [Sample]",
    title_bn: "অন্তর্নিহিত নীরবতার স্থাপত্য [নমুনা]",
    excerpt: "An inquiry into why modern consciousness rejects quietude, and how genuine contemplative thought requires structural emptiness.",
    reading_time_min: 7,
    tags: ["Philosophy", "Solitude", "Consciousness", "Epistemology"],
    status: "published",
    published_at: "2026-11-04T10:00:00Z",
    is_sample: true,
    content: `### The Fear of the Open Horizon

In our contemporary world, noise is not merely an auditory condition; it has become an ontological shelter. The ceaseless torrent of notifications, commentary, and fractured stimuli serves a defensive psychological function: it shields us from the dizzying vertigo of being left alone in an unmediated chamber with our own mind.

When the room falls quiet, what actually happens? For the unpracticed, silence feels empty—a vacuum demanding immediate replenishment. But for the contemplative tradition, silence is not an absence. It is an architecture.

> *"All of humanity's problems stem from man's inability to sit quietly in a room alone."*
> — Blaise Pascal, *Pensées*

---

### The Three Layers of Stillness

1. **Acoustic Stillness:** The cessation of external decibels. This is the simplest threshold, easily disrupted by a passing siren or the hum of a refrigerator.
2. **Linguistic Stillness:** The slowing down of the internal narrator—the persistent voice that annotates, critiques, and pre-renders every perception before it is felt.
3. **Ontological Stillness:** The profound realization that one exists prior to thought, prior to performance, prior to memory.

When we examine the second tier, we observe that most people never experience linguistic stillness. Even when sitting silently, they are silently drafting a rebuttal, remembering an slight from seven years ago, or scripting their next appearance.

### Solitude as a Workbench

Solitude is not isolation. Isolation is the painful lack of the other; solitude is the rich presence of the self in dialogue with reality. In solitude, the mind ceases to be a reactive organ and transforms into a workshop of discernment.

To read deeply, to write with precision, to contemplate without malice—all of these require that one accepts the weight of unhurried minutes. When Rafi writes late into the night, the goal is not productivity in the economic sense, but alignment with what persists.`
  },
  {
    id: "article-2",
    slug: "the-parable-of-the-unwritten-book",
    title: "The Parable of the Unwritten Book [Sample]",
    title_bn: "অলিখিত গ্রন্থের রূপকথা [নমুনা]",
    excerpt: "Examining the melancholy of potentiality: why every written page is an honorable compromise with perfection.",
    reading_time_min: 5,
    tags: ["Aesthetics", "Writing", "Literature"],
    status: "published",
    published_at: "2026-10-21T09:15:00Z",
    is_sample: true,
    content: `### The Inevitable Compromise

Every blank notebook carries infinite promise. Before the first stroke of ink meets the cream-colored leaf, the unwritten book is flawless. It contains the exact cadence that could heal grief; it holds the philosophical synthesis that might unite intuition with analytical rigour.

Yet the moment the pen descends, infinity collapses. A choice is made: *this* noun instead of that one, *this* syntax rather than that cadence.

\`\`\`
Pure Potentiality  ───(Act of Writing)───>  Concrete Form
   [Flawless]                               [Imperfect & Mortal]
\`\`\`

### Why We Must Write Anyway

To refuse to write out of fear of imperfection is a subtle form of spiritual cowardice. It prefers the safety of an imagined monument over the rough dignity of an earthen bowl. The artist's duty is not to rival the divine imagination, but to offer a clear, honest fragment of human experience.

Each sentence is a bridge thrown across the abyss between two solitudes.`
  },
  {
    id: "article-3",
    slug: "bengali-thought-and-existential-melancholy",
    title: "Bangla Literature and the Aesthetic of 'Biraha' [Sample]",
    title_bn: "বাংলা সাহিত্য ও বিরহ-চৈতন্যের নন্দনতত্ত্ব [নমুনা]",
    excerpt: "Exploring the philosophical depth of longing and separation in classical and modern Bengali poetic consciousness.",
    reading_time_min: 9,
    tags: ["Bangla", "Poetics", "Philosophy"],
    status: "published",
    published_at: "2026-09-28T16:00:00Z",
    is_sample: true,
    content: `### বিরহ কেবল বিচ্ছেদ নয়

বাঙালির ভাবচেতনায় 'বিরহ' কেবল প্রিয়জনের শারীরিক অনুপস্থিতি নির্দেশ করে না; এটি একটি সার্বিক দার্শনিক অবস্থান। পদাবলি কীর্তন থেকে শুরু করে আধুনিক জীবনানন্দ দাশ পর্যন্ত বিরহ রূপ নিয়েছে বিশ্বচরাচরের সাথে মানুষের এক অপূরণীয় দূরত্বের রূপকে।

রবীন্দ্রনাথ ঠাকুরের ভাষায়:
> *"যেথা আমি আছি সেথা তুমি নাই, যেথা তুমি আছ সেথা আমি নাই—মাঝখানে অন্তহীন ক্রন্দন।"*

### জীবনানন্দের অন্ধকার ও নির্জনতা

জীবনানন্দ দাশ যখন লিখলেন *"সব পাখি ঘরে আসে—সব নদী—ফুরায় এ জীবনের সব লেনদেন; থাকে শুধু অন্ধকার, মুখোমুখি বসিবার বনলতা সেন"*, তখন অন্ধকার কোনো ভয়াল অস্তিত্ব নয়, বরং অবসন্ন আত্মার একমাত্র আশ্রয়।

বাঙালি মনস্তত্ত্বের এই নিবিড় বিষাদ আসলে এক গভীর প্রজ্ঞার দ্যোতক। তা জাগতিক চঞ্চলতাকে অতিক্রম করে এক শান্ত, অবিনশ্বর উপলব্ধিতে উপনীত হতে শেখায়।`
  }
];

export const sampleResearch: ResearchPaper[] = [
  {
    id: "research-1",
    slug: "phenomenology-of-margins-and-marginalia",
    title: "The Epistemology of the Margin: Marginalia as Phenomenological Artifact [Sample]",
    title_bn: "প্রান্তিকের জ্ঞানতত্ত্ব: টীকাভাষ্যের রূপতাত্ত্বিক পাঠ [নমুনা]",
    abstract: "This paper investigates how marginal annotations written in the physical perimeters of books reveal an uncodified dialogue between reader and text. Analyzing historical readers' marginal notes from 18th-century philosophy texts, we demonstrate that peripheral commentary destabilizes the presumed hierarchy between authorial canon and subjective reception.",
    keywords: ["Hermeneutics", "Marginalia", "Phenomenology", "Textual Theory", "Cognitive Aesthetics"],
    status: "published",
    pdf_url: "/samples/epistemology-of-the-margin.pdf",
    published_at: "2026-10-28T12:00:00Z",
    is_sample: true,
    content: `### 1. Introduction & Theoretical Framing
The printed text has long maintained an aura of definitive authority. Bound, typeset, and sealed, the codex presents itself as a monologic discourse. However, when an individual reader takes up an ink pen and marks the blank margin—challenging an assumption, querying an etymology, or underscoring a doubt—the static monologue is fractured into an intimate dialectic.

### 2. The Spatial Politics of the Margin
Whitespace in book design is rarely neutral. Historically conceived as an aesthetic buffer to protect the reading eye from typographical fatigue, the margin simultaneously operates as an unregulated sanctuary for dissent.

### 3. Conclusion
Rather than treating marginalia as vandalism or trivial sentiment, we argue for its elevation to a primary phenomenological source: the tangible footprint of human consciousness wrestling with form.`
  },
  {
    id: "research-2",
    slug: "computational-solitude-in-algorithmic-societies",
    title: "Algorithmic Asynchrony: The Structural Erosion of Contemplative Time [Sample]",
    title_bn: "অ্যালগরিদমিক অসমকালীনতা ও মননশীল সময়ের সংকট [নমুনা]",
    abstract: "A critical inquiry into how real-time algorithmic feedback loops distort human perception of duration. By substituting continuous micro-intervals of reward for expansive stretches of boredom, algorithmic architectures eliminate the cognitive incubation periods necessary for synthetic philosophical synthesis.",
    keywords: ["Temporal Ethics", "Algorithmic Culture", "Attention Economy", "Digital Philosophy"],
    status: "ongoing",
    published_at: "2026-11-12T08:30:00Z",
    is_sample: true,
    content: `### Abstract & Working Hypotheses
This ongoing research project maps the degradation of contemplative duration under ubiquitous mobile notification engines. We hypothesize that synthetic contemplation requires non-teleological time: hours where the mind produces no measurable output and expects no feedback.`
  },
  {
    id: "research-3",
    slug: "poetics-of-water-in-eastern-bengal",
    title: "Fluids of Being: The River as Metaphysical Topology in Eastern Bengal [Sample]",
    title_bn: "অস্তিত্বের জলরাশি: পূর্ব বাংলার নদীকেন্দ্রিক অধিবিদ্যা [নমুনা]",
    abstract: "Examining how shifting alluvial topography (চর ও ভাঙন) fundamentally shapes the Bengali understanding of fate, transience, and spiritual surrender compared to Western continental philosophy grounded in stone and permanent borders.",
    keywords: ["Ecophilosophy", "Bengal", "Ontology of Water", "Geopoetics"],
    status: "published",
    pdf_url: "/samples/fluids-of-being.pdf",
    published_at: "2026-09-10T11:00:00Z",
    is_sample: true,
    content: `### Geographical Determinism in Metaphysics
Where land vanishes overnight beneath monsoon swells, permanence is recognized as a delusion. The human soul in Eastern Bengal understands its existence not as an enduring fortress, but as an anchored skiff.`
  }
];

export const samplePosters: Poster[] = [
  {
    id: "poster-1",
    slug: "silence-before-syllable",
    title: "Silence Before Syllable [Sample]",
    title_bn: "শব্দের পূর্বে নৈশব্দ্য [নমুনা]",
    description: "Typographic meditation on typographic space and philosophical quietude. Minimalist ink on warm handmade paper.",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    high_res_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2400&q=95",
    dimensions: "24 x 36 in / Screenprint on Archival Cotton",
    published_at: "2026-10-18T15:00:00Z",
    is_sample: true
  },
  {
    id: "poster-2",
    slug: "the-geometry-of-solitude",
    title: "The Geometry of Solitude [Sample]",
    title_bn: "নির্জনতার জ্যামিতি [নমুনা]",
    description: "An architectural exploration of light hitting an empty study corner at 3:00 AM. Deep midnight navy and warm brass leaf.",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    high_res_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=2400&q=95",
    dimensions: "18 x 24 in / Woodblock Print",
    published_at: "2026-09-25T11:30:00Z",
    is_sample: true
  },
  {
    id: "poster-3",
    slug: "river-and-nightfall",
    title: "River and Nightfall [Sample]",
    title_bn: "নদী ও গোধূলি [নমুনা]",
    description: "Visual study of the Meghna river in twilight, Bengali calligraphic verse blended into monochrome silver reflections.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    high_res_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=95",
    dimensions: "20 x 30 in / Giclée Fine Art Print",
    published_at: "2026-09-05T18:00:00Z",
    is_sample: true
  },
  {
    id: "poster-4",
    slug: "constellations-of-thought",
    title: "Constellations of Thought [Sample]",
    title_bn: "ভাবনার নক্ষত্রমণ্ডল [নমুনা]",
    description: "Astronomical map of philosophical categories, showing intersecting domains of ethics, ontology, and poetic intuition.",
    image_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    high_res_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2400&q=95",
    dimensions: "24 x 36 in / Metallic Foil on Charcoal Board",
    published_at: "2026-08-14T10:00:00Z",
    is_sample: true
  }
];

export const sampleBooks: Book[] = [
  {
    id: "book-1",
    slug: "the-anatomy-of-contemplation",
    title: "The Anatomy of Contemplation [Sample]",
    subtitle: "Dialogues on Solitude, Time, and the Interior Horizon",
    description: "A philosophical inquiry into the conditions under which authentic human reflection survives in an age of accelerated distraction. Structured as seven meditative treatises.",
    cover_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    status: "published",
    published_at: "2026-10-01T10:00:00Z",
    is_sample: true,
    chapters: [
      {
        id: "chap-1",
        book_id: "book-1",
        chapter_number: 1,
        slug: "the-perimeter-of-silence",
        title: "Chapter I: The Perimeter of Silence",
        reading_time_min: 8,
        created_at: "2026-10-01T10:00:00Z",
        content: `### The Threshold of the Study

Before one can think, one must construct a room in which thinking is not an emergency. For centuries, the monastic cell and the writer's study shared a common virtue: they were enclosures explicitly designed to keep the triviality of the world at bay.

When you cross into the study at midnight, you leave behind the frantic exchange of social debts. The books along the wall do not demand an immediate reply. They have waited four hundred years; they can wait another evening.

\`\`\`
Outer World  ──[ Threshold of Silence ]──>  The Contemplative Chamber
(Velocity)                                  (Depth & Duration)
\`\`\`

### The First Movement: Extinguishing the False Lights

Modern humanity has populated its hours with artificial suns. We carry in our pockets glowing slabs that promise connection while subtly amputating our capacity for depth. 

The first discipline of contemplation is the willful shutting down of these micro-distractions. Let the shadows lengthen across the carpet. Let the clock on the mantle tick with deliberate, unhurried measure.

In this subdued atmosphere, the mind initially rebels. It demands novelty; it craves a sudden dopamine spike. If one can sit through the first twenty minutes of restlessness without surrendering, a remarkable shift occurs: the baseline of consciousness lowers, and the quiet begins to speak.`
      },
      {
        id: "chap-2",
        book_id: "book-1",
        chapter_number: 2,
        slug: "on-the-weight-of-words",
        title: "Chapter II: On the Weight of Words",
        reading_time_min: 10,
        created_at: "2026-10-02T10:00:00Z",
        content: `### The Currency of Language

Language is the most delicate instrument we possess, yet we treat it like disposable plastic. Every day, trillions of careless phrases are flung across digital wires—half-thought, unweighed, discarded before the sun sets.

A writer must re-learn the sacred density of words. In ancient Sanskrit and classical Hebrew, a word was never merely a label for an object; it was a manifestation of the object's essential vibration.

> *"To speak a word truthfully is to assume moral responsibility for the universe you have summoned into being."*

### The Craft of Elimination

True style is not the ornamentation of thought, but the merciless pruning of everything that is not indispensable. When Rafi writes, the wastepaper basket is always fuller than the manuscript desk. 

If a paragraph can survive without an adverb, cast the adverb out. If an idea can be illuminated by an exact verb, discard the three adjectives that were leaning against it like crutches.

When language is restored to its proper weight, even a sentence of six words can anchor a wandering heart for a decade.`
      },
      {
        id: "chap-3",
        book_id: "book-1",
        chapter_number: 3,
        slug: "the-dialectic-of-dusk",
        title: "Chapter III: The Dialectic of Dusk",
        reading_time_min: 7,
        created_at: "2026-10-03T10:00:00Z",
        content: `### The In-Between Hour

Dusk is the most philosophical hour of the day. It belongs neither to the harsh pragmatism of daylight nor to the impenetrable mystery of deep night. It is a frontier, a twilight seam where the outlines of objects soften and dissolve.

At dusk, the mind naturally turns toward retrospection. What was gained today? What evaporated without a trace?

To sit quietly by an open window during twilight is to witness the natural world surrender its claims without panic. The trees do not contest the fading light; the birds return to their perches with an instinct that requires no philosophy to justify itself.`
      },
      {
        id: "chap-4",
        book_id: "book-1",
        chapter_number: 4,
        slug: "the-eternal-return-of-solitude",
        title: "Chapter IV: The Eternal Return of Solitude",
        reading_time_min: 11,
        created_at: "2026-10-04T10:00:00Z",
        content: `### The Inevitable Return

No matter how deeply we love, no matter how tightly we weave ourselves into the fabric of human society, each of us remains an unrepeatable solitude. We are born into our own skin, and when we close our eyes for the final time, it is our own quiet darkness we encounter.

This truth need not be a source of despair. On the contrary: when one accepts solitude as the foundational condition of human life, loneliness loses its terror. One no longer expects another person to save them from being themselves.

Instead, relationship becomes an encounter between two sovereign landscapes—two quiet kingdoms meeting across a tranquil river.`
      }
    ]
  },
  {
    id: "book-2",
    slug: "reflections-on-the-bengal-delta",
    title: "Reflections on the Bengal Delta [Sample]",
    title_bn: "গাঙ্গেয় বদ্বীপের ভাবনা [নমুনা]",
    subtitle: "Essays on Alluvial Memory and Riverine Philosophy",
    description: "An exploration of how the shifting rivers and monsoonal tides of Bengal give birth to a distinctive ontological surrender.",
    cover_image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    status: "published",
    published_at: "2026-08-15T12:00:00Z",
    is_sample: true,
    chapters: [
      {
        id: "chap-b2-1",
        book_id: "book-2",
        chapter_number: 1,
        slug: "the-birth-of-silt",
        title: "প্রথম অধ্যায়: পলির জন্ম ও বিনাশ",
        reading_time_min: 6,
        created_at: "2026-08-15T12:00:00Z",
        content: `### নদীর সন্তান

পলিমাটির দেশে মানুষের স্থায়ী কোনো সীমানা থাকে না। আজ যে জমি ফসলে সবুজ, কাল সেখানে পদ্মা বা মেঘনার তীব্র ভাঙন। এই অস্থির ভূগোলের ওপর দাঁড়িয়ে আমরা যে জীবন রচনা করি, তার পরতে পরতে থাকে অনিত্যতার পাঠ।

পাশ্চাত্যের চিন্তা তৈরি হয়েছে পাথুরে পাহাড়ি ভূমিতে, যেখানে রোমান দেয়াল দুই হাজার বছর টিকে থাকে। কিন্তু আমাদের বাংলার দর্শন তৈরি হয়েছে জলে ও কাদায়। এখানে সৃষ্টি এবং ধ্বংস একাকার হয়ে বয়ে যায় অবিরাম স্রোতে।`
      }
    ]
  }
];

export const sampleFeaturedItem = {
  type: "book",
  title: "The Anatomy of Contemplation",
  subtitle: "Dialogues on Solitude, Time, and the Interior Horizon",
  slug: "the-anatomy-of-contemplation",
  excerpt: "A philosophical inquiry into the conditions under which authentic human reflection survives in an age of accelerated distraction.",
  badge: "Featured Book",
  link: "/books/the-anatomy-of-contemplation"
};
