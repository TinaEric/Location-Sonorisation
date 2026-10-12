import { Link } from 'react-router-dom';

// Page à construire : elle évite un lien mort depuis le menu.
export default function Connexion() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="display text-3xl sm:text-4xl">Se connecter</h1>
      <p className="mt-4 max-w-xl text-base-content/75">Le formulaire de connexion sera ajouté ici.</p>
      <Link to="/" className="btn btn-accent mt-8">
        Retour à l’accueil
      </Link>
    </div>
  );
}
