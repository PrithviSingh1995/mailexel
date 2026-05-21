import type { Metadata } from "next";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
