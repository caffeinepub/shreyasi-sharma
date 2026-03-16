import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Award,
  ChevronDown,
  Film,
  Instagram,
  Loader2,
  Mail,
  Play,
  Star,
  Trophy,
  Tv2,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useGetAwards,
  useGetBio,
  useGetProjects,
  useSubmitContact,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_BIO = `Shreyasi Sharma is an award-winning screenwriter, showrunner, and multihyphenate creative force — writer, director, and actor — who has spent over a decade shaping how India sees itself on screen. At The Viral Fever (TVF), she helped define the platform's storytelling voice during its formative years, pioneering a raw, intimate style of digital narrative that influenced an entire generation of creators.

As Showrunner for multiple seasons of Girls Hostel, she led one of India's most-watched female-led series — celebrated for its sharp dialogue, emotional honesty, and unflinching portrayal of young Indian womanhood. As writer-director-actor at Girliyapa, she conceived and performed sketch comedy that became a benchmark for female-forward digital content in India.

Shreyasi is a pioneer of female storytelling in the Indian digital and OTT space — at a time when women's stories were largely absent from the screen, she insisted on centering them. Her work has been part of a transformation in how India — and the world — understands South Asian women's lives, ambitions, and humor.

Holding a Master's degree in Biotechnology, Shreyasi brings an analytical precision to her craft — dissecting human behavior with the same rigor she once applied to molecular structures. The result is writing that is intellectually sharp, deeply felt, and impossible to forget.`;

const FALLBACK_PROJECTS = [
  {
    title: "Girls Hostel",
    year: BigInt(2018),
    description:
      "Showrunner across multiple seasons of India's most beloved female-led digital series. A story about friendship, ambition, heartbreak, and the chaotic magic of college life — told with unflinching honesty and sharp comedic timing. One of the defining OTT shows of the decade.",
    thumb: "/assets/generated/girls-hostel-thumb.dim_600x400.jpg",
  },
  {
    title: "TVF Originals",
    year: BigInt(2014),
    description:
      "Core creative architect at The Viral Fever during its defining years. Developed the storytelling voice and narrative frameworks that set the standard for Indian digital content — intimate, relatable, culturally specific, and wholly new.",
    thumb: null as string | null,
  },
  {
    title: "Girliyapa Sketches",
    year: BigInt(2016),
    description:
      "Writer, director, and on-screen performer for TVF's female-focused comedy vertical. Created sketch work that pioneered authentic female humor in India's digital landscape — wit-forward narratives that spoke directly to modern Indian women.",
    thumb: null as string | null,
  },
];

const FALLBACK_AWARDS = [
  {
    title: "Shorty Award — Best Web Series (International)",
    year: BigInt(2020),
    won: true,
    detail:
      "Girls Hostel won the Shorty Award for Best Web Series, competing against productions from across the world. The Shorty Awards, presented in New York City, recognize the best in social media and digital content globally. This win marked a historic moment for Indian OTT storytelling on the international stage.",
  },
  {
    title: "Screenwriters Guild of India — Nominated, Best Comedy Drama",
    year: BigInt(2019),
    won: false,
    detail:
      "Nominated by the Screenwriters Guild of India in the Comedy Drama category — recognizing the distinct comedic voice, nuanced female characters, and the craft required to sustain long-form comedic drama across multiple seasons.",
  },
  {
    title: "Exchange4Media — Best Branded Campaign of the Year (Whisper)",
    year: BigInt(2019),
    won: true,
    detail:
      "Won Best Branded Campaign of the Year at Exchange4Media Awards for the Whisper campaign — a landmark branded content collaboration that combined powerful storytelling with purposeful messaging, reaching millions across India.",
  },
  {
    title: "India Content Leadership Awards — Best Humorous Content",
    year: BigInt(2018),
    won: true,
    detail:
      "Girliyapa won Best Humorous Content at the India Content Leadership Awards 2018 for 'No More Dishstress' — a sketch that captured everyday domestic comedy with a sharp, feminist lens and resonated deeply with Indian women online.",
  },
  {
    title: "India Content Leadership Awards — Best Video Marketing Campaign",
    year: BigInt(2018),
    won: true,
    detail:
      "Girliyapa received a Special Mention for Best Content in a Video Marketing Campaign at the India Content Leadership Awards 2018 for Whisper's SitImproper — a branded campaign blending humor with social commentary to challenge gender norms.",
  },
  {
    title: "Shorty Award — Best Comedy (Nominated)",
    year: BigInt(2019),
    won: false,
    detail:
      "Nominated at the Shorty Awards for Best Comedy for work at Girliyapa, recognizing the groundbreaking sketch comedy format that brought female-led humor to millions of digital viewers in India.",
  },
];

const GIRLIYAPA_SHOWS = [
  {
    title: "Pagals",
    seasons: "Season 1 & 2",
    role: "Written by Shreyasi Sharma",
    description:
      "A sharp, spirited comedy about the glorious messiness of female friendship — navigating careers, relationships, and the beautiful absurdity of being a modern Indian woman. Pagals redefined what it meant to be 'crazy' — turning it into a badge of pride worn by women who refuse to fit the mold.",
    thumb: "/assets/generated/pagals-thumb.dim_600x400.jpg",
  },
  {
    title: "The Interns",
    seasons: "Season 1",
    role: "Written by Shreyasi Sharma",
    description:
      "An incisive look at the dream-meets-reality collision of young women entering the workforce. Equal parts comedy and emotional truth, The Interns captures the disorientation and ambition of a generation stepping into a world that wasn't built for them — and deciding to build it themselves.",
    thumb: "/assets/generated/interns-thumb.dim_600x400.jpg",
  },
  {
    title: "Sisters",
    seasons: "Season 1",
    role: "Written & Produced by Shreyasi Sharma",
    description:
      "An intimate portrait of sisterhood — the complicated, beautiful, irreplaceable bond between women who share blood and everything else that comes with it. Sisters broke new ground as a TVF Girliyapa original, produced entirely under Shreyasi's vision.",
    thumb: "/assets/generated/sisters-thumb.dim_600x400.jpg",
  },
];

const PHOTO_STRIP = [
  "/assets/uploads/HEIF-Image-1-2.jpg",
  "/assets/uploads/39656639-95AD-4826-9CF7-F4B237E2F859-4.JPG",
  "/assets/uploads/2043F088-C82D-4328-AF80-845F3A49D253-5.JPG",
  "/assets/uploads/B71341C2-81A1-44E4-81BA-44B446AA6703-6.JPG",
  "/assets/uploads/IMG_6301-7.jpeg",
  "/assets/uploads/2043F088-C82D-4328-AF80-845F3A49D253-1-1.JPG",
  "/assets/uploads/HEIF-Image-3.jpeg",
];

const STATS = [
  { value: "10+", label: "Years in Film & Digital" },
  { value: "5", label: "Original Shows" },
  { value: "2", label: "International Awards" },
  { value: "100M+", label: "Views Across Platforms" },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
      delay: i * 0.1,
    },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  children,
  className = "",
  id,
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "data-ocid"?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      data-ocid={dataOcid}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#about", label: "About", ocid: "nav.about.link" },
    { href: "#work", label: "Work", ocid: "nav.work.link" },
    { href: "#girliyapa", label: "Girliyapa", ocid: "nav.girliyapa.link" },
    { href: "#awards", label: "Awards", ocid: "nav.awards.link" },
    { href: "#contact", label: "Contact", ocid: "nav.contact.link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-blur ${
        scrolled ? "bg-background/80 border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display text-xl font-semibold tracking-wide"
        >
          <span className="gold-text">Shreyasi Sharma</span>
        </a>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-ocid={l.ocid}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
            >
              {l.label}
            </a>
          ))}
        </nav>
        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-foreground"
          data-ocid="nav.toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1">
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background/95 border-b border-border px-6 pb-6"
          >
            <div className="flex flex-col gap-5 pt-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-ocid={l.ocid}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Parallax background portrait */}
      <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
        <img
          src="/assets/uploads/HEIF-Image-1.jpg"
          alt=""
          className="w-full h-full object-cover object-top"
          style={{ transform: "scale(1.1)" }}
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </motion.div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[1] grain-hero pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ opacity: opacityContent }}
        className="relative z-10 flex-1 flex items-center"
      >
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs tracking-[0.4em] uppercase text-gold-DEFAULT font-body mb-6"
            >
              Screenwriter · Showrunner · Director · Actor
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.02] mb-8"
            >
              Shreyasi
              <br />
              <span className="gold-text italic-accent">Sharma</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-body text-lg text-muted-foreground leading-[1.75] max-w-xl mb-10"
            >
              Pioneer of female storytelling in Indian digital & OTT. Creator of
              stories that moved a generation — and changed what Indian cinema
              could be.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href="#work"
                data-ocid="hero.primary_button"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 group"
              >
                <Play className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                View My Work
              </a>
              <a
                href="#contact"
                data-ocid="hero.secondary_button"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-gold-DEFAULT/40 text-foreground font-body text-sm tracking-wider uppercase rounded-sm hover:border-gold-DEFAULT hover:bg-gold-DEFAULT/5 transition-all duration-300"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="relative z-10 pb-10 flex justify-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-5 h-5 text-gold-DEFAULT/50" />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="relative py-10 px-6 border-y border-gold-DEFAULT/15 bg-gradient-to-r from-background via-[oklch(0.16_0.015_65/0.4)] to-background overflow-hidden"
    >
      {/* Decorative line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-DEFAULT/20 to-transparent" />

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className="text-center"
          >
            <p className="font-display text-4xl lg:text-5xl font-bold gold-text mb-1">
              {stat.value}
            </p>
            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About({ bio }: { bio?: string }) {
  const text = bio ?? FALLBACK_BIO;
  const paragraphs = text.split("\n\n").filter(Boolean);
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <Section id="about" data-ocid="about.section" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.3em] uppercase text-gold-DEFAULT font-body mb-4"
        >
          About
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-16"
        >
          Author of <br />
          <em className="gold-text" style={{ fontStyle: "italic" }}>
            True Stories
          </em>
        </motion.h2>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left column */}
          <div className="space-y-8">
            {/* Main portrait */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -inset-3 border border-gold-DEFAULT/10" />
              <div className="absolute -inset-6 border border-gold-DEFAULT/5" />
              <img
                src="/assets/uploads/HEIF-Image-1.jpg"
                alt="Shreyasi Sharma"
                className="relative w-full object-cover object-top rounded-sm"
                style={{ height: "420px" }}
              />
              {/* Gold overlay on bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
            </motion.div>

            {/* Quick facts */}
            <motion.div variants={fadeUp} className="space-y-4">
              {[
                {
                  label: "Roles",
                  value: "Writer · Director · Actor · Showrunner",
                },
                { label: "Platform", value: "TVF · Girliyapa · OTT" },
                { label: "Education", value: "M.Sc. Biotechnology" },
                { label: "Experience", value: "10+ Years" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-b border-border/40 pb-3"
                >
                  <p className="text-xs text-muted-foreground tracking-widest uppercase font-body mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-body text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {paragraphs.map((para, i) => (
              <motion.p
                key={para.slice(0, 30)}
                variants={fadeUp}
                custom={i * 0.05}
                className="font-body text-muted-foreground leading-[1.85] text-base lg:text-lg"
              >
                {para.trim()}
              </motion.p>
            ))}

            {/* Pioneer callout */}
            <motion.blockquote
              variants={fadeUp}
              className="border-l-2 border-gold-DEFAULT/50 pl-6 mt-8"
            >
              <p className="font-display text-xl font-semibold text-foreground leading-snug italic">
                "When women's stories were absent from the Indian screen, she
                insisted on centering them — and changed what Indian digital
                storytelling could be."
              </p>
            </motion.blockquote>
          </div>
        </div>

        {/* Photo strip */}
        <motion.div variants={fadeUp} className="mt-20">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-DEFAULT/60 font-body mb-6">
            Behind the Camera & On Screen
          </p>
          <div
            ref={stripRef}
            className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {PHOTO_STRIP.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                className="relative shrink-0 snap-start overflow-hidden rounded-sm group cursor-pointer"
                style={{ width: "200px", height: "260px" }}
              >
                <img
                  src={src}
                  alt={`Shreyasi Sharma ${i + 1}`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border border-gold-DEFAULT/0 group-hover:border-gold-DEFAULT/30 transition-colors duration-300 rounded-sm" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Work ─────────────────────────────────────────────────────────────────────
const PROJECT_OCIDS = ["work.item.1", "work.item.2", "work.item.3"];

const PROJECT_META = [
  {
    thumb: "/assets/generated/girls-hostel-thumb.dim_600x400.jpg",
    accent: "oklch(0.25 0.06 65)",
  },
  { thumb: null as string | null, accent: "oklch(0.20 0.04 280)" },
  { thumb: null as string | null, accent: "oklch(0.22 0.05 120)" },
];

function Work({
  projects,
}: { projects?: Array<{ title: string; year: bigint; description: string }> }) {
  const items = projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;

  return (
    <Section
      id="work"
      data-ocid="work.section"
      className="py-28 px-6 bg-[oklch(0.14_0.007_280)]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.3em] uppercase text-gold-DEFAULT font-body mb-4"
        >
          Selected Work
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-16"
        >
          Stories That
          <br />
          <span className="gold-text">Moved a Generation</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((project, i) => {
            const meta = PROJECT_META[i] ?? PROJECT_META[0];
            const fallbackThumb = (
              FALLBACK_PROJECTS[i] as (typeof FALLBACK_PROJECTS)[0] | undefined
            )?.thumb;
            const thumb = fallbackThumb ?? meta.thumb;
            return (
              <motion.article
                key={project.title}
                variants={fadeUp}
                custom={i}
                data-ocid={PROJECT_OCIDS[i] ?? `work.item.${i + 1}`}
                className="relative bg-card border border-border/50 rounded-sm group hover:border-gold-DEFAULT/40 transition-all duration-500 hover:shadow-gold overflow-hidden"
              >
                {/* Thumbnail */}
                {thumb && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={thumb}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    {/* Play hover button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full border border-gold-DEFAULT/60 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <Film className="w-5 h-5 text-gold-DEFAULT" />
                      </div>
                    </div>
                  </div>
                )}

                {!thumb && (
                  <div
                    className="relative aspect-video flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${meta.accent}, oklch(0.12 0.008 280))`,
                    }}
                  >
                    <Film className="w-10 h-10 text-gold-DEFAULT/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>
                )}

                <div className="p-7">
                  {/* Year watermark */}
                  <div className="absolute top-4 right-6 font-display text-5xl font-bold text-foreground/5 leading-none select-none">
                    {project.year.toString()}
                  </div>

                  <p className="text-xs tracking-widest uppercase text-muted-foreground font-body mb-1">
                    {project.year.toString()}
                  </p>
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">
                    {project.title}
                  </h3>

                  <p className="font-body text-sm text-muted-foreground leading-[1.8]">
                    {project.description}
                  </p>

                  <div className="mt-5 h-px bg-gradient-to-r from-gold-DEFAULT/30 to-transparent group-hover:from-gold-DEFAULT/60 transition-all duration-500" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── Girliyapa Shows ──────────────────────────────────────────────────────────
const GIRLIYAPA_OCIDS = [
  "girliyapa.item.1",
  "girliyapa.item.2",
  "girliyapa.item.3",
];

function GirliyapaShows() {
  return (
    <Section
      id="girliyapa"
      data-ocid="girliyapa.section"
      className="py-28 px-6 bg-[oklch(0.12_0.008_60)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-4">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-DEFAULT font-body">
            TVF Girliyapa · Original Series
          </p>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-6"
        >
          Girliyapa
          <br />
          <span className="gold-text">Original Shows</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="font-body text-muted-foreground max-w-2xl mb-16 leading-relaxed"
        >
          Three landmark series written and produced for TVF Girliyapa — each
          one a distinct voice in the movement that redefined female
          storytelling in Indian digital and OTT content.
        </motion.p>

        {/* Show cards with thumbnails */}
        <div className="grid md:grid-cols-3 gap-6">
          {GIRLIYAPA_SHOWS.map((show, i) => (
            <motion.article
              key={show.title}
              variants={fadeUp}
              custom={i}
              data-ocid={GIRLIYAPA_OCIDS[i]}
              className="relative bg-card border border-gold-DEFAULT/15 rounded-sm group hover:border-gold-DEFAULT/40 transition-all duration-500 hover:shadow-[0_0_40px_oklch(0.72_0.15_60/0.15)] overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={show.thumb}
                  alt={show.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                {/* Seasons badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className="border-gold-DEFAULT/50 text-gold-DEFAULT bg-background/80 backdrop-blur-sm font-body text-[10px] tracking-wider"
                  >
                    {show.seasons}
                  </Badge>
                </div>
              </div>

              <div className="p-7">
                {/* Decorative number */}
                <div className="absolute top-4 right-5 font-display text-[4.5rem] font-bold text-gold-DEFAULT/[0.06] leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <Tv2 className="w-4 h-4 text-gold-DEFAULT mt-0.5 shrink-0" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {show.title}
                  </h3>
                </div>

                {/* Role badge */}
                <Badge
                  variant="outline"
                  className="border-gold-DEFAULT/25 text-gold-DEFAULT/80 bg-gold-DEFAULT/5 font-body text-[10px] tracking-wider mb-5"
                >
                  {show.role}
                </Badge>

                <p className="font-body text-sm text-muted-foreground leading-[1.8]">
                  {show.description}
                </p>

                <div className="mt-5 h-px bg-gradient-to-r from-gold-DEFAULT/30 to-transparent group-hover:from-gold-DEFAULT/60 transition-all duration-500" />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          variants={fadeUp}
          className="mt-16 border border-gold-DEFAULT/20 bg-gold-DEFAULT/5 rounded-sm p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="shrink-0 w-12 h-12 rounded-full border border-gold-DEFAULT/40 bg-gold-DEFAULT/10 flex items-center justify-center">
            <Tv2 className="w-5 h-5 text-gold-DEFAULT" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground mb-1">
              A body of work unlike any other in Indian digital content
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Across Pagals, The Interns, and Sisters, Shreyasi wrote and
              produced stories centered on women's interiority — their
              ambitions, contradictions, bonds, and joy — at a time when those
              stories simply did not exist on Indian screens.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Awards ───────────────────────────────────────────────────────────────────
type AwardItem = { title: string; year: bigint; won: boolean; detail?: string };

const AWARD_OCIDS = [
  "awards.item.1",
  "awards.item.2",
  "awards.item.3",
  "awards.item.4",
  "awards.item.5",
  "awards.item.6",
];

function Awards({
  awards,
}: { awards?: Array<{ title: string; year: bigint; won: boolean }> }) {
  const raw = awards && awards.length > 0 ? awards : FALLBACK_AWARDS;
  const items: AwardItem[] = raw.map((a, i) => ({
    ...a,
    detail: (FALLBACK_AWARDS[i] as AwardItem | undefined)?.detail,
  }));

  return (
    <Section id="awards" data-ocid="awards.section" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.3em] uppercase text-gold-DEFAULT font-body mb-4"
        >
          Recognition
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-4"
        >
          Awards &
          <br />
          <span className="gold-text">Accolades</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="font-body text-muted-foreground max-w-2xl mb-16 leading-relaxed"
        >
          Recognized internationally and nationally for pioneering
          female-forward storytelling in India's digital and OTT landscape.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {items.slice(0, 6).map((award, i) => (
            <motion.div
              key={award.title}
              variants={fadeUp}
              custom={i}
              data-ocid={AWARD_OCIDS[i] ?? `awards.item.${i + 1}`}
              className="relative border border-border/40 bg-card p-8 rounded-sm group hover:border-gold-DEFAULT/40 transition-all duration-500 hover:shadow-gold-sm overflow-hidden"
            >
              {/* Background shimmer for winners */}
              {award.won && (
                <div className="absolute inset-0 bg-gradient-to-br from-gold-DEFAULT/[0.04] to-transparent pointer-events-none" />
              )}
              <div className="flex items-start gap-5">
                <div
                  className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-sm border ${
                    award.won
                      ? "border-gold-DEFAULT/50 bg-gold-DEFAULT/10"
                      : "border-border/50 bg-muted/30"
                  }`}
                >
                  {award.won ? (
                    <Trophy className="w-5 h-5 text-gold-DEFAULT" />
                  ) : (
                    <Star className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      {award.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs text-muted-foreground font-body tracking-wider">
                      {award.year.toString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-body tracking-wider ${
                        award.won
                          ? "border-gold-DEFAULT/40 text-gold-DEFAULT bg-gold-DEFAULT/5"
                          : "border-border/40 text-muted-foreground"
                      }`}
                    >
                      {award.won ? "Winner" : "Nominated"}
                    </Badge>
                  </div>
                  {award.detail && (
                    <p className="font-body text-xs text-muted-foreground leading-[1.75] border-t border-border/30 pt-4">
                      {award.detail}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mutation = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ name, email, message });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Section
      id="contact"
      data-ocid="contact.section"
      className="py-28 px-6 bg-[oklch(0.14_0.007_280)]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
          {/* Left */}
          <div>
            <motion.p
              variants={fadeUp}
              className="text-xs tracking-[0.3em] uppercase text-gold-DEFAULT font-body mb-4"
            >
              Get in Touch
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-6"
            >
              Let's Create
              <br />
              <span className="gold-text">Something</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-body text-muted-foreground leading-relaxed mb-8"
            >
              Whether you're a producer, collaborator, or fellow storyteller —
              Shreyasi is open to conversations about compelling projects.
            </motion.p>

            {/* Contact links */}
            <motion.div variants={fadeUp} className="space-y-4">
              <a
                href="mailto:shreyasi.sharma88@gmail.com"
                data-ocid="contact.link"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-sm border border-gold-DEFAULT/30 bg-gold-DEFAULT/5 flex items-center justify-center group-hover:border-gold-DEFAULT/60 group-hover:bg-gold-DEFAULT/10 transition-all duration-300">
                  <Mail className="w-4 h-4 text-gold-DEFAULT" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground font-body mb-0.5">
                    Email
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-gold-DEFAULT transition-colors">
                    shreyasi.sharma88@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://instagram.com/shreyasi.n.sharma"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.secondary_button"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-sm border border-gold-DEFAULT/30 bg-gold-DEFAULT/5 flex items-center justify-center group-hover:border-gold-DEFAULT/60 group-hover:bg-gold-DEFAULT/10 transition-all duration-300">
                  <Instagram className="w-4 h-4 text-gold-DEFAULT" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground font-body mb-0.5">
                    Instagram
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-gold-DEFAULT transition-colors">
                    @shreyasi.n.sharma
                  </p>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div variants={fadeUp}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  data-ocid="contact.success_state"
                  className="border border-gold-DEFAULT/30 bg-gold-DEFAULT/5 rounded-sm p-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full border border-gold-DEFAULT/40 bg-gold-DEFAULT/10 flex items-center justify-center mx-auto mb-5">
                    <Award className="w-6 h-6 text-gold-DEFAULT" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3">
                    Message Received
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">
                    Thank you for reaching out. Shreyasi will get back to you
                    soon.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="border-gold-DEFAULT/30 text-foreground hover:border-gold-DEFAULT/60 font-body tracking-wider text-xs uppercase"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  data-ocid="contact.panel"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs tracking-widest uppercase text-muted-foreground font-body"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      data-ocid="contact.input"
                      placeholder="Your name"
                      className="bg-background border-border/50 focus:border-gold-DEFAULT/50 font-body text-foreground placeholder:text-muted-foreground/50 rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs tracking-widest uppercase text-muted-foreground font-body"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="bg-background border-border/50 focus:border-gold-DEFAULT/50 font-body text-foreground placeholder:text-muted-foreground/50 rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-xs tracking-widest uppercase text-muted-foreground font-body"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      data-ocid="contact.textarea"
                      placeholder="Tell me about your project..."
                      className="bg-background border-border/50 focus:border-gold-DEFAULT/50 font-body text-foreground placeholder:text-muted-foreground/50 rounded-sm resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    disabled={mutation.isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body tracking-wider text-xs uppercase rounded-sm py-6"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                  {mutation.isError && (
                    <p
                      className="text-xs text-destructive font-body text-center"
                      data-ocid="contact.error_state"
                    >
                      Something went wrong. Please try again.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-semibold gold-text mb-1">
            Shreyasi Sharma
          </p>
          <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
            Screenwriter · Showrunner · Director · Actor
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-3">
          <div className="flex items-center gap-5">
            <a
              href="mailto:shreyasi.sharma88@gmail.com"
              data-ocid="footer.link"
              className="text-muted-foreground hover:text-gold-DEFAULT transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/shreyasi.n.sharma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold-DEFAULT transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="font-body text-xs text-muted-foreground/50">
            © {year}. Built with ♥ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-DEFAULT/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function Portfolio() {
  const bioQuery = useGetBio();
  const projectsQuery = useGetProjects();
  const awardsQuery = useGetAwards();

  return (
    <div className="grain">
      <Nav />
      <main>
        <Hero />
        <StatsStrip />
        <About bio={bioQuery.data} />
        <Work projects={projectsQuery.data} />
        <GirliyapaShows />
        <Awards awards={awardsQuery.data} />
        <Contact />
      </main>
      <Footer />
      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border font-body text-foreground",
            title: "text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Portfolio />
    </QueryClientProvider>
  );
}
