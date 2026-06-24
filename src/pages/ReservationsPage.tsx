// pages/ReservationsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import './ReservationsPage.css';

const ReservationsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { createBooking } = useBookings();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: 2,
    seatingArea: 'Indoor' as 'Indoor' | 'Garden' | 'Rooftop' | 'VIP Lounge',
    specialRequests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createBooking({
        userId: 'current-user',
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        seatingArea: formData.seatingArea,
        specialRequests: formData.specialRequests
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/user/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="reservations-page">
      <div className="reservations-hero">
        <div className="container">
          <h1>Reserve a Table</h1>
          <p>Book your unforgettable dining experience</p>
        </div>
      </div>

      <div className="container reservations-container">
        <div className="reservations-grid">
          <div className="reservation-info animate-slideInLeft">
            <h2>Secure Your Spot</h2>
            <p>Experience the finest dining in Islamabad. Our tables fill up quickly, so we recommend booking in advance.</p>
            
            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">⏰</span>
                <h3>Opening Hours</h3>
                <p>Monday - Sunday</p>
                <p>12:00 PM - 11:00 PM</p>
              </div>
              <div className="info-card">
                <span className="info-icon">📍</span>
                <h3>Location</h3>
                <p>F-7 Markaz, Islamabad</p>
                <p>Next to Centaurus Mall</p>
              </div>
              <div className="info-card">
                <span className="info-icon">📞</span>
                <h3>Contact</h3>
                <p>+92 51 2345678</p>
                <p>reservations@maisonnoir.com</p>
              </div>
            </div>
          </div>

          <div className="reservation-form-container animate-slideInRight">
            <form onSubmit={handleSubmit} className="reservation-form">
              <h2>Make a Reservation</h2>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={minDate}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Guests *</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Seating Area *</label>
                  <select
                    name="seatingArea"
                    value={formData.seatingArea}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="Indoor">Indoor (Air Conditioned)</option>
                    <option value="Garden">Garden (Outdoor)</option>
                    <option value="Rooftop">Rooftop (City View)</option>
                    <option value="VIP Lounge">VIP Lounge (Private)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="form-input"
                  rows={3}
                  placeholder="Dietary restrictions, special occasions, etc."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Reserve Table'}
              </button>

              {!isAuthenticated && (
                <p className="login-note">
                  Please <a href="/login">sign in</a> to complete your reservation
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-toast">
          <span>✓</span> Reservation submitted successfully! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;