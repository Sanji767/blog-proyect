// components/TrustBadges.tsx
import { Shield, Lock, Award, Globe } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900 border-y">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Shield, text: 'Regulados por la UE' },
            { icon: Lock, text: 'Cifrado bancario' },
            { icon: Award, text: '4.8/5 en Trustpilot' },
            { icon: Globe, text: '30+ países' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <item.icon className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-foreground-accent">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}