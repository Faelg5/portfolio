/* public/portfolio-data.js */
window.portfolioData = [
  {
    id: "algepi",
    image: "/assets/portfolio/thumbs/algepi.webp",
    tags: ["HCI", "Research", "RecSys"],
    url: "https://human-ist.unifr.ch/",
    i18n: {
      fr: { title: "ALGEPI — Bien-être épistémique", description: "Recherche sur l'impact du filtrage algorithmique." },
      en: { title: "ALGEPI — Epistemic Welfare", description: "Research on algorithmic gatekeeping impact." },
      de: { title: "ALGEPI — Epistemisches Wohlbefinden", description: "Forschung zu algorithmischen Filtern." }
    }
  },
  {
    id: "newslens",
    image: "/assets/portfolio/thumbs/newslens.webp",
    tags: ["Mobile", "React Native", "Product"],
    url: "#",
    i18n: {
      fr: { title: "NewsLens — Prototype App", description: "App React Native explorant transparence." },
      en: { title: "NewsLens — App Prototype", description: "React Native news app exploring transparency." },
      de: { title: "NewsLens — App-Prototyp", description: "React Native News-App (Transparenz)." }
    }
  },
  {
    id: "n8n_cover",
    image: "/assets/portfolio/thumbs/n8n.webp",
    tags: ["Automation", "n8n", "AI"],
    url: "https://n8n.io/",
    i18n: {
      fr: { title: "Automatisation Cover Art IA", description: "Workflow n8n pour Broducer Records." },
      en: { title: "AI Cover Art Automation", description: "n8n workflow for Broducer Records." },
      de: { title: "KI-Cover-Automatisierung", description: "n8n-Workflow für Broducer Records." }
    }
  }
];
window.PORTFOLIO = { items: window.portfolioData };
window.PORTFOLIO_ITEMS = window.portfolioData;
