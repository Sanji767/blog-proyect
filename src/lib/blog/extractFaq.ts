export type FaqItem = {
  question: string;
  answer: string;
};

function cleanMarkdown(value: string): string {
  let text = value;

  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, " ");

  // Remove images: ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Remove links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // Remove blockquote markers
  text = text.replace(/^\s*>\s?/gm, "");

  // Remove list markers
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // Remove common markdown formatting
  text = text.replace(/[`*_~]/g, "");

  // Strip HTML tags (MDX / inline HTML)
  text = text.replace(/<[^>]+>/g, "");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function isFaqSectionHeading(line: string): boolean {
  const normalized = line.trim().toLowerCase();
  if (!normalized.startsWith("##")) return false;

  const title = normalized.replace(/^##+\s+/, "");
  return (
    title.startsWith("preguntas frecuentes") ||
    title === "faq" ||
    title.startsWith("faq ")
  );
}

export function extractFaqFromMarkdown(markdown: string): FaqItem[] {
  if (!markdown) return [];

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const startIndex = lines.findIndex((l) => isFaqSectionHeading(l));
  if (startIndex === -1) return [];

  const faqs: FaqItem[] = [];

  let currentQuestion: string | null = null;
  let answerLines: string[] = [];

  const pushCurrent = () => {
    if (!currentQuestion) return;
    const question = cleanMarkdown(currentQuestion);
    const answer = cleanMarkdown(answerLines.join("\n"));
    if (question && answer) faqs.push({ question, answer });
  };

  for (let i = startIndex + 1; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const trimmed = raw.trim();

    // Stop at the next H2 section
    if (/^##\s+/.test(trimmed)) break;

    const headingMatch = trimmed.match(/^#{3,4}\s+(.+)$/);
    if (headingMatch) {
      pushCurrent();
      currentQuestion = headingMatch[1].trim();
      answerLines = [];
      continue;
    }

    if (!currentQuestion) continue;
    answerLines.push(raw);
  }

  pushCurrent();

  const dedup = new Map<string, FaqItem>();
  for (const item of faqs) {
    const key = item.question.toLowerCase();
    if (!dedup.has(key)) dedup.set(key, item);
  }

  return Array.from(dedup.values()).slice(0, 20);
}

