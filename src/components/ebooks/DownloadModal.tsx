import { useState } from "react";

interface Props {
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function DownloadModal({ onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
        <h3 className="text-2xl font-bold mb-2 text-card-foreground">Descarga el ebook</h3>
        <p className="text-muted-foreground text-sm mb-6">Déjanos tu email y te enviamos el enlace de acceso inmediato.</p>

        <input
          type="email"
          placeholder="Tu mejor email"
          className="w-full border border-input p-3 rounded-2xl mb-6 focus:ring-2 focus:ring-ring outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <button
            className="w-full bg-primary hover:bg-primary-accent text-primary-foreground py-3 rounded-2xl font-semibold transition-colors"
            onClick={() => onSubmit(email)}
          >
            Enviar ahora
          </button>
          <button
            className="w-full text-muted-foreground text-sm py-2 hover:text-foreground"
            onClick={onClose}
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}