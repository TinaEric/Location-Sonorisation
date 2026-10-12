import { api } from './Api';
import { verifierReponse } from './verifierReponse';

export const packsDisponibles = async (data) => {
    return await verifierReponse(() => api.post('/pack/disponibles', data));
};

export const listePacks = async () => {
    return await verifierReponse(() => api.get('/pack'));
};

export const getTypeEvenement = async () => {
    return await verifierReponse(() => api.get('/pack/typeEvenement'));
};