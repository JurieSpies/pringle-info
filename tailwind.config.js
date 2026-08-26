/** Tailwind config for Overstrand Lifeline — used by `tailwind.source.css` to build `tailwind.css`.
    Design system: Notion-inspired (see DESIGN.md) — warm paper canvas, near-black ink type,
    hairline borders, one blue accent for chrome. Crisis red is reserved strictly for
    emergency call actions (lifeline tiles, dial buttons, first-aid). */
module.exports = {
    darkMode: "class",
    content: ["./index.html"],
    theme: {
        extend: {
            colors: {
                paper: "#f6f5f4", // warm paper canvas (Notion canvas-soft)
                ink: {
                    DEFAULT: "#12100e", // near-black warm ink
                    soft: "#31302e", // warm charcoal
                    muted: "#615d59", // stone
                    faint: "#a39e98", // ash
                },
                hairline: "#e6e6e6", // 1px borders & dividers
                primary: {
                    DEFAULT: "#0075de", // Notion blue — chrome accent (links, search, install)
                    dark: "#005bab", // pressed state
                    light: "#7db8f7", // blue on dark surfaces
                    soft: "#e8f1fb", // pale blue wash
                },
                crisis: {
                    DEFAULT: "#C1292E", // emergency red — lifelines & dial actions only
                    dark: "#9E1E22",
                    light: "#E8B4B0",
                },
            },
            fontFamily: {
                display: [
                    "'Space Grotesk'",
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                ],
                sans: [
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                ],
            },
        },
    },
    plugins: [],
};
