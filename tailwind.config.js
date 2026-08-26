/** Tailwind config for Pringle Info — used by `tailwind.source.css` to build `tailwind.css`. */
module.exports = {
    darkMode: "class",
    content: ["./index.html"],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#C1292E",
                    dark: "#9E1E22",
                    light: "#E8B4B0",
                },
            },
            fontFamily: {
                sans: [
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
