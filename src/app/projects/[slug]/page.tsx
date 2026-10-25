import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import {
  ListRow,
  SectionLabel,
  SiteFooter,
  SiteHeader,
} from "@/components/site-chrome";
import { getProject, profile, projects } from "@/lib/content";
import {
  buttonDark,
  container,
  mono,
  projectLinks,
  projectMeta,
  sectionPad,
  tag,
  tags,
  textLink,
  titleStar,
} from "@/lib/styles";

type Props = { params: Promise<{ slug: string }> };

const factRow = "grid gap-2 border-b border-line py-[18px]";
const factLabel = `${mono} text-2xs text-mauve uppercase`;

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
      <main id="top">
        <section
          className={`${container} grid grid-cols-[1fr_1.1fr] items-center gap-[60px] pt-10 pb-[30px] max-phone:grid-cols-1 max-phone:gap-10 max-phone:pt-5`}
        >
          <Reveal>
            <Link
              href="/#work"
              className={`${textLink} mb-[46px] w-max max-phone:mb-[30px]`}
            >
              <ArrowLeft size={16} /> All work
            </Link>
            <div className={projectMeta}>
              <span>{project.tag}</span>
              <span>
                {project.number} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <h1 className="mt-[18px] font-display text-project leading-[0.85] tracking-[-0.05em] text-plum max-phone:text-project-phone">
              {project.title}
              <span className={`${titleStar} text-9xl`}>✳</span>
            </h1>
            <p className="mt-[22px] font-display text-9xl leading-[1.3] text-wine italic max-phone:text-7xl">
              {project.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <ProjectVisual
              kind={project.className}
              className="h-[clamp(320px,36vw,460px)]"
            />
          </Reveal>
        </section>

        <section
          className={`${container} ${sectionPad} grid grid-cols-[1.3fr_0.7fr] gap-[10%] max-phone:grid-cols-1 max-phone:gap-10`}
        >
          <Reveal>
            <SectionLabel index="01 /"> OVERVIEW</SectionLabel>
            {project.overview.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-[22px] max-w-[620px] text-xl leading-[1.95] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="border-t border-line">
              <div className={factRow}>
                <dt className={factLabel}>Year</dt>
                <dd className="text-base">{project.year}</dd>
              </div>
              <div className={factRow}>
                <dt className={factLabel}>Role</dt>
                <dd className="text-base">{project.role}</dd>
              </div>
              <div className={factRow}>
                <dt className={factLabel}>Stack</dt>
                <dd className={tags}>
                  {project.stack.map((s) => (
                    <span key={s} className={tag}>
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            {(project.demo || project.github) && (
              <div className={projectLinks}>
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

        <section
          className={`${container} grid grid-cols-[0.7fr_1.3fr] gap-[10%] max-phone:grid-cols-1 max-phone:gap-10`}
        >
          <Reveal>
            <SectionLabel index="02 /"> HIGHLIGHTS</SectionLabel>
          </Reveal>
          <div className="border-t border-line">
            {project.features.map((feature, i) => (
              <Reveal key={feature.title}>
                <ListRow
                  n={`0${i + 1}`}
                  title={feature.title}
                  text={feature.text}
                />
              </Reveal>
            ))}
          </div>
        </section>

        <section className={`${container} ${sectionPad}`}>
          <Reveal className="flex flex-wrap items-end justify-between gap-[30px] border-t border-line pt-[50px]">
            <Link href={`/projects/${next.slug}`} className="group grid gap-3">
              <span className={`${mono} text-2xs text-mauve`}>
                NEXT PROJECT
              </span>
              <strong className="flex items-center gap-[18px] font-display text-next leading-none font-normal tracking-[-0.04em] text-plum transition-colors duration-200 group-hover:text-wine">
                {next.title} <ArrowRight size={30} strokeWidth={1.1} />
              </strong>
            </Link>
            <Link href="/#contact" className={buttonDark}>
              Let&apos;s work together <ArrowUpRight size={17} />
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
