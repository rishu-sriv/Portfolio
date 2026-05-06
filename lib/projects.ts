import type { ProjectCategory } from "@/types";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  thumbnail: string;
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
}

export const PROJECTS: Project[] = [
  {
    id: "smase",
    title: "SMASE",
    description: "A multi-tenant media asset platform that supports keyword, semantic, and hybrid AI search across images, PDFs, and videos.",
    longDescription:
      "SMASE (Semantic Media Asset Search Engine) lets teams upload media, process files in the background, and retrieve assets through multiple search strategies. It combines FastAPI APIs, PostgreSQL with pgvector for embeddings, Redis + Celery for async processing, and a React dashboard behind nginx. The pipeline is designed for practical production usage with tenant isolation, OCR/enrichment tasks, and monitored services.",
    techStack: ["FastAPI", "PostgreSQL", "pgvector", "Redis", "Celery", "React", "TypeScript", "Docker", "MinIO"],
    thumbnail: "/projects/smase.png",
    screenshots: ["/projects/smase.png"],
    githubUrl: "https://github.com/rishu-sriv/SMASE",
    category: "fullstack",
  },
  {
    id: "anomix",
    title: "Anomix",
    description: "A financial anomaly detection system that analyzes time-series streams and provides AI-assisted investigation workflows.",
    longDescription:
      "Anomix focuses on identifying unusual behavior in financial data in near real time. The project includes backend services for anomaly workflows, a TypeScript frontend for analysis and monitoring, infrastructure/config for deployment, and CI automation. It is built as an end-to-end engineering system rather than just a single model demo, with emphasis on observability and operability.",
    techStack: ["Python", "TypeScript", "Docker", "FastAPI", "Monitoring", "GitHub Actions"],
    thumbnail: "/projects/anomix.png",
    screenshots: ["/projects/anomix.png"],
    githubUrl: "https://github.com/rishu-sriv/anomix",
    category: "fullstack",
  },
  {
    id: "financial-academia",
    title: "Financial Academia",
    description: "A gamified financial education platform with interactive learning modules, assistant features, and real-time engagement tools.",
    longDescription:
      "Financial Academia is designed to make financial learning engaging through game-like progression, quizzes, expert content, and collaborative experiences. The architecture spans frontend interfaces plus multiple backend services (Node, Flask, FastAPI), and includes AI assistant capabilities with RAG/document-chat style experiences. It blends education, interactivity, and applied fintech learning in one product.",
    techStack: ["TypeScript", "JavaScript", "React", "Node.js", "Flask", "FastAPI", "RAG", "Qdrant", "MongoDB"],
    thumbnail: "/projects/financial-academia.png",
    screenshots: ["/projects/financial-academia.png"],
    githubUrl: "https://github.com/rishu-sriv/Financial-Academia",
    category: "fullstack",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "A full-stack portfolio application built with Next.js, combining interactive UI with backend-powered contact and content workflows.",
    longDescription:
      "This portfolio showcases projects and engineering identity through a highly interactive macOS-inspired experience. On the frontend it emphasizes polished UI, animation, and desktop metaphors; on the backend it uses server-side/API capabilities for features like contact handling and dynamic content flow. The result is a full-stack personal product with strong design and implementation depth.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    thumbnail: "/projects/portfolio.png",
    screenshots: ["/projects/portfolio.png"],
    githubUrl: "https://github.com/rishu-sriv/Portfolio",
    category: "fullstack",
  },
  {
    id: "shadient",
    title: "shadient (Contributor)",
    description: "A modern gradient design playground that I contributed to through my fork with custom feature and UX updates.",
    longDescription:
      "Shadient is a gradient playground with support for linear/radial/mesh design modes, animation controls, and export-oriented workflows. My role is listed as a contributor via my fork, where I iterated on implementation details and product polish. It represents practical open-source style contribution and extension work.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
    thumbnail: "/projects/shadient.png",
    screenshots: ["/projects/shadient.png"],
    githubUrl: "https://github.com/rishu-sriv/shadient",
    category: "open-source",
  },
];
