import { BRAND } from '../data/content.js';

const number = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

// "12000.00" ou 12000 -> "12 000 Ar"
export const formatMoney = (value) => `${number.format(Number(value) || 0)} ${BRAND.currency}`;

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

// Même règle que le backend (calculerDuree) : écart en jours, 1 jour minimum
export const rentalDays = (dateDebut, dateFin) =>
  Math.max(1, Math.ceil((new Date(dateFin) - new Date(dateDebut)) / 86_400_000));

export const plural = (n, singular, pluralForm) => (n > 1 ? pluralForm : singular);
