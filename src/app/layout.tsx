// layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "./css/style.css"

export const metadata: Metadata = {
  title: "Para Mini-App",
  description: "A wallet management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Sans&family=Geist+Mono&display=swap"
        />
      </head>
      <body className="font-geistsans antialiased">
        {children}
      </body>
    </html>
  );
}
