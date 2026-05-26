import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MailExel — Email Viewer, Converter, Migration & Backup Software",
  description:
    "The ultimate email management suite. View, convert, migrate, and backup PST, MBOX, EML, MSG, OST and 150+ email formats. Trusted by 500,000+ IT professionals.",
  keywords: [
    "email converter",
    "PST to MBOX",
    "email migration",
    "email backup",
    "email viewer",
    "PST viewer",
    "MBOX converter",
    "Outlook migration",
    "email forensics",
  ],
  openGraph: {
    title: "MailExel — Email Management Suite",
    description: "View, convert, migrate, and backup 150+ email formats. Zero data loss.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
