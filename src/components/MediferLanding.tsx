import { useEffect, useState } from "react";
import RegionalMap from "./RegionalMap";

type Lang = "es" | "en";
const CONTACT_EMAIL = "contacto@medifergroup.com";
const GROUP_PARENT_NAME = "YYY Group";

const copy = {
  es: {
    navProposal: "Nuestra propuesta", navMedifer: "Medifer", navPresence: "Presencia regional", navContact: "Contacto",
    heroTitle: "Desarrollamos tu marca en Latinoamerica, adaptando la estrategia a cada mercado",
    heroText: "Medifer Group representa marcas internacionales del sector salud, impulsando su desarrollo y expansión en latinoamericana", heroCta: "Conoce Medifer",
    proposalTitle: "La identidad de tu marca, adaptada a cada mercado.", proposalText: "Latinoamérica reúne mercados diferentes. Respetamos la identidad y los estándares de cada marca al adaptar su desarrollo en cada país.",
    mediferTitle: "Medifer Group", mediferText: "Integramos conocimiento de mercado, gestión regulatoria y desarrollo comercial bajo un modelo de Master Distributor.", capabilities: ["Conocimiento de mercado", "Gestión regulatoria", "Desarrollo comercial"],
    presenceTitle: "Panamá, nuestro hub regional", presenceText: "Su ubicación geográfica, el Canal de Panamá y su conectividad aérea hacen de nuestra sede un hub estratégico que facilita el enlace con los distintos mercados de Latinoamérica.", regionalLabel: "Conectividad de Panamá", panama: "Hub marítimo, aéreo y terrestre",
    contactTitle: "Contacto", contactText: "Para conocer más sobre Medifer Group, escríbenos.", footer: "Medifer Group S.A., forma parte de", openMenu: "Abrir menú", closeMenu: "Cerrar menú",
  },
  en: {
    navProposal: "Our proposal", navMedifer: "Medifer", navPresence: "Regional presence", navContact: "Contact",
    heroTitle: "We develop your brand in Latin America, adapting the strategy to each market",
    heroText: "Medifer Group represents international healthcare brands, driving their development and expansion across Latin America.", heroCta: "Discover Medifer",
    proposalTitle: "Your brand identity, adapted to each market.", proposalText: "Latin America brings together different markets. We respect each brand’s identity and standards when adapting its development in every country.",
    mediferTitle: "Medifer Group", mediferText: "We integrate market knowledge, regulatory management and commercial development under a Master Distributor model.", capabilities: ["Market knowledge", "Regulatory management", "Commercial development"],
    presenceTitle: "Panama, our regional hub", presenceText: "Its geographic location, the Panama Canal and its air connectivity make our headquarters a strategic hub that facilitates connections with the different markets in Latin America.", regionalLabel: "Panama connectivity", panama: "Maritime, air and land hub",
    contactTitle: "Contact", contactText: "To learn more about Medifer Group, write to us.", footer: "Medifer Group S.A. is part of", openMenu: "Open menu", closeMenu: "Close menu",
  },
} as const;

const LOADING_ASSETS = ["/logo-blue.png", "/hero-city.webp"];
const MIN_LOADING_MS = 4000;

function PageLoader({ exiting }: { exiting: boolean }) {
  return (
    <div className={`page-loader${exiting ? " is-exiting" : ""}`} role="status" aria-live="polite" aria-label="Cargando MEDIFER Group">
      <div className="page-loader-inner">
        <img src="/logo-blue.png" alt="MEDIFER Group" />
        <span className="page-loader-line" aria-hidden="true"><i /></span>
      </div>
    </div>
  );
}

function scrollToSection(id: string, onNavigate: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  onNavigate();
}

function CapabilityIcon({ index }: { index: number }) {
  const paths = [
    <>
      <path className="capability-blob" d="M31 42c11-23 45-30 72-21 28 9 42 34 35 59-7 25-35 46-64 42-29-4-54-32-53-55 0-9 5-17 10-25Z" />
      <g className="capability-art">
        <circle cx="80" cy="78" r="34" />
        <path d="M46 78h68M80 44c-11 10-16 21-16 34s5 24 16 34M80 44c11 10 16 21 16 34s-5 24-16 34" />
        <path className="capability-accent" d="M56 59c7-5 15-8 24-8 9 0 17 3 24 8M56 97c7 5 15 8 24 8 9 0 17-3 24-8" />
        <circle className="capability-accent-fill" cx="120" cy="57" r="8" />
        <path className="capability-accent" d="m115 57 4 4 8-9" />
      </g>
    </>,
    <>
      <path className="capability-blob" d="M34 34c18-19 55-20 77-3 22 17 25 51 10 75-15 24-48 34-74 22-26-12-39-46-28-69 4-10 9-18 15-25Z" />
      <g className="capability-art">
        <rect x="49" y="47" width="62" height="78" rx="7" />
        <path d="M67 47v-8c0-5 4-8 9-8h8c5 0 9 3 9 8v8M73 47v-7h14v7M64 67h31M64 80h24M64 93h17" />
        <path className="capability-accent" d="m64 107 8 8 15-17" />
        <path className="capability-accent" d="M104 67h13M104 80h7" />
      </g>
    </>,
    <>
      <path className="capability-blob" d="M27 65c4-27 32-48 60-48 28 0 53 21 57 48 4 27-14 55-40 66-27 11-61 1-73-23-7-13-6-28-4-43Z" />
      <g className="capability-art">
        <path d="M45 117V61M45 117h72" />
        <rect x="57" y="84" width="13" height="33" rx="2" />
        <rect x="78" y="67" width="13" height="50" rx="2" />
        <rect x="99" y="51" width="13" height="66" rx="2" />
        <path className="capability-accent" d="m53 75 20-16 17 8 28-29" />
        <path className="capability-accent" d="M108 38h10v10" />
      </g>
    </>,
  ];
  return <svg className={`capability-icon capability-icon-${index}`} viewBox="0 0 160 160" aria-hidden="true">{paths[index]}</svg>;
}

export default function MediferLanding() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("medifer.lang") : null;
    return saved === "en" ? "en" : "es";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaderState, setLoaderState] = useState<"loading" | "exiting" | "done">("loading");
  const [heroProgress, setHeroProgress] = useState(0);
  const t = copy[lang];
  useEffect(() => { localStorage.setItem("medifer.lang", lang); document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    let active = true;
    let finishScheduled = false;
    const startedAt = performance.now();
    const loadImage = (src: string) => new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    });
    const finish = () => {
      if (!active || finishScheduled) return;
      finishScheduled = true;
      const remaining = Math.max(0, MIN_LOADING_MS - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (!active) return;
        setLoaderState("exiting");
        window.setTimeout(() => active && setLoaderState("done"), 520);
      }, remaining);
    };
    Promise.all(LOADING_ASSETS.map(loadImage)).then(finish);
    const safety = window.setTimeout(finish, MIN_LOADING_MS + 1000);
    return () => { active = false; window.clearTimeout(safety); };
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const updateHeroProgress = () => {
      frame = 0;
      const range = Math.max(window.innerHeight * 0.78, 1);
      setHeroProgress(Math.min(window.scrollY / range, 1));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeroProgress);
    };
    updateHeroProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".capability-reveal"));
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  const navigate = (id: string) => scrollToSection(id, () => setMenuOpen(false));

  return <div className="site-shell" aria-busy={loaderState !== "done"}>
    {loaderState !== "done" && <PageLoader exiting={loaderState === "exiting"} />}
    <header className="site-header"><div className="header-inner">
      <button className="brand-button" onClick={() => navigate("inicio")} aria-label="MEDIFER Group"><img src="/logo-blue.png" alt="MEDIFER Group" /></button>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
      <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
        <button onClick={() => navigate("propuesta")}>{t.navProposal}</button><button onClick={() => navigate("medifer")}>{t.navMedifer}</button><button onClick={() => navigate("presencia")}>{t.navPresence}</button><button className="nav-contact" onClick={() => navigate("contacto")}>{t.navContact}</button>
        <div className="language-switcher" aria-label="Language selector"><button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")} aria-pressed={lang === "es"}>ES</button><span>/</span><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button></div>
      </nav>
    </div></header>

    <main>
      <section id="inicio" className="hero-section hero-cover" aria-labelledby="hero-title">
        <figure className="hero-image-bg" style={{ opacity: 1 - heroProgress * 0.42, transform: `scale(${1 + heroProgress * 0.025}) translateY(${heroProgress * 22}px)` }}>
          <img src="/hero-city.webp" alt={lang === "es" ? "Vista urbana de Panamá junto al mar" : "Panama city skyline by the sea"} fetchPriority="high" />
          <span className="hero-image-overlay" aria-hidden="true" />
        </figure>
        <div className="section-wrap hero-content" style={{ opacity: 1 - heroProgress, transform: `translateY(${heroProgress * -34}px)` }}>
          <div className="hero-copy hero-copy-centered reveal"><h1 id="hero-title">{t.heroTitle}</h1><p className="hero-lead">{t.heroText}</p></div>
        </div>
      </section>
      <section id="propuesta" className="proposal-section" aria-labelledby="proposal-title"><div className="section-wrap narrow-copy reveal"><p className="eyebrow">01 / {t.navProposal}</p><h2 id="proposal-title">{t.proposalTitle}</h2><p>{t.proposalText}</p></div></section>
      <section id="medifer" className="medifer-section" aria-labelledby="medifer-title"><div className="section-wrap"><div className="section-heading reveal"><p className="eyebrow">02 / MEDIFER</p><h2 id="medifer-title">{t.mediferTitle}</h2><p>{t.mediferText}</p></div><div className="capabilities" role="list">{t.capabilities.map((capability, index) => <div className={`capability capability-reveal capability-${index}`} role="listitem" key={capability}><CapabilityIcon index={index} /><span>{capability}</span></div>)}</div></div></section>
      <section id="presencia" className="presence-section" aria-labelledby="presence-title"><div className="section-wrap presence-layout"><div className="presence-copy reveal"><p className="eyebrow">03 / {t.navPresence}</p><h2 id="presence-title">{t.presenceTitle}</h2><p>{t.presenceText}</p><div className="country-list" aria-label={t.regionalLabel}><div className="country-item country-primary"><span className="country-dot" /><span>Panamá</span><small>{t.panama}</small></div></div></div><RegionalMap /></div></section>
      <section id="contacto" className="contact-section" aria-labelledby="contact-title"><div className="section-wrap contact-inner reveal"><p className="eyebrow">04 / {t.navContact}</p><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactText}</p><a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div></section>
    </main>
    <footer className="site-footer"><div className="section-wrap footer-inner"><img src="/logo-blue.png" alt="MEDIFER Group" /><p>{t.footer} <a href="#inicio">{GROUP_PARENT_NAME}</a>.</p><span>© {new Date().getFullYear()} MEDIFER Group</span></div></footer>
  </div>;
}
