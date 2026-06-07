import client from './client';

export const cancelPayment = (creatorId) =>
    client.post('/payments/cancel', { creatorId });

export const getSettlement = (creatorId, paymentType) =>
    client.get('/payments/settlement', {
        params: paymentType
            ? { creatorId, paymentType }
            : { creatorId }
    });