import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "var(--border)",
                card: "var(--card)",
                "card-foreground": "var(--card-foreground)",
                primary: {
                    DEFAULT: "#3b82f6",
                    hover: "#2563eb",
                },
                dark: {
                    900: "#09090b",
                    800: "#18181b",
                    700: "#27272a",
                },
            },
            animation: {
                "glow-pulse": "glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "fade-in": "fade-in 0.5s ease-out forwards",
            },
            keyframes: {
                "glow-pulse": {
                    "0%, 100%": { opacity: "1", transform: "scale(1)" },
                    "50%": { opacity: "0.7", transform: "scale(1.05)" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
