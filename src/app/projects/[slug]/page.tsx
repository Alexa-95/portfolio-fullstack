import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SectionLabel, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getProject, profile, projects } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);

  if (!project) {
    return {};
  }

  const title = `${project.title} — ${profile.name}`;

  return {
    title,
    description: project.description,
    openGraph: { title, description: project.subtitle, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);

  if (!project) {
    notFound();
  }

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <SiteHeader />
      <main id="top" className="project-page">
        <section className="container project-hero">
          <Reveal>
            <Link href="/#work" className="text-link project-back">
              <ArrowLeft size={16} /> All work
            </Link>
            <div className="project-meta">
              <span>{project.tag}</span>
              <span>
                {project.number} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <h1>
              {project.title}
              <span className="title-star">✳</span>
            </h1>
            <p className="project-hero-subtitle">{project.subtitle}</p>
          </Reveal>
          <Reveal className="project-hero-art" delay={0.12}>
            <ProjectVisual kind={project.className} />
          </Reveal>
        </section>

        <section className="container project-details section-pad">
          <Reveal className="project-overview">
            <SectionLabel index="01 /"> OVERVIEW</SectionLabel>
            {project.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal className="project-facts" delay={0.1}>
            <dl>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd className="project-tags">
                  {project.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </dd>
              </div>
            </dl>
            {(project.demo || project.github) && (
              <div className="project-links">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
          </Reveal>
        </section>

        <section className="container project-features">
          <Reveal>
            <SectionLabel index="02 /"> HIGHLIGHTS</SectionLabel>
          </Reveal>
          <div className="approach-list">
            {project.features.map((feature, i) => (
              <Reveal key={feature.title}>
                <div className="approach-row">
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container project-next section-pad">
          <Reveal>
            <Link href={`/projects/${next.slug}`} className="project-next-link">
              <span>NEXT PROJECT</span>
              <strong>
                {next.title} <ArrowRight size={30} strokeWidth={1.1} />
              </strong>
            </Link>
            <Link href="/#contact" className="button button-dark">
              Let&apos;s work together <ArrowUpRight size={17} />
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
