import edaptLogo from "@/assets/partners/edapt.png";
import fkcLogo from "@/assets/partners/fkc.png";
import manoramaLogo from "@/assets/partners/manorama.png";

export type Mentor = {
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
};

export const programConfig = {
  siteUrl: "https://onemillionaisuperstars-seniorpathway.lovable.app",
  siteName: "1 Million AI Superstars",
  registrationUrl: "https://learn.edapt.me/web/checkout/6a1ff9235736ad4a98d25b84",
  batch: {
    batchName: "Batch 9",
    startDate: "12 Aug 2026",
    endDate: "12 Aug 2026",
    displayRange: "12 August 2026",
    displayStart: "12 August 2026",
    classTime: "06:30 PM",
    sessions: 10,
    language: "Malayalam",
  },

  certificate: {
    title: "Official Completion Certificate",
    issuedBy: "Edapt Learning Technologies",
    passMark: "75% in the final MCQ exam",
    recordingAccess: "1-year access to all class recordings",
  },
  contact: {
    phone: "+91 81380 10166",
    phoneHref: "tel:+918138010166",
    whatsappNumber: "918138010166",
    whatsappUrl: "https://wa.me/918138010166",
    // Placeholder — official support email to be provided.
    email: "info@1millionaisuperstars.com",
    adminEmail: "edapt.me@gmail.com",
  },
  social: {
    instagram: "https://www.instagram.com/1m_ai_superstars/",
    facebook: "https://www.facebook.com/1Millon.AI.Superstars/",
  },
  partners: [
    { name: "Edapt", logoUrl: edaptLogo },
    { name: "Future Knowledge Collective", logoUrl: fkcLogo },
    { name: "Malayala Manorama", logoUrl: manoramaLogo },
  ],
  // Populated as mentor profiles are confirmed.
  mentors: [] as Mentor[],
  projectCategories: [
    "All",
    "AI Website",
    "Dashboard",
    "Automation",
    "Content",
    "Chatbot",
  ] as const,
  nav: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Student Projects", to: "/projects" },
    { label: "Contact", to: "/contact" },
  ] as const,
  faqs: [
    {
      q: "Do I need coding knowledge to join?",
      a: "Absolutely not. This program is built for complete beginners. You'll only use no-code tools with simple point-and-click interfaces.",
    },
    {
      q: "Is this suitable for beginners?",
      a: "Yes. We start from zero, assuming no prior tech background, and build your skills gradually across 10 live sessions.",
    },
    {
      q: "Will class recordings be available?",
      a: "Yes. Every session is recorded and you get 1-year access to all recordings inside your dashboard.",
    },
    {
      q: "Will I receive a certificate?",
      a: "Yes. After passing the final MCQ exam (75% pass mark, unlimited attempts), you receive an official digital certificate.",
    },
    {
      q: "What if I miss a live class?",
      a: "No problem, the full recording is uploaded to your dashboard within hours, and you have 1 year to watch it.",
    },
    {
      q: "Is there any refund?",
      a: "We follow a strict no-refund policy. Please review the program details carefully before registering.",
    },
  ],
};
