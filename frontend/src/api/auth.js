import api from './axios'

export const sendVerificationEmail = (email, purpose) =>
  api.post('/auth/email/verification', { email, purpose })

export const signUp = (data) =>
  api.post('/auth/signup', data)

export const login = (data) =>
  api.post('/auth/login', data)

export const logout = () =>
  api.post('/auth/logout')

export const withdraw = (password) =>
  api.delete('/auth/withdraw', { data: { password } })

export const resetPassword = (data) =>
  api.post('/auth/password/reset', data)
