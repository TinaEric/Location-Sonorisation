import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="display text-3xl sm:text-4xl">Page introuvable</h1>
      <p className="mt-4 max-w-xl text-base-content/75">
        L’adresse saisie n’existe pas. Retournez à l’accueil pour lancer une recherche.
      </p>
      <Link to="/" className="btn btn-primary mt-8">
        Retour à l’accueil
      </Link>
    </div>
  );
}
