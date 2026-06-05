import client from './client';

export const cancelPayment = (userId, creatorId, targetId) =>
    client.post('/payments/cancel', { userId, creatorId, targetId });

export const getSettlement = (creatorId, paymentType) =>
    client.get('/payments/settlement', {
        params: paymentType
            ? { creatorId, paymentType }
            : { creatorId }
    });