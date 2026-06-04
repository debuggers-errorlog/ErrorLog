import api from './axios'

export const sendVerificationEmail = (email) =>
  api.post('/auth/email/verification', { email })

export const signUp = (data) =>
  api.post('/auth/signup', data)

export const login = (data) =>
  api.post('/auth/login', data)

export const logout = () =>
  api.post('/auth/logout')

export const withdraw = (password) =>
  api.delete('/auth/withdraw', { data: { password } })
