import { useEffect, useState } from 'react';
import { packsDisponibles } from '../data/reservationService.js';

export function usePacks(dateDebut, dateFin, typeEvenement = '') {
  const [essai, setEssai] = useState(0);
  const [result, setResult] = useState({ cle: '', data: null, error: null });
  const cle = `${dateDebut}|${dateFin}|${typeEvenement}|${essai}`;

  useEffect(() => {
    let annule = false;
    packsDisponibles({ dateDebut, dateFin, ...(typeEvenement ? { typeEvenement } : {}) })
      .then((reponse) => {
        if (annule) return;
        const liste = Array.isArray(reponse) ? reponse : (reponse?.data ?? []);
        setResult({ cle, data: liste, error: null });
      })
      .catch((e) => {
        if (annule) return;
        setResult({ cle, data: null, error: e instanceof Error ? e : new Error(String(e)) });
      });
    return () => {
      annule = true;
    };
  }, [dateDebut, dateFin, typeEvenement, cle]);

  return {
    data: result.data,
    error: result.error,
    loading: result.cle !== cle,
    reload: () => setEssai((n) => n + 1),
  };
}