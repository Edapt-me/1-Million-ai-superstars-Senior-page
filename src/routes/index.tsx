import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Video,
  User,
  Globe,
  Zap,
  ShieldCheck,
  Check,
  ChevronDown,
  Phone,
  MessageCircle,
  Award,
  Clock,
  Calendar,
  GraduationCap,
  Briefcase,
  Users,
  Home,
  PenTool,
  Search,
  PlayCircle,
  Info,
  Headset,
  ArrowRight,
} from "lucide-react";
import certificateAsset from "@/assets/1m-ai-superstars-certificate.png";
// Replaced by CMS
// import chatgptLogo from "@/assets/tools/chatgpt.png.asset.json";
// import geminiLogo from "@/assets/tools/gemini-new.png.asset.json";
// import claudeLogo from "@/assets/tools/claude-new.png.asset.json";
// import canvaLogo from "@/assets/tools/canva.jpg.asset.json";
// import notebooklmLogo from "@/assets/tools/notebooklm-new.png.asset.json";

// import flowLogo from "@/assets/tools/flow.png.asset.json";
// import heygenLogo from "@/assets/tools/heygen.png.asset.json";
// import aiStudioLogo from "@/assets/tools/ai-studio-new.png.asset.json";
// import gammaLogo from "@/assets/tools/gamma.png.asset.json";
import edaptLogo from "@/assets/partners/edapt.png";
import fkcLogo from "@/assets/partners/fkc.png";
import manoramaLogo from "@/assets/partners/manorama.png";
import { programConfig } from "@/lib/programConfig";
import { getWebsiteSettings, getPublishedCurriculum, getPublishedFAQs, getPublishedAITools } from "@/lib/cms";
import { optimizedImage } from "@/services/media";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "1 Million AI Superstars | Learn AI in Simple Malayalam" },
      {
        name: "description",
        content:
          "Live AI training in Malayalam. 10 live classes, 15+ AI tools, official certificate & 1-year recording access. Register today.",
      },
    ],
  }),
});

function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left gradient-bg"
        aria-hidden
      />

      <main>
        <Hero />
        <AboutSection />
        <InitiativeBySection />
        <CertificateSection />
        <CurriculumSection />
        <CurriculumUpdateNotice />
        <ToolsSection />
        <ProgramSection />
        <WhyJoinSection />
        <WhoCanJoinSection />
        <ContactSection />
        <FinalCTA />
        <FAQSection />
      </main>

      <a
        href={regUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-cta-float fixed left-1/2 z-50 inline-flex items-center justify-center rounded-full gradient-bg px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(31,10,119,0.55)] backdrop-blur-sm md:hidden"
        style={{
          bottom: "calc(20px + env(safe-area-inset-bottom))",
          width: "25vw",
          minWidth: "140px",
          maxWidth: "220px",
          transform: "translateX(-50%)",
        }}
      >
        Register
      </a>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;
  const badgesStr = settings?.hero_badge || "10 Live Sessions · Malayalam · Certificate";
  const badges = [
    "Live Classes",
    "Malayalam",
    "Practical Learning",
    "Certificate",
    "1-Year Recording Access",
  ];

  return (
    <section id="hero" className="hero-bg relative overflow-hidden pt-20 sm:pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(31,10,119,0.22),transparent_70%)] blur-2xl will-change-transform md:blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(75,45,214,0.22),transparent_70%)] blur-2xl will-change-transform md:blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center md:block md:text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-[13px] font-semibold text-primary shadow-sm backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {badgesStr}
            </motion.div>
          </div>

          <div className="text-left md:text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-balance text-[42px] font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.08] lg:text-[64px]"
            >
              {settings?.hero_title ? (
                settings.hero_title
              ) : (
                <>
                  Learn Artificial Intelligence in{" "}
                  <span className="gradient-text">Simple Malayalam</span>
                </>
              )}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-7 max-w-2xl text-pretty text-[18px] font-normal leading-relaxed text-muted-foreground sm:text-[19px] md:mx-auto md:mt-8 md:text-[21px] prose prose-lg prose-p:my-0 prose-headings:my-0 max-w-none prose-a:text-primary text-left md:text-center"
              dangerouslySetInnerHTML={{
                __html: settings?.hero_subtitle ||
                  "<p>Whether you are an employee, business owner, teacher, homemaker or beginner, this program helps you confidently use AI in your daily life and work.</p>",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center justify-start gap-2.5 md:mt-10 md:justify-center"
            >
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/85 px-3.5 py-2 text-[13px] font-medium text-foreground shadow-sm backdrop-blur"
                >
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {b}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 flex flex-col flex-wrap items-stretch justify-start gap-3 sm:flex-row sm:items-center sm:justify-center md:mt-12 md:gap-4"
            >
              <a
                href={regUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex h-14 items-center justify-center rounded-full px-6 text-[16px] font-semibold sm:min-w-[200px] sm:px-8 sm:text-[17px]"
              >
                {settings?.hero_primary_button_text || "Register Now"}
              </a>
              <a
                href="#curriculum"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-white/85 px-6 text-[16px] font-semibold text-foreground backdrop-blur transition-all hover:border-primary hover:text-primary sm:min-w-[200px] sm:px-8 sm:text-[17px]"
              >
                <PlayCircle className="h-5 w-5" />
                {settings?.hero_secondary_button_text || "View Curriculum"}
              </a>
              <Link
                to="/projects"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-white/85 px-6 text-[16px] font-semibold text-foreground backdrop-blur transition-all hover:border-primary hover:text-primary sm:min-w-[200px] sm:px-8 sm:text-[17px]"
              >
                <Briefcase className="h-5 w-5" />
                Student Projects
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 flex flex-col flex-wrap items-start justify-start gap-3 text-[13px] text-muted-foreground sm:flex-row sm:gap-6 md:mt-14 md:items-center md:justify-center"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Official Digital Certificate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PlayCircle className="h-4 w-4 text-primary" />
                <span>1-Year Recording Access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span>{settings?.hero_trust_counter || "5000+ Students"}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Initiative By ---------- */
const PARTNERS = [
  { name: "Edapt", logo: edaptLogo, maxH: 44 },
  { name: "Future Knowledge Collective", logo: fkcLogo, maxH: 56 },
  { name: "Malayala Manorama", logo: manoramaLogo, maxH: 36 },
];

function InitiativeBySection() {
  return (
    <section
      id="initiative-by"
      className="relative border-t border-border/60 bg-white py-12 md:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Initiative By
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14 md:gap-x-20">
              {PARTNERS.map((p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={p.logo}
                    alt={`${p.name} logo`}
                    loading="lazy"
                    style={{ maxHeight: p.maxH, width: "auto", height: "auto", maxWidth: "180px" }}
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-8 flex justify-center md:mt-9"
        >
          <Link
            to="/about"
            className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-[rgba(31,10,119,0.08)] bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#1F0A77] transition-all duration-[250ms] hover:scale-[1.02] hover:bg-[#E6EBFF]"
            aria-label="Learn more about the organizations behind this initiative"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>About the Initiative</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-[250ms] group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Certificate Showcase ---------- */
function CertificateSection() {
  return (
    <section id="certificate" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Certification"
          title="Official Course Completion Certificate"
          subtitle="Complete the program successfully and receive an official digital certificate after passing the final assessment."
        />

        <FadeIn delay={0.1}>
          <div className="relative mt-10">
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-4xl">
              <div className="absolute inset-x-8 top-10 h-full rounded-[40px] bg-[radial-gradient(60%_80%_at_50%_20%,rgba(75,45,214,0.18),transparent_70%)] blur-2xl" />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="float-cert group mx-auto max-w-4xl"
            >
              <div
                className="relative rounded-[32px] p-4 sm:p-5 md:p-6"
                style={{
                  background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)",
                  boxShadow:
                    "0 30px 80px -20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.6)",
                }}
              >
                <div className="overflow-hidden rounded-[20px] border border-black/60 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                  <img
                    src={certificateAsset}
                    alt="Sample Certificate of Completion"
                    width={2000}
                    height={1414}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function AboutSection() {
  return (
    <section id="about" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="glass-card gradient-border-hover rounded-3xl p-8 md:p-14">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full gradient-bg px-3.5 py-1.5 text-[12px] font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Why AI, Why Now
            </div>
            <div
              className="space-y-5 text-[18px] leading-relaxed text-foreground md:text-[20px]"
              lang="ml"
            >
              <p>ഇന്ന് ലോകം മുഴുവൻ മാറ്റിമറിച്ചുകൊണ്ടിരിക്കുന്ന സാങ്കേതികവിദ്യയാണ് AI.</p>
              <p>
                വലിയ കമ്പ്യൂട്ടർ അറിവുകളോ വിദ്യാഭ്യാസ യോഗ്യതയോ ഇല്ലാത്ത ഏതൊരു സാധാരണക്കാരനും വളരെ
                ലളിതമായി പഠിച്ചെടുക്കാനും, സ്വന്തം നിത്യജീവിതത്തിൽ ഒരു സഹായിയെപ്പോലെ AI എങ്ങനെ
                ഉപയോഗിക്കാമെന്ന് പഠിപ്പിച്ചു തരുന്ന രീതിയിലാണ് ഈ പദ്ധതി രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്.
              </p>
              <p>
                അടിസ്ഥാന അറിവുകളിൽ നിന്ന് തുടങ്ങി ഓരോ ദിവസം കഴിയുന്തോറും നിങ്ങളെ ഒരു AI Literate
                ആക്കി മാറ്റുന്ന രീതിയിലാണ് പദ്ധതി ഡിസൈൻ ചെയ്തിട്ടുള്ളത്.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Curriculum ---------- */
const DEFAULT_CURRICULUM = [
  {
    week_number: 1,
    title: "Introduction to AI & GenAI",
    description:
      "AI എന്താണെന്ന് വളരെ എളുപ്പത്തിൽ മനസ്സിലാക്കുക. ഭാവിയിലെ മാറ്റങ്ങളെക്കുറിച്ച് അറിയുക.",
  },
  {
    week_number: 2,
    title: "Chatbots as Your Personal Assistant",
    description: "ഗൂഗിളിൽ മണിക്കൂറുകൾ തിരയേണ്ട കാര്യങ്ങൾ മിനിറ്റുകൾക്കുള്ളിൽ കണ്ടെത്തുക.",
  },
  {
    week_number: 3,
    title: "Visual Content Creation & Canva",
    description: "ഡിസൈനർമാരെ ആശ്രയിക്കാതെ സ്വന്തമായി ഫോട്ടോകളും വിഷ്വലുകളും ഉണ്ടാക്കുക.",
  },
];

function CurriculumSection() {
  const { data: dbCurriculum, isLoading } = useQuery({
    queryKey: ["published-curriculum"],
    queryFn: getPublishedCurriculum,
  });

  const [open, setOpen] = useState<number | null>(0);
  const curriculum = dbCurriculum && dbCurriculum.length > 0 ? dbCurriculum : DEFAULT_CURRICULUM;

  return (
    <section
      id="curriculum"
      className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Curriculum"
          title={<>ഈ പദ്ധതിയിലൂടെ നിങ്ങൾ എന്തെല്ലാം പഠിച്ചെടുക്കും?</>}
          malayalamTitle
          subtitle="Live sessions covering practical AI skills you need in daily life & work."
        />

        <div className="relative mt-10">
          <div className="absolute left-4 top-0 h-full w-0.5 gradient-bg md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-6 md:space-y-10">
            {curriculum.map((item, i) => {
              const isOpen = open === i;
              const align = i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]";
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className={`relative pl-12 md:pl-0 ${align}`}>
                    <div className="absolute left-4 top-6 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full gradient-bg text-white shadow-[var(--shadow-glow)] md:left-1/2">
                      <BookOpen className="h-4 w-4" />
                    </div>

                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="glass-card gradient-border-hover group w-full rounded-3xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] md:p-7"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <span className="inline-block rounded-full gradient-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                            Session {item.week_number}
                          </span>
                          <h3 className="mt-3 text-[22px] font-semibold tracking-tight">
                            {item.title}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 grid gap-3">
                              <div className="rounded-2xl border border-border/60 bg-white/80 p-4">
                                <div
                                  className="text-[15px] leading-relaxed text-muted-foreground prose prose-sm prose-p:my-0 prose-headings:my-2 max-w-none prose-a:text-primary"
                                  lang="ml"
                                  dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CurriculumUpdateNotice() {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white pb-8 pt-2 md:pb-12 md:pt-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4 rounded-2xl border-l-4 border-[#1F0A77] bg-[#EEF2FF] p-5 shadow-[var(--shadow-soft)] md:items-center md:gap-5 md:rounded-3xl md:p-6">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1F0A77]/10 text-[#1F0A77] md:h-11 md:w-11">
            <Info className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[#1F0A77] md:text-[18px]">
              Curriculum Update Notice
            </h3>
            <p className="mt-1 text-[14px] leading-relaxed text-[#4B5563] md:text-[15px]">
              AI technology evolves rapidly. To keep this program current and valuable, the syllabus
              may be updated periodically to include the latest AI tools and features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Tools ---------- */
function ToolsSection() {
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["published-ai-tools"],
    queryFn: getPublishedAITools,
  });

  return (
    <section id="tools" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="AI Tools"
          title="പഠിക്കുന്ന പ്രധാന AI Tools"
          malayalamTitle
          subtitle="15+ hands-on tools you'll master through live practical sessions."
        />
        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              Loading tools...
            </div>
          ) : tools.length === 0 ? (
            <div className="flex justify-center py-12 text-[15px] font-medium text-muted-foreground">
              No AI tools available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {tools.map((t, i) => (
                <FadeIn key={t.id} delay={i * 0.03}>
                  <div className="glass-card gradient-border-hover group flex h-full flex-col items-center justify-between rounded-3xl px-5 pb-6 pt-8 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                    <div className="flex h-24 w-full items-center justify-center bg-transparent transition-transform duration-300 ease-out group-hover:scale-[1.08] md:h-28">
                      <img
                        src={optimizedImage(t.tool_logo)}
                        alt={`${t.tool_name} logo`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="mt-5 text-[15px] font-medium text-foreground">{t.tool_name}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Program Specs ---------- */
function ProgramSection() {
  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const SPECS = [
    {
      icon: Calendar,
      label: "Course Date",
      value: settings?.course_start_date || programConfig.batch.displayStart,
    },
    { icon: Clock, label: "Class Time", value: "8:30 PM – 10:00 PM Daily" },
    { icon: GraduationCap, label: "Certificate", value: "Official Digital Certificate" },
    { icon: PlayCircle, label: "Recording Access", value: "1-Year Recorded Class Access" },
  ];

  return (
    <section
      id="program"
      className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Program Details"
          title="Program Specifications"
          subtitle="Everything you need to know at a glance."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.label} delay={i * 0.04}>
                <div className="glass-card gradient-border-hover group h-full rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-bg text-white shadow-[var(--shadow-soft)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                  <div className="text-[20px] font-semibold tracking-tight text-foreground">
                    {s.value}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-12 overflow-hidden rounded-[32px] gradient-bg p-10 text-center text-white shadow-[var(--shadow-glow)] md:p-14">
            <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/80">
              Program Fee
            </div>
            <div className="mt-3 text-5xl font-bold md:text-6xl">
              ₹{settings?.course_fee || "749"}{" "}
              <span className="text-2xl font-medium text-white/80">
                {settings?.course_offer_price || "+ GST"}
              </span>
            </div>
            <p className="mt-4 text-[17px] text-white/85 md:text-lg">
              One-time payment · {settings?.course_duration || "10 sessions"} · 1-year recording
              access
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Why Join ---------- */
const WHY_JOIN = [
  {
    icon: Sparkles,
    title: "Learn AI from Zero",
    body: "No prior technical knowledge is required. Start from the absolute basics.",
  },
  {
    icon: Zap,
    title: "15+ Practical AI Tools",
    body: "Hands-on with the exact tools professionals use every day.",
  },
  {
    icon: MessageCircle,
    title: "Live Interaction",
    body: "Ask questions in real-time during every live session.",
  },
  {
    icon: BookOpen,
    title: "Malayalam Classes",
    body: "Learn in your native language with clear, easy-to-understand explanations.",
  },
  {
    icon: Award,
    title: "Official Certificate",
    body: "Earn a shareable digital certificate on completion.",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Skills",
    body: "Build practical AI skills that remain valuable for your career, business, and everyday life.",
  },
];

function WhyJoinSection() {
  return (
    <section className="relative py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Benefits"
          title="Why Join This Program?"
          subtitle="Six reasons this program transforms the way you live and work with AI."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_JOIN.map((w, i) => {
            const Icon = w.icon;
            return (
              <FadeIn key={w.title} delay={i * 0.05}>
                <div className="glass-card gradient-border-hover group h-full rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                  <div className="mb-5 grid h-13 w-13 place-items-center rounded-2xl gradient-bg p-3 text-white shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[22px] font-semibold tracking-tight">{w.title}</h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Who Can Join ---------- */
const AUDIENCES = [
  { icon: Sparkles, label: "AI Enthusiasts" },
  { icon: Briefcase, label: "Business Owners" },
  { icon: Users, label: "Professionals" },
  { icon: Home, label: "Housewives" },
  { icon: Search, label: "Job Seekers" },
  { icon: Video, label: "Content Creators" },
  { icon: BookOpen, label: "Teachers" },
  { icon: PenTool, label: "Freelancers" },
];

function WhoCanJoinSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Audience"
          title="Who Can Join?"
          subtitle="This program is designed for anyone curious about AI, regardless of background."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeIn key={a.label} delay={i * 0.04}>
                <div className="glass-card gradient-border-hover group flex h-full min-h-[160px] flex-col items-center justify-center gap-3 rounded-3xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-bg text-white shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-[16px] font-semibold leading-tight sm:text-[17px]">
                    {a.label}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const DEFAULT_FAQS = programConfig.faqs;

function FAQSection() {
  const { data: dbFaqs } = useQuery({ queryKey: ["published-faqs"], queryFn: getPublishedFAQs });
  const [open, setOpen] = useState<number | null>(0);
  const faqs =
    dbFaqs && dbFaqs.length > 0
      ? dbFaqs.map((f) => ({ q: f.question, a: f.answer }))
      : DEFAULT_FAQS;

  return (
    <section id="faq" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you register."
        />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={i} delay={i * 0.03}>
                <div
                  className={`glass-card overflow-hidden rounded-2xl transition-all ${isOpen ? "shadow-[var(--shadow-glow)] ring-1 ring-primary/20" : ""}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className={`text-[17px] font-semibold ${isOpen ? "gradient-text" : ""}`}>
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="px-6 pb-6 text-[16px] leading-relaxed text-muted-foreground prose prose-base prose-p:my-0 prose-headings:my-2 max-w-none prose-a:text-primary"
                          dangerouslySetInnerHTML={{ __html: f.a }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function ContactSection() {
  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const phone = settings?.contact_phone || "+91 81380 10166";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const whatsapp = settings?.contact_whatsapp || "918138010166";
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <section id="contact" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="group relative overflow-hidden rounded-[28px] border border-[#ECEEF5] bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-glow)]">
            <div className="grid grid-cols-1 md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%]">
              
              {/* Left Side: Illustration */}
              <div className="relative flex flex-col items-center justify-center border-b border-[#ECEEF5] bg-slate-50/50 py-8 px-6 md:border-b-0 md:border-r md:p-10">
                {/* Dotted background pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: "radial-gradient(#1F0A77 2px, transparent 2px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl shadow-primary/10 md:h-40 md:w-40"
                >
                  <div className="absolute inset-0 rounded-full border border-primary/10" />
                  <div className="absolute -inset-4 rounded-full border border-primary/5" />
                  <Headset className="h-12 w-12 text-primary md:h-16 md:w-16" strokeWidth={1.5} />
                  
                  {/* Decorative blobs */}
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-500 shadow-md md:h-10 md:w-10">
                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-500 shadow-md md:h-10 md:w-10">
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </motion.div>
              </div>

              {/* Right Side: Content */}
              <div className="flex flex-col p-5 sm:p-8 md:p-12 lg:p-14">
                {/* Badge */}
                <div className="mb-5 flex">
                  <div className="inline-flex cursor-default items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[13px] font-semibold tracking-wide text-primary transition-transform hover:scale-105">
                    <span>📞</span> Admission Enquiry
                  </div>
                </div>

                <h2 className="w-full text-[26px] font-bold leading-[1.2] text-foreground sm:text-[30px] md:text-[36px]" lang="ml">
                  ഈ പ്രോഗ്രാം നിങ്ങൾക്ക് എങ്ങനെ ഉപകാരപ്പെടും?
                  <span className="mt-1 block whitespace-nowrap text-[24px] sm:text-[28px] md:text-[32px] gradient-text">കൂടുതൽ അറിയണോ?</span>
                </h2>
                
                <p className="mt-[18px] text-[16px] leading-[1.6] text-muted-foreground/90" lang="ml">
                  ഞങ്ങളുടെ അഡ്മിഷൻ ടീമുമായി സംസാരിച്ച് നിങ്ങളുടെ എല്ലാ സംശയങ്ങൾക്കും മറുപടി നേടൂ.
                </p>

                {/* Contact Card */}
                <div className="mt-6 flex items-center gap-4 rounded-[18px] border border-border bg-white p-4 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow)] sm:gap-5 sm:p-5">
                  <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md">
                    <Phone className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="mb-1 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[12px]">
                      Call us directly
                    </span>
                    <a
                      href={phoneHref}
                      className="inline-block text-[24px] font-bold tracking-tight text-foreground transition-colors hover:text-primary sm:text-[26px]"
                      style={{ userSelect: "all" }}
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-[54px] w-full items-center justify-between rounded-[16px] bg-[#25D366] px-6 text-[16px] font-semibold text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:h-[56px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <MessageCircle className="h-[20px] w-[20px]" />
                      WhatsApp Us
                    </span>
                    <ArrowRight className="h-[20px] w-[20px] transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href={phoneHref}
                    className="group flex h-[54px] w-full items-center justify-between rounded-[16px] bg-primary px-6 text-[16px] font-semibold text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:h-[56px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone className="h-[20px] w-[20px]" />
                      Call Now
                    </span>
                    <ArrowRight className="h-[20px] w-[20px] transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                {/* Trust Strip */}
                <div className="mt-6 flex h-[60px] items-center justify-center gap-4 border-t border-border pt-4 text-[13px] font-medium text-muted-foreground sm:h-[64px] sm:gap-6 sm:text-[14px]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                    <span className="leading-snug">Trusted by<br className="sm:hidden" /> Thousands</span>
                  </div>
                  <div className="h-8 w-px shrink-0 bg-border" />
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 shrink-0 text-primary" />
                    <span className="leading-snug">Expert Admission<br className="sm:hidden" /> Guidance</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;
  const whatsapp = settings?.contact_whatsapp || "918138010166";
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <section id="register" className="relative overflow-hidden py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] gradient-bg p-12 text-center text-white shadow-[var(--shadow-glow)] md:p-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Limited Seats · Next Batch{" "}
              {settings?.course_start_date || programConfig.batch.displayStart}
            </div>
            <h2 className="text-[40px] font-bold leading-tight tracking-tight md:text-5xl lg:text-[56px]">
              Start Your AI Journey Today
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[18px] text-white/90 md:text-[20px]">
              Join thousands of learners who are building their future with AI.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={regUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 min-w-64 items-center justify-center rounded-full bg-white px-8 text-[17px] font-bold text-primary shadow-xl transition-transform hover:-translate-y-0.5"
              >
                Register Now for ₹{settings?.course_fee || "749"}{" "}
                {settings?.course_offer_price || "+ GST"}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 min-w-56 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 text-[17px] font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Shared helpers ---------- */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  malayalamTitle = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  malayalamTitle?: boolean;
}) {
  return (
    <FadeIn>
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full gradient-bg px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-white">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2
          className={`text-balance text-[32px] font-semibold tracking-tight md:text-[40px] lg:text-[44px] ${malayalamTitle ? "font-malayalam leading-tight" : ""}`}
          lang={malayalamTitle ? "ml" : undefined}
        >
          <span className="gradient-text">{title}</span>
        </h2>
        {subtitle && (
          <p className="mt-5 text-[18px] leading-relaxed text-muted-foreground md:text-[20px]">
            {subtitle}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
