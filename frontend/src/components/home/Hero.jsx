import FilterBar from '../FilterBar.jsx';
import heroStage from '../../assets/hero-stage.svg';

const STEPS = ['Choisissez vos dates', 'Composez votre matériel', 'Confirmez votre réservation'];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-neutral text-neutral-content">
      {/* Image de fond et voiles de lisibilité (décoratifs) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroStage})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral/85 via-neutral/40 to-transparent sm:from-neutral/80"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral/75 via-transparent to-neutral/20" />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-24">
        <h1
          id="hero-title"
          className="display max-w-3xl text-balance text-3xl text-white [text-shadow:0_2px_28px_rgb(0_0_0/0.55)] sm:text-4xl xl:text-5xl"
        >
          Sonorisez vos événements professionnels et privés en 3 clics
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.6)]">
          Enceintes, micros, tables de mixage et éclairage. Choisissez vos dates, recevez le matériel installé et réglé,
          rendez-le après l’événement.
        </p>

        <FilterBar className="mt-10 text-base-content shadow-xl lg:mt-14" />

        <ol className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-content">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
