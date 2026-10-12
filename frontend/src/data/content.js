import {
  Cake,
  Heart,
  Presentation,
  Speaker,
  Mic,
  SlidersHorizontal,
  Lightbulb,
  Headset,
  Truck,
  ClipboardCheck,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

/*
  Contenu du site.
  Tout ce qui est marqué "exemple" est à remplacer par vos vraies données
  (ou à charger depuis l'API) avant la mise en ligne.
*/

export const BRAND = {
  name: 'SonoLoc',
  phone: '+261 38 23 612 23', 
  currency: 'Ar', 
  tagline: 'Location de sonorisation et d’éclairage pour vos événements.',
};

// Les 4 menus du site
export const NAV_LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/reservation', label: 'Réservation' },
  { to: '/information', label: 'Information' },
  { to: '/aide', label: 'Aide' },
];

export const EVENT_TYPES = [
  { value: 'anniversaire', label: 'Anniversaire' },
  { value: 'mariage', label: 'Mariage' },
  { value: 'conference', label: 'Conférence' },
  { value: 'concert', label: 'Concert ou soirée' },
  { value: 'autre', label: 'Autre événement' },
];

// Exemple : contenu des packs à adapter à votre catalogue
export const PACKS = [
  {
    slug: 'anniversaire',
    title: 'Pack Anniversaire',
    icon: Cake,
    audience: 'Jusqu’à 60 invités',
    includes: '2 enceintes actives, 1 micro sans fil, 2 projecteurs d’ambiance.',
  },
  {
    slug: 'mariage',
    title: 'Pack Mariage',
    icon: Heart,
    audience: '100 à 300 invités',
    includes:
      'Sono complète avec caissons de basses, 2 micros sans fil, éclairage de scène et machine à brouillard.',
  },
  {
    slug: 'conference',
    title: 'Pack Conférence',
    icon: Presentation,
    audience: '20 à 200 participants',
    includes: 'Enceintes de façade, micros main et cravate, table de mixage 8 voies.',
  },
];

export const CATEGORIES = [
  { slug: 'enceintes', label: 'Enceintes', icon: Speaker, description: 'Façade, retours, caissons de basses' },
  { slug: 'micros', label: 'Micros', icon: Mic, description: 'Sans fil, main, cravate, serre-tête' },
  {
    slug: 'tables-de-mixage',
    label: 'Tables de mixage',
    icon: SlidersHorizontal,
    description: 'Analogiques et numériques, 8 à 32 voies',
  },
  { slug: 'eclairage', label: 'Éclairage', icon: Lightbulb, description: 'Projecteurs LED, lyres, machines à effets' },
];

export const FEATURES = [
  {
    icon: Headset,
    title: 'Assistance technique 24/7',
    text: 'Un technicien répond à toute heure, avant et pendant votre événement.',
  },
  {
    icon: Truck,
    title: 'Livraison et installation',
    text: 'En option : nous livrons, installons, réglons le son, puis reprenons le matériel.',
  },
  {
    icon: ClipboardCheck,
    title: 'État du matériel suivi',
    text: 'Chaque équipement est contrôlé et son état noté au départ et au retour.',
  },
];

// Exemples : à remplacer par de vrais avis clients
export const REVIEWS = [
  {
    rating: 5,
    quote: 'Le technicien a réglé le son avant l’arrivée des invités. Je n’ai rien eu à gérer.',
    author: 'Hanta R.',
    context: 'Mariage, 150 invités',
  },
  {
    rating: 5,
    quote: 'Réservation faite en dix minutes depuis mon téléphone. Matériel propre et complet.',
    author: 'Tahiry A.',
    context: 'Conférence d’entreprise',
  },
  {
    rating: 5,
    quote: 'Une enceinte a lâché pendant la soirée : elle a été remplacée en moins d’une heure.',
    author: 'Mialy F.',
    context: 'Anniversaire, 60 invités',
  },
];

// Page Information : étapes d'une location (c'est une vraie séquence)
export const INFO_STEPS = [
  {
    title: 'Choisissez vos dates',
    text: 'Indiquez le début et la fin de votre événement. Seul le matériel libre sur cette période est proposé.',
  },
  {
    title: 'Composez votre matériel',
    text: 'Ajoutez un pack ou des équipements à l’unité, avec la quantité voulue.',
  },
  {
    title: 'Confirmez la réservation',
    text: 'Vous recevez un numéro de réservation. Le montant est calculé d’après le tarif journalier et le nombre de jours.',
  },
  {
    title: 'Récupérez ou faites-vous livrer',
    text: 'Retrait sur place, ou livraison et installation en option. L’état de chaque équipement est noté au départ.',
  },
  {
    title: 'Rendez le matériel',
    text: 'Au retour, l’état est contrôlé et la caution est restituée.',
  },
];

export const INFO_POINTS = [
  {
    icon: Wallet,
    title: 'Tarifs',
    text: 'Chaque équipement a un tarif journalier. Le total est ce tarif multiplié par la quantité et par le nombre de jours.',
  },
  {
    icon: ShieldCheck,
    title: 'Caution',
    text: 'Une caution est demandée pour chaque matériel. Elle est restituée au retour, après contrôle de l’état.',
  },
  {
    icon: Truck,
    title: 'Livraison et installation',
    text: 'En option. Choisissez « Livraison » à la réservation : les frais sont indiqués avant que vous confirmiez.',
  },
];

// Page Aide : questions fréquentes (exemples à adapter à vos règles)
export const FAQ = [
  {
    q: 'Comment réserver du matériel ?',
    a: 'Indiquez vos dates et le type d’événement sur la page Réservation, choisissez votre matériel parmi ce qui est libre, puis confirmez. Vous recevez un numéro de réservation.',
  },
  {
    q: 'Comment le prix est-il calculé ?',
    a: 'Tarif journalier de chaque équipement × quantité × nombre de jours, plus les frais de livraison si vous choisissez la livraison.',
  },
  {
    q: 'À quoi sert la caution ?',
    a: 'Elle couvre les dommages éventuels. Elle vous est restituée au retour du matériel, une fois son état contrôlé.',
  },
  {
    q: 'Puis-je modifier ou annuler ma réservation ?',
    a: 'Contactez l’assistance avec votre numéro de réservation. Nous vous indiquons ce qui est possible selon la date de l’événement.',
  },
  {
    q: 'Un équipement tombe en panne pendant l’événement. Que faire ?',
    a: 'Appelez l’assistance technique, joignable 24h/24 et 7j/7. Nous intervenons ou nous remplaçons l’équipement.',
  },
  {
    q: 'Livrez-vous et installez-vous le matériel ?',
    a: 'Oui, en option. Choisissez « Livraison » lors de la réservation. Les frais sont affichés avant la confirmation.',
  },
];

// Raccourcis de l'accueil (?categorie=...) : filtre appliqué au matériel disponible.
// Les catégories de l'API (sonorisation, éclairage, instruments) sont plus larges que ces raccourcis,
// on filtre donc aussi sur le nom du matériel.
export const SHORTCUTS = {
  enceintes: (materiel) => /enceinte|caisson de basses|subwoofer/i.test(materiel.designation),
  micros: (materiel) => /micro/i.test(materiel.designation),
  'tables-de-mixage': (materiel) => /table de mixage|console|mixage/i.test(materiel.designation),
  eclairage: (_materiel, categorie) => categorie.typeCategorie === 'eclairage',
};
