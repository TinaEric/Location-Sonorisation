import { Link } from 'react-router-dom';
import { Headset } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="bg-neutral text-neutral-content">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <h2 className="display text-2xl sm:text-3xl">Une date en tête ? Vérifiez ce qui est libre.</h2>
          <p className="mt-3 opacity-80">
            Le matériel réservé n’est plus disponible pour les autres clients : choisissez votre date tôt.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/reservation" className="btn btn-accent btn-lg">
            Voir le matériel libre
          </Link>
          <Link to="/aide" className="btn btn-ghost btn-lg border border-neutral-content/40 text-neutral-content">
            <Headset className="size-5" aria-hidden="true" />
            Parler à un technicien
          </Link>
        </div>
      </div>
    </section>
  );
}
