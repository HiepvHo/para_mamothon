// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // Đảm bảo rằng Tailwind CSS được khai báo ở đây
    autoprefixer: {}, // Autoprefixer hỗ trợ tự động thêm tiền tố CSS
  },
};
