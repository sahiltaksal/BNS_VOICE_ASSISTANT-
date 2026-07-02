/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F2E9",
        ink: "#1B2A4A",
        coral: {
          DEFAULT: "#E8734A",
          light: "#F2A07C",
          dark: "#C85A34",
        },
        lagoon: {
          DEFAULT: "#1F6F78",
          light: "#3C8F98",
          dark: "#164F56",
        },
        sand: "#EDE4D3",
        line: "#D8CDB4",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        perforate:
          "radial-gradient(circle, transparent 4px, #F7F2E9 4.5px)",
      },
      boxShadow: {
        ticket: "0 8px 30px -8px rgba(27,42,74,0.25)",
      },
      keyframes: {
        pulseWave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        wave1: "pulseWave 1s ease-in-out infinite",
        wave2: "pulseWave 1s ease-in-out infinite 0.15s",
        wave3: "pulseWave 1s ease-in-out infinite 0.3s",
        wave4: "pulseWave 1s ease-in-out infinite 0.45s",
        floatSlow: "floatSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
