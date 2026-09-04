export type Row = { label: string; description: string; total: string };
export type Service = { title: string; intro: string; items: { title: string; copy: string }[] };
export type TimelinePhase = { period: string; title: string; items: string[] };
export type IndexItem = { title: string; copy: string[] };

export type Quote = {
  logo?: string;
  provider: string;
  providerMeta: string;
  client: string;
  clientVat?: string;
  title: string;
  showHourlyProspect?: boolean;
  showMaintenanceProspect?: boolean;
  showTimeline?: boolean;
  indexSubtitle: string;
  indexItems: IndexItem[];
  intro: string;
  services: Service[];
  hours: Row[];
  economics: Row[];
  maintenanceIntro: string;
  maintenance: Row;
  timeline: TimelinePhase[];
  timelineNote: string;
  contactLines: string[];
  closing: string;
};

export const seed: Quote = {
  logo: "z-logo.svg",
  provider: "YOUR\nSTUDIO",
  providerMeta: "Digital consultancy",
  client: "Client Name",
  title: "Proposta di Progetto",
  showHourlyProspect: true,
  showMaintenanceProspect: true,
  showTimeline: true,
  indexSubtitle: "Sviluppo e Manutenzione Sito Web",
  indexItems: [
    { title: "Analisi Brand", copy: ["Brand positioning review.", "Report of visual and technical priorities."] },
    { title: "Sviluppo UX/UI", copy: ["Site architecture, layout and content priorities.", "Prototypes and practical design guidelines."] },
    { title: "Sviluppo Web", copy: ["Website build and functional implementation.", "Security, accessibility and compliance testing."] },
  ],
  intro: "This proposal sets out the design, development and delivery of a clear, effective digital experience. Each phase is reviewed against agreed objectives, timing and outcomes.",
  services: [
    { title: "Analisi Brand", intro: "A focused review of positioning and communication foundations.", items: [
      { title: "Identity", copy: "Review of the visual identity and its consistency across the customer journey." },
      { title: "Voice", copy: "Definition of a direct, recognisable tone for key messages and calls to action." },
      { title: "Positioning", copy: "Clear service hierarchy designed to reduce friction and build confidence." },
      { title: "Report", copy: "A concise report of visual and technical priorities." },
    ] },
    { title: "Sviluppo Web", intro: "Design and implementation of a fast, accessible and responsive website.", items: [
      { title: "Architecture", copy: "Content structure, user paths and page priorities." },
      { title: "UX / UI", copy: "Interface system, components and responsive behaviour." },
      { title: "Build", copy: "Production implementation, integrations and testing." },
      { title: "Launch", copy: "Deployment, analytics and handover." },
    ] },
  ],
  hours: [
    { label: "BRAND ANALYSIS", description: "Identity, competitive position and communication audit.", total: "6 hours" },
    { label: "UX / UI DEVELOPMENT", description: "Site architecture, wireframes and interface prototypes.", total: "16–18 hours" },
    { label: "WEB DEVELOPMENT", description: "Responsive implementation, functionality and testing.", total: "100–120 hours" },
  ],
  economics: [
    { label: "BRAND ANALYSIS", description: "Identity, competitive position and communication audit.", total: "€240.00" },
    { label: "UX / UI DEVELOPMENT", description: "Site architecture, wireframes and interface prototypes.", total: "€690.00" },
    { label: "WEB DEVELOPMENT", description: "Responsive implementation, functionality and testing.", total: "€4,320.00" },
  ],
  maintenanceIntro: "A dedicated maintenance plan keeps the website secure, current and performing reliably after launch.",
  maintenance: { label: "MAINTENANCE", description: "Platform updates, performance monitoring, scheduled backups and rapid technical support.", total: "€630.00 / year" },
  timeline: [
    { period: "Settimana 1", title: "Analisi Brand e Web", items: ["Analisi del brand", "Report interventi"] },
    { period: "Settimana 2", title: "Sviluppo Concept", items: ["Direzioni creative", "Architettura sito", "Wireframe"] },
    { period: "Settimana 3–6", title: "Proposte Concept", items: ["Prototipo", "Credenziali sito", "Web style guide", "Presentazione e feedback"] },
    { period: "Settimana 7", title: "Consegna", items: ["Sviluppo sito", "SEO contenuti", "GDPR, WCAG 2.1 / EAA", "Revisioni da feedback"] },
  ],
  timelineNote: "Si garantisce il completamento dell’intero progetto entro e non oltre il 15 Marzo 2026, previa approvazione del committente.",
  contactLines: ["P.IVA 00000000000", "C.F. XXXXXXXXXXXXXXXX", "+39 000 0000", "info@yourstudio.it"],
  closing: "Thank you for considering this proposal. We look forward to building a considered, effective and durable digital presence together.",
};
