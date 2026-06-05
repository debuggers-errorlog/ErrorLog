import client from './client';

export const getSubscriptionInfo = (creatorId) =>
    client.get(`/subscriptions/${creatorId}/info`);

export const subscribe = (subscriberId, creatorId) =>
    client.post('/subscriptions', { subscriberId, creatorId });

export const getSubscriptionStatus = (subscriberId, creatorId) =>
    client.get('/subscriptions/status', { params: { subscriberId, creatorId } });

export const getSubscriptionList = (userId) =>
    client.get('/subscriptions/list', { params: { userId } });

export const getSubscriptionSettings = (creatorId) =>
    client.get(`/subscription-settings/${creatorId}`);

export const createSubscriptionSettings = (data) =>
    client.post('/subscription-settings', data);

export const updateSubscriptionSettings = (creatorId, data) =>
    client.put(`/subscription-settings/${creatorId}`, data);