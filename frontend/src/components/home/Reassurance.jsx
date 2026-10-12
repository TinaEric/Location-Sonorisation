import { FEATURES } from '../../data/content.js';

export default function Reassurance() {
  return (
    <section aria-labelledby="reassurance-title" >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="reassurance-title" className="display max-w-2xl text-2xl sm:text-3xl">
          Vous n’êtes jamais seul le jour J
        </h2>

        <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0">
          {FEATURES.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className={index > 0 ? 'md:border-l md:border-primary-content/30 md:px-8' : 'md:pr-8'}>
              <Icon className="size-8 text-accent" aria-hidden="true" />
              <h3 className="display mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-accent-content/85">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
