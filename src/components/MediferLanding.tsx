import { useEffect, useState } from "react";
import RegionalMap from "./RegionalMap";

type Lang = "es" | "en";
const CONTACT_EMAIL = "contacto@medifergroup.com";
const GROUP_PARENT_NAME = "YGroup";

const copy = {
  es: {
    navProposal: "Nuestra propuesta", navMedifer: "Medifer", navPresence: "Presencia regional", navContact: "Contacto",
    heroTitle: "Desarrollamos tu marca en Latinoamérica, adaptando la estrategia a cada mercado.",
    heroText: "Medifer Group representa marcas internacionales del sector salud e impulsa su desarrollo y expansión en Latinoamérica.", heroCta: "Conoce Medifer",
    proposalTitle: "La identidad de tu marca, adaptada a cada mercado.", proposalText: "Latinoamérica reúne mercados diferentes. Respetamos la identidad y los estándares de cada marca al adaptar su desarrollo en cada país.",
    mediferTitle: "Medifer Group", mediferText: "Integramos conocimiento de mercado, gestión regulatoria y desarrollo comercial bajo un modelo de Master Distributor.", capabilities: ["Conocimiento de mercado", "Gestión regulatoria", "Desarrollo comercial"],
    presenceTitle: "Panamá, nuestra sede regional", presenceText: "Su ubicación geográfica, el Canal de Panamá y su conectividad aérea hacen de nuestra sede un hub estratégico que facilita el enlace con los distintos mercados de Latinoamérica.", regionalLabel: "Presencia regional", panama: "Sede regional", venezuela: "Presencia regional", ecuador: "Presencia regional",
    contactTitle: "Contacto", contactText: "Para conocer más sobre Medifer Group, escríbenos.", footer: "Medifer Group forma parte de", openMenu: "Abrir menú", closeMenu: "Cerrar menú",
  },
  en: {
    navProposal: "Our proposal", navMedifer: "Medifer", navPresence: "Regional presence", navContact: "Contact",
    heroTitle: "We develop your brand in Latin America, adapting the strategy to each market.",
    heroText: "Medifer Group represents international healthcare brands and drives their development and expansion across Latin America.", heroCta: "Discover Medifer",
    proposalTitle: "Your brand identity, adapted to each market.", proposalText: "Latin America brings together different markets. We respect each brand’s identity and standards when adapting its development in every country.",
    mediferTitle: "Medifer Group", mediferText: "We integrate market knowledge, regulatory management and commercial development under a Master Distributor model.", capabilities: ["Market knowledge", "Regulatory management", "Commercial development"],
    presenceTitle: "Panama, our regional headquarters", presenceText: "Its geographic location, the Panama Canal and its air connectivity make our headquarters a strategic hub that facilitates connections with the different markets in Latin America.", regionalLabel: "Regional presence", panama: "Regional headquarters", venezuela: "Regional presence", ecuador: "Regional presence",
    contactTitle: "Contact", contactText: "To learn more about Medifer Group, write to us.", footer: "Medifer Group is part of", openMenu: "Open menu", closeMenu: "Close menu",
  },
} as const;

function scrollToSection(id: string, onNavigate: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  onNavigate();
}

function CapabilityIcon({ index }: { index: number }) {
  const paths = [
    <><circle cx="12" cy="12" r="7" /><path d="M12 5v14M5 12h14" /></>,
    <><path d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    <><path d="M4 19V9M12 19V5M20 19v-7" /><path d="M2 19h20" /></>,
  ];
  return <svg className="capability-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[index]}</svg>;
}

export default function MediferLanding() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("medifer.lang") : null;
    return saved === "en" ? "en" : "es";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[lang];
  useEffect(() => { localStorage.setItem("medifer.lang", lang); document.documentElement.lang = lang; }, [lang]);
  const navigate = (id: string) => scrollToSection(id, () => setMenuOpen(false));

  return <div className="site-shell">
    <header className="site-header"><div className="header-inner">
      <button className="brand-button" onClick={() => navigate("inicio")} aria-label="MEDIFER Group"><img src="/logo-dark.png" alt="MEDIFER Group" /></button>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
      <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
        <button onClick={() => navigate("propuesta")}>{t.navProposal}</button><button onClick={() => navigate("medifer")}>{t.navMedifer}</button><button onClick={() => navigate("presencia")}>{t.navPresence}</button><button className="nav-contact" onClick={() => navigate("contacto")}>{t.navContact}</button>
        <div className="language-switcher" aria-label="Language selector"><button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")} aria-pressed={lang === "es"}>ES</button><span>/</span><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button></div>
      </nav>
    </div></header>

    <main>
      <section id="inicio" className="hero-section" aria-labelledby="hero-title"><div className="section-wrap hero-grid">
        <div className="hero-copy reveal"><p className="eyebrow">MEDIFER GROUP</p><h1 id="hero-title">{t.heroTitle}</h1><p className="hero-lead">{t.heroText}</p><button className="primary-cta" onClick={() => navigate("medifer")}>{t.heroCta}<span aria-hidden="true">↗</span></button></div>
        <figure className="hero-image reveal"><img src="/gallery/02.webp" alt={lang === "es" ? "Entorno profesional del sector salud" : "Professional healthcare environment"} fetchPriority="high" /><figcaption>Healthcare / Latin America</figcaption></figure>
      </div></section>
      <section id="propuesta" className="proposal-section" aria-labelledby="proposal-title"><div className="section-wrap narrow-copy reveal"><p className="eyebrow">01 / {t.navProposal}</p><h2 id="proposal-title">{t.proposalTitle}</h2><p>{t.proposalText}</p></div></section>
      <section id="medifer" className="medifer-section" aria-labelledby="medifer-title"><div className="section-wrap"><div className="section-heading reveal"><p className="eyebrow">02 / MEDIFER</p><h2 id="medifer-title">{t.mediferTitle}</h2><p>{t.mediferText}</p></div><div className="capabilities" role="list">{t.capabilities.map((capability, index) => <div className="capability reveal" role="listitem" key={capability}><CapabilityIcon index={index} /><span>{capability}</span></div>)}</div></div></section>
      <section id="presencia" className="presence-section" aria-labelledby="presence-title"><div className="section-wrap presence-layout"><div className="presence-copy reveal"><p className="eyebrow">03 / {t.navPresence}</p><h2 id="presence-title">{t.presenceTitle}</h2><p>{t.presenceText}</p><div className="country-list" aria-label={t.regionalLabel}><div className="country-item country-primary"><span className="country-dot" /><span>Panamá</span><small>{t.panama}</small></div><div className="country-item"><span className="country-dot" /><span>Venezuela</span><small>{t.venezuela}</small></div><div className="country-item"><span className="country-dot" /><span>Ecuador</span><small>{t.ecuador}</small></div></div></div><RegionalMap labels={{ panama: t.panama, venezuela: t.venezuela, ecuador: t.ecuador }} /></div></section>
      <section id="contacto" className="contact-section" aria-labelledby="contact-title"><div className="section-wrap contact-inner reveal"><p className="eyebrow">04 / {t.navContact}</p><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactText}</p><a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<span aria-hidden="true">↗</span></a></div></section>
    </main>
    <footer className="site-footer"><div className="section-wrap footer-inner"><img src="/logo-dark.png" alt="MEDIFER Group" /><p>{t.footer} <a href="#inicio">{GROUP_PARENT_NAME}</a>.</p><span>© {new Date().getFullYear()} MEDIFER Group</span></div></footer>
  </div>;
}
