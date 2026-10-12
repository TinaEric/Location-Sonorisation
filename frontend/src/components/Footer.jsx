import { Link } from 'react-router-dom';
import { Headset } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="display text-lg">{BRAND.name}</p>
          <p className="mt-2 max-w-xs text-sm text-base-content/75">{BRAND.tagline}</p>
        </div>

        <nav aria-label="Liens du pied de page">
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/connexion" className="hover:underline">
                Se connecter
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Headset className="size-4" aria-hidden="true" />
            Assistance technique 24/7
          </p>
          <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className="mt-2 inline-block hover:underline">
            {BRAND.phone}
          </a>
        </div>
      </div>
      <div className="border-t border-base-300 py-4 text-center text-xs text-base-content/60">
        © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
