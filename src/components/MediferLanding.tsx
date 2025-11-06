// src/components/MediferLanding.tsx
import React, {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
  type TargetAndTransition,
} from "framer-motion";
import HeroAmericasMapBG from "./HeroAmericasMapBG";

/* ========================== Brand ========================== */
const C = {
  blue: "#0574bb",
  teal: "#009fa5",
  gray: "#888989",
  white: "#f8f7f7",
};

const HUB_VIDEO = { webm: "/hub-panama.webm", mp4: "/hub-panama.mp4" };
const CANAL_POSTER = "/hero-canal.webp";

/** === GALERÍA: coloca tus 6 fotos en /public/gallery/ === */
const GALLERY: string[] = [
  "/gallery/01.webp",
  "/gallery/02.webp",
  "/gallery/03.webp",
  "/gallery/04.webp",
  "/gallery/05.webp",
  "/gallery/06.webp",
];

type PlaneTheme = "auto" | "light" | "dark";
type Lang = "es" | "en";

/* =================== i18n básico (ES/EN) =================== */
const T: Record<Lang, Record<string, string>> = {
  es: {
    // Header
    nav_logistica: "Logística",
    nav_cadena: "Cadena de Frío",
    nav_cobertura: "Cobertura",
    nav_contacto: "Contacto",

    // Hero
    hero_l1: "Conectando la salud,",
    hero_l2: "Generando confianza.",
    hero_chip: "Distribución farmacéutica internacional",
    hero_lead: "Hub estratégico con rutas optimizadas hacia Centro y Suramérica.",
    hero_cta_capacidades: "Ver capacidades",
    hero_cta_hablemos: "Hablemos",

    // Hub Panamá
    hub_kicker: "Panamá: Hub logístico",
    hub_title: "Enlace natural entre océanos, con tiempos de tránsito imbatibles.",
    hub_lead:
      "Consolidamos cargas, gestionamos documentación y aseguramos cadena de frío con operadores homologados. Nuestra ubicación reduce costos totales y maximiza la disponibilidad de producto en destino.",
    hub_stat1: "Lead time típico a Centroamérica",
    hub_stat2: "Lead time típico a Suramérica",
    hub_stat3: "Monitoreo y trazabilidad",

    // Unificado
    uni_k_logistica: "Logística",
    uni_t_logistica: "Logística integral",
    uni_l_logistica:
      "Consolidación, documentación y operadores homologados para LATAM y conexiones intercontinentales.",
    uni_card_hub: "Hub Panamá",
    uni_card_hub_d: "Tránsitos optimizados LATAM + conexiones intercontinentales.",
    uni_card_route: "Ruteo y costos",
    uni_card_route_d: "Optimización de rutas y reducción de costo total entregado.",
    uni_card_comp: "Compliance",
    uni_card_comp_d: "Procesos auditables, SOPs y partners homologados.",

    uni_k_temp: "Temperaturas",
    uni_t_temp: "Cadena de frío",
    uni_l_temp: "Control térmico, registros y embalaje validado para fármacos sensibles.",
    uni_temp_1_big: "2–8 °C",
    uni_temp_1_small: "Manejo refrigerado",
    uni_temp_2_big: "15–25 °C",
    uni_temp_2_small: "Controlado",
    uni_temp_3_big: "−20 °C",
    uni_temp_3_small: "Congelado",

    uni_k_cov: "Alcance",
    uni_t_cov: "Cobertura global",
    uni_l_cov: "Centro y Suramérica.",
    uni_badge_ca: "Centroamérica",
    uni_badge_sa: "Suramérica",

    // Lightbox
    lb_close: "Cerrar",
    photo: "Foto",

    // Contacto
    contact_title: "Conversemos",
    contact_lead: "Cuéntanos tu necesidad logística y te proponemos la mejor ruta.",
    f_name: "Nombre",
    f_company: "Empresa",
    f_email: "Email",
    f_phone: "Teléfono",
    f_msg: "Mensaje",
    f_send: "Enviar",
  },
  en: {
    // Header
    nav_logistica: "Logistics",
    nav_cadena: "Cold Chain",
    nav_cobertura: "Coverage",
    nav_contacto: "Contact",

    // Hero
    hero_l1: "Connecting Health,",
    hero_l2: "Delivering Trust.",
    hero_chip: "International pharmaceutical distribution",
    hero_lead: "Strategic hub with optimized routes to Central and South America.",
    hero_cta_capacidades: "See capabilities",
    hero_cta_hablemos: "Let’s talk",

    // Hub Panamá
    hub_kicker: "Panama: Logistics hub",
    hub_title: "Natural link between oceans with unbeatable transit times.",
    hub_lead:
      "We consolidate cargo, handle documentation and secure the cold chain with approved operators. Our location reduces total costs and maximizes product availability at destination.",
    hub_stat1: "Typical lead time to Central America",
    hub_stat2: "Typical lead time to South America",
    hub_stat3: "Monitoring & traceability",

    // Unified
    uni_k_logistica: "Logistics",
    uni_t_logistica: "Integrated logistics",
    uni_l_logistica:
      "Consolidation, documentation and approved operators for LATAM and intercontinental connections.",
    uni_card_hub: "Panama Hub",
    uni_card_hub_d: "Optimized LATAM transits + intercontinental connections.",
    uni_card_route: "Routing & costs",
    uni_card_route_d: "Route optimization and reduced total delivered cost.",
    uni_card_comp: "Compliance",
    uni_card_comp_d: "Auditable processes, SOPs and approved partners.",

    uni_k_temp: "Temperatures",
    uni_t_temp: "Cold chain",
    uni_l_temp: "Thermal control, records and validated packaging for sensitive drugs.",
    uni_temp_1_big: "2–8 °C",
    uni_temp_1_small: "Refrigerated handling",
    uni_temp_2_big: "15–25 °C",
    uni_temp_2_small: "Controlled",
    uni_temp_3_big: "−20 °C",
    uni_temp_3_small: "Frozen",

    uni_k_cov: "Reach",
    uni_t_cov: "Global coverage",
    uni_l_cov: "Central & South America.",
    uni_badge_ca: "Central America",
    uni_badge_sa: "South America",

    // Lightbox
    lb_close: "Close",
    photo: "Photo",

    // Contact
    contact_title: "Let’s talk",
    contact_lead: "Tell us your logistics need and we’ll propose the best route.",
    f_name: "Name",
    f_company: "Company",
    f_email: "Email",
    f_phone: "Phone",
    f_msg: "Message",
    f_send: "Send",
  },
};

function useLang(): [Lang, (l: Lang) => void, (k: string) => string] {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("medifer.lang")) as Lang | null;
    return saved === "en" || saved === "es" ? saved : "es";
  });
  useEffect(() => {
    localStorage.setItem("medifer.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (k: string) => T[lang][k] ?? k;
  return [lang, setLang, t];
}

/* ========= Responsive helper: móvil < 768px ========= */
function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpointPx : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpointPx]);
  return isMobile;
}

/* =========== Hooks tema/scroll =========== */
function usePlaneTheme(sectionSelectors: string = "[data-plane]"): PlaneTheme {
  const [theme, setTheme] = useState<PlaneTheme>("auto");
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(sectionSelectors));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const v = visible[0].target.getAttribute("data-plane");
          if (v === "light" || v === "dark" || v === "auto") setTheme(v);
          else setTheme("auto");
        }
      },
      { threshold: [0.6] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionSelectors]);
  return theme;
}

/* Hook: cambia el tema del header SOLO si estás sobre #contacto */
function useHeaderLogoTheme(
  contactSelector: string = "#contacto",
  headerHeight = 72
): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(contactSelector);
    if (!el) return;

    let ticking = false;

    const calc = () => {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      const y = window.scrollY + headerHeight; // borde inferior del header
      const isOnContact = y >= top && y < bottom;
      setTheme(isOnContact ? "dark" : "light");
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        calc();
        ticking = false;
      });
    };

    const onResize = () => calc();

    calc(); // primer cálculo
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [contactSelector, headerHeight]);

  return theme;
}

function useScrollDirection(): "up" | "down" {
  const [dir, setDir] = useState<"up" | "down">("down");
  useEffect(() => {
    let lastY = window.scrollY;
    let rAF = 0;
    const onScroll = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 2) setDir(y > lastY ? "down" : "up");
        lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return dir;
}

/* ===================== Contador ===================== */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function useCountUp(active: boolean, to: number, durationMs = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / durationMs, 1);
      setVal(Math.round(to * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, to, durationMs]);
  return val;
}
function Counter({
  to,
  suffix,
  startWhenInViewRef,
  durationMs = 1100,
}: {
  to: number;
  suffix?: string;
  startWhenInViewRef: React.RefObject<HTMLElement>;
  durationMs?: number;
}) {
  const inView = useInView(startWhenInViewRef, { amount: 0.4, once: true });
  const val = useCountUp(inView, to, durationMs);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

/* ===================== Página ===================== */
const MediferLanding: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile(768); // móvil: ocultar mapa y avión
  const [lang, setLang, t] = useLang();

  // Avión siguiendo el scroll (solo desktop/tablet)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, -40, -80, -120]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 120, 260, 430, 600]);
  const rotatePath = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 3, -4]);

  const planeTheme = usePlaneTheme();
  const dir = useScrollDirection();

  // Header/logo theme: SOLO cambia en #contacto
  const navTheme = useHeaderLogoTheme("#contacto", 72);
  const dirRotation = dir === "down" ? 180 : 0;

  const PLANE_SRC = "/plane.png";
  const LOGO_DARK = "/logo-dark.png";
  const LOGO_LIGHT = "/logo-light.png";
  const isLight = navTheme === "light";
  const logoSrc = isLight ? LOGO_LIGHT : LOGO_DARK;

  const planeFilter =
    planeTheme === "light"
      ? "brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.25))"
      : "drop-shadow(0 4px 12px rgba(0,0,0,0.25))";

  const headerText = isLight ? "text-white" : "text-slate-900";
  const linkHover = isLight ? "hover:bg-white/10" : "hover:bg-slate-900/10";

  return (
    <div className="w-full min-h-screen text-white bg-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={[
            "mx-auto max-w-7xl px-4 py-3 flex items-center justify-between",
            "transition-none",
            headerText,
          ].join(" ")}
          style={{ background: "transparent" }}
        >
          <div className="flex items-center gap-3">
            <img
              key={logoSrc}
              src={logoSrc}
              alt="Medifer Group"
              className="h-12 w-auto md:h-14 transition-opacity duration-150"
              style={{
                filter: isLight
                  ? "drop-shadow(0 1px 0 rgba(0,0,0,.35))"
                  : "drop-shadow(0 1px 0 rgba(255,255,255,.15))",
              }}
            />
          </div>

          {/* NAV desktop/tablet; móvil: oculto (solo idioma) */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-2 text-sm font-medium">
              <a href="#logistica" className={`px-3 py-2 rounded-full ${linkHover} transition-none`}>
                {t("nav_logistica")}
              </a>
              <a href="#cadena" className={`px-3 py-2 rounded-full ${linkHover} transition-none`}>
                {t("nav_cadena")}
              </a>
              <a href="#cobertura" className={`px-3 py-2 rounded-full ${linkHover} transition-none`}>
                {t("nav_cobertura")}
              </a>
              <a
                href="#contacto"
                className="ml-2 rounded-full px-4 py-2 font-semibold text-white transition-none"
                style={{ background: C.teal }}
              >
                {t("nav_contacto")}
              </a>
            </nav>

            {/* Idioma toggle (desktop/tablet) */}
            <LangToggle lang={lang} onChange={setLang} theme={navTheme} />
          </div>

          {/* Móvil: SOLO switch de idioma */}
          <div className="md:hidden">
            <LangToggle lang={lang} onChange={setLang} compact theme={navTheme} />
          </div>
        </div>
      </header>

      {/* Track */}
      <main ref={trackRef} className="relative">
        {/* Avión — oculto en móvil */}
        {!isMobile && (
          <motion.div
            style={{ x, y, rotate: rotatePath }}
            className="pointer-events-none fixed z-40 right-6 top-24"
          >
            <motion.img
              src={PLANE_SRC}
              alt="Avión Medifer"
              style={{ filter: planeFilter }}
              animate={{ rotate: dirRotation }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="w-12 h-12"
            />
          </motion.div>
        )}

        {/* HERO — mapa oculto en móvil */}
        <section
          id="hero"
          data-plane="light"
          data-nav="light"
          className="relative h-screen overflow-hidden flex items-center"
          style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.teal})` }}
        >
          {!isMobile && <HeroAmericasMapBG offsetY={28} />}
          <div className="relative z-10 mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-white/15 ring-1 ring-white/20">
                <span className="w-2 h-2 rounded-full bg-white" />
                {t("hero_chip")}
              </div>

              {/* Título en dos líneas controladas con balance */}
              <h1
                className={[
                  "mt-4 font-extrabold leading-tight font-[nunito]",
                  ((): string => {
                    if (typeof window !== "undefined" && window.innerWidth >= 768) {
                      return lang === "es" ? "text-[40px] md:text-[56px]" : "text-[44px] md:text-6xl";
                    }
                    return "text-4xl";
                  })(),
                ].join(" ")}
                style={{ textWrap: "balance" as any }}
              >
                <span className="block max-w-[22ch]">{t("hero_l1")}</span>
                <span className="block max-w-[22ch] opacity-90">{t("hero_l2")}</span>
              </h1>

              <p className="mt-5 text-white/90 max-w-xl">{t("hero_lead")}</p>
              <div className="mt-8 flex gap-3">
                <a
                  href="#logistica"
                  className="rounded-full px-5 py-3 font-semibold text-slate-900 bg-white"
                >
                  {t("hero_cta_capacidades")}
                </a>
                <a
                  href="#contacto"
                  className="rounded-full px-5 py-3 font-semibold border border-white/40"
                >
                  {t("hero_cta_hablemos")}
                </a>
              </div>
            </div>
            <div className="hidden md:block" />
          </div>
        </section>

        {/* VIDEO Hub Panamá (con contadores) */}
        <HubPanamaSection video={HUB_VIDEO} poster={CANAL_POSTER} t={t} />

        {/* ======= SECCIÓN ÚNICA: REVEAL POR SCROLL + carrusel inline ======= */}
        <UnifiedInfoSection t={t} />

        {/* Contacto (sin toggle duplicado) */}
        <section
          id="contacto"
          data-plane="dark"
          data-nav="dark"
          className="relative bg-white text-slate-900"
          style={{ minHeight: "100vh" }}
        >
          <Wrap className="py-24">
            <div className="mb-6">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-2">{t("contact_title")}</h2>
              <p className="text-slate-600">{t("contact_lead")}</p>
            </div>

            <form className="grid md:grid-cols-2 gap-4 max-w-3xl">
              <input className="px-4 py-3 rounded-xl bg-slate-100" placeholder={t("f_name")} />
              <input className="px-4 py-3 rounded-xl bg-slate-100" placeholder={t("f_company")} />
              <input className="px-4 py-3 rounded-xl bg-slate-100" placeholder={t("f_email")} />
              <input className="px-4 py-3 rounded-xl bg-slate-100" placeholder={t("f_phone")} />
              <textarea
                className="md:col-span-2 px-4 py-3 rounded-xl bg-slate-100"
                rows={5}
                placeholder={t("f_msg")}
              />
              <button
                type="button"
                className="md:col-span-2 rounded-xl px-5 py-3 font-semibold text-white"
                style={{ background: C.blue }}
              >
                {t("f_send")}
              </button>
            </form>
          </Wrap>
        </section>
      </main>
    </div>
  );
};

export default MediferLanding;

/* =================== Helpers =================== */
function Wrap({ className = "", children }: PropsWithChildren<{ className?: string }>): JSX.Element {
  return <div className={`mx-auto max-w-7xl px-6 ${className}`}>{children}</div>;
}
const Feature: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="rounded-2xl p-6 bg-slate-100/80">
    <h3 className="font-extrabold text-xl mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

/* ======= Selector de idioma (con tema adaptativo) ======= */
function LangToggle({
  lang,
  onChange,
  compact = false,
  theme = "light",
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
  compact?: boolean;
  theme?: "light" | "dark";
}) {
  const isLight = theme === "light";
  const containerClass = isLight
    ? "backdrop-blur bg-white/10 border-white/20"
    : "backdrop-blur bg-slate-900/5 border-slate-900/20";
  const activeClass = isLight
    ? "bg-white text-slate-900"
    : "bg-slate-900 text-white";
  const idleClass = isLight ? "text-white/90" : "text-slate-900/75";

  return (
    <div
      className={`flex items-center rounded-full border ${compact ? "px-1 py-1" : "px-1.5 py-1.5"} ${containerClass}`}
      role="group"
      aria-label="Language switch"
      style={{ boxShadow: isLight ? "0 0 0 1px rgba(255,255,255,.05) inset" : "0 0 0 1px rgba(0,0,0,.03) inset" }}
    >
      <button
        onClick={() => onChange("es")}
        className={`px-2 rounded-full text-sm font-semibold transition-colors ${lang === "es" ? activeClass : idleClass}`}
        aria-pressed={lang === "es"}
      >
        ES
      </button>
      <button
        onClick={() => onChange("en")}
        className={`px-2 rounded-full text-sm font-semibold transition-colors ${lang === "en" ? activeClass : idleClass}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}

/* ======= Hub Panamá con video + counters ======= */
function HubPanamaSection({
  video,
  poster,
  imgSrc,
  t,
}: {
  video?: { webm?: string; mp4?: string };
  poster?: string;
  imgSrc?: string;
  t: (k: string) => string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [supports, setSupports] = useState({ webm: true, mp4: true });

  useEffect(() => {
    const v = document.createElement("video");
    setSupports({
      webm:
        !!v.canPlayType &&
        v.canPlayType("video/webm; codecs=vp9,vorbis").length > 0,
      mp4:
        !!v.canPlayType &&
        v.canPlayType("video/mp4; codecs=avc1.42E01E,mp4a.40.2").length > 0,
    });
  }, []);
  useEffect(() => {
    const el = vidRef.current;
    if (!el) return;
    const tryPlay = () => el.play().catch(() => {});
    el.addEventListener("canplay", tryPlay, { once: true });
    setTimeout(tryPlay, 300);
    return () => el.removeEventListener("canplay", tryPlay);
  }, [video?.webm, video?.mp4]);

  const showVideo =
    !!video && ((video.webm && supports.webm) || (video.mp4 && supports.mp4));

  return (
    <section
      id="hub-panama"
      data-plane="light"
      data-nav="light"
      ref={sectionRef}
      className="relative text-white"
      style={{ minHeight: "70vh" }}
    >
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            ref={vidRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            poster={poster}
            key={(video.webm || "") + (video.mp4 || "")}
          >
            {video.webm && supports.webm && (
              <source src={video.webm} type="video/webm" />
            )}
            {video.mp4 && supports.mp4 && (
              <source src={video.mp4} type="video/mp4" />
            )}
          </video>
        ) : (
          <img
            src={imgSrc || poster || "/hero-canal.webp"}
            alt="Canal de Panamá"
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/35 to-transparent" />
      </div>

      <Wrap className="relative py-20">
        <div className="max-w-3xl">
          <span className="inline-block text-xs tracking-wide uppercase opacity-80 mb-3">
            {t("hub_kicker")}
          </span>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{t("hub_title")}</h2>
          <p className="text-white/90 mb-8">{t("hub_lead")}</p>

          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              title={<><Counter to={72} suffix=" h" startWhenInViewRef={sectionRef} /></>}
              desc={t("hub_stat1")}
            />
            <StatCard
              title={<><Counter to={96} startWhenInViewRef={sectionRef} /> – <Counter to={120} suffix=" h" startWhenInViewRef={sectionRef} /></>}
              desc={t("hub_stat2")}
            />
            <StatCard
              title={<><Counter to={24} startWhenInViewRef={sectionRef} />/<span>7</span></>}
              desc={t("hub_stat3")}
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}
function StatCard({ title, desc }: { title: ReactNode; desc: string }) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/15">
      <div className="text-3xl font-extrabold leading-none">{title}</div>
      <div className="text-white/90 mt-2">{desc}</div>
    </div>
  );
}

/* ======= Sección unificada con reveal por scroll + carrusel inline ======= */
function UnifiedInfoSection({ t }: { t: (k: string) => string }) {
  return (
    <section
      id="unificado"
      data-plane="light"
      data-nav="light"
      className="relative"
      style={{ minHeight: "180vh" }}
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0b1220 0%, #0e1628 60%, #0b1220 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="relative mx-auto max-w-7xl px-6 py-28">
        <RevealBlock
          kicker={t("uni_k_logistica")}
          title={t("uni_t_logistica")}
          lead={t("uni_l_logistica")}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard index={0} title={t("uni_card_hub")} desc={t("uni_card_hub_d")} />
            <InfoCard index={1} title={t("uni_card_route")} desc={t("uni_card_route_d")} />
            <InfoCard index={2} title={t("uni_card_comp")} desc={t("uni_card_comp_d")} />
          </div>
        </RevealBlock>

        <RevealBlock
          kicker={t("uni_k_temp")}
          title={t("uni_t_temp")}
          lead={t("uni_l_temp")}
        >
          <ul className="grid md:grid-cols-3 gap-6 text-white/90">
            <MiniCard index={0} big={t("uni_temp_1_big")} small={t("uni_temp_1_small")} />
            <MiniCard index={1} big={t("uni_temp_2_big")} small={t("uni_temp_2_small")} />
            <MiniCard index={2} big={t("uni_temp_3_big")} small={t("uni_temp_3_small")} />
          </ul>
        </RevealBlock>

        <RevealBlock
          kicker={t("uni_k_cov")}
          title={t("uni_t_cov")}
          lead={t("uni_l_cov")}
        >
          <div className="grid md:grid-cols-3 gap-6 text-white/90">
            <Badge index={0}>{t("uni_badge_ca")}</Badge>
            <Badge index={1}>{t("uni_badge_sa")}</Badge>
          </div>
        </RevealBlock>

        {/* Carrusel inline */}
        <InlineMarquee images={GALLERY} t={t} />
      </div>
    </section>
  );
}

/* ========= CARRUSEL INFINITO INLINE + LIGHTBOX ========= */
function InlineMarquee({ images, t }: { images: string[]; t: (k: string) => string }) {
  const [open, setOpen] = useState<string | null>(null);

  // Duplicamos la lista para loop perfecto
  const track = [...images, ...images];

  // Velocidad (ajusta a gusto)
  const DURATION = 18;

  return (
    <div className="mt-12">
      <div className="relative overflow-hidden">
        {/* fade edges nice-to-have */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0b1220] to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0b1220] to-transparent opacity-70" />

        <motion.div
          className="flex gap-4 md:gap-6"
          // 👇 Recorre media pista (-50%) para mostrar TODAS las imágenes y repetir sin salto
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: DURATION, ease: "linear", repeat: Infinity }}
        >
          {track.map((src, i) => (
            <button
              key={`${src}-${i}`}
              className="group relative shrink-0 w-[72vw] md:w-[560px] aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-xl md:rounded-2xl will-change-transform transform-gpu"
              onClick={() => setOpen(src)}
              aria-label={`${t("photo")} ${i + 1}`}
            >
              <img
                src={src}
                alt={`${t("photo")} ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] [backface-visibility:hidden]"
                style={{ pointerEvents: "none", userSelect: "none" }}
              />
            </button>
          ))}
        </motion.div>
      </div>

      <Lightbox src={open} onClose={() => setOpen(null)} t={t} />
    </div>
  );
}

function Lightbox({
  src,
  onClose,
  t,
}: {
  src: string | null;
  onClose: () => void;
  t: (k: string) => string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-6xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 rounded-full px-3 py-1 text-sm bg-white/10 text-white hover:bg-white/20"
        >
          {t("lb_close")}
        </button>
        <img
          src={src}
          alt="Vista ampliada"
          className="w-full max-h-[80vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

/* ---- Wrapper de sección con título + contenido que revela y oculta ---- */
function RevealBlock({
  kicker,
  title,
  lead,
  children,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px", amount: 0.4 });

  const headCtrl = useAnimation();
  const bodyCtrl = useAnimation();

  const E_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const headVisible: TargetAndTransition = {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: E_OUT },
  };
  const headHidden: TargetAndTransition = {
    opacity: 0,
    y: 24,
    transition: { duration: 0.3, ease: E_OUT },
  };
  const bodyVisible = (delay = 0): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: E_OUT, delay },
  });
  const bodyHidden: TargetAndTransition = {
    opacity: 0,
    y: 18,
    transition: { duration: 0.25, ease: E_OUT },
  };

  useEffect(() => {
    if (inView) {
      headCtrl.start(headVisible);
      bodyCtrl.start(bodyVisible(0.06));
    } else {
      headCtrl.start(headHidden);
      bodyCtrl.start(bodyHidden);
    }
  }, [inView, headCtrl, bodyCtrl]);

  return (
    <div ref={ref} className="mb-24 last:mb-0">
      <motion.div initial={headHidden} animate={headCtrl}>
        {kicker ? (
          <span className="inline-block text-xs tracking-wide uppercase opacity-80 mb-3">
            {kicker}
          </span>
        ) : null}
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{title}</h2>
        {lead ? <p className="text-white/85 mb-8 max-w-3xl">{lead}</p> : null}
      </motion.div>

      <motion.div initial={bodyHidden} animate={bodyCtrl}>
        {children}
      </motion.div>
    </div>
  );
}

/* ---- Card genérica con animación bidireccional ---- */
const E_OUT_CARD: [number, number, number, number] = [0.16, 1, 0.3, 1];
const cardHidden: TargetAndTransition = {
  opacity: 0,
  y: 22,
  transition: { duration: 0.2, ease: E_OUT_CARD },
};
const cardVisible = (delay = 0): TargetAndTransition => ({
  opacity: 1,
  y: 0,
  transition: { duration: 0.42, ease: E_OUT_CARD, delay },
});

function useBidirectionalInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref as React.RefObject<Element>, {
    margin: "-15% 0px",
    amount: 0.35,
  });
  const ctrl = useAnimation();

  useEffect(() => {
    if (inView) ctrl.start(cardVisible());
    else ctrl.start(cardHidden);
  }, [inView, ctrl]);

  return { ref, ctrl };
}

function InfoCard({
  title,
  desc,
  index = 0,
}: {
  title: string;
  desc: string;
  index?: number;
}) {
  const { ref, ctrl } = useBidirectionalInView<HTMLDivElement>();
  useEffect(() => {
    ctrl.start(cardVisible(index * 0.06));
  }, [ctrl, index]);

  return (
    <motion.div
      ref={ref}
      initial={cardHidden}
      animate={ctrl}
      className="rounded-2xl p-6 bg-white/10 backdrop-blur border border-white/15"
      style={{ willChange: "transform, opacity" }}
    >
      <h3 className="font-extrabold text-xl mb-2">{title}</h3>
      <p className="text-white/90">{desc}</p>
    </motion.div>
  );
}

function MiniCard({
  big,
  small,
  index = 0,
}: {
  big: string;
  small: string;
  index?: number;
}) {
  const { ref, ctrl } = useBidirectionalInView<HTMLLIElement>();
  useEffect(() => {
    ctrl.start(cardVisible(index * 0.06));
  }, [ctrl, index]);

  return (
    <motion.li
      ref={ref}
      initial={cardHidden}
      animate={ctrl}
      className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/15 text-center"
      style={{ willChange: "transform, opacity" }}
    >
      <p className="text-2xl font-extrabold">{big}</p>
      <p className="text-white/85">{small}</p>
    </motion.li>
  );
}

function Badge({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const { ref, ctrl } = useBidirectionalInView<HTMLDivElement>();
  useEffect(() => {
    ctrl.start(cardVisible(index * 0.06));
  }, [ctrl, index]);

  return (
    <motion.div
      ref={ref}
      initial={cardHidden}
      animate={ctrl}
      className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/15 text-center"
      style={{ willChange: "transform, opacity" }}
    >
      <p className="text-2xl font-extrabold">{children}</p>
    </motion.div>
  );
}