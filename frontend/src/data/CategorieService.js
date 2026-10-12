import { api } from './Api';
import { verifierReponse } from './verifierReponse';

export const listeCategories = async () =>
  await verifierReponse(() => api.get('/categorie'));