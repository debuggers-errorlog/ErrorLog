import client from './client';

export const getSubscriptionInfo = (creatorId) =>
    client.get(`/subscriptions/${creatorId}/info`);

export const subscribe = (creatorId) =>
    client.post('/subscriptions', { creatorId });

export const getSubscriptionStatus = (creatorId) =>
    client.get('/subscriptions/status', { params: { creatorId } });

export async function fetchSubscriptionStatus(creatorId) {
  const { data } = await getSubscriptionStatus(creatorId);
  return !!data;
}

export const getSubscriptionList = () =>
    client.get('/subscriptions/list');

export const getSubscriptionSettings = (creatorId) =>
    client.get(`/subscription-settings/${creatorId}`);

export const getMySubscriptionSettings = () =>
    client.get('/subscription-settings/me');

export const createSubscriptionSettings = (data) =>
    client.post('/subscription-settings/me', data);

/** 내 구독 플랜 저장 (없으면 생성, 있으면 수정) */
export const saveMySubscriptionSettings = (data) =>
    client.post('/subscription-settings/me', data);