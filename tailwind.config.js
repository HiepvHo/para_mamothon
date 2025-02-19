module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{html,js,jsx,css,ts,tsx}', 
  ],
  theme: {
    extend: {
      textColor: {
        'foreground': 'var(--foreground)',  // Sử dụng CSS variables
      },
      backgroundColor: {
        'background': 'var(--background)',  // Sử dụng CSS variables
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      gradientColorStops: {
        'gradient-start': 'var(--gradient-start)',
        'gradient-middle': 'var(--gradient-middle)',
        'gradient-end': 'var(--gradient-end)',
      }
    },
  },
  plugins: [],
}