import api from './axios'

export const getMyProfile = () =>
  api.get('/users/me')

export const updateMyProfile = (data) =>
  api.patch('/users/me', data)
