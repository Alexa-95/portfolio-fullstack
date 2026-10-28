export const profile = {
  name: "Aleksandra Sobańska",
  title: "Fullstack Developer",
  // Split so the full address is never in the server HTML.
  emailUser: "contact",
  emailDomain: "datenshi.dev",
  location: "Based in Europe · Available worldwide",
  github: "https://github.com/Alexa-95",
  linkedin: "https://www.linkedin.com/in/aleksandra-sobanska/",
};

export const projects = [
  {
    slug: "loan-calculator",
    number: "01",
    tag: "FULLSTACK · FINTECH",
    title: "Loan Calculator",
    subtitle: "Every instalment, explained.",
    description:
      "A mortgage calculator for financial advisors with a full amortisation schedule, a live chart and an interactive overpayment slider.",
    stack: ["React", "Node.js", "Express", "Recharts", "Tailwind CSS"],
    className: "loan-calculator",
    demo: "",
    github: "https://github.com/Alexa-95/kalkulator-kredytowy",
    year: "2026",
    role: "Design & fullstack development",
    overview: [
      "Loan Calculator was built for financial advisors who need to show a client more than a single monthly figure. It breaks every instalment into its principal and interest parts, so the client can see how the loan actually gets paid off over the years.",
      "A React and Vite front end talks to a stateless Express API, where the schedule is produced by a single pure function. The project was built step by step with an AI coding agent, as a live demo for an LLM workshop.",
    ],
    features: [
      {
        title: "Full amortisation schedule",
        text: "Each instalment is split into principal, interest and remaining balance, formatted with Polish number formatting and tabular figures so the columns never jump.",
      },
      {
        title: "Overpayment simulator",
        text: "A slider adds a monthly overpayment and instantly shows how much interest is saved and how many months come off the loan.",
      },
      {
        title: "Live chart",
        text: "An animated area chart and the table read from the same data, so changing an input updates both at once, with debounced requests keeping it smooth.",
      },
    ],
  },
  {
    slug: "brewing-beer-app",
    number: "02",
    tag: "FULLSTACK · CATALOGUE",
    title: "Brewing Beer App",
    subtitle: "Every pint, remembered.",
    description:
      "A private beer journal for logging every beer tasted, with its brewery, style, tasting notes, ratings and a photo of the label.",
    stack: ["Next.js", "React", "Appwrite", "NextAuth", "Tailwind CSS", "NextUI"],
    className: "brewing",
    demo: "",
    github: "https://github.com/Alexa-95/Brewing-Beer-App",
    year: "2025",
    role: "Design & fullstack development",
    overview: [
      "Brewing Beer App is a personal catalogue for beer lovers. Each entry keeps the beer's style, brewery, bitterness, sourness and strength next to two independent ratings and free-form tasting notes, so it is easy to remember what was worth buying again.",
      "The Next.js 14 front end uses Appwrite as its backend: documents live in Appwrite collections and label photos in Appwrite Storage. Access is protected by NextAuth and a Basic Auth middleware, and the lists of breweries and beer styles are kept as separate collections that can be managed from the app.",
    ],
    features: [
      {
        title: "Searchable beer list",
        text: "One table searches across beer name, brewery and style at once, with Polish-aware alphabetical sorting and pagination.",
      },
      {
        title: "Detailed tasting entries",
        text: "Every beer stores bitterness, sourness, alcohol content, two ratings, notes and an uploaded label photo, with a placeholder when there is none.",
      },
      {
        title: "Managed dictionaries",
        text: "Breweries and beer styles are separate collections, seeded with Polish breweries and dozens of styles, and edited from their own pages.",
      },
    ],
  },
  {
    slug: "chapterly",
    number: "03",
    tag: "FULLSTACK · READING",
    title: "Chapterly",
    subtitle: "A home for every book you read.",
    description:
      "A reading journal for tracking books, progress, ratings and reviews, with shelves, yearly goals and reading stats.",
    stack: ["Next.js", "TypeScript", "Cloudflare D1", "Drizzle ORM", "Open Library API", "Google Books API"],
    className: "chapterly",
    demo: "",
    github: "https://github.com/Alexa-95/chapterly",
    year: "2026",
    role: "Design & fullstack development",
    overview: [
      "Chapterly is a personal reading journal. Books are found through a search, placed on shelves and followed from the moment they are added, through the pages read, to a finished book with a rating and a review.",
      "It is built with Next.js 16, the App Router and Server Actions, and runs on Cloudflare Workers through OpenNext. Data lives in a Cloudflare D1 database modelled with Drizzle ORM and versioned migrations, while book details come from Open Library, with Google Books as a fallback.",
    ],
    features: [
      {
        title: "Two-source book search",
        text: "Open Library is queried first for its better coverage of Polish books, and Google Books takes over when it fails.",
      },
      {
        title: "Shelves & reading progress",
        text: "Every book has a status (want to read, reading, read), a current page and any number of custom shelves.",
      },
      {
        title: "Goals, stats & history",
        text: "A yearly reading goal, books finished per year, pages read per month and a log of every reading activity.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const skills = [
  { title: 'Frontend', detail: 'React, Vue.js, Next.js, TypeScript', symbol: '✳' },
  { title: 'Backend', detail: 'Node.js, REST APIs, authentication', symbol: '⌘' },
  { title: 'Data', detail: 'PostgreSQL, Prisma, Redis', symbol: '◈' },
  { title: 'Workflow', detail: 'Git, testing, Docker, deployment', symbol: '↗' },
];
