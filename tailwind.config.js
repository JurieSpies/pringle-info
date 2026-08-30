/** Tailwind config for Overstrand Lifeline — used by `tailwind.source.css` to build `tailwind.css`.
    Design system: The Shore (see DESIGN.md) — warm sand canvas (#F5F2EC), near-black ink (#26221B),
    hairline borders, sage-teal chrome accent (#2E6E62). Crisis red is reserved strictly for
    emergency call actions (lifeline tiles, dial buttons, first-aid). */
module.exports = {
    darkMode: "class",
    content: ["./index.html"],
    theme: {
        extend: {
            colors: {
                paper: "#F5F2EC", // warm sand canvas
                ink: {
                    DEFAULT: "#26221B", // warm near-black
                    soft: "#4A453B", // warm charcoal
                    muted: "#6E685A", // stone
                    faint: "#A39B8B", // ash (decorative only)
                },
                hairline: "#E4DCCB", // warm hairline dividers
                primary: {
                    DEFAULT: "#2E6E62", // sage-teal — chrome accent (links, search, area, install, mail/nav)
                    dark: "#22544B", // pressed state
                    light: "#7FBFB2", // teal on dark surfaces
                    soft: "#E6EFEC", // pale teal wash
                },
                crisis: {
                    DEFAULT: "#C1292E", // emergency red — lifelines & dial actions only
                    dark: "#9E1E22",
                    light: "#E8B4B0",
                },
            },
            fontFamily: {
                display: ["'Fraunces'", "Georgia", "serif"],
                sans: [
                    "'Instrument Sans'",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                ],
                num: ["'Space Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
            },
        },
    },
    plugins: [],
};
