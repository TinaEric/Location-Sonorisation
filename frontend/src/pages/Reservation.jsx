import { Link, useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import MaterielsDisponibles from '../components/reservation/MaterielsDisponibles.jsx';

import { formatDate } from '../utils/format.js';
import { listeCategories } from '../data/CategorieService.js';
import { useEffect, useState } from 'react';

export default function Reservation() {
  const [params] = useSearchParams();
  const dateDebut = params.get('dateDebut') ?? '';
  const dateFin = params.get('dateFin') ?? '';
  const type = params.get('type') ?? '';
  const categorie = params.get('categorie') ?? '';
  const pack = params.get('pack') ?? '';
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catResp = await listeCategories()
        setCategories(catResp);
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasDates = Boolean(dateDebut && dateFin);
  const datesValides = hasDates && dateFin >= dateDebut;

  const criteria = [
    hasDates ? `Du ${formatDate(dateDebut)} au ${formatDate(dateFin)}` : null,
    categories.find((c) => c.codeCategorie === categorie)?.libelle,
  ].filter(Boolean);

    // Lien « voir tout » : mêmes dates, sans le raccourci de catégorie
    const showAll = new URLSearchParams();
    if (dateDebut) showAll.set('dateDebut', dateDebut);
    if (dateFin) showAll.set('dateFin', dateFin);
    if (type) showAll.set('type', type);

    if (loading) {
      return <p>Chargement des données...</p>;
    }

    if (error) {
      return <p className="text-error">{error}</p>;
    }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="display text-3xl sm:text-4xl">Réservation</h1>
      <p className="mt-4 max-w-xl text-base-content/75">
        Indiquez les dates de votre événement pour voir le matériel libre.
      </p>

      {/* key : le formulaire se remet à jour quand on arrive depuis un raccourci */}
      <FilterBar
        key={params.toString()}
        initial={{ dateDebut, dateFin, type }}
        extra={{ categorie, pack }}
        className="mt-8"
      />

      {criteria.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Critères choisis">
          {criteria.map((item) => (
            <li key={item} className="badge badge-neutral badge-lg">
              {item}
            </li>
          ))}
        </ul>
      )}

      
      {datesValides && (
        <MaterielsDisponibles
          key={`${dateDebut}|${dateFin}|${type}`}
          dateDebut={dateDebut}
          dateFin={dateFin}
          shortcut={categorie}
          packCode={pack}
          type={type}
          categories={categories} // Passe les catégories récupérées au composant
          showAllHref={`/reservation?${showAll.toString()}`}
        />
      )}
     
           {hasDates && !datesValides && (
             <p role="alert" className="mt-10 font-medium text-error">
               La date de fin doit être égale ou postérieure à la date de début.
             </p>
           )}
     
           {!hasDates && (
             <p className="mt-10 text-base-content/75">
               Besoin d’aide pour choisir ? <Link to="/aide" className="link link-accent">Consultez l’aide</Link> ou{' '}
               <Link to="/information" className="link link-accent">le fonctionnement d’une location</Link>.
             </p>
           )}
      </div>
  );
}
