// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { MenuProvider } from './context/MenuContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Gallery from './pages/Gallery';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReservationsPage from './pages/ReservationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminMenu from './pages/AdminMenu';
import AdminOverview from './pages/AdminOverview';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MenuProvider>
          <BookingProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyEmailPage />} />
              <Route path="/user/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/overview" replace />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="menu" element={<AdminMenu />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BookingProvider>
        </MenuProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;