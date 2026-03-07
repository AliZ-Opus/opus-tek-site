/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "opus-red": "#FF0000",
        "opus-dark": "#050505",
      },
      spacing: {
        "overlap-force": "150px",
      },
      fontSize: {
        "display-hero": "clamp(2.75rem, 5vw, 5.5rem)",
      },
      lineHeight: {
        tightest: "0.98",
      },
      letterSpacing: {
        authority: "-0.03em",
      },
    },
  },
  plugins: [],
};
