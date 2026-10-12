import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getTypeEvenement } from '../data/PackService.js';

const todayIso = () => new Date().toLocaleDateString('en-CA');

function Field({ id, label, tilt, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="tape self-start" style={{ transform: `rotate(${tilt}deg)` }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FilterBar({ initial = {}, extra = {}, className = '' }) {
  const navigate = useNavigate();
  const uid = useId();
  const today = todayIso();
  const [form, setForm] = useState({
    dateDebut: initial.dateDebut ?? '',
    dateFin: initial.dateFin ?? '',
    type: initial.type ?? '',
  });
  const [error, setError] = useState('');
  const [types, setTypes] = useState([]); 
  const [loading, setLoading] = useState(true); 
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const packResp = await getTypeEvenement()
          setTypes(packResp);
        } catch (err) {
          setError('Erreur lors du chargement des données.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);


  const update = (key) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'dateDebut' && next.dateFin && next.dateFin < value) next.dateFin = value;
      return next;
    });
    setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.dateDebut || !form.dateFin) {
      setError('Indiquez la date de début et la date de fin de votre événement.');
      return;
    }
    const params = new URLSearchParams();
    Object.entries({ ...extra, ...form }).forEach(([key, value]) => value && params.set(key, value));

    navigate({ pathname: '/reservation', search: params.toString() });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Filtre rapide du matériel disponible"
      className={`rounded-sm border border-base-300 bg-base-100 p-5 sm:p-6 ${className}`}
    >
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end">
        <Field id={`${uid}-debut`} label="Date de début" tilt={-1.2}>
          <input
            id={`${uid}-debut`}
            type="date"
            min={today}
            value={form.dateDebut}
            onChange={update('dateDebut')}
            required
            className="input w-full"
          />
        </Field>

        <Field id={`${uid}-fin`} label="Date de fin" tilt={0.8}>
          <input
            id={`${uid}-fin`}
            type="date"
            min={form.dateDebut || today}
            value={form.dateFin}
            onChange={update('dateFin')}
            required
            className="input w-full"
          />
        </Field>

        <Field id={`${uid}-type`} label="Type d’événement" tilt={-0.6}>
          <select id={`${uid}-type`} value={form.type} onChange={update('type')} className="select w-full">
            <option value="">Tous les types</option>
            {loading ? <option>Chargement…</option> : types.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </Field>

        <button type="submit" className="btn btn-accent btn-lg sm:col-span-2 lg:col-span-1">
          <Search className="size-5" aria-hidden="true" />
          Voir le matériel libre
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-error">
          {error}
        </p>
      )}
    </form>
  );
}
