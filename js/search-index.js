// Site-wide search index. Hand-maintained for now — if this grows past a few
// dozen entries, or content starts coming from a CMS, generate this instead.
const SEARCH_INDEX = [
  // Pages
  { title: "Home", url: "index.html", category: "About", description: "Cultivating hearts, minds, and communities through education, reflection, and service.", tags: "home faizani international" },
  { title: "Who We Are", url: "about.html", category: "About", description: "Faizani International is a spiritually grounded nonprofit rooted in Islamic monotheism.", tags: "about mission vision values ikhlas ihsan istiqamah tradition" },
  { title: "Mawlana Faizani (RA)", url: "about.html#leadership", category: "About", description: "Founder & Spiritual Guide. Author of over fifty works exploring spirituality, faith, society, humanity, and creation.", tags: "leadership founder faizani self-knowledge" },
  { title: "Ustadh Mazhabi", url: "about.html#leadership", category: "About", description: "President, leading Faizani International's global vision through education and service.", tags: "leadership president mazhabi" },
  { title: "Community", url: "about.html#community", category: "About", description: "A global community of growth and service for children, youth, adults, and families.", tags: "community global family" },
  { title: "Contact Us", url: "contact.html", category: "About", description: "Questions about programs, collaboration, events, publications, or community.", tags: "contact email message" },
  { title: "Donate", url: "donate.html", category: "About", description: "Support our work — one-time, monthly, or annual giving.", tags: "donate give support donation" },

  // Programs
  { title: "Children's Program", url: "programs.html#children", category: "Programs", description: "Ages 6–13. Weekly sessions focused on building a strong intellectual faith foundation.", tags: "children kids age 6-13 dhikr service" },
  { title: "Youth Program", url: "programs.html#youth", category: "Programs", description: "Ages 14–17. Developing intellectual and reason-based faith through reflection and discussion.", tags: "youth teen age 14-17 nextgen conference" },
  { title: "Young Adults Program", url: "programs.html#young-adults", category: "Programs", description: "Ages 18–25. Building a strong understanding of faith, life, and purpose.", tags: "young adults age 18-25" },
  { title: "Adults Program", url: "programs.html#adults", category: "Programs", description: "Weekly spiritual education and practices for beginner to advanced students — Dhikr, contemplation, and more.", tags: "adults dhikr contemplation spiritual practice" },
  { title: "Seekers", url: "programs.html#seekers", category: "Programs", description: "Begin your spiritual journey with guidance from a certified instructor.", tags: "seekers begin journey exploring islam faith" },

  // Publications are appended at runtime from BOOKS_DATA (see search.js) —
  // keeping one source of truth instead of duplicating 13+ book records here.

  // Teachings
  { title: "Asrar-e-Marifat: Muhammad ﷺ, The Guiding Light of the Mystics", url: "index.html#teaching", category: "Teachings", description: "A teaching with Ustadh Mazhabi on Ma'rifah, Sufi wisdom, and the path of Divine Love.", tags: "teaching video youtube marifat mazhabi dhikr contemplation" },

  // Events / Apps
  { title: "Events", url: "events.html", category: "Events", description: "Learn. Reflect. Connect. Discover upcoming programs, conferences, and community events.", tags: "events conferences calendar" },
  { title: "Dhikr App", url: "apps.html", category: "About", description: "Coming soon. Create a daily practice of remembrance.", tags: "dhikr app tools reminders" },
  { title: "Contemplation App", url: "apps.html", category: "About", description: "Coming soon. Explore creation through reflection.", tags: "contemplation app tools" },
];
