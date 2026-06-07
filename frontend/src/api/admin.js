import api from './axios'

export const getMembers    = (params) => api.get('/admin/members', { params })
export const suspendMember = (id) => api.patch(`/admin/members/${id}/suspend`)
export const restoreMember = (id) => api.patch(`/admin/members/${id}/restore`)

export const getPosts   = (params) => api.get('/admin/posts', { params })
export const hidePost   = (id) => api.patch(`/admin/posts/${id}/hide`)
export const showPost   = (id) => api.patch(`/admin/posts/${id}/show`)
export const deletePost = (id) => api.delete(`/admin/posts/${id}`)

export const getSubscriptionSummary = () => api.get('/admin/subscriptions/summary');
export const getSubscriptions = ({ page = 0, size = 10, search = '', status = '' } = {}) =>
    api.get('/admin/subscriptions', { params: { page, size, search, status } });

export const getQuestionRequests   = (params) => api.get('/admin/question-requests', { params })
export const cancelQuestionRequest = (id) => api.patch(`/admin/question-requests/${id}/cancel`)

export const getReports    = (params) => api.get('/admin/reports', { params })
export const resolveReport = (id) => api.patch(`/admin/reports/${id}/resolve`)
export const rejectReport  = (id) => api.patch(`/admin/reports/${id}/reject`)

export const getDashboard = () => api.get('/admin/dashboard')