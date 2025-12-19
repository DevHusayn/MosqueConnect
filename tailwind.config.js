module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Urbanist', 'Inter', 'Segoe UI', 'Arial', 'sans-serif'],
            },
            colors: {
                base: {
                    DEFAULT: '#F7F7F4', // warm off-white
                    sand: '#ECEBE6',    // light sand gray
                },
                emerald: {
                    DEFAULT: '#0F3D2E', // deep emerald green
                },
                gold: {
                    DEFAULT: '#C8A951', // muted gold
                },
                olive: {
                    DEFAULT: '#6B8E6E', // soft olive green
                },
                text: {
                    DEFAULT: '#1F1F1F', // primary text
                    secondary: '#555555',
                    muted: '#7A7A7A',
                },
                white: '#FFFFFF',
                error: '#ef4444',
                success: '#22c55e',
                warning: '#f59e42',
            },
            borderRadius: {
                xl: '0.75rem',
                '2xl': '1.25rem',
                full: '9999px',
            },
            boxShadow: {
                card: '0 2px 8px 0 rgba(60,60,60,0.06)',
            },
        },
    },
    plugins: [],
};
