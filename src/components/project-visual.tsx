import Image from "next/image";

const shots: Record<string, { src: string; alt: string }> = {
  "loan-calculator": {
    src: "/projects/loan-calculator.png",
    alt: "Zrzut ekranu kalkulatora kredytowego",
  },
  brewing: {
    src: "/projects/brewing-beer-app.png",
    alt: "Zrzut ekranu aplikacji Brewing Beer App",
  },
  chapterly: {
    src: "/projects/chapterly.png",
    alt: "Zrzut ekranu aplikacji Chapterly",
  },
};

// `className` sets the height, which differs between the card and the hero.
export function ProjectVisual({
  kind,
  className,
}: {
  kind: string;
  className: string;
}) {
  const shot = shots[kind] ?? shots.chapterly;
  return (
    <div
      className={`relative overflow-hidden bg-blush-dark transition-transform duration-400 group-hover:-translate-y-1 ${className}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        unoptimized
        sizes="(max-width: 700px) 100vw, 50vw"
        className="object-cover object-left-top"
      />
    </div>
  );
}
