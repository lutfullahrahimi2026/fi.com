// Site-wide search index. Hand-maintained for now — if this grows past a few
// dozen entries, or content starts coming from a CMS, generate this instead.
const SEARCH_INDEX = [
  // Pages
  { title: "Home", url: "index.html", category: "About", description: "Cultivating hearts, minds, and communities through remembrance, contemplation, and service.", tags: "home faizani international" },
  { title: "Who We Are", url: "about.html", category: "About", description: "Faizani International is a spiritually grounded nonprofit rooted in Islamic monotheism.", tags: "about mission vision tradition what guides us" },
  { title: "Mawlana Faizani (RA)", url: "about.html#leadership", category: "About", description: "Founder & Spiritual Guide. Author of over fifty works exploring spirituality, faith, society, humanity, and creation.", tags: "leadership founder faizani self-knowledge" },
  { title: "Ustadh Mazhabi", url: "about.html#leadership", category: "About", description: "President and eldest son of Mawlana Faizani (RA), leading the University of Insight into God.", tags: "leadership president mazhabi" },
  { title: "Community", url: "about.html#community", category: "About", description: "A global community of growth and service for children, youth, adults, and families.", tags: "community global family" },
  { title: "Contact Us", url: "contact.html", category: "About", description: "We'd love to hear from you, drop us a message below and we'll get back to you soon!", tags: "contact email message" },
  { title: "Donate", url: "donate.html", category: "About", description: "Support our work — one-time or monthly giving.", tags: "donate give support donation" },

  // Programs
  { title: "Children's Program", url: "programs.html#children", category: "Programs", description: "Ages 7–13. Weekly sessions focused on building a strong intellectual faith foundation.", tags: "children kids age 7-13 dhikr service" },
  { title: "Youth Program", url: "programs.html#youth", category: "Programs", description: "Ages 14–17. Developing intellectual and reason-based faith through reflection and discussion.", tags: "youth teen age 14-17 nextgen conference" },
  { title: "Young Adults Program", url: "programs.html#young-adults", category: "Programs", description: "Ages 18–25. Building a strong understanding of faith, life, and purpose.", tags: "young adults age 18-25" },
  { title: "Adults Program", url: "programs.html#adults", category: "Programs", description: "Weekly spiritual education and practices for beginner to advanced students — Dhikr, contemplation, and more.", tags: "adults dhikr contemplation spiritual practice" },
  { title: "Seekers", url: "programs.html#seekers", category: "Programs", description: "Begin your spiritual journey with guidance from a certified instructor.", tags: "seekers begin journey exploring islam faith all faith backgrounds" },

  // Publications (keep in sync with publications.html)
  { title: "General Questions", url: "publications.html#general-questions", category: "Publications", description: "Featured book by Mawlana Faizani (RA).", tags: "book featured faizani" },
  { title: "Knowing Oneself — Knowing God", url: "publications.html#knowing-oneself-knowing-god", category: "Publications", description: "The Six Goblets Series by Mawlana Faizani (RA).", tags: "book the six goblets series" },
  { title: "Magnificence and Perfection of Glorious Artificer in Arts", url: "publications.html#magnificence-and-perfection", category: "Publications", description: "The Six Goblets Series by Mawlana Faizani (RA).", tags: "book the six goblets series" },
  { title: "Man and the Secrets of Nearness", url: "publications.html#man-and-the-secrets-of-nearness", category: "Publications", description: "The Six Goblets Series by Mawlana Faizani (RA).", tags: "book the six goblets series" },
  { title: "Man and the Philosophy of Test", url: "publications.html#man-and-the-philosophy-of-test", category: "Publications", description: "The Six Goblets Series by Mawlana Faizani (RA).", tags: "book the six goblets series" },
  { title: "The Secrets of Creation up to the Court of Greatness", url: "publications.html#secrets-of-creation", category: "Publications", description: "The Six Goblets Series by Mawlana Faizani (RA).", tags: "book the six goblets series" },
  { title: "Alphabets of the Secrets of the Quran", url: "publications.html#alphabets-of-the-secrets-of-the-quran", category: "Publications", description: "The Six Goblets Series by Mawlana Faizani (RA).", tags: "book the six goblets series" },
  { title: "The Soul", url: "publications.html#the-soul", category: "Publications", description: "The Analysis of Man's Atom Series by Mawlana Faizani (RA).", tags: "book the analysis of mans atom series" },
  { title: "The Heart", url: "publications.html#the-heart", category: "Publications", description: "The Analysis of Man's Atom Series by Mawlana Faizani (RA).", tags: "book the analysis of mans atom series" },
  { title: "The Devil", url: "publications.html#the-devil", category: "Publications", description: "The Analysis of Man's Atom Series by Mawlana Faizani (RA).", tags: "book the analysis of mans atom series" },
  { title: "The Reasoning of the Dhakiren", url: "publications.html#the-reasoning-of-the-dhakiren", category: "Publications", description: "Additional Publications by Mawlana Faizani (RA).", tags: "book additional publications" },
  { title: "The Existing Essences Still Lost", url: "publications.html#the-existing-essences-still-lost", category: "Publications", description: "Additional Publications by Mawlana Faizani (RA).", tags: "book additional publications" },
  { title: "The World from the Telescope of the Quran", url: "publications.html#the-world-from-the-telescope-of-the-quran", category: "Publications", description: "Additional Publications by Mawlana Faizani (RA).", tags: "book additional publications" },
  { title: "The Sun of Gnosis", url: "publications.html#the-sun-of-gnosis", category: "Publications", description: "Additional Publications by Mawlana Faizani (RA).", tags: "book additional publications" },

  // Events / Apps
  { title: "Events", url: "events.html", category: "Events", description: "Watch live broadcasts and discover upcoming programs, conferences, and community events.", tags: "events conferences calendar live stream youtube broadcast watch" },
  { title: "Dhikr App", url: "apps.html", category: "About", description: "Coming soon. Create a daily practice of remembrance.", tags: "dhikr app tools reminders" },
  { title: "Contemplation App", url: "apps.html", category: "About", description: "Coming soon. Explore creation through reflection.", tags: "contemplation app tools" },
];
