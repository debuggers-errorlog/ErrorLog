import api from './axios'

export const getMyProfile = () =>
  api.get('/users/me')

export const updateMyProfile = (data) =>
  api.patch('/users/me', data)

export const getMyPosts = (page = 0, size = 10) =>
  api.get(`/users/me/posts?page=${page}&size=${size}`)

export const getMyFollowing = () =>
  api.get('/follows/following')

export const getMyQuestions = () =>
  api.get('/questions/my/asker')
