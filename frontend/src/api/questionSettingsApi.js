import client from './client';

export const getQuestionSettings = (mentorId) =>
    client.get(`/question-settings/${mentorId}`);

export const getMyQuestionSettings = () =>
    client.get('/question-settings/me');

export const saveMyQuestionSettings = (data) =>
    client.post('/question-settings/me', data);
