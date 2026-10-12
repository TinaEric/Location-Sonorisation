import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import { useEffect, useState } from 'react';
import { listePacks } from '../../data/reservationService.js';
import {
  Cake,
  Heart,
  Presentation,
  Mic,
} from 'lucide-react';

const ICONS = {
  mariage: Heart,
  anniversaire: Cake,
  conference: Presentation,
  autre: Mic,
};

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const packResp = await listePacks();
        setPacks(packResp);
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section aria-labelledby="packs-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        id="packs-title"
        title="Packs clés en main"
        text="Un pack par type d’événement : le matériel est déjà choisi pour la taille de votre public."
      />

      {loading && <p>Chargement des packs...</p>}
      {error && <p className="text-error">{error}</p>}

      {!loading && !error && (
        <ul className="mt-10 divide-y divide-base-300 border-y border-base-300">
          {packs.map((pack) => {
            const include = pack.composants
              .map((comp) => `${comp.quantite}x ${comp.materiel.designation}`)
              .join(', ');

            // Déterminer l'icône en fonction du type de catégorie (par défaut "autre")
            const Icon = ICONS[pack.typesEvenement[0]] || ICONS['autre'];

            return (
              <li key={pack.codePack}>
                <Link
                  to={`/reservation?pack=${pack.codePack}`}
                  className="grid items-center gap-4 px-2 py-6 transition-colors hover:bg-base-200 md:grid-cols-12"
                >
                  <div className="flex items-center gap-4 md:col-span-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-neutral text-accent">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="display text-xl">{pack.libelle}</h3>
                  </div>
                  <p className="text-base-content/75 md:col-span-5">{include}</p>
                  <div className="flex items-center justify-between gap-3 md:col-span-3 md:justify-end">
                    <span className="font-medium">{pack.description}</span>
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}