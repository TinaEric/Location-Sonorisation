import { Check } from 'lucide-react';
import { Photo } from './MaterielCard.jsx';
import { formatMoney, plural } from '../../utils/format.js';

export default function PackCard({ pack, nbJours, choisi, onChoisir }) {
  const tarif = Number(pack.tarifJournalier);
  const caution = Number(pack.prixCaution);
  const somme = pack.composants.reduce(
    (t, c) => t + Number(c.materiel.prixLocation) * c.quantite,
    0,
  );
  const economie = somme - tarif;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-sm border bg-base-100 ${
        choisi ? 'border-accent ring-1 ring-accent' : 'border-base-300'
      }`}
    >
      <Photo src={pack.imageUrl} alt={pack.libelle} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold leading-snug">{pack.libelle}</h4>
          <span className="badge badge-soft badge-success shrink-0">
            {pack.possibles} {plural(pack.possibles, 'pack disponible', 'packs disponibles')}
          </span>
        </div>

        {pack.description && <p className="mt-2 text-sm text-base-content/75">{pack.description}</p>}

        <ul className="mt-3 space-y-1 text-sm">
          {pack.composants.map((c) => (
            <li key={c.idComposant} className="flex gap-2">
              <span className="font-semibold">{c.quantite}×</span>
              <span>{c.materiel.designation}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Par jour</dt>
            <dd className="font-semibold">{formatMoney(tarif)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>
              Pour {nbJours} {plural(nbJours, 'jour', 'jours')}
            </dt>
            <dd className="font-semibold">{formatMoney(tarif * nbJours)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-base-content/70">
            <dt>Caution</dt>
            <dd>{formatMoney(caution)}</dd>
          </div>
          {economie > 0 && (
            <div className="flex justify-between gap-4 text-success">
              <dt>Économie par jour</dt>
              <dd className="font-semibold">{formatMoney(economie)}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto pt-5">
          <button
            type="button"
            className={`btn btn-sm w-full ${choisi ? 'btn-neutral' : 'btn-accent'}`}
            onClick={onChoisir}
          >
            {choisi ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Pack choisi
              </>
            ) : (
              'Choisir ce pack'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}