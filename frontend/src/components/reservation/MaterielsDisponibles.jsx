import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CircleAlert, RotateCw } from 'lucide-react';
import MaterielCard from './MaterielCard.jsx';
import PackCard from './PackCard.jsx';
import { useMaterielsDisponibles } from '../../hooks/useMaterielsDisponibles.js';
import { usePacks } from '../../hooks/usePacks.js';
import { SHORTCUTS } from '../../data/content.js';
import { formatDate, formatMoney, plural, rentalDays } from '../../utils/format.js';
import { createReservation } from '../../data/reservationService.js';

const ID_USER = 'CLI0007'; 

const compositionDe = (pack) =>
  Object.fromEntries(pack.composants.map((c) => [c.materiel.CodeMateriel, c.quantite]));

/** Compare la sélection du client à la composition d'origine du pack. */
function comparer(composition, selection) {
  const ajoutes = [];
  const retires = [];
  const modifies = [];
  for (const [code, quantite] of Object.entries(selection)) {
    if (quantite <= 0) continue;
    const avant = composition[code];
    if (avant === undefined) ajoutes.push({ code, quantite });
    else if (avant !== quantite) modifies.push({ code, avant, apres: quantite });
  }
  for (const [code, quantite] of Object.entries(composition)) {
    if (!(selection[code] > 0)) retires.push({ code, quantite });
  }
  return { ajoutes, retires, modifies, identique: !ajoutes.length && !retires.length && !modifies.length };
}

const texteErreur = (e) => (Array.isArray(e?.message) ? e.message.join(' · ') : (e?.message ?? 'Erreur inconnue'));

function Skeletons() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton h-80 rounded-sm" />
      ))}
    </div>
  );
}


export default function MaterielsDisponibles({
  dateDebut, dateFin, shortcut = '', packCode = '', type = '', showAllHref = '/reservation',
}) {
  const { data, loading, error, reload } = useMaterielsDisponibles(dateDebut, dateFin);
  const { data: packsData, error: errorPacks } = usePacks(dateDebut, dateFin, type);

  const [selection, setSelection] = useState({}); // { CodeMateriel: quantité }
  const [packChoisiCode, setPackChoisiCode] = useState('');
  const [envoi, setEnvoi] = useState(null); // { statut: 'envoi' | 'ok' | 'erreur', ... }
  const [presele, setPresele] = useState(false);

  const nbJours = rentalDays(dateDebut, dateFin);
  const filtre = SHORTCUTS[shortcut];

  // Tout le matériel renvoyé par l'API (sert aux prix et au calcul de disponibilité des packs)
  const parCode = useMemo(() => {
    const map = new Map();
    (data ?? []).forEach((g) => g.materiels.forEach((m) => map.set(m.CodeMateriel, m)));
    return map;
  }, [data]);

  // Catégories avec uniquement le matériel disponible (et le raccourci éventuel)
  const groupes = useMemo(
    () =>
      (data ?? [])
        .map((categorie) => ({
          ...categorie,
          materiels: categorie.materiels.filter(
            (m) => m.quantiteDisponible > 0 && (!filtre || filtre(m, categorie)),
          ),
        }))
        .filter((categorie) => categorie.materiels.length > 0),
    [data, filtre],
  );

const packsDispo = useMemo(
  () =>
    (packsData ?? [])
      .filter((p) => p.composants?.length > 0)
      .map((p) => ({ ...p, possibles: p.quantiteDisponible })),
  [packsData],
);

  // Présélection d'un pack passé dans l'adresse (?pack=PCK0001), une seule fois quand tout est chargé
  if (!presele && packsData && data) {
    setPresele(true);
    const p = packCode && packsDispo.find((x) => x.codePack === packCode);
    if (p) {
      setPackChoisiCode(p.codePack);
      setSelection(compositionDe(p));
    }
  }

  const packChoisi = packsDispo.find((p) => p.codePack === packChoisiCode) ?? null;
  const modifs = packChoisi ? comparer(compositionDe(packChoisi), selection) : null;
  const action = !packChoisi ? 'materiel' : modifs.identique ? 'pack' : 'personnalise';

  const lignes = Object.entries(selection)
    .filter(([, quantite]) => quantite > 0)
    .map(([code, quantite]) => ({ materiel: parCode.get(code), quantite }))
    .filter((l) => l.materiel);

  const nbEquipements = lignes.reduce((n, l) => n + l.quantite, 0);
  const totalLocation =
    action === 'pack'
      ? Number(packChoisi.tarifJournalier) * nbJours
      : lignes.reduce((t, l) => t + l.quantite * Number(l.materiel.prixLocation) * nbJours, 0);
  const totalCaution =
    action === 'pack'
      ? Number(packChoisi.prixCaution)
      : lignes.reduce((t, l) => t + l.quantite * Number(l.materiel.prixCaution), 0);

  const nom = (code) => parCode.get(code)?.designation ?? code;

  const setQuantite = (code, quantite) => {
    setSelection((current) => {
      const next = { ...current };
      if (quantite <= 0) delete next[code];
      else next[code] = quantite;
      return next;
    });
    setEnvoi(null);
  };

  const choisirPack = (pack) => {
    setPackChoisiCode(pack.codePack);
    setSelection(compositionDe(pack));
    setEnvoi(null);
  };

  const vider = () => {
    setSelection({});
    setPackChoisiCode('');
    setEnvoi(null);
  };

  const construireRequete = () => {
    const base = { idUser: ID_USER, dateDebutPrevue: dateDebut, dateFinPrevue: dateFin, actionLocataire: action };
    const materiels = lignes.map((l) => ({ codeMateriel: l.materiel.CodeMateriel, quantite: l.quantite }));
    if (action === 'pack') return { ...base, codePack: packChoisi.codePack, quantitePack: 1 };
    if (action === 'personnalise') return { ...base, codePack: packChoisi.codePack, materiels };
    return { ...base, materiels };
  };

  const continuer = async () => {
    setEnvoi({ statut: 'envoi' });
    try {
      const reponse = await createReservation(construireRequete());
      const reservation = reponse?.data ?? reponse;
      setSelection({});
      setPackChoisiCode('');
      setEnvoi({ statut: 'ok', numReservation: reservation?.numReservation });
    } catch (e) {
      setEnvoi({ statut: 'erreur', message: texteErreur(e) });
    }
  };

  return (
    <section aria-labelledby="dispo-title" className="mt-12">
      <h2 id="dispo-title" className="display text-2xl sm:text-3xl">
        Packs et matériel disponibles
      </h2>
      <p className="mt-3 max-w-2xl text-base-content/75">
        Du {formatDate(dateDebut)} au {formatDate(dateFin)}, soit {nbJours} {plural(nbJours, 'jour', 'jours')} de
        location.
      </p>

      {filtre && (
        <p className="mt-2 text-sm">
          Un filtre est actif.{' '}
          <Link to={showAllHref} className="link link-accent">
            Voir tout le matériel
          </Link>
        </p>
      )}

      {envoi?.statut === 'ok' && (
        <div role="status" className="alert alert-success alert-soft mt-8 max-w-2xl">
          <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Réservation enregistrée.</p>
            {envoi.numReservation && <p className="text-sm">Numéro : {envoi.numReservation}</p>}
          </div>
        </div>
      )}

      {envoi?.statut === 'erreur' && (
        <div role="alert" className="alert alert-error alert-soft mt-8 max-w-2xl">
          <CircleAlert className="size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">La réservation n’a pas pu être créée.</p>
            <p className="text-sm">{envoi.message}</p>
          </div>
        </div>
      )}

      {loading && <Skeletons />}

      {error && (
        <div role="alert" className="alert alert-error alert-soft mt-8 max-w-2xl">
          <CircleAlert className="size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Impossible de charger le matériel.</p>
            <p className="text-sm">{error.message}. Vérifiez que l’API est démarrée, puis réessayez.</p>
          </div>
          <button type="button" className="btn btn-sm" onClick={reload}>
            <RotateCw className="size-4" aria-hidden="true" />
            Réessayer
          </button>
        </div>
      )}

      {errorPacks && (
        <p role="alert" className="mt-6 text-sm text-warning">
          Les packs n’ont pas pu être chargés ({errorPacks.message}). Le matériel reste disponible ci-dessous.
        </p>
      )}

      {/* Packs */}
      {!loading && !error && packsData && packsDispo.length === 0 && (
        <p className="mt-6 text-sm text-base-content/70">
          Aucun pack disponible pour ces dates{type ? ' et ce type d’événement' : ''}. Composez votre matériel ci-dessous.
        </p>
      )}

      {/* Résumé des modifications du pack */}
      {packChoisi && (
        <div className="mt-8 max-w-2xl rounded-sm border border-accent bg-base-200 p-4 text-sm">
          <p className="font-semibold">
            Pack « {packChoisi.libelle} » {modifs.identique ? 'sélectionné' : 'personnalisé'}
          </p>
          {!modifs.identique && (
            <ul className="mt-2 space-y-0.5">
              {modifs.ajoutes.map((a) => (
                <li key={`a-${a.code}`}>+ {a.quantite} {nom(a.code)} ajouté</li>
              ))}
              {modifs.retires.map((r) => (
                <li key={`r-${r.code}`}>− {nom(r.code)} retiré</li>
              ))}
              {modifs.modifies.map((q) => (
                <li key={`q-${q.code}`}>
                  {nom(q.code)} : {q.avant} → {q.apres}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => choisirPack(packChoisi)}>
              Revenir au pack d’origine
            </button>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setPackChoisiCode('')}>
              Ne plus utiliser ce pack
            </button>
          </div>
        </div>
      )}

      {!loading && !error && groupes.length === 0 && (
        <p className="mt-8 max-w-xl rounded-sm border border-base-300 bg-base-200 p-5">
          Aucun matériel n’est libre sur cette période. Essayez d’autres dates avec le filtre ci-dessus.
        </p>
      )}

      {groupes.length > 1 && (
        <nav aria-label="Catégories de matériel" className="mt-8 flex flex-wrap gap-2">
          {groupes.map((g) => (
            <a key={g.idCategorie} href={`#cat-${g.idCategorie}`} className="btn btn-sm btn-outline">
              {g.libelle}
              <span className="badge badge-sm">{g.materiels.length}</span>
            </a>
          ))}
        </nav>
      )}

      {groupes.map((groupe) => (
        <div key={groupe.idCategorie} className="mt-10">
          <h3 id={`cat-${groupe.idCategorie}`} className="display scroll-mt-24 text-xl">
            {groupe.libelle}
          </h3>
          <p className="mt-1 text-sm text-base-content/70">{groupe.descriptionCategorie}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {groupe.materiels.map((materiel) => (
              <MaterielCard
                key={materiel.CodeMateriel}
                materiel={materiel}
                nbJours={nbJours}
                quantite={selection[materiel.CodeMateriel] ?? 0}
                onChange={(q) => setQuantite(materiel.CodeMateriel, q)}
              />
            ))}
          </div>
        </div>
      ))}

      {nbEquipements > 0 && (
        <div className="sticky bottom-4 z-20 mt-10" role="status">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm bg-neutral p-4 text-neutral-content shadow-xl sm:p-5">
            <div>
              <p className="font-semibold">
                {nbEquipements} {plural(nbEquipements, 'équipement sélectionné', 'équipements sélectionnés')}
                {packChoisi && (
                  <span className="badge badge-accent badge-sm ml-2">
                    {action === 'pack' ? 'Pack' : 'Pack personnalisé'}
                  </span>
                )}
              </p>
              <p className="text-sm opacity-80">
                Location : {formatMoney(totalLocation)} pour {nbJours} {plural(nbJours, 'jour', 'jours')}. Caution :{' '}
                {formatMoney(totalCaution)}.
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost btn-sm text-neutral-content" onClick={vider}>
                Vider
              </button>
              <button
                type="button"
                className="btn btn-accent"
                disabled={envoi?.statut === 'envoi'}
                onClick={continuer}
              >
                {envoi?.statut === 'envoi' ? 'Envoi…' : 'Continuer la réservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


// import { useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { CircleAlert, RotateCw } from 'lucide-react';
// import MaterielCard from './MaterielCard.jsx';
// import { useMaterielsDisponibles } from '../../hooks/useMaterielsDisponibles.js';
// import { SHORTCUTS } from '../../data/content.js';
// import { formatDate, formatMoney, plural, rentalDays } from '../../utils/format.js';
// import { testeApi } from '../../data/reservationService.js';

// function Skeletons() {
//   return (
//     <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
//       {Array.from({ length: 6 }, (_, i) => (
//         <div key={i} className="skeleton h-80 rounded-sm" />
//       ))}
//     </div>
//   );
// }

// /**
//  * Matériel disponible entre deux dates, groupé par catégorie, avec sélection des quantités.
//  * Props : dateDebut / dateFin (AAAA-MM-JJ), shortcut (slug d'un raccourci de l'accueil),
//  * showAllHref (lien « voir tout » quand un raccourci est actif).
//  * Utilisez `key={dateDebut + dateFin}` pour remettre la sélection à zéro quand les dates changent.
//  */
// export default function MaterielsDisponibles({ dateDebut, dateFin, shortcut = '', showAllHref = '/reservation' }) {
//   const { data, loading, error, reload } = useMaterielsDisponibles(dateDebut, dateFin);
//   const [selection, setSelection] = useState({}); // { CodeMateriel: quantité }
//   const [payload, setPayload] = useState(null);

//   const nbJours = rentalDays(dateDebut, dateFin);
//   const filtre = SHORTCUTS[shortcut];

//   // Catégories avec uniquement le matériel réellement disponible (et le raccourci éventuel)
//   const groupes = useMemo(
//     () =>
//       (data ?? [])
//         .map((categorie) => ({
//           ...categorie,
//           materiels: categorie.materiels.filter(
//             (m) => m.quantiteDisponible > 0 && (!filtre || filtre(m, categorie)),
//           ),
//         }))
//         .filter((categorie) => categorie.materiels.length > 0),
//     [data, filtre],
//   );

//   const parCode = useMemo(() => {
//     const map = new Map();
//     groupes.forEach((g) => g.materiels.forEach((m) => map.set(m.CodeMateriel, m)));
//     return map;
//   }, [groupes]);

//   const lignes = Object.entries(selection)
//     .filter(([, quantite]) => quantite > 0)
//     .map(([code, quantite]) => ({ materiel: parCode.get(code), quantite }))
//     .filter((l) => l.materiel);

//   const nbEquipements = lignes.reduce((n, l) => n + l.quantite, 0);
//   const totalLocation = lignes.reduce((t, l) => t + l.quantite * Number(l.materiel.prixLocation) * nbJours, 0);
//   const totalCaution = lignes.reduce((t, l) => t + l.quantite * Number(l.materiel.prixCaution), 0);

//   const setQuantite = (code, quantite) => {
//     setSelection((current) => {
//       const next = { ...current };
//       if (quantite <= 0) delete next[code];
//       else next[code] = quantite;
//       return next;
//     });
//     setPayload(null);
//   };

//   const continuer = async () => {
//     // Corps à envoyer à POST /reservations (le tarif et le total sont calculés par le serveur)
//     setPayload({
//       dateDebutPrevue: dateDebut,
//       dateFinPrevue: dateFin,
//       ligneLocations: lignes.map((l) => ({ codeMateriel: l.materiel.CodeMateriel, quantite: l.quantite })),
//     });
//     const data = {
//       dateDebutPrevue: dateDebut,
//       dateFinPrevue: dateFin,
//       ligneLocations: lignes.map((l) => ({ codeMateriel: l.materiel.CodeMateriel, quantite: l.quantite })),
//     }
//     const response = await testeApi(data)
//     console.log("DONNEES AVANT CREATE: ", data)
//     console.log("DONNEES APRES CREATE: ", response)
//   };

//   return (
//     <section aria-labelledby="dispo-title" className="mt-12">
//       <h2 id="dispo-title" className="display text-2xl sm:text-3xl">
//         Matériel disponible
//       </h2>
//       <p className="mt-3 max-w-2xl text-base-content/75">
//         Du {formatDate(dateDebut)} au {formatDate(dateFin)}, soit {nbJours} {plural(nbJours, 'jour', 'jours')} de
//         location.
//       </p>

//       {filtre && (
//         <p className="mt-2 text-sm">
//           Un filtre est actif.{' '}
//           <Link to={showAllHref} className="link link-accent">
//             Voir tout le matériel
//           </Link>
//         </p>
//       )}

//       {loading && <Skeletons />}

//       {error && (
//         <div role="alert" className="alert alert-error alert-soft mt-8 max-w-2xl">
//           <CircleAlert className="size-5 shrink-0" aria-hidden="true" />
//           <div>
//             <p className="font-semibold">Impossible de charger le matériel.</p>
//             <p className="text-sm">{error.message}. Vérifiez que l’API est démarrée, puis réessayez.</p>
//           </div>
//           <button type="button" className="btn btn-sm" onClick={reload}>
//             <RotateCw className="size-4" aria-hidden="true" />
//             Réessayer
//           </button>
//         </div>
//       )}

//       {!loading && !error && groupes.length === 0 && (
//         <p className="mt-8 max-w-xl rounded-sm border border-base-300 bg-base-200 p-5">
//           Aucun matériel n’est libre sur cette période. Essayez d’autres dates avec le filtre ci-dessus.
//         </p>
//       )}

//       {groupes.length > 1 && (
//         <nav aria-label="Catégories de matériel" className="mt-6 flex flex-wrap gap-2">
//           {groupes.map((g) => (
//             <a key={g.idCategorie} href={`#cat-${g.idCategorie}`} className="btn btn-sm btn-outline">
//               {g.libelle}
//               <span className="badge badge-sm">{g.materiels.length}</span>
//             </a>
//           ))}
//         </nav>
//       )}

//       {groupes.map((groupe) => (
//         <div key={groupe.idCategorie} className="mt-10">
//           <h3 id={`cat-${groupe.idCategorie}`} className="display scroll-mt-24 text-xl">
//             {groupe.libelle}
//           </h3>
//           <p className="mt-1 text-sm text-base-content/70">{groupe.descriptionCategorie}</p>

//           <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {groupe.materiels.map((materiel) => (
//               <MaterielCard
//                 key={materiel.CodeMateriel}
//                 materiel={materiel}
//                 nbJours={nbJours}
//                 quantite={selection[materiel.CodeMateriel] ?? 0}
//                 onChange={(q) => setQuantite(materiel.CodeMateriel, q)}
//               />
//             ))}
//           </div>
//         </div>
//       ))}

//       {nbEquipements > 0 && (
//         <div className="sticky bottom-4 z-20 mt-10" role="status">
//           <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm bg-neutral p-4 text-neutral-content shadow-xl sm:p-5">
//             <div>
//               <p className="font-semibold">
//                 {nbEquipements} {plural(nbEquipements, 'équipement sélectionné', 'équipements sélectionnés')}
//               </p>
//               <p className="text-sm opacity-80">
//                 Location : {formatMoney(totalLocation)} pour {nbJours} {plural(nbJours, 'jour', 'jours')}. Caution :{' '}
//                 {formatMoney(totalCaution)}.
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 className="btn btn-ghost btn-sm text-neutral-content"
//                 onClick={() => {
//                   setSelection({});
//                   setPayload(null);
//                 }}
//               >
//                 Vider
//               </button>
//               <button type="button" className="btn btn-accent" onClick={continuer}>
//                 Continuer la réservation
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {payload && (
//         <div className="mt-8 max-w-2xl rounded-sm border border-base-300 bg-base-200 p-5">
//           <p className="font-semibold">Prochaine étape : créer la réservation</p>
//           <p className="mt-2 text-sm text-base-content/75">
//             Envoyez ceci à l’API, avec l’identifiant de l’utilisateur connecté (idUser) et le mode de retrait :
//           </p>
//           <pre className="mt-3 overflow-x-auto rounded-sm bg-neutral p-3 text-sm text-neutral-content">
//             <code>{`POST /reservations\n${JSON.stringify(payload, null, 2)}`}</code>
//           </pre>
//         </div>
//       )}
//     </section>
//   );
// }
