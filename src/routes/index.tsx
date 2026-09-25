import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
  ChevronLeft,
  ChevronRight,
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
  Trophy,
} from "lucide-react";
import certificateAsset from "@/assets/1m-ai-superstars-certificate.png";
import heroLaptopImg from "@/assets/hero-laptop.png";
import programThumbnail from "@/assets/program-thumbnail.png";
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
import { programConfig } from "@/lib/programConfig";
import {
  getWebsiteSettings,
  getPublishedCurriculum,
  getPublishedFAQs,
  getPublishedAITools,
} from "@/lib/cms";
import { optimizedImage } from "@/services/media";
import { trackEvent } from "@/lib/analytics";
import { ExploreCoursesSection } from "@/components/courses/ExploreCoursesSection";

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

const DEFAULT_SETTINGS = {
  id: 1,
  hero_title: "AI എന്താണെന്നും, എങ്ങനെ ഉപയോഗിക്കാമെന്നും മലയാളത്തിൽ പഠിക്കാം",
  hero_subtitle:
    "<p>AI-യെക്കുറിച്ച് വലിയ ടെക്നിക്കൽ അറിവൊന്നും വേണ്ട. നമ്മുടെ ദൈനംദിന ജീവിതത്തിലും ജോലിയിലും AI എങ്ങനെ എളുപ്പത്തിൽ ഉപയോഗിക്കാമെന്ന് ലളിതമായി പഠിക്കാം.</p>",
  hero_badge: "10 Live Sessions · Malayalam · Certificate",
  hero_image: "",
  hero_primary_button_text: "ഇപ്പോൾ തന്നെ Join ചെയ്യൂ",
  hero_secondary_button_text: "View Curriculum",
  hero_trust_counter: "10K+ Learners",
  course_batch_name: programConfig.batch.batchName,
  course_start_date: programConfig.batch.displayStart,
  course_duration: `${programConfig.batch.sessions} Days`,
  course_registration_link: programConfig.registrationUrl,
  course_fee: programConfig.pricing.fee,
  course_offer_price: programConfig.pricing.offerPrice,
  contact_email: programConfig.contact.email,
  contact_phone: programConfig.contact.phone,
  contact_whatsapp: programConfig.contact.whatsappNumber,
  social_facebook: programConfig.social.facebook,
  social_instagram: programConfig.social.instagram,
  social_youtube: "",
  social_linkedin: "",
  created_at: "",
  updated_at: "",
};

function LandingPage() {
  const { scrollYProgress } = useScroll();

  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
    initialData: DEFAULT_SETTINGS,
  });

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left gradient-bg"
        aria-hidden
      />

      <main>
        <Hero />
        <AboutSection />
        <InitiativeBySection />
        <CurriculumSection />
        <ToolsSection />
        <ProgramSection />
        <WhoCanJoinSection />
        <ExploreCoursesSection />
        <ContactSection />
        <FAQSection />
      </main>
    </div>
  );
}

/* ---------- Hero Tool Icons ---------- */
function ChatGPTLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.182a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.758a.771.771 0 0 0 .78 0l5.843-3.368v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.499 4.499 0 0 1-6.14-1.646zm-1.26-10.41a4.485 4.485 0 0 1 2.366-1.972V11.6a.766.766 0 0 0 .388.676l5.814 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.047 14.01a4.504 4.504 0 0 1-1.707-6.118zm16.596 3.856L13.104 8.364l2.015-1.164a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.677a.79.79 0 0 0-.408-.667zm2.011-3.023l-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.499 4.499 0 0 1 6.68 4.66zm-12.64 4.135a.771.771 0 0 0 .397-.681V6.755l2.02-1.168a.071.071 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.677a.79.79 0 0 0-.407-.667zm-1.259 2.182l2.91-1.68a.795.795 0 0 0 .393-.681V9.923l2.91 1.68a.795.795 0 0 0 .785 0l2.91-1.68v3.364a.795.795 0 0 0 .393.681l2.91 1.68-2.91 1.68a.795.795 0 0 0-.393.681v3.364l-2.91-1.68a.795.795 0 0 0-.785 0l-2.91 1.68v-3.364a.795.795 0 0 0-.393-.681l-2.91-1.68z"
        fill="#10A37F"
      />
    </svg>
  );
}

function GeminiLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hero-gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA4335" />
          <stop offset="30%" stopColor="#FBBC04" />
          <stop offset="65%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#34A853" />
        </linearGradient>
      </defs>
      <path
        d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
        fill="url(#hero-gemini-grad)"
      />
    </svg>
  );
}

function LovableLogo() {
  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hero-lovable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF416C" />
            <stop offset="35%" stopColor="#FF4B2B" />
            <stop offset="70%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#hero-lovable-grad)"
        />
      </svg>
      <span className="mt-1 text-[11px] sm:text-[12px] font-bold text-slate-800 tracking-tight">
        Lovable
      </span>
    </div>
  );
}

function NotebookLMLogo() {
  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 23C6 14.2 10.5 9 16 9C21.5 9 26 14.2 26 23"
          stroke="#111827"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M10 23C10 17 12.7 13.5 16 13.5C19.3 13.5 22 17 22 23"
          stroke="#111827"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M14 23C14 20 14.9 18 16 18C17.1 18 18 20 18 23"
          stroke="#111827"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="mt-1 text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-tight">
        NotebookLM
      </span>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
    initialData: DEFAULT_SETTINGS,
  });

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;

  return (
    <section
      id="hero"
      className="bg-white relative overflow-x-clip overflow-y-visible pt-[88px] sm:pt-[104px] md:pt-[120px] lg:pt-[128px] pb-6 sm:pb-8 md:pb-12"
    >
      {/* Soft lavender/purple background ambient glow matching reference */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Large subtle circular purple glow behind the right column / laptop (hidden on phone/mobile) */}
        <div className="hidden md:block absolute right-[-4%] sm:right-[0%] top-[4%] sm:top-[6%] h-[550px] w-[550px] sm:h-[680px] sm:w-[680px] md:h-[780px] md:w-[780px] rounded-full bg-[radial-gradient(circle,rgba(224,216,255,0.65)_0%,rgba(238,233,255,0.3)_42%,transparent_70%)] blur-2xl md:blur-3xl" />
        {/* Soft lavender ambient glow on the bottom-left */}
        <div className="absolute -left-20 bottom-[-5%] h-[320px] w-[320px] sm:h-[480px] sm:w-[480px] rounded-full bg-[radial-gradient(circle,rgba(238,232,255,0.45)_0%,transparent_65%)] blur-2xl" />
      </div>

      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Top 2-Column Hero Composition */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-6 lg:gap-8 xl:gap-10">
          {/* LEFT SIDE: Text Content & Primary CTA */}
          <div className="col-span-1 md:col-span-7 lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left z-20 relative">
            <h1
              className="text-[25px] sm:text-[29px] md:text-[33px] lg:text-[35px] xl:text-[38px] 2xl:text-[42px] font-extrabold !leading-[1.02] sm:!leading-[1.04] lg:!leading-[1.02] tracking-tight text-foreground"
              lang="ml"
            >
              <span className="block sm:whitespace-nowrap">AI എന്താണെന്നും, എങ്ങനെ</span>
              <span className="block -mt-1 sm:-mt-2 md:-mt-2.5 lg:-mt-3 sm:whitespace-nowrap">
                ഉപയോഗിക്കാമെന്നും മലയാളത്തിൽ
              </span>
              <span className="block -mt-1 sm:-mt-2 md:-mt-2.5 lg:-mt-3 text-[#3b1298]">
                പഠിക്കാം
              </span>
            </h1>

            <p
              className="mt-3.5 sm:mt-4 md:mt-5 text-[15px] sm:text-[16px] lg:text-[16.5px] xl:text-[17px] !leading-[1.65] text-slate-600 max-w-full md:max-w-[560px] lg:max-w-[620px] xl:max-w-[670px]"
              lang="ml"
            >
              AI-യെക്കുറിച്ച് വലിയ ടെക്നിക്കൽ അറിവൊന്നും വേണ്ട. നമ്മുടെ ദൈനംദിന ജീവിതത്തിലും ജോലിയിലും AI എങ്ങനെ എളുപ്പത്തിൽ ഉപയോഗിക്കാമെന്ന് ലളിതമായി പഠിക്കാം.
            </p>

            <div className="mt-6 sm:mt-7 md:mt-8">
              <a
                href={regUrl}
                onClick={() => trackEvent("register_click", { location: "hero" })}
                className="group inline-flex h-13 sm:h-14 items-center justify-between rounded-full bg-gradient-to-r from-[#240c88] via-[#3314a6] to-[#4820d2] pl-7 pr-2.5 sm:pl-8 sm:pr-3 text-[15px] sm:text-[16px] font-semibold text-white shadow-[0_10px_25px_-4px_rgba(40,15,145,0.45),0_6px_12px_-4px_rgba(40,15,145,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_14px_30px_-4px_rgba(40,15,145,0.55)] active:scale-[0.98]"
              >
                <span className="mr-3 sm:mr-4 tracking-wide">
                  {settings?.hero_primary_button_text || "ഇപ്പോൾ തന്നെ Join ചെയ്യൂ"}
                </span>
                <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white text-[#2a0f9b] shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5]" />
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Laptop + Hand-drawn Annotation + Floating AI Tool Cards */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-5 xl:col-span-5 relative items-center justify-center lg:justify-end pt-4 md:pt-0">
            <div className="relative w-full max-w-[430px] lg:max-w-[480px] xl:max-w-[530px] aspect-[4/3] flex items-center justify-center">
              
              {/* Hand-drawn Annotation: Practical Skills / Real Opportunities */}
              <div className="absolute -top-10 lg:-top-14 right-[18%] lg:right-[22%] z-20 pointer-events-none select-none">
                <svg
                  className="w-36 h-24 lg:w-44 lg:h-28 overflow-visible"
                  viewBox="0 0 160 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text
                    x="85"
                    y="26"
                    textAnchor="middle"
                    fill="#4b5563"
                    style={{
                      fontFamily: "'Caveat', 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive, sans-serif",
                      fontSize: "17px",
                      fontWeight: "600",
                      fontStyle: "italic",
                      letterSpacing: "0.2px",
                    }}
                    transform="rotate(-5 85 26)"
                  >
                    Practical Skills
                  </text>
                  <text
                    x="87"
                    y="45"
                    textAnchor="middle"
                    fill="#6b7280"
                    style={{
                      fontFamily: "'Caveat', 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive, sans-serif",
                      fontSize: "14px",
                      fontWeight: "500",
                      fontStyle: "italic",
                      letterSpacing: "0.1px",
                    }}
                    transform="rotate(-5 87 45)"
                  >
                    Real Opportunities
                  </text>
                  {/* Sketched arrow pointing down-left towards laptop screen */}
                  <path
                    d="M62 52 C48 58 38 66 28 78"
                    stroke="#6b7280"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M26 68 L28 78 L38 76"
                    stroke="#6b7280"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Floating AI Tool 1: ChatGPT (Top-Left, closer to laptop screen) */}
              <div className="absolute top-[18%] lg:top-[20%] left-[18%] sm:left-[20%] md:left-[21%] lg:left-[23%] xl:left-[24%] z-20 flex h-13 w-13 md:h-14 md:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl lg:rounded-[22px] border border-white/90 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] animate-hero-float-up">
                <ChatGPTLogo className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9" />
              </div>

              {/* Floating AI Tool 2: Gemini (Bottom-Left, closer to laptop keyboard/base) */}
              <div className="absolute top-[52%] lg:top-[54%] left-[3%] lg:left-[5%] z-20 flex h-13 w-13 md:h-14 md:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl lg:rounded-[22px] border border-white/90 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] animate-hero-float-down">
                <GeminiLogo className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9" />
              </div>

              {/* Floating AI Tool 3: Lovable (Top-Right, closer to laptop screen) */}
              <div className="absolute top-[26%] lg:top-[28%] right-[2%] lg:right-[4%] z-20 flex h-[64px] w-[64px] md:h-[70px] md:w-[70px] lg:h-[78px] lg:w-[78px] flex-col items-center justify-center rounded-2xl lg:rounded-[22px] border border-white/90 bg-white p-2 shadow-[0_10px_26px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] animate-hero-float-up">
                <LovableLogo />
              </div>

              {/* Floating AI Tool 4: NotebookLM (Bottom-Right, closer to laptop screen/base) */}
              <div className="absolute top-[56%] lg:top-[58%] right-[2%] lg:right-[4%] z-20 flex h-[64px] w-[64px] md:h-[70px] md:w-[70px] lg:h-[78px] lg:w-[78px] flex-col items-center justify-center rounded-2xl lg:rounded-[22px] border border-white/90 bg-white p-2 shadow-[0_10px_26px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] animate-hero-float-down">
                <NotebookLMLogo />
              </div>

              {/* Central Laptop Mockup Image */}
              <div className="relative z-10 w-full overflow-hidden select-none pointer-events-none">
                <img
                  src={heroLaptopImg}
                  alt="Learn AI in Malayalam on Laptop"
                  width={1024}
                  height={768}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* HERO BENEFITS ROW: 6-item benefit row directly below the two-column hero */}
        <div className="mt-10 sm:mt-14 md:mt-18 lg:mt-20 pt-6 sm:pt-8 border-t border-border/50">
          <div className="mx-auto w-full max-w-[440px] md:max-w-5xl xl:max-w-[1360px]">
            <div className="grid grid-cols-3 gap-y-4 rounded-3xl p-2 sm:p-4 md:grid-cols-6 md:gap-y-0 md:divide-x divide-border/60">
              {/* 1. 10 Day Live */}
              <div className="flex flex-col items-center justify-start text-center px-1.5 md:px-3 border-r border-border/60 md:border-r-0">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 sm:mb-3">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-tight text-foreground/90">
                  10 Day
                  <br />
                  Live
                </div>
              </div>

              {/* 2. Live Doubt Clearance */}
              <div className="flex flex-col items-center justify-start text-center px-1.5 md:px-3 border-r border-border/60 md:border-r-0">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 sm:mb-3">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-tight text-foreground/90">
                  Live Doubt
                  <br />
                  Clearance
                </div>
              </div>

              {/* 3. 1-Year Access */}
              <div className="flex flex-col items-center justify-start text-center px-1.5 md:px-3">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 sm:mb-3">
                  <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-tight text-foreground/90">
                  1-Year
                  <br />
                  Access
                </div>
              </div>

              {/* 4. Competition and Challenges */}
              <div className="flex flex-col items-center justify-start text-center px-1.5 md:px-3 border-r border-border/60 md:border-r-0">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 sm:mb-3">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-tight text-foreground/90">
                  Competition &amp;
                  <br />
                  Challenges
                </div>
              </div>

              {/* 5. Official Certificate */}
              <div className="flex flex-col items-center justify-start text-center px-1.5 md:px-3 border-r border-border/60 md:border-r-0">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 sm:mb-3">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-tight text-foreground/90">
                  Official
                  <br />
                  Certificate
                </div>
              </div>

              {/* 6. 10K+ Learners */}
              <div className="flex flex-col items-center justify-start text-center px-1.5 md:px-3">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-primary/10 text-primary mb-2 sm:mb-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-tight text-foreground/90">
                  {(() => {
                    const counter = settings?.hero_trust_counter;
                    if (!counter || counter.includes("5000") || counter.includes("5,000")) {
                      return "10K+";
                    }
                    const match = counter.match(/[\d,]+\s*[kK]?\s*\+/);
                    return match ? match[0].trim() : "10K+";
                  })()}
                  <br />
                  Learners
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Initiative By ---------- */
function InitiativeBySection() {
  return (
    <section
      id="initiative-by"
      className="relative border-t border-border/60 bg-white py-10 sm:py-12 md:py-14"
    >
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="flex flex-col items-center justify-center text-center">
            {/* Header with flanking decorative lines matching reference */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-border/80" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                Initiative By
              </span>
              <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-border/80" />
            </div>

            {/* Centered Partner Cards matching reference */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* Edapt Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex h-16 sm:h-20 w-44 sm:w-52 items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-[0_4px_20px_-4px_rgba(31,10,119,0.07),0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100/90"
              >
                <img
                  src={edaptLogo}
                  alt="Edapt logo"
                  loading="lazy"
                  className="max-h-9 sm:max-h-11 w-auto object-contain"
                />
              </motion.div>

              {/* Vertical divider line between logos matching reference */}
              <div className="hidden sm:block h-10 w-px bg-slate-200/80" />

              {/* Future Knowledge Collective Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex h-16 sm:h-20 w-44 sm:w-52 items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-[0_4px_20px_-4px_rgba(31,10,119,0.07),0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100/90"
              >
                <img
                  src={fkcLogo}
                  alt="Future Knowledge Collective logo"
                  loading="lazy"
                  className="max-h-10 sm:max-h-12 w-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-7 flex justify-center md:mt-8"
        >
          <Link
            to="/about"
            className="group inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[rgba(31,10,119,0.08)] bg-[#EEF2FF] px-4 text-[13px] font-medium text-[#1F0A77] transition-all duration-[250ms] hover:scale-[1.02] hover:bg-[#E6EBFF]"
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

/* ---------- About / AI Literacy ---------- */
function AboutSection() {
  return (
    <section id="about" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
      {/* Subtle ambient glow behind certificate */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hidden md:block absolute right-[5%] top-[15%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(224,216,255,0.45)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* LEFT SIDE: Badge, Main Heading & Paragraphs */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-10">
            {/* "Why AI, Why Now" Badge */}
            <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#200a78] via-[#2f119b] to-[#451fd4] px-4 py-1.5 text-xs sm:text-[13px] font-semibold text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Why AI, Why Now</span>
            </div>

            {/* Main Malayalam Heading */}
            <h2
              className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] font-extrabold text-foreground !leading-[1.28] tracking-tight"
              lang="ml"
            >
              ഇന്ന് ലോകം മുഴുവൻ മാറ്റിമറിച്ചുകൊണ്ടിരിക്കുന്ന സാങ്കേതികവിദ്യയാണ് AI.
            </h2>

            {/* Supporting Malayalam Paragraphs */}
            <div
              className="mt-4 sm:mt-5 md:mt-6 space-y-3.5 sm:space-y-4 text-[15px] sm:text-[16px] md:text-[16.5px] text-slate-700 !leading-[1.75]"
              lang="ml"
            >
              <p>
                വലിയ കമ്പ്യൂട്ടർ അറിവുകളോ വിദ്യാഭ്യാസ യോഗ്യതയോ ഇല്ലാത്ത ഏതൊരു സാധാരണക്കാരനും വളരെ ലളിതമായി പഠിച്ചെടുക്കാനും, സ്വന്തം നിത്യജീവിതത്തിൽ ഒരു സഹായിയെപ്പോലെ AI എങ്ങനെ ഉപയോഗിക്കാമെന്ന് പഠിപ്പിച്ചു തരുന്ന രീതിയിലാണ് ഈ പദ്ധതി രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്.
              </p>
              <p>
                അടിസ്ഥാന അറിവുകളിൽ നിന്ന് തുടങ്ങി ഓരോ ദിവസം കഴിയുന്തോറും നിങ്ങളെ ഒരു AI Literate ആക്കി മാറ്റുന്ന രീതിയിലാണ് പദ്ധതി ഡിസൈൻ ചെയ്തിട്ടുള്ളത്.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Framed Certificate & Decorative Badges */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-6 relative flex items-center justify-center pt-2 sm:pt-4 lg:pt-0">
            <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[580px] xl:max-w-[620px]">
              {/* Decorative radiant burst at top-right */}
              <div className="absolute -top-7 -right-2 sm:-top-8 sm:-right-4 pointer-events-none select-none z-10">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-[#4f28d9]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                >
                  <path d="M12 28 C10 20 8 13 5 7" />
                  <path d="M25 24 C25 16 27 10 30 4" />
                  <path d="M35 28 C40 24 44 20 48 18" />
                </svg>
              </div>

              {/* Black Physical Certificate Frame */}
              <div className="relative rounded-none border-[12px] sm:border-[16px] md:border-[18px] border-[#0c0c0e] bg-[#0c0c0e] shadow-[0_22px_55px_-12px_rgba(0,0,0,0.28),0_10px_20px_-5px_rgba(0,0,0,0.15)]">
                {/* Inner white mat & certificate artwork */}
                <div className="relative bg-white overflow-hidden border border-slate-200">
                  <img
                    src={certificateAsset}
                    alt="1 Million AI Superstars Official Certificate of Completion"
                    width={2000}
                    height={1414}
                    loading="lazy"
                    className="block w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Decorative Floating Badge 1: Award Ribbon (Bottom-Left) */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 z-20 flex h-13 w-13 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.06)] border border-slate-100">
                <Award className="h-7 w-7 sm:h-8 sm:w-8 text-[#451fd4] stroke-[2.2]" />
              </div>

              {/* Decorative Floating Badge 2: Graduation Cap (Middle-Right) */}
              <div className="absolute top-[52%] -right-4 sm:-right-5 z-20 flex h-13 w-13 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.06)] border border-slate-100">
                <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-[#451fd4] stroke-[2.2]" />
              </div>
            </div>
          </div>
        </div>
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
      className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white pb-12 pt-6 md:pb-16 md:pt-10"
    >
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Curriculum"
          eyebrowExtra={
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer ml-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                  aria-label="Curriculum update notice"
                >
                  <Info className="h-2.5 w-2.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 sm:w-96 rounded-2xl p-4 sm:p-5 shadow-2xl border border-border/80 bg-white text-foreground"
                align="center"
                sideOffset={8}
              >
                <div className="flex items-start gap-3.5 text-left normal-case tracking-normal">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-primary">
                      Curriculum Update Notice
                    </h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      AI technology evolves rapidly. To keep this program current and valuable, the syllabus may be updated periodically to include the latest AI tools and features.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          }
          title={<>ഈ പദ്ധതിയിലൂടെ നിങ്ങൾ എന്തെല്ലാം പഠിച്ചെടുക്കും?</>}
          malayalamTitle
          titleMaxWidth="max-w-4xl xl:max-w-5xl"
          subtitle="Live sessions covering practical AI skills you need in daily life & work."
        />

        <div className="relative mt-5 md:mt-8 max-w-[1360px] mx-auto">
          <div className="absolute left-4 top-0 h-full w-0.5 gradient-bg md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-4 sm:space-y-6 md:space-y-10">
            {curriculum.map((item, i) => {
              const isOpen = open === i;
              const align = i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]";
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className={`relative pl-10 sm:pl-12 md:pl-0 ${align}`}>
                    <div className="absolute left-4 top-6 z-10 grid h-8 w-8 sm:h-9 sm:w-9 -translate-x-1/2 place-items-center rounded-full gradient-bg text-white shadow-[var(--shadow-glow)] md:left-1/2">
                      <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="glass-card gradient-border-hover group w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] md:p-7"
                    >
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <span className="inline-block rounded-full gradient-bg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-white">
                            Session {item.week_number}
                          </span>
                          <h3 className="mt-2.5 sm:mt-3 text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight leading-snug">
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
                            <div className="mt-4 sm:mt-5 grid gap-3">
                              <div className="rounded-2xl border border-border/60 bg-white/80 p-4">
                                <div
                                  className="text-[14px] sm:text-[15px] leading-relaxed text-muted-foreground prose prose-sm prose-p:my-0 prose-headings:my-2 max-w-none prose-a:text-primary"
                                  lang="ml"
                                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
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


/* ---------- Tools ---------- */
function ToolsSection() {
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["published-ai-tools"],
    queryFn: getPublishedAITools,
  });

  // Ensure sufficient cloned items for Embla's circular loop without visual jumps (at least 24, even count)
  const displayTools = useMemo(() => {
    if (tools.length === 0) return [];
    let items = [...tools];
    while (items.length < 24 || items.length % 2 !== 0) {
      items = [...items, ...tools];
    }
    return items;
  }, [tools]);

  // Autoplay: 3.2s interval, pauses on touch/hover and resumes automatically
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3200,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: (viewSize, snapSize) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          // Mobile peek: 1 center card fully visible with half-card peek on each side
          return (viewSize - snapSize) / 2;
        }
        return 0; // 'start' for tablet, laptop, desktop
      },
      slidesToScroll: 1,
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Subtle pagination indicators (5 dots)
  const totalDots = 5;
  const activeDotIndex = useMemo(() => {
    if (scrollSnaps.length === 0) return 0;
    return Math.floor((selectedIndex / scrollSnaps.length) * totalDots) % totalDots;
  }, [selectedIndex, scrollSnaps.length]);

  const scrollToDot = (dotIndex: number) => {
    if (!emblaApi || scrollSnaps.length === 0) return;
    const targetSnap = Math.floor((dotIndex / totalDots) * scrollSnaps.length);
    emblaApi.scrollTo(targetSnap);
  };

  return (
    <section id="tools" className="relative pt-6 pb-10 md:pt-8 md:pb-14 overflow-hidden">
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <SectionHeader
          title="പഠിക്കുന്ന പ്രധാന AI Tools"
          malayalamTitle
          titleMaxWidth="max-w-3xl whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible"
        />

        <div className="mt-6 md:mt-8 relative">
          {isLoading ? (
            <div className="flex justify-center py-12 text-muted-foreground">Loading tools...</div>
          ) : tools.length === 0 ? (
            <div className="flex justify-center py-12 text-[15px] font-medium text-muted-foreground">
              No AI tools available.
            </div>
          ) : (
            <>
              {/* Carousel Container with Arrows and Viewport */}
              <div className="relative flex items-center justify-between gap-1.5 sm:gap-3 md:gap-4 w-full">
                {/* Left Circular Navigation Button */}
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous AI tools"
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-full border border-[#e6e2f2] bg-white text-[#1f0a77] shadow-[0_2px_8px_rgba(31,10,119,0.08)] backdrop-blur-sm transition-all duration-200 hover:bg-[#1f0a77] hover:text-white hover:border-[#1f0a77] hover:shadow-[0_4px_16px_rgba(31,10,119,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f0a77] active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {/* Embla Viewport */}
                <div className="overflow-hidden flex-1 select-none min-w-0" ref={emblaRef}>
                  <div className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 items-stretch">
                    {displayTools.map((t, i) => (
                      <div
                        key={`${t.id || t.tool_name}-${i}`}
                        className="basis-[calc((100%-20px)/2)] md:basis-[calc((100%-16px)/2)] lg:basis-[calc((100%-40px)/3)] xl:basis-[calc((100%-72px)/4)] shrink-0 min-w-0"
                      >
                        <div className="group relative flex h-[155px] sm:h-[175px] md:h-[195px] lg:h-[205px] w-full flex-col items-center justify-between rounded-2xl border border-[#e6e2f2] bg-white p-3.5 sm:p-5 text-center shadow-[0_4px_16px_-4px_rgba(31,10,119,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#3216a8]/35 hover:shadow-[0_12px_28px_-6px_rgba(31,10,119,0.12)]">
                          <div className="flex flex-1 w-full items-center justify-center overflow-hidden">
                            <img
                              src={optimizedImage(t.tool_logo)}
                              alt={`${t.tool_name} logo`}
                              loading="lazy"
                              className="max-h-12 sm:max-h-16 md:max-h-20 max-w-[85%] object-contain pointer-events-none select-none transition-transform duration-300 ease-out group-hover:scale-105"
                            />
                          </div>
                          <div className="mt-2 text-[12px] sm:text-[13px] md:text-[15px] font-semibold text-foreground line-clamp-1 w-full px-1">
                            {t.tool_name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Circular Navigation Button */}
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next AI tools"
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 rounded-full border border-[#e6e2f2] bg-white text-[#1f0a77] shadow-[0_2px_8px_rgba(31,10,119,0.08)] backdrop-blur-sm transition-all duration-200 hover:bg-[#1f0a77] hover:text-white hover:border-[#1f0a77] hover:shadow-[0_4px_16px_rgba(31,10,119,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f0a77] active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Pagination Dots (● ● ━ ● ●) */}
              <div
                className="mt-4 sm:mt-5 flex justify-center items-center gap-1.5"
                role="tablist"
                aria-label="Carousel pagination"
              >
                {Array.from({ length: totalDots }).map((_, idx) => {
                  const isActive = idx === activeDotIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Go to AI tools slide ${idx + 1}`}
                      onClick={() => scrollToDot(idx)}
                      className={`transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f0a77] ${
                        isActive
                          ? "h-2 w-6 sm:w-7 rounded-full bg-[#1f0a77] shadow-sm"
                          : "h-2 w-2 rounded-full bg-[#1f0a77]/25 hover:bg-[#1f0a77]/50"
                      }`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Program Specs ---------- */
function ProgramSection() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
    initialData: DEFAULT_SETTINGS,
  });

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;
  const startDate = "Saturday, October 3, 2026";
  const classTime = "8:30 PM IST";
  const offerPrice = "999";
  const wasPrice = "2,499";

  return (
    <section
      id="program"
      className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white py-12 md:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Program Details"
          title="Program Specifications"
          subtitle="Everything you need to know at a glance."
        />

        <FadeIn delay={0.1}>
          <div className="mt-8 md:mt-12 mx-auto max-w-[1400px] xl:max-w-[1440px]">
            {/* Unified Large Program Card */}
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/15 bg-[radial-gradient(ellipse_80%_80%_at_20%_-20%,rgba(120,80,255,0.28),transparent),linear-gradient(135deg,#0d0436_0%,#180860_45%,#260d8b_100%)] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 shadow-[0_25px_60px_-15px_rgba(20,5,80,0.4)]">
              {/* Subtle ambient glow behind card */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full bg-violet-600/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-[350px] w-[350px] rounded-full bg-indigo-600/15 blur-3xl" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-center">
                {/* Left Side: Program Information */}
                <div className="flex flex-col justify-center">
                  {/* LIVE PROGRAM Badge */}
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE PROGRAM</span>
                  </div>

                  {/* Main Heading */}
                  <h3 className="mt-3.5 sm:mt-4 text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px] xl:text-[44px] font-black tracking-tight text-white uppercase leading-[1.12]">
                    1 MILLION AI SUPERSTARS PROGRAM
                  </h3>

                  {/* Program Description */}
                  <p className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] md:text-[17px] text-white/80 leading-relaxed max-w-2xl font-normal">
                    Learn AI from the basics through 10 live classes in Malayalam, with practical tools and real-world applications for work, business, and everyday life.
                  </p>

                  {/* Date & Time Row */}
                  <div className="mt-7 sm:mt-8 pt-6 sm:pt-7 border-t border-white/15 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 lg:gap-10">
                    {/* Starts */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-inner">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/60 font-semibold">
                          Starts
                        </span>
                        <span className="block text-[16px] sm:text-[18px] md:text-[19px] font-extrabold text-white mt-0.5 leading-snug">
                          {startDate}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block h-10 w-[1px] bg-white/15" />

                    {/* Class time */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-inner">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/60 font-semibold">
                          Class time
                        </span>
                        <span className="block text-[16px] sm:text-[18px] md:text-[19px] font-extrabold text-white mt-0.5 leading-snug">
                          {classTime}
                        </span>
                        <small className="block text-[12px] sm:text-[13px] text-white/65 font-medium mt-0.5 tracking-normal">
                          Every evening, 1.5 hour
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: White Pricing Panel */}
                <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col justify-between">
                  {/* Thumbnail */}
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/9] w-full bg-slate-100 relative shadow-sm border border-slate-200/60">
                    <img
                      src={programThumbnail}
                      alt="1 Million AI Superstars Program"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="mt-5 sm:mt-6">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[32px] sm:text-[38px] font-black tracking-tight text-[#1f0a77] leading-none">
                        ₹{offerPrice.replace(/[^0-9]/g, "") || "999"}
                      </span>
                      <span className="text-[17px] sm:text-[19px] font-semibold text-muted-foreground line-through decoration-[1.5px]">
                        ₹{wasPrice.replace(/[^0-9,]/g, "") || "2,499"}
                      </span>
                    </div>
                    <p className="text-[12px] sm:text-[13px] text-muted-foreground mt-1.5 font-medium">
                      Including GST. One payment, that's all.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={regUrl}
                    onClick={() =>
                      trackEvent("register_click", { location: "program_specifications" })
                    }
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f0a77] via-[#2f139e] to-[#4b2dd6] py-3.5 sm:py-4 px-6 text-[16px] sm:text-[17px] font-bold text-white shadow-[0_8px_20px_-4px_rgba(31,10,119,0.35)] transition-all duration-200 hover:shadow-[0_12px_28px_-4px_rgba(31,10,119,0.5)] hover:scale-[1.01] active:scale-[0.99] text-center"
                  >
                    <span>Take my seat</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------- Who Can Join ---------- */
const AUDIENCES = [
  { icon: Briefcase, label: "Business Owners" },
  { icon: Users, label: "Professionals" },
  { icon: Home, label: "Housewives" },
  { icon: Video, label: "Content Creators" },
  { icon: BookOpen, label: "Teachers" },
  { icon: PenTool, label: "Freelancers" },
];

function WhoCanJoinSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#f7f5fd] to-white py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <SectionHeader
          title="Who Can Join?"
          subtitle="This program is designed for anyone curious about AI, regardless of background."
        />
        <div className="mt-8 md:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-3 max-w-6xl xl:max-w-[1360px] mx-auto">
          {AUDIENCES.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeIn key={a.label} delay={i * 0.04}>
                <div className="glass-card gradient-border-hover group flex h-full min-h-[140px] sm:min-h-[160px] flex-col items-center justify-center gap-2.5 sm:gap-3 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                  <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-xl sm:rounded-2xl gradient-bg text-white shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="text-[14px] font-semibold leading-tight sm:text-[17px]">
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
    <section id="faq" className="relative py-12 md:py-20">
      <div className="mx-auto max-w-4xl xl:max-w-5xl px-4 sm:px-8 lg:px-12">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you register."
        />
        <div className="mt-8 md:mt-10 space-y-3">
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
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-secondary/40"
                  >
                    <span className="text-[15px] sm:text-[17px] font-semibold text-foreground">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                          className="px-5 pb-5 sm:px-6 sm:pb-6 text-[14px] sm:text-[16px] leading-relaxed text-muted-foreground prose prose-base prose-p:my-0 prose-headings:my-2 max-w-none prose-a:text-primary"
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
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
    initialData: DEFAULT_SETTINGS,
  });

  const phone = settings?.contact_phone || "+91 81380 10166";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const whatsapp = settings?.contact_whatsapp || "918138010166";
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <section id="contact" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="group relative overflow-hidden rounded-[28px] border border-[#ECEEF5] bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-glow)] max-w-5xl xl:max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%]">
              {/* Left Side: Illustration (hidden on mobile, visible on desktop/tablet) */}
              <div className="relative hidden md:flex flex-col items-center justify-center border-b border-[#ECEEF5] bg-slate-50/50 py-8 px-6 md:border-b-0 md:border-r md:p-10">
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

                <h2
                  className="w-full text-[26px] font-bold leading-[1.2] text-foreground sm:text-[30px] md:text-[36px]"
                  lang="ml"
                >
                  ഈ പ്രോഗ്രാം നിങ്ങൾക്ക് എങ്ങനെ ഉപകാരപ്പെടും?
                  <span className="mt-1 block whitespace-nowrap text-[24px] sm:text-[28px] md:text-[32px] gradient-text">
                    കൂടുതൽ അറിയണോ?
                  </span>
                </h2>

                <p
                  className="mt-[18px] text-[16px] leading-[1.6] text-muted-foreground/90"
                  lang="ml"
                >
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
                    <span className="leading-snug">
                      Trusted by
                      <br className="sm:hidden" /> Thousands
                    </span>
                  </div>
                  <div className="h-8 w-px shrink-0 bg-border" />
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 shrink-0 text-primary" />
                    <span className="leading-snug">
                      Expert Admission
                      <br className="sm:hidden" /> Guidance
                    </span>
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



/* ---------- Shared helpers ---------- */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  malayalamTitle = false,
  titleMaxWidth = "max-w-2xl",
  eyebrowExtra,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  malayalamTitle?: boolean;
  titleMaxWidth?: string;
  eyebrowExtra?: React.ReactNode;
}) {
  return (
    <FadeIn>
      <div className={`mx-auto text-center ${titleMaxWidth}`}>
        {eyebrow && (
          <div className="mb-2.5 md:mb-3 inline-flex items-center gap-1.5 rounded-full gradient-bg px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{eyebrow}</span>
            {eyebrowExtra}
          </div>
        )}
        <h2
          className={`text-balance font-semibold tracking-tight ${
            malayalamTitle
              ? "font-malayalam text-[clamp(22px,5vw,32px)] leading-[1.2] md:text-[36px] md:leading-[1.15]"
              : "text-[28px] leading-[1.15] sm:text-[32px] md:text-[40px] lg:text-[44px]"
          }`}
          lang={malayalamTitle ? "ml" : undefined}
        >
          <span className="gradient-text">{title}</span>
        </h2>
        {subtitle && (
          <p className="mx-auto mt-2.5 max-w-[90%] text-[15px] leading-relaxed text-muted-foreground sm:max-w-full sm:text-[16px] md:mt-3 md:text-[18px]">
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
