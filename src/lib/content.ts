export const profile = {
  name: "Aleksandra Sobańska",
  title: "Fullstack Developer",
  email: "contact@datenshi.dev",
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
  // {
  //   slug: "bloom",
  //   number: "03",
  //   tag: "WEB APP · DASHBOARD",
  //   title: "Bloom",
  //   subtitle: "Making data feel effortless.",
  //   description:
  //     "An analytics dashboard concept designed for clarity, accessibility and expressive data storytelling.",
  //   stack: ["Next.js", "REST API", "Charts"],
  //   className: "bloom",
  //   demo: "",
  //   github: "",
  //   year: "2026",
  //   role: "Data visualisation & frontend architecture",
  //   overview: [
  //     "Bloom turns product analytics into something people actually want to open. Each view leads with one clear answer and lets the details unfold only when you ask for them.",
  //     "Charts are built to be read by everyone: colour is never the only signal, every chart has a text summary, and the whole dashboard works with a keyboard.",
  //   ],
  //   features: [
  //     {
  //       title: "Accessible charts",
  //       text: "Patterns, labels and summaries make every chart understandable without relying on colour.",
  //     },
  //     {
  //       title: "Composable widgets",
  //       text: "Panels share one data contract, so new views are assembled rather than rebuilt.",
  //     },
  //     {
  //       title: "Typed REST layer",
  //       text: "A thin API client validates responses before they ever reach a chart.",
  //     },
  //   ],
  // },
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
