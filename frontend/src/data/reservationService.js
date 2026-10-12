import {api} from "./Api";
import { verifierReponse } from './verifierReponse';

export const materielDispo = async (data) => {
    return await verifierReponse(() => api.post('/reservation/materiels-disponibles',data));
};

export const packsDisponibles = async (data) => {
    return await verifierReponse(() => api.post('/pack/disponibles', data));
};

export const listePacks = async () => {
    return await verifierReponse(() => api.get('/pack'));
};

export const createReservation = async (data) => {
    return await verifierReponse(() => api.post('/reservation/creer',data));
};

export const listeReservation = async (data) => {
    return await verifierReponse(() => api.post('/reservation/',data));
};