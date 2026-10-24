import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SectionLabel, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { profile, projects, skills } from "@/lib/content";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const href = `/projects/${project.slug}`;

  return (
    <Reveal delay={index * 0.08}>
      <article
        className={`project-card ${index % 2 === 1 ? "project-card-offset" : ""}`}
      >
        {/* Duplicate link for mouse users; the title link serves keyboards. */}
        <Link href={href} tabIndex={-1} aria-hidden className="project-art-link">
          <ProjectVisual kind={project.className} />
        </Link>
        <div className="project-meta">
          <span>{project.tag}</span>
          <span>
            {project.number} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <div className="project-heading">
          <div>
            <h3>
              <Link href={href}>
                {project.title}
                <span className="title-star">✳</span>
              </Link>
            </h3>
            <p className="project-subtitle">{project.subtitle}</p>
          </div>
          <Link href={href} tabIndex={-1} aria-hidden className="project-arrow">
            <ArrowUpRight strokeWidth={1.1} size={30} />
          </Link>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        {(project.demo || project.github) && (
          <div className="project-links">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                Live demo ↗
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code ↗
              </a>
            )}
          </div>
        )}
      </article>
    </Reveal>
  );
}
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow">
                <span className="live-dot" /> FULLSTACK DEVELOPER · CREATIVE
                THINKER
              </p>
              <h1>
                Code with
                <br />
                <em>intention.</em>
                <span className="hero-spark">✳</span>
              </h1>
              <p className="hero-intro">
                I build beautiful interfaces and the powerful systems behind
                them. From the first pixel to the final API.
              </p>
              <div className="hero-actions">
                <a href="#work" className="button button-dark">
                  Explore my work <ArrowUpRight size={17} />
                </a>
                <a href="#contact" className="text-link">
                  Get in touch <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal className="hero-art" delay={0.15}>
            <div className="art-frame">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="art-flower">
                <div className="flower-core" />
                <span className="petal p1" />
                <span className="petal p2" />
                <span className="petal p3" />
                <span className="petal p4" />
                <span className="petal p5" />
                <span className="petal p6" />
              </div>
              <span className="art-caption">ART MEETS ENGINEERING / 2026</span>
              <span className="art-asterisk">✳</span>
            </div>
            <div className="floating-note">
              <span>THE CREATIVE SIDE</span>
              <b>
                Pretty on the outside.
                <br />
                <em>Powerful on the inside.</em>
              </b>
              <span>✦ A LITTLE OF BOTH</span>
            </div>
          </Reveal>
          <div className="hero-scroll">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDownRight size={17} />
          </div>
        </section>
        <section id="work" className="work-section section-pad">
          <div className="container">
            <Reveal>
              <SectionLabel index="01 /"> SELECTED WORK</SectionLabel>
              <div className="section-heading-row">
                <h2>
                  Things I&apos;ve <em>built.</em>
                </h2>
                <p>
                  A selection of thoughtful digital experiences where creativity
                  meets robust engineering.
                </p>
              </div>
            </Reveal>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p.number} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="about-section section-pad">
          <div className="container about-grid">
            <Reveal className="about-visual">
              <div className="about-art">
                <span className="about-art-top">MORE THAN JUST CODE</span>
                <div className="about-illustration">
                  <div className="about-circle" />
                  <span>✳</span>
                  <div className="about-stroke" />
                </div>
                <span className="about-art-bottom">
                  DETAILS MAKE THE DIFFERENCE — EST. 2026
                </span>
              </div>
              <div className="about-sticker">
                DESIGN MINDED
                <br />
                LOGIC DRIVEN <span>↗</span>
              </div>
            </Reveal>
            <Reveal className="about-copy">
              <SectionLabel index="02 /"> BEHIND THE CODE</SectionLabel>
              <h2>
                A creative mind,
                <br />a developer&apos;s <em>heart.</em>
              </h2>
              <p>
                I love the space where thoughtful design meets solid
                engineering. To me, the best digital products should feel
                effortless on the surface — and be beautifully structured
                underneath.
              </p>
              <p>
                I&apos;m curious by nature, detail-oriented by choice, and
                always looking for ways to turn complex ideas into approachable
                experiences.
              </p>
              <div className="about-signature">
                With care, <span>Aleksandra</span>
              </div>
            </Reveal>
          </div>
        </section>
        <section id="toolkit" className="toolkit-section section-pad">
          <div className="container">
            <Reveal>
              <SectionLabel index="03 /"> MY TOOLKIT</SectionLabel>
              <div className="section-heading-row">
                <h2>
                  What I work <em>with.</em>
                </h2>
                <p>
                  The technologies and practices I reach for to turn ambitious
                  ideas into reliable products.
                </p>
              </div>
            </Reveal>
            <div className="skills-grid">
              {skills.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.07}>
                  <div className="skill-card">
                    <span className="skill-symbol">{s.symbol}</span>
                    <span className="skill-number">0{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="approach-section section-pad">
          <div className="container approach-grid">
            <Reveal>
              <SectionLabel index="04 /"> HOW I THINK</SectionLabel>
              <h2>
                Thoughtful
                <br />
                from <em>start to finish.</em>
              </h2>
              <p>
                Good development is about asking the right questions, not just
                writing the right code.
              </p>
            </Reveal>
            <div className="approach-list">
              {[
                {
                  n: "01",
                  title: "Understand",
                  text: "Listen, explore the problem, and understand the people behind it.",
                },
                {
                  n: "02",
                  title: "Design & build",
                  text: "Shape intuitive experiences backed by dependable architecture.",
                },
                {
                  n: "03",
                  title: "Refine",
                  text: "Test, optimize, iterate — because the little details matter.",
                },
              ].map((item) => (
                <Reveal key={item.n}>
                  <div className="approach-row">
                    <span>{item.n}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <ArrowUpRight size={21} strokeWidth={1.2} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="container contact-grid">
            <Reveal className="contact-copy">
              <SectionLabel index="05 /"> SAY HELLO</SectionLabel>
              <h2>
                Let&apos;s make
                <br />
                something <em>beautiful.</em>
              </h2>
              <p>
                Have a project in mind, a question, or just want to say hello?
                I&apos;d love to hear from you.
              </p>
              <a className="contact-email" href={`mailto:${profile.email}`}>
                {profile.email} <ArrowUpRight size={18} />
              </a>
              <div className="contact-decoration">✳</div>
            </Reveal>
            <Reveal delay={0.13}>
              <div className="contact-card">
                <div className="contact-card-heading">
                  <span>A LITTLE NOTE TO ME</span>
                  <span>✦</span>
                </div>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
