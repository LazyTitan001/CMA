import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import Navbar from './components/layout/Navbar'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import CarList from './components/cars/CarList'
import CarDetail from './components/cars/CarDetail'
import AddCar from './components/cars/AddCar'
import EditCar from './components/cars/EditCar'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CarList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/:id"
            element={
              <PrivateRoute>
                <CarDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/add"
            element={
              <PrivateRoute>
                <AddCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/edit/:id"
            element={
              <PrivateRoute>
                <EditCar />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App