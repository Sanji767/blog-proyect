interface Props {
  children: React.ReactNode;
  variant?: "default" | "free";
}

export default function Badge({ children, variant = "default" }: Props) {
  const styles =
    variant === "free"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-[#ebedef] text-[#8a949e]"; // Gris suave de la imagen

  return (
    <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}