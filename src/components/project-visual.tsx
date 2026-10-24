import Image from "next/image";

export function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "loan-calculator")
    return (
      <div className="project-art shot-art">
        <Image
          src="/projects/loan-calculator.png"
          alt="Zrzut ekranu kalkulatora kredytowego"
          fill
          unoptimized
          sizes="(max-width: 700px) 100vw, 50vw"
        />
      </div>
    );
  if (kind === "brewing")
    return (
      <div className="project-art shot-art">
        <Image
          src="/projects/brewing-beer-app.png"
          alt="Zrzut ekranu aplikacji Brewing Beer App"
          fill
          unoptimized
          sizes="(max-width: 700px) 100vw, 50vw"
        />
      </div>
    );
  return (
    <div className="project-art shot-art">
      <Image
        src="/projects/chapterly.png"
        alt="Zrzut ekranu aplikacji Chapterly"
        fill
        unoptimized
        sizes="(max-width: 700px) 100vw, 50vw"
      />
    </div>
  );
}
