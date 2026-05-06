import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio — macOS",
  description: "A macOS-inspired developer portfolio",
  icons: {
    icon: "/icons/about-me.jpg",
    apple: "/icons/about-me.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
