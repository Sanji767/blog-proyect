interface Props {
  children: React.ReactNode;
  variant?: "default" | "free";
}

export default function Badge({ children, variant = "default" }: Props) {
  const styles =
    variant === "free"
      ? "bg-accent text-accent-foreground"
      : "border border-secondary-foreground/10 bg-secondary-foreground/5 text-secondary-foreground/80";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${styles}`}
    >
      {children}
    </span>
  );
}
