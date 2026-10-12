import { Star } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import { REVIEWS } from '../../data/content.js';

export default function Reviews() {
  return (
    <section aria-labelledby="avis-title" className="bg-base-200 mx-auto  px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading id="avis-title" title="Ce que disent nos clients" />

      <ul className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
        {REVIEWS.map(({ rating, quote, author, context }, index) => (
          <li key={author} className={`border-t-2 border-neutral pt-5 ${index === 1 ? 'lg:mt-12' : ''}`}>
            <div role="img" aria-label={`Note : ${rating} sur 5`} className="flex gap-0.5 text-neutral">
              {Array.from({ length: 5 }, (_, n) => (
                <Star key={n} className={`size-4 ${n < rating ? 'fill-current' : ''}`} aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-4 text-lg leading-relaxed">« {quote} »</blockquote>
            <p className="mt-4 font-semibold">{author}</p>
            <p className="text-sm text-base-content/70">{context}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
