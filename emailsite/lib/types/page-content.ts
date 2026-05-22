export interface HeroContent {
  badge: string;
  ratingLabel: string;
  titleLine1: string;
  titleLine2: string;
  titleSub: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  trustItems: string[];
  stats: { val: string; label: string }[];
  floatingStatVal: string;
  floatingStatLabel: string;
  formatBadges: string[];
  appWindowTitle: string;
}

export interface FeatureCard {
  title: string;
  badge: string;
  desc: string;
  items: string[];
}

export interface FeaturesContent {
  label: string;
  title1: string;
  title2: string;
  description: string;
  features: FeatureCard[];
  stats: { stat: string; label: string }[];
  bottomText: string;
  bottomCtaText: string;
  bottomCtaHref: string;
}

export interface HowItWorksStep {
  title: string;
  desc: string;
}

export interface HowItWorksContent {
  label: string;
  title1: string;
  title2: string;
  description: string;
  steps: HowItWorksStep[];
}

export interface DownloadCtaContent {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  features: string[];
  versionText: string;
}

export interface EtherealCtaContent {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  stats: { val: string; label: string }[];
  trustText: string;
}

export interface FaqItem {
  title: string;
  subtitle: string;
  content: string;
}

export interface FaqContent {
  label: string;
  title1: string;
  title2: string;
  ctaTitle: string;
  ctaDesc: string;
  items: FaqItem[];
}

export interface FooterLink { text: string; url: string }
export interface FooterMenuItem { title: string; links: FooterLink[] }

export interface FooterContent {
  brandDescription: string;
  brandSubtext: string;
  menuItems: FooterMenuItem[];
  bottomLinks: FooterLink[];
}

export interface NavLink {
  label: string;
  href: string;
  dropdown?: string[];
}

export interface NavContent {
  links: NavLink[];
  ctaText: string;
  ctaHref: string;
  signInText: string;
  signInHref: string;
}

export interface GlobalContent {
  nav: NavContent;
  footer: FooterContent;
}

export interface HomePageContent {
  hero: HeroContent;
  features: FeaturesContent;
  howItWorks: HowItWorksContent;
  downloadCta: DownloadCtaContent;
  etherealCta: EtherealCtaContent;
  faq: FaqContent;
}

export const defaultHomeContent: HomePageContent = {
  hero: {
    badge: "4.8/5 · 1,842 Reviews",
    ratingLabel: "#1 Tool",
    titleLine1: "The Complete",
    titleLine2: "Email Suite",
    titleSub: "for Windows",
    description: "Convert, migrate, backup and view emails from PST, MBOX, EML, MSG, OST and 50+ formats. 100% offline. No Outlook needed.",
    primaryCtaText: "Free Download",
    primaryCtaHref: "#download",
    secondaryCtaText: "See How It Works",
    secondaryCtaHref: "#how-it-works",
    trustItems: ["Virus & Ad Free", "No Credit Card Required", "Windows 7–11"],
    stats: [
      { val: "500K+", label: "Customers Worldwide" },
      { val: "50+", label: "File Formats Supported" },
      { val: "100%", label: "Data Accuracy" },
      { val: "4.8★", label: "User Rating" },
    ],
    floatingStatVal: "10M+",
    floatingStatLabel: "Emails Processed",
    formatBadges: ["PST", "MBOX", "EML", "OST", "MSG", "NSF"],
    appWindowTitle: "MailExel — Email Converter & Migration Tool v9.2",
  },
  features: {
    label: "All-in-One Email Suite",
    title1: "Four tools.",
    title2: "One software.",
    description: "Convert, migrate, backup and view emails — everything you need in a single offline Windows application built for IT professionals and everyday users.",
    features: [
      {
        title: "Email Converter",
        badge: "Core Tool",
        desc: "Convert emails between PST, MBOX, EML, MSG, OST and 50+ formats with full metadata, folder structure and attachment integrity preserved.",
        items: ["PST → MBOX / EML / MSG / PDF", "Batch convert unlimited files", "Preserve folder hierarchy", "100% metadata accuracy"],
      },
      {
        title: "Email Migration",
        badge: "Cloud Ready",
        desc: "Migrate entire mailboxes to Office 365, Gmail, Yahoo, Zoho, Thunderbird or Exchange Server — directly, with zero downtime.",
        items: ["Office 365 ↔ Gmail ↔ Exchange", "IMAP to IMAP migration", "Selective folder migration", "Delta sync & scheduling"],
      },
      {
        title: "Email Backup",
        badge: "Secure",
        desc: "Schedule AES-256 encrypted incremental backups of your entire mailbox. Restore any individual email or full folder in seconds.",
        items: ["Automated scheduled backup", "AES-256 encryption", "Incremental — saves bandwidth", "One-click restore"],
      },
      {
        title: "Email Viewer",
        badge: "Free",
        desc: "Open and preview PST, OST, MBOX, EML, MSG and 50+ formats instantly — no Outlook installation or email client required.",
        items: ["No Outlook required", "Full attachment preview", "Advanced search & filtering", "Export before converting"],
      },
    ],
    stats: [
      { stat: "50+", label: "Supported Formats" },
      { stat: "10K+", label: "Emails per Minute" },
      { stat: "100%", label: "Data Accuracy" },
      { stat: "500K+", label: "Users Worldwide" },
    ],
    bottomText: "Works entirely offline on Windows 7, 8, 10 & 11. No cloud. No subscription. Just install and run.",
    bottomCtaText: "Download Free Trial",
    bottomCtaHref: "#download",
  },
  howItWorks: {
    label: "How It Works",
    title1: "Up and running in",
    title2: "3 simple steps",
    description: "No technical expertise required. A clean graphical interface designed for IT professionals and non-technical users alike.",
    steps: [
      {
        title: "Load Your Email Source",
        desc: "Select PST, MBOX, EML, MSG, OST or NSF files via drag & drop, or connect directly to Gmail, Outlook, Office 365, Exchange or any IMAP server.",
      },
      {
        title: "Configure Your Options",
        desc: "Choose your target format or destination. Apply date range, folder, sender or subject filters. Set encryption, scheduling and naming options.",
      },
      {
        title: "Convert & Deliver Instantly",
        desc: "MailExel processes at 10,000+ emails per minute. Get a full conversion report, download your files, or auto-deliver to your destination server.",
      },
    ],
  },
  downloadCta: {
    badge: "#1 Email Management Software",
    title1: "Start Managing Emails",
    title2: "for Free",
    description: "Download MailExel free — no credit card required. Full-featured trial. Works on Windows 7, 8, 10 & 11.",
    features: ["No Credit Card", "Virus & Ad Free", "Windows 7–11", "24/7 Support"],
    versionText: "Windows · 5.8 MB · v9.2.1 · Electronic Delivery · English",
  },
  etherealCta: {
    badge: "Rated #1 Email Management Tool · 500,000+ Users",
    title1: "Your email data.",
    title2: "Fully in control.",
    description: "Convert, migrate, backup and view emails from any format — with zero data loss, complete offline privacy, and enterprise-grade encryption.",
    primaryCtaText: "Download Free Trial",
    primaryCtaHref: "#download",
    secondaryCtaText: "View Pricing",
    secondaryCtaHref: "#pricing",
    stats: [
      { val: "500K+", label: "Users" },
      { val: "50+", label: "Formats" },
      { val: "4.8", label: "Rating" },
    ],
    trustText: "100% offline · no cloud · AES-256 encrypted · Windows 7–11",
  },
  faq: {
    label: "FAQ",
    title1: "Frequently asked",
    title2: "questions",
    ctaTitle: "Still have questions?",
    ctaDesc: "Our expert support team is available Monday–Friday, 9am–6pm EST.",
    items: [
      {
        title: "What email formats does MailExel support?",
        subtitle: "PST, MBOX, EML, MSG, OST, NSF and 50+ more",
        content: "MailExel supports 50+ email formats including PST, OST, MBOX, EML, MSG, EMLX, MBX, DBX, TBB, NSF and many more. Export targets include PDF, HTML, RTF, TXT and CSV documents, plus direct delivery to cloud platforms like Gmail, Office 365, Exchange, Yahoo, Zoho, IMAP and POP3.",
      },
      {
        title: "Do I need Outlook installed to open PST or OST files?",
        subtitle: "No — completely standalone, no dependencies",
        content: "No. MailExel opens PST, OST and all supported formats independently — no Outlook, no Exchange, no email client required. This makes it ideal for forensic analysis, migration projects and archival work on any Windows 7–11 machine.",
      },
      {
        title: "How fast is the conversion and migration?",
        subtitle: "10,000+ emails processed per minute",
        content: "MailExel's multi-threaded engine processes 10,000+ emails per minute depending on your hardware. A typical 10GB PST file with 50,000 emails converts in under 5 minutes. Batch processing handles unlimited files simultaneously with no slowdown.",
      },
      {
        title: "Is my data secure? Does anything get uploaded to the cloud?",
        subtitle: "100% offline — nothing ever leaves your machine",
        content: "Your data never leaves your machine. MailExel is a fully offline desktop application — no files, emails or metadata are uploaded anywhere. AES-256 encryption is available for all backup files. Works completely without an internet connection after installation.",
      },
      {
        title: "Can I migrate directly between email servers?",
        subtitle: "Office 365, Gmail, Exchange, IMAP and more",
        content: "Yes. The Migration module supports direct server-to-server migration between Office 365, Gmail, Exchange, IMAP and POP3. Delta sync transfers only emails added since the last sync, saving time and bandwidth. Selective folder migration lets you choose exactly what moves.",
      },
      {
        title: "Does MailExel work on Windows 10 and 11?",
        subtitle: "Supports Windows 7, 8, 10 and 11 (32 & 64-bit)",
        content: "Yes. MailExel is fully compatible with Windows 7, 8, 10 and 11 on both 32-bit and 64-bit systems. No additional runtime or framework is required. The free trial lets you process up to 25 emails per file with no time limit and no credit card.",
      },
      {
        title: "What support options are available?",
        subtitle: "Email, chat and phone support available",
        content: "Free users get community forum access. The Professional plan includes email support with 24-hour response times. The Enterprise plan adds priority phone and live chat support plus a dedicated account manager available Monday–Friday.",
      },
    ],
  },
};

const defaultFooterContent: FooterContent = {
  brandDescription: "The complete email conversion, migration, backup and viewer suite for Windows.",
  brandSubtext: "Trusted by 500,000+ IT professionals, forensic analysts, and legal teams worldwide.",
  menuItems: [
    { title: "Popular Solutions", links: [
      { text: "PST to MBOX Converter", url: "#" },
      { text: "MBOX to PST Converter", url: "#" },
      { text: "PST to PDF Converter", url: "#" },
      { text: "EML to MSG Converter", url: "#" },
      { text: "OST to PST Converter", url: "#" },
    ]},
    { title: "Technology", links: [
      { text: "Email Converter", url: "#" },
      { text: "Email Migration", url: "#" },
      { text: "Email Backup", url: "#" },
      { text: "Email Viewer", url: "#" },
      { text: "Batch Processor", url: "#" },
    ]},
    { title: "Company", links: [
      { text: "About Us", url: "#" },
      { text: "Blog", url: "#" },
      { text: "Press Kit", url: "#" },
      { text: "Careers", url: "#" },
      { text: "Contact", url: "#" },
    ]},
    { title: "Support", links: [
      { text: "Documentation", url: "#" },
      { text: "Knowledge Base", url: "#" },
      { text: "Video Tutorials", url: "#" },
      { text: "System Requirements", url: "#" },
    ]},
  ],
  bottomLinks: [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
    { text: "GDPR Compliance", url: "#" },
    { text: "Refund Policy", url: "#" },
  ],
};

export const defaultGlobalContent: GlobalContent = {
  nav: {
    links: [
      { label: "Features", href: "#features", dropdown: ["Email Viewer", "Email Converter", "Email Migration", "Email Backup"] },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "#faq" },
    ],
    ctaText: "Free Download",
    ctaHref: "#download",
    signInText: "Sign In",
    signInHref: "#",
  },
  footer: defaultFooterContent,
};
