export interface Ebook {
  id: string;
  title: string;
  description: string;
  category: "ahorro" | "inversion" | "bancos";
  pages?: number; // Opcional, porque no todos los cursos tienen "páginas"
  format: "Curso Online"
  image: string;
  isFree: boolean;
  price?: number;
  hotmartUrl: string;
  learnings?: string[];
  targetAudience?: string;
  whyInvest?: string;
  author?: {
    name: string;
    experience: string;
    bio: string;
  };
  reviews?: {
    rating: number;
    count: number;
  };
}

export const ebooks: Ebook[] = [
  {
    id: "guia-neobancos",
    title: "Oro Inteligente – Curso Profesional de Inversión Segura en Oro",
    description:
      "Aprende a proteger tu dinero frente a la inflación con una estrategia real, segura y aplicable.",
    category: "inversion",
    format: "Curso Online",
    image: "/ebooks/oroI.png",
    isFree: false,
    price: 69,
    hotmartUrl: "https://go.hotmart.com/A104283331K?dp=1",
    learnings: [
      "Por qué el oro es el activo refugio más seguro",
      "Cómo invertir en oro físico desde cero",
      "Dónde comprar oro sin riesgos",
      "Cómo protegerte de la inflación",
      "Estrategias reales de diversificación",
      "Mentalidad del inversor inteligente",
    ],
    targetAudience:
      "Este curso está diseñado para personas que quieren invertir en oro físico de forma segura, proteger sus ahorros frente a la inflación y construir un patrimonio estable sin depender de especulación ni productos financieros complejos.",
    whyInvest:
      "En un contexto de inflación, crisis monetaria y pérdida de poder adquisitivo, el oro sigue siendo el activo refugio más sólido para proteger el valor del dinero. Aprender a invertir en metales preciosos es hoy una habilidad clave para cualquier persona.",
  },
  {
    id: "vive-saludable",
    title: "Vive Saludable – Estrategias prácticas para ahorrar y mejorar tu bienestar",
    description:
      "Aprende a ahorrar dinero desde la primera semana mientras mejoras tu salud y energía diaria.",
    category: "ahorro",
    format: "Curso Online",
    image: "/ebooks/vive-saludable.png",
    isFree: false,
    price: 49,
    hotmartUrl: "https://go.hotmart.com/T104283295G?dp=1",
    learnings: [
      "Resultados rápidos: podrás ahorrar dinero desde la primera semana sin dejar de disfrutar tu vida",
      "Fácil de aplicar: no necesitas conocimientos financieros, solo seguir pasos simples",
      "Método probado: estrategias reales que ya han ayudado a cientos de personas a recuperar el control de sus gastos",
      "Incluye herramientas prácticas: checklist imprimible y plantilla editable para llevar tu progreso",
      "Accesible y económico: cuesta menos que una cena fuera y puede hacerte ahorrar cientos de euros",
    ],
    targetAudience:
      "Cualquier persona que quiera mejorar sus hábitos financieros y de salud sin complicaciones, aprendiendo pasos prácticos y sencillos de aplicar.",
    whyInvest:
      "En Vive Saludable, aprenderás hábitos sostenibles basados en la dieta mediterránea, ejercicio consciente y desarrollo de una mentalidad positiva, para lograr tus objetivos sin métodos extremos.",
    author: {
      name: "VIVE SALUDABLE",
      experience: "1 Año Hotmarter",
      bio: "Mi misión es ayudarte a alcanzar una vida más equilibrada, llena de energía, bienestar y salud. Proporciono herramientas prácticas y efectivas para que el cambio hacia un estilo de vida saludable sea fácil y accesible.",
    },

  },
];
