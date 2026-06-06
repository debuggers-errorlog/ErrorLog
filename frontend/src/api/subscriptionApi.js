import client from './client';

export const getSubscriptionInfo = (creatorId) =>
    client.get(`/subscriptions/${creatorId}/info`);

export const subscribe = (creatorId) =>
    client.post('/subscriptions', { creatorId });

export const getSubscriptionStatus = (creatorId) =>
    client.get('/subscriptions/status', { params: { creatorId } });

export const getSubscriptionList = () =>
    client.get('/subscriptions/list');

export const getSubscriptionSettings = (creatorId) =>
    client.get(`/subscription-settings/${creatorId}`);

export const createSubscriptionSettings = (data) =>
    client.post('/subscription-settings', data);

export const updateSubscriptionSettings = (creatorId, data) =>
    client.put(`/subscription-settings/${creatorId}`, data);