// Tailwind class sets shared across components. Keep these free of anything
// a call site overrides (sizes, colors, margins): without tailwind-merge the
// winner of two conflicting utilities depends on CSS order, not class order.

export const container =
  "mx-auto w-[min(1160px,calc(100%_-_88px))] max-tablet:w-[min(100%_-_52px,900px)] max-phone:w-[calc(100%_-_40px)]";

export const sectionPad = "py-[125px] max-phone:py-20";

export const mono = "font-mono tracking-[0.07em]";

export const heading = "font-display leading-[0.98] tracking-[-0.042em]";

// Section h2 shared by Work, About, Toolkit and Approach.
export const sectionHeading = `${heading} text-plum text-section max-phone:text-section-phone`;

export const button =
  "inline-flex items-center gap-[30px] rounded-full px-[25px] py-[17px] text-sm font-bold transition duration-[250ms] hover:-translate-y-[3px] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 max-tiny:gap-[13px] max-tiny:px-[18px] max-tiny:py-[15px]";

export const buttonDark = `${button} bg-wine text-white hover:bg-wine-dark`;

export const textLink =
  "flex items-center gap-3 text-sm font-bold hover:text-rose";

export const navContact =
  "flex items-center gap-[15px] rounded-full border border-line-strong px-[19px] py-[13px] transition-colors duration-200 hover:bg-blush";

export const projectMeta = `${mono} flex justify-between text-2xs text-mauve`;

export const titleStar =
  "ml-2.5 align-top font-sans leading-[normal] text-rose";

export const tags = "flex flex-wrap gap-2";

export const tag =
  "rounded-full border border-line-rose px-3 py-2 font-mono text-2xs text-mauve-dark";

export const projectLinks =
  "mt-[18px] flex gap-[18px] text-sm text-wine underline";
