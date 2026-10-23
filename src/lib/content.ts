export const profile = {
  name: 'Your Name',
  title: 'Fullstack Developer',
  email: 'hello@example.com',
  location: 'Based in Europe · Available worldwide',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
};

export const projects = [
  {
    number: '01', tag: 'FULLSTACK · E-COMMERCE', title: 'Maison', subtitle: 'A shopping experience with soul.',
    description: 'An editorial storefront concept with product discovery, secure checkout architecture and a thoughtful admin experience.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    className: 'maison', demo: '', github: '',
  },
  {
    number: '02', tag: 'FULLSTACK · PRODUCTIVITY', title: 'Forma', subtitle: 'A calmer way to get things done.',
    description: 'A collaborative workspace concept combining a refined interface with auth, data modeling and real-time-ready architecture.',
    stack: ['React', 'Node.js', 'Redis'],
    className: 'forma', demo: '', github: '',
  },
  {
    number: '03', tag: 'WEB APP · DASHBOARD', title: 'Bloom', subtitle: 'Making data feel effortless.',
    description: 'An analytics dashboard concept designed for clarity, accessibility and expressive data storytelling.',
    stack: ['Next.js', 'REST API', 'Charts'],
    className: 'bloom', demo: '', github: '',
  },
];

export const skills = [
  { title: 'Frontend', detail: 'React, Next.js, TypeScript, responsive UI', symbol: '✳' },
  { title: 'Backend', detail: 'Node.js, REST APIs, authentication', symbol: '⌘' },
  { title: 'Data', detail: 'PostgreSQL, Prisma, Redis', symbol: '◈' },
  { title: 'Workflow', detail: 'Git, testing, Docker, deployment', symbol: '↗' },
];
