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
    <div className="project-art bloom-art">
      <div className="bloom-top">
        bloom<span>ANALYTICS / OVERVIEW</span>◈
      </div>
      <div className="bloom-hero">
        A clearer view
        <br />
        <em>of what grows.</em>
      </div>
      <div className="bloom-panels">
        <div>
          <small>ACTIVE USERS</small>
          <strong>24.8k</strong>
          <span>↗ +12.4%</span>
        </div>
        <div className="bloom-bars">
          {[32, 57, 44, 76, 61, 86, 70, 94, 78, 100].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
