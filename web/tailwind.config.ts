import daisyui from "daisyui";
import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  plugins: [
    // @ts-ignore: npm import
    daisyui,
  ],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;
