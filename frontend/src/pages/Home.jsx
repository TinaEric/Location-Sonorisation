import Hero from '../components/home/Hero.jsx';
import Packs from '../components/home/Packs.jsx';
import Categories from '../components/home/Categories.jsx';
import Reassurance from '../components/home/Reassurance.jsx';
import Reviews from '../components/home/Reviews.jsx';
import FinalCta from '../components/home/FinalCta.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Packs />
      <Categories />
      <Reassurance />
      <Reviews />
      <FinalCta />
    </>
  );
}
