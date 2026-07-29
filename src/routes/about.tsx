import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Eye, Users, Sparkles, GraduationCap, Award, FileBadge, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/PageShell";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { programConfig } from "@/lib/programConfig";
import { useQuery } from "@tanstack/react-query";
import { getWebsiteSettings, getPublishedFAQs } from "@/lib/cms";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | 1 Million AI Superstars" },
      {
        name: "description",
        content:
          "Our mission: empower one million Malayalees to master AI in their own language, with practical, live instruction.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Target,
    title: "Our Mission",
    body: "Empower one million Malayalees with practical AI skills taught in simple Malayalam and backed by real workflows.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "A future where every Malayali can confidently build, create, and earn with AI as a daily companion.",
  },
  {
    icon: Users,
    title: "For Everyone",
    body: "For homemakers, students, professionals, entrepreneurs, and seniors. No coding, no jargon, and no gatekeeping.",
  },
];

const WHY = [
  {
    icon: Sparkles,
    title: "Live in Malayalam",
    body: "Real instructors, live Q&A, and practical projects, all in your language.",
  },
  {
    icon: GraduationCap,
    title: "Practical curriculum",
    body: "10 days of hands-on training on 15+ industry-leading AI tools.",
  },
  {
    icon: Award,
    title: "Trusted partners",
    body: "Edapt, Future Knowledge Collective and Malayala Manorama stand behind this program.",
  },
];

const EDAPT_FEATURES = [
  {
    icon: FileBadge,
    title: "IIT Madras Partner",
    desc: "Official Kerala Partner of IIT Madras Pravartak.",
  },
  {
    icon: Users,
    title: "400,000+ Learners",
    desc: "Trusted by learners across more than 100 countries.",
  },
  {
    icon: Clock,
    title: "8+ Years Experience",
    desc: "Delivering technology education since 2017.",
  },
  {
    icon: Award,
    title: "Proven Programs",
    desc: "AI, Technology, Digital Literacy and Career-focused learning programs.",
  },
];

function AboutPage() {
  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const { data: dbFaqs } = useQuery({
    queryKey: ["published-faqs"],
    queryFn: getPublishedFAQs,
  });

  const faqs =
    dbFaqs && dbFaqs.length > 0
      ? dbFaqs.map((f) => ({ q: f.question, a: f.answer }))
      : programConfig.faqs;

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;
  const batchName = settings?.course_batch_name || programConfig.batch.batchName;
  const displayRange = settings?.course_start_date || programConfig.batch.displayRange;

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Kerala's largest Malayalam AI movement"
        subtitle="A joint initiative by Edapt, Future Knowledge Collective and Malayala Manorama, built to make AI accessible to every Malayali household."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-white p-7 shadow-[var(--shadow-soft)]"
              >
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl gradient-bg text-white">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-[32px] font-semibold tracking-tight md:text-[40px]">
              <span className="gradient-text">Why this program</span>
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
              Built for real Malayalees, with the tools and workflows they'll actually use.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-border bg-white p-7 shadow-[var(--shadow-soft)]"
              >
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
              Initiative by
            </div>
            <h2 className="mt-3 text-balance text-[28px] font-semibold tracking-tight md:text-[36px]">
              <span className="gradient-text">Our partners</span>
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {programConfig.partners.map((p) => (
              <img
                key={p.name}
                src={p.logoUrl}
                alt={p.name}
                loading="lazy"
                width={320}
                height={120}
                className="h-10 w-auto object-contain md:h-12"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                IMPLEMENTING ORGANIZATION
              </div>
              <h2 className="mt-3 text-balance text-[32px] font-semibold tracking-tight md:text-[40px]">
                Edapt Learning Technologies
              </h2>
              <p className="mt-4 text-[18px] font-medium text-foreground">
                Kerala's Leading Vernacular Technology Education Platform
              </p>
              <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-muted-foreground">
                <p>
                  Founded in 2017, Edapt Learning Technologies is a Kerala-based EdTech organization
                  committed to making technology education accessible through vernacular-first
                  learning.
                </p>
                <p>
                  As Kerala's official partner of IIT Madras Pravartak, Edapt has empowered more
                  than 400,000 learners across 100+ countries through AI education, digital literacy
                  initiatives, and professional upskilling programs.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {EDAPT_FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
                >
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-[17px] font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-[32px] font-semibold tracking-tight md:text-[40px]">
              Frequently asked <span className="gradient-text">questions</span>
            </h2>
          </div>
          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-[28px] font-semibold tracking-tight md:text-[36px]">
            Ready to join <span className="gradient-text">{batchName}?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            {displayRange} · Live sessions in Malayalam · Limited seats.
          </p>
          <a
            href={regUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full gradient-bg px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(31,10,119,0.55)] transition-transform hover:-translate-y-0.5"
          >
            Register Now
          </a>
        </div>
      </section>
    </>
  );
}
