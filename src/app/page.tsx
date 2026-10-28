import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import {
  ListRow,
  SectionLabel,
  SiteFooter,
  SiteHeader,
} from "@/components/site-chrome";
import { profile, projects, skills } from "@/lib/content";
import {
  buttonDark,
  container,
  heading,
  mono,
  projectLinks,
  projectMeta,
  sectionHeading,
  sectionPad,
  tag,
  tags,
  textLink,
  titleStar,
} from "@/lib/styles";
import { EmailLink } from "@/components/email-link";

const headingRowText =
  "max-w-[285px] text-base leading-[1.9] text-muted max-phone:mt-[19px]";
const aboutText = "mb-[18px] text-lg leading-[2] text-muted";
const petalRotations = [
  "rotate-0",
  "rotate-60",
  "rotate-120",
  "rotate-180",
  "rotate-240",
  "rotate-300",
];

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
        className={`group ${index % 2 === 1 ? "mt-[100px] max-phone:mt-0" : ""}`}
      >
        {/* Duplicate link for mouse users; the title link serves keyboards. */}
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <ProjectVisual
            kind={project.className}
            className="h-[340px] max-tablet:h-[290px] max-phone:h-[clamp(270px,76vw,380px)]"
          />
        </Link>
        <div className={`${projectMeta} mt-[26px] mb-3`}>
          <span>{project.tag}</span>
          <span>
            {project.number} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="font-display text-card leading-[0.95] tracking-[-0.035em] text-plum">
              <Link
                href={href}
                className="transition-colors duration-200 hover:text-wine"
              >
                {project.title}
                <span className={`${titleStar} text-3xl`}>✳</span>
              </Link>
            </h3>
            <p className="mt-[9px] text-md text-wine">{project.subtitle}</p>
          </div>
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden
            className="transition-transform duration-[250ms] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
          >
            <ArrowUpRight strokeWidth={1.1} size={30} />
          </Link>
        </div>
        <p className="mt-[17px] max-w-[470px] text-md leading-[1.8] text-muted">
          {project.description}
        </p>
        <div className={`${tags} mt-[17px]`}>
          {project.stack.map((s) => (
            <span key={s} className={tag}>
              {s}
            </span>
          ))}
        </div>
        {(project.demo || project.github) && (
          <div className={projectLinks}>
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
        <section
          className={`${container} relative grid min-h-[660px] grid-cols-[1fr_0.9fr] items-center gap-[58px] pb-[100px] max-tablet:gap-[15px] max-phone:min-h-0 max-phone:grid-cols-1 max-phone:gap-[35px] max-phone:pt-[47px] max-phone:pb-[75px]`}
        >
          <div className="relative z-2">
            <Reveal>
              <p
                className={`${mono} mb-[30px] flex items-center gap-2.5 text-2xs text-wine`}
              >
                <span className="size-[7px] rounded-full bg-rose shadow-[0_0_0_5px_#f4e5e8]" />{" "}
                FULLSTACK DEVELOPER · CREATIVE THINKER
              </p>
              <h1 className="relative font-display text-hero leading-[0.83] tracking-[-0.056em] whitespace-nowrap text-plum max-tablet:text-hero-tablet max-phone:text-hero-phone max-tiny:text-hero-xs">
                Code with
                <br />
                <em className="text-wine">intention.</em>
                <span className="absolute top-[5px] right-0 animate-[rotate_28s_linear_infinite] font-sans text-spark leading-[normal] text-rose max-tablet:hidden">
                  ✳
                </span>
              </h1>
              <p className="mt-[37px] max-w-[430px] text-xl leading-[1.85] text-muted max-phone:mt-[23px] max-phone:text-base">
                I build beautiful interfaces and the powerful systems behind
                them. From the first pixel to the final API.
              </p>
              <div className="mt-8 flex items-center gap-[29px] max-tiny:gap-3.5">
                <a href="#work" className={buttonDark}>
                  Explore my work <ArrowUpRight size={17} />
                </a>
                <a href="#contact" className={textLink}>
                  Get in touch <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal
            className="relative pt-5 pr-2.5 pb-[60px] pl-[5px] max-phone:m-auto max-phone:w-[min(420px,94%)] max-phone:pt-0 max-phone:pr-1 max-phone:pb-[42px] max-phone:pl-1"
            delay={0.15}
          >
            <div className="relative aspect-[0.96] overflow-hidden rounded-[50%_50%_44%_44%] bg-[radial-gradient(circle_at_62%_40%,#f4e4e3,#eac9d5_68%,#deb7c8)]">
              <div className="absolute -top-[3%] left-[19%] h-[105%] w-[65%] -rotate-25 rounded-full border border-white/63" />
              <div className="absolute -top-[3%] left-[26%] h-[105%] w-[50%] rotate-37 rounded-full border border-white/63" />
              {/* Plain transform (not translate-*), because the float keyframes animate transform. */}
              <div className="absolute top-[49%] left-1/2 size-[230px] animate-[float_7s_ease-in-out_infinite] [transform:translate(-50%,-50%)] max-phone:[transform:translate(-50%,-50%)_scale(0.8)]">
                <div className="absolute top-[98px] left-[97px] z-2 size-[46px] rounded-full border-[7px] border-art-stem bg-art-core" />
                {petalRotations.map((rotation) => (
                  <span
                    key={rotation}
                    className={`absolute top-[6px] left-[70px] h-[136px] w-[90px] origin-[45px_109px] rounded-[100%_0_100%_0] bg-[linear-gradient(125deg,#bd7895,#92506f)] shadow-[inset_6px_10px_18px_#ffffff40] ${rotation}`}
                  />
                ))}
              </div>
              <span
                className={`${mono} absolute bottom-[19px] left-1/2 -translate-x-1/2 text-3xs whitespace-nowrap text-mauve-deep`}
              >
                ART MEETS ENGINEERING / 2026
              </span>
              <span className="absolute top-[12%] right-[10%] animate-[rotate_16s_linear_infinite] text-glyph text-cream">
                ✳
              </span>
            </div>
            <div className="absolute bottom-[9px] -left-[35px] grid min-w-[265px] -rotate-5 gap-3 bg-paper p-[22px] shadow-[0_18px_50px_#63314b17] max-tablet:-left-[15px] max-phone:bottom-0 max-phone:-left-2.5 max-phone:min-w-[220px] max-phone:p-4">
              <span className={`${mono} text-3xs text-taupe`}>
                THE CREATIVE SIDE
              </span>
              <b className="font-display text-7xl leading-[1.06] font-medium text-wine max-phone:text-4xl">
                Pretty on the outside.
                <br />
                <em className="text-6xl font-normal max-phone:text-4xl">
                  Powerful on the inside.
                </em>
              </b>
              <span className={`${mono} text-3xs text-taupe`}>
                ✦ A LITTLE OF BOTH
              </span>
            </div>
          </Reveal>
          <div
            className={`${mono} absolute bottom-[35px] left-0 flex items-center gap-4 text-2xs text-taupe max-phone:bottom-4`}
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDownRight size={17} />
          </div>
        </section>
        <section id="work" className={`${sectionPad} bg-paper`}>
          <div className={container}>
            <Reveal>
              <SectionLabel index="01 /"> SELECTED WORK</SectionLabel>
              <div className="mt-[19px] mb-[53px] flex items-end justify-between gap-[60px] max-phone:mb-8 max-phone:block">
                <h2 className={sectionHeading}>
                  Things I&apos;ve <em className="text-wine">built.</em>
                </h2>
                <p className={headingRowText}>
                  A selection of thoughtful digital experiences where creativity
                  meets robust engineering.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-[37px] gap-y-[74px] max-phone:grid-cols-1 max-phone:gap-y-[50px]">
              {projects.map((p, i) => (
                <ProjectCard key={p.number} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
        <section id="about" className={sectionPad}>
          <div
            className={`${container} grid grid-cols-2 items-center gap-[12%] max-tablet:gap-[6%] max-phone:grid-cols-1 max-phone:gap-[50px]`}
          >
            <Reveal className="relative pb-9 pl-[18px] max-phone:m-auto max-phone:w-full max-phone:max-w-[470px]">
              <div className="flex h-[530px] flex-col justify-between bg-[linear-gradient(145deg,#eed9dd,#d7aaba)] p-5 text-mauve-deep max-phone:h-[420px]">
                <span className={`${mono} text-3xs`}>MORE THAN JUST CODE</span>
                <div className="relative grid flex-1 place-items-center">
                  <div className="h-[290px] w-[260px] -rotate-24 rounded-[50%_50%_45%_45%] bg-[linear-gradient(130deg,#f4e5df,#dcb0bf)] shadow-[35px_20px_70px_#75425430]" />
                  <span className="absolute animate-[rotate_35s_linear_infinite] font-[family-name:serif] text-deco-xl text-art-glyph">
                    ✳
                  </span>
                  <div className="absolute h-[210px] w-[330px] rotate-54 rounded-full border border-art-stroke" />
                </div>
                <span className={`${mono} text-3xs`}>
                  DETAILS MAKE THE DIFFERENCE — EST. 2026
                </span>
              </div>
              <div className="absolute -right-7 bottom-[7px] rotate-8 bg-paper p-[23px] font-mono text-xs leading-[1.6] text-wine shadow-[0_14px_40px_#78475916] max-phone:right-0">
                DESIGN MINDED
                <br />
                LOGIC DRIVEN <span className="float-right text-6xl">↗</span>
              </div>
            </Reveal>
            <Reveal>
              <SectionLabel index="02 /"> BEHIND THE CODE</SectionLabel>
              <h2
                className={`${sectionHeading} mt-7 mb-[25px] max-phone:mt-[23px]`}
              >
                A creative mind,
                <br />a developer&apos;s <em className="text-wine">heart.</em>
              </h2>
              <p className={aboutText}>
                I love the space where thoughtful design meets solid
                engineering. To me, the best digital products should feel
                effortless on the surface — and be beautifully structured
                underneath.
              </p>
              <p className={aboutText}>
                I&apos;m curious by nature, detail-oriented by choice, and
                always looking for ways to turn complex ideas into approachable
                experiences.
              </p>
              <div className="mt-[30px] border-t border-line pt-[25px] font-display text-8xl text-taupe-dark italic">
                With care, <span className="ml-3 text-wine">Aleksandra</span>
              </div>
            </Reveal>
          </div>
        </section>
        <section id="toolkit" className={`${sectionPad} bg-blush-light`}>
          <div className={container}>
            <Reveal>
              <SectionLabel index="03 /"> MY TOOLKIT</SectionLabel>
              <div className="mt-[19px] mb-[53px] flex items-end justify-between gap-[60px] max-phone:mb-8 max-phone:block">
                <h2 className={sectionHeading}>
                  What I work <em className="text-wine">with.</em>
                </h2>
                <p className={headingRowText}>
                  The technologies and practices I reach for to turn ambitious
                  ideas into reliable products.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-4 gap-[15px] max-tablet:grid-cols-2 max-phone:gap-2.5">
              {skills.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.07}>
                  <div className="relative min-h-[232px] bg-paper p-[25px] transition-transform duration-[250ms] hover:-translate-y-1.5 max-phone:min-h-[205px] max-phone:p-[19px]">
                    <span className="font-display text-symbol text-wine">
                      {s.symbol}
                    </span>
                    <span
                      className={`${mono} absolute top-7 right-[21px] text-2xs text-rose-muted`}
                    >
                      0{i + 1}
                    </span>
                    <h3 className="mt-[34px] font-display text-skill text-plum-light max-phone:text-skill-sm">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.8] text-muted">
                      {s.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className={sectionPad}>
          <div
            className={`${container} grid grid-cols-2 gap-[13%] max-phone:grid-cols-1 max-phone:gap-[50px]`}
          >
            <Reveal>
              <SectionLabel index="04 /"> HOW I THINK</SectionLabel>
              <h2 className={`${sectionHeading} mt-[25px]`}>
                Thoughtful
                <br />
                from <em className="text-wine">start to finish.</em>
              </h2>
              <p className="mt-[22px] max-w-[340px] text-base leading-[1.9] text-muted">
                Good development is about asking the right questions, not just
                writing the right code.
              </p>
            </Reveal>
            <div className="border-t border-line">
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
                  <ListRow
                    n={item.n}
                    title={item.title}
                    text={item.text}
                    icon={<ArrowUpRight size={21} strokeWidth={1.2} />}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="bg-wine py-[130px] text-cream max-phone:py-20"
        >
          <div
            className={`${container} grid grid-cols-[1fr_0.85fr] items-start gap-[12%] max-tablet:gap-[6%] max-phone:grid-cols-1 max-phone:gap-[50px]`}
          >
            <Reveal>
              <SectionLabel index="05 /" inverted>
                {" "}
                SAY HELLO
              </SectionLabel>
              <h2
                className={`${heading} mt-8 text-contact text-cream max-phone:text-contact-phone`}
              >
                Let&apos;s make
                <br />
                something <em className="text-petal-deep">beautiful.</em>
              </h2>
              <p className="mt-8 mb-[26px] max-w-[340px] text-base leading-[1.9] text-petal">
                Have a project in mind, a question, or just want to say hello?
                I&apos;d love to hear from you.
              </p>
              <EmailLink
                user={profile.emailUser}
                domain={profile.emailDomain}
                className="flex w-max max-w-full items-center gap-3 border-b border-line-wine pb-[9px] text-base wrap-anywhere"
              />
              <div className="mt-[57px] w-max animate-[rotate_45s_linear_infinite] text-deco leading-none text-wine-light max-phone:hidden">
                ✳
              </div>
            </Reveal>
            <Reveal delay={0.13}>
              <div className="bg-paper p-[37px] text-plum-soft max-phone:p-[25px]">
                <div
                  className={`${mono} flex justify-between border-b border-line pb-[22px] text-2xs text-mauve`}
                >
                  <span>A LITTLE NOTE TO ME</span>
                  <span className="text-4xl">✦</span>
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
