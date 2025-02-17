// src/app/layout.tsx
import React from 'react';
import './globals.css';  // Đảm bảo rằng bạn nhập CSS toàn cục

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body> {/* Trang con sẽ được hiển thị ở đây */}
    </html>
  );
};

export default Layout;