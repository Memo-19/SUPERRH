import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUPERRH — Plateforme ATS Intelligente",
  description: "Recrutez les meilleurs talents grâce à l'Intelligence Artificielle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body className="dark:bg-[#060d13] bg-[#f0f6fa] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
