import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// These endpoints don't need changes as they don't handle images
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const getCars = async (search = '') => {
  const response = await api.get(`/cars${search ? `?search=${search}` : ''}`)
  return response.data
}

export const getCar = async (id) => {
  const response = await api.get(`/cars/${id}`)
  return response.data
}

// For file uploads, we need to ensure proper headers
export const createCar = async (carData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  const response = await api.post('/cars', carData, config)
  return response.data
}

export const updateCar = async (id, carData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  const response = await api.patch(`/cars/${id}`, carData, config)
  return response.data
}

export const deleteCar = async (id) => {
  const response = await api.delete(`/cars/${id}`)
  return response.data
}

export default api