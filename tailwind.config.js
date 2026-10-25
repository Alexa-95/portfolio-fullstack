/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    // +1px so max-* variants match the old max-width queries exactly (≤700px etc.)
    screens: {
      tiny: "391px",
      phone: "701px",
      tablet: "1001px",
    },
    // Replaces Tailwind's default scale: names map to this site's sizes, not
    // Tailwind's (here text-sm is 12px). Sizes only, no line-height.
    fontSize: {
      "3xs": "9px",
      "2xs": "10px",
      xs: "11px",
      sm: "12px",
      md: "13px",
      base: "14px",
      lg: "15px",
      xl: "16px",
      "2xl": "17px",
      "3xl": "18px",
      "4xl": "19px",
      "5xl": "21px",
      "6xl": "22px",
      "7xl": "23px",
      "8xl": "24px",
      "9xl": "28px",
      "skill-sm": "30px",
      skill: "35px",
      row: "36px",
      glyph: "46px",
      spark: "47px",
      symbol: "48px",
      card: "55px",
      deco: "120px",
      "deco-xl": "210px",
      // Fluid headings
      "hero-xs": "64px",
      hero: "clamp(76px, 8.7vw, 138px)",
      "hero-tablet": "clamp(70px, 9vw, 106px)",
      "hero-phone": "clamp(68px, 15vw, 100px)",
      section: "clamp(58px, 6vw, 87px)",
      "section-phone": "clamp(54px, 11vw, 80px)",
      contact: "clamp(66px, 7vw, 98px)",
      "contact-phone": "clamp(65px, 12vw, 92px)",
      project: "clamp(76px, 9vw, 140px)",
      "project-phone": "clamp(64px, 17vw, 100px)",
      next: "clamp(54px, 6vw, 87px)",
    },
    extend: {
      colors: {
        ivory: "#faf6f2",
        paper: "#fffaf7",
        ink: "#292229",
        muted: "#78656c",
        cream: "#fff6f5",
        blush: {
          DEFAULT: "#f2dde3",
          light: "#f4e6e9",
          dark: "#e5cbd1",
        },
        rose: {
          DEFAULT: "#c78fa2",
          muted: "#b88fa0",
          dark: "#ba7d95",
          pale: "#e9bfcf",
        },
        wine: {
          DEFAULT: "#742f4b",
          light: "#a35c78",
          dark: "#54283b",
          deep: "#5b233a",
        },
        plum: {
          DEFAULT: "#4d2939",
          light: "#552d3d",
          soft: "#4f3440",
          muted: "#704456",
        },
        mauve: {
          DEFAULT: "#966478",
          dark: "#785364",
          deep: "#76495c",
        },
        taupe: {
          DEFAULT: "#9b7682",
          light: "#aa9099",
          gray: "#9b828b",
          dark: "#846e76",
        },
        line: {
          DEFAULT: "#e7d8d9",
          rose: "#e3cbd1",
          strong: "#d6bdc6",
          wine: "#cc92a6",
        },
        // Light pinks on the wine background
        petal: {
          DEFAULT: "#edc9d5",
          bright: "#f2c0d1",
          deep: "#e8b6c9",
        },
        success: { DEFAULT: "#315d3b", bg: "#e6f1e5" },
        error: { DEFAULT: "#873a43", bg: "#fae9e9" },
        // Hero / about illustrations
        art: {
          core: "#f2ced0",
          stem: "#a9607e",
          glyph: "#995c75",
          stroke: "#fff7ef",
        },
      },
      // next/font variables are set on <html> in layout.tsx
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
