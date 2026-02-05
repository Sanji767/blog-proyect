import { useState } from "react";

interface Props {
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function DownloadModal({ onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">Descarga el ebook</h3>
        <p className="text-gray-500 text-sm mb-6">Déjanos tu email y te enviamos el enlace de acceso inmediato.</p>

        <input
          type="email"
          placeholder="Tu mejor email"
          className="w-full border border-gray-200 p-3 rounded-2xl mb-6 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-colors"
            onClick={() => onSubmit(email)}
          >
            Enviar ahora
          </button>
          <button
            className="w-full text-gray-400 text-sm py-2 hover:text-gray-600"
            onClick={onClose}
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}