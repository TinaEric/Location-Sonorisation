import { Link } from 'react-router-dom';
import { INFO_POINTS, INFO_STEPS } from '../data/content.js';

export default function Information() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="display text-3xl sm:text-4xl">Information</h1>
      <p className="mt-4 max-w-xl text-base-content/75">
        Comment se déroule une location, de la réservation au retour du matériel.
      </p>

      <ol className="mt-12 max-w-2xl space-y-8">
        {INFO_STEPS.map(({ title, text }, index) => (
          <li key={title} className="flex gap-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral font-bold text-accent">
              {index + 1}
            </span>
            <div>
              <h2 className="display text-lg">{title}</h2>
              <p className="mt-1 text-base-content/75">{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <ul className="mt-16 grid gap-10 border-t border-base-300 pt-12 md:grid-cols-3">
        {INFO_POINTS.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Icon className="size-8 text-accent" aria-hidden="true" />
            <h2 className="display mt-4 text-lg">{title}</h2>
            <p className="mt-2 text-base-content/75">{text}</p>
          </li>
        ))}
      </ul>

      <Link to="/reservation" className="btn btn-accent btn-lg mt-14">
        Voir le matériel libre
      </Link>
    </div>
  );
}
