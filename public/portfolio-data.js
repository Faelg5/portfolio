/* public/portfolio-data.js */
window.portfolioData = [
  {
    id: "algepi",
    image: "/assets/portfolio/thumbs/algepi.webp",
    tags: ["HCI", "Research", "RecSys"],
    url: "https://human-ist.unifr.ch/",
    i18n: {
      fr: {
        title: "ALGEPI — Bien-être épistémique",
        description: "Recherche sur l'impact du filtrage algorithmique.",
        context: "Projet FNS étudiant les risques de l'enfermement algorithmique sur l'accès à l'information.",
        role: "Chercheur principal : conception d'expériences IHM et analyse de systèmes de recommandation.",
        impact: "Publication de nouveaux modèles d'interaction favorisant la diversité de points de vue."
      },
      en: {
        title: "ALGEPI — Epistemic Welfare",
        description: "Research on algorithmic gatekeeping impact.",
        context: "SNSF project studying the risks of algorithmic bubbles on information access.",
        role: "Lead Researcher: designed HCI experiments and evaluated recommendation systems.",
        impact: "Proposed novel interaction models to promote viewpoint diversity."
      },
      de: {
        title: "ALGEPI — Epistemisches Wohlbefinden",
        description: "Forschung zu algorithmischen Filtern.",
        context: "SNF-Projekt über die Risiken algorithmischer Filterblasen beim Informationszugang.",
        role: "Haupforscher: Design von HCI-Experimenten und Evaluation von Empfehlungssystemen.",
        impact: "Entwicklung neuer Interaktionsmodelle zur Förderung der Meinungsvielfalt."
      }
    }
  },
  {
    id: "newslens",
    image: "/assets/portfolio/thumbs/newslens.webp",
    tags: ["Mobile", "React Native", "Product"],
    url: "#",
    i18n: {
      fr: {
        title: "NewsLens — Prototype App",
        description: "App React Native explorant transparence.",
        context: "Prototype mobile pour la consommation de nouvelles transparente et diversifiée.",
        role: "Développeur Full-stack & Designer UX : création complète de l'application mobile.",
        impact: "Démonstrateur utilisé pour des tests utilisateurs à grande échelle."
      },
      en: {
        title: "NewsLens — App Prototype",
        description: "React Native news app exploring transparency.",
        context: "Mobile prototype for transparent and diverse news consumption.",
        role: "Full-stack Developer & UX Designer: end-to-end mobile app creation.",
        impact: "Working prototype used for large-scale user studies."
      },
      de: {
        title: "NewsLens — App-Prototyp",
        description: "React Native News-App (Transparenz).",
        context: "Mobiler Prototyp für transparenten und vielfältigen Nachrichtenkonsum.",
        role: "Full-stack Entwickler & UX Designer: Komplette App-Entwicklung.",
        impact: "Funktionsfähiger Prototyp für umfangreiche Nutzerstudien."
      }
    }
  },
  {
    id: "n8n_cover",
    image: "/assets/portfolio/thumbs/n8n.webp",
    tags: ["Automation", "AI", "Production"],
    url: "https://n8n.io/",
    i18n: {
      fr: {
        title: "Automatisation Cover Art IA",
        description: "Workflow n8n pour Broducer Records.",
        context: "Besoin de générer des visuels d'albums cohérents pour un label de musique indépendant.",
        role: "Ingénieur Automation : intégration de Stable Diffusion via n8n et APIs personnalisées.",
        impact: "Réduction massive du temps de création graphique (de 2h à 5min par artwork)."
      },
      en: {
        title: "AI Cover Art Automation",
        description: "n8n workflow for Broducer Records.",
        context: "Need for consistent album artwork for an independent music label.",
        role: "Automation Engineer: integrated Stable Diffusion via n8n and custom APIs.",
        impact: "Massive time reduction in graphic creation (from 2h to 5min per artwork)."
      },
      de: {
        title: "KI-Cover-Automatisierung",
        description: "n8n-Workflow für Broducer Records.",
        context: "Bedarf an konsistenten Albumcovern für ein unabhängiges Musiklabel.",
        role: "Automations-Ingenieur: Integration von Stable Diffusion über n8n und APIs.",
        impact: "Enorme Zeitersparnis bei der Grafikerstellung (von 2h auf 5 Min. pro Artwork)."
      }
    }
  }
];
window.PORTFOLIO = { items: window.portfolioData };
window.PORTFOLIO_ITEMS = window.portfolioData;
