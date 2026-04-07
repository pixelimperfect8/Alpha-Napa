import type { Metadata } from "next";
import { Outfit, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alpha School — Napa Valley",
  description:
    "A group of Napa Valley families are exploring bringing Alpha School to our community. We're gathering interest — join us.",
  metadataBase: new URL("https://alphanapa.org"),
  openGraph: {
    title: "Alpha School — Napa Valley",
    description:
      "Built for the world they're growing into. A group of Napa Valley families exploring bringing Alpha School to our community.",
    siteName: "Alpha School Napa Valley",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha School — Napa Valley",
    description:
      "Built for the world they're growing into. A group of Napa Valley families exploring bringing Alpha School to our community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${spaceMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
