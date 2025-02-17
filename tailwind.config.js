module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,css}', // Đảm bảo quét các tệp CSS
    './pages/**/*.{js,ts,jsx,tsx}', // Nếu bạn có các trang trong thư mục `pages`
    './components/**/*.{js,ts,jsx,tsx}', // Nếu có thư mục components
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
    },
  },
  plugins: [],
}