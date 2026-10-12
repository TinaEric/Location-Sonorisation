import { Headset } from 'lucide-react';
import { BRAND, FAQ } from '../data/content.js';

export default function Aide() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="display text-3xl sm:text-4xl">Aide</h1>
      <p className="mt-4 max-w-xl text-base-content/75">Les réponses aux questions les plus fréquentes.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-2 lg:col-span-8">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="collapse collapse-arrow rounded-sm border border-base-300 bg-base-100">
              <summary className="collapse-title font-semibold">{q}</summary>
              <div className="collapse-content text-base-content/75">
                <p>{a}</p>
              </div>
            </details>
          ))}
        </div>

        <aside className="self-start rounded-sm bg-neutral p-6 text-neutral-content lg:col-span-4">
          <Headset className="size-8 text-accent" aria-hidden="true" />
          <h2 className="display mt-4 text-lg">Assistance technique 24/7</h2>
          <p className="mt-2 opacity-80">Un technicien vous répond à toute heure, avant et pendant votre événement.</p>
          <a
            href={`tel:${BRAND.phone.replace(/\s/g, '')}`}
            className="btn btn-accent mt-5 w-full"
          >
            {BRAND.phone}
          </a>
        </aside>
      </div>
    </div>
  );
}
