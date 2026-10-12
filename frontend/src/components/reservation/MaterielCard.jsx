import { useState } from 'react';
import { Minus, Package, Plus } from 'lucide-react';
import { formatMoney, plural } from '../../utils/format.js';

export function Photo({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid aspect-[16/10] place-items-center bg-base-200 text-base-content/40">
        <Package className="size-10" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[16/10] w-full object-cover"
    />
  );
}

export default function MaterielCard({ materiel, nbJours, quantite, onChange }) {
  const { designation, marque, detailTechnique, imageURL, quantiteDisponible } = materiel;
  const prix = Number(materiel.prixLocation);
  const caution = Number(materiel.prixCaution);
  const dernier = quantiteDisponible <= 1;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-sm border bg-base-100 ${
        quantite > 0 ? 'border-accent ring-1 ring-accent' : 'border-base-300'
      }`}
    >
      <Photo src={imageURL} alt={designation} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-bold leading-snug">{designation}</h4>
            <p className="text-sm text-base-content/70">{marque}</p>
          </div>
          <span className={`badge shrink-0 ${dernier ? 'badge-warning' : 'badge-soft badge-success'}`}>
            {dernier ? 'Dernier exemplaire' : `${quantiteDisponible} disponibles`}
          </span>
        </div>

        <p className="mt-3 text-sm text-base-content/75">{detailTechnique}</p>

        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Par jour</dt>
            <dd className="font-semibold">{formatMoney(prix)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>
              Pour {nbJours} {plural(nbJours, 'jour', 'jours')}
            </dt>
            <dd className="font-semibold">{formatMoney(prix * nbJours)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-base-content/70">
            <dt>Caution</dt>
            <dd>{formatMoney(caution)}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-5">
          {quantite === 0 ? (
            <button type="button" className="btn btn-accent btn-sm w-full" onClick={() => onChange(1)}>
              <Plus className="size-4" aria-hidden="true" />
              Ajouter
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="join">
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  aria-label={`Retirer un exemplaire de ${designation}`}
                  onClick={() => onChange(quantite - 1)}
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <output
                  aria-label={`Quantité de ${designation}`}
                  className="join-item grid min-w-10 place-items-center border border-base-300 px-3 text-sm font-semibold"
                >
                  {quantite}
                </output>
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  disabled={quantite >= quantiteDisponible}
                  aria-label={`Ajouter un exemplaire de ${designation}`}
                  onClick={() => onChange(quantite + 1)}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
              <span className="text-sm font-semibold">{formatMoney(prix * nbJours * quantite)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
