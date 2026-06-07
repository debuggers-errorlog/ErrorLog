import api from './axios'

export const createReport = ({ targetType, targetId, reasonCategory, reasonDetail }) =>
    api.post('/reports', { targetType, targetId, reasonCategory, reasonDetail })