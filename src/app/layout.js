// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Baby Store",
  description: "Your one-stop shop for baby products",
  openGraph: {
    title: "Baby Store",
    description: "Your one-stop shop for baby products",
    images: [
      {
        // Use an absolute URL; put default-og.jpg in public/
        url: `${SITE}/default-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Baby Store preview",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
