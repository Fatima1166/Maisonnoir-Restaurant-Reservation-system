// pages/UserDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  
  // Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [updating, setUpdating] = useState(false);

  // Sync state with user details if user context changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const userBookings = bookings.filter(booking => booking.userEmail === user?.email);
  const upcomingBookings = userBookings.filter(b => 
    b.status === 'pending' || b.status === 'confirmed'
  );
  const pastBookings = userBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    setUpdating(true);
    try {
      await updateProfile(name, phone, currentPassword || undefined, newPassword || undefined);
      setSuccessMsg('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowProfileModal(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-hero">
        <div className="dashboard-hero-overlay"></div>
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>Welcome back, {user?.name}</h1>
              <p>{user?.email} | Member</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-container">
        <div className="dashboard-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-value">{upcomingBookings.length}</span>
              <span className="stat-label">Upcoming Reservations</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">{userBookings.filter(b => b.status === 'confirmed').length}</span>
              <span className="stat-label">Confirmed Bookings</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">🍽️</div>
            <div className="stat-info">
              <span className="stat-value">{pastBookings.length}</span>
              <span className="stat-label">Past Visits</span>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="main-section">
            <div className="section-header">
              <h2>Upcoming Reservations</h2>
              <Link to="/reservations" className="btn-secondary small-btn">+ New Booking</Link>
            </div>
            {upcomingBookings.length > 0 ? (
              <div className="bookings-list">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="booking-card premium-card">
                    <div className="booking-date">
                      <span className="date-month">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="date-num">{new Date(booking.date).getDate()}</span>
                      <span className="date-day">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </div>
                    <div className="booking-details">
                      <h3>{booking.time}</h3>
                      <p>👤 {booking.guests} Guests ({booking.seatingArea})</p>
                      {booking.tableNumber && <p className="table-no">📌 Table: {booking.tableNumber}</p>}
                      {booking.specialRequests && <p className="special-req">📝 Note: {booking.specialRequests}</p>}
                    </div>
                    <div className="booking-actions">
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                      {booking.status === 'pending' && (
                        <button 
                          className="cancel-btn outline"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state glass-card">
                <div className="empty-icon">🍷</div>
                <h3>No upcoming reservations</h3>
                <p>Your table is waiting. Book your next dining experience.</p>
                <Link to="/reservations" className="btn-primary mt-20">Reserve a Table</Link>
              </div>
            )}
          </div>

          <div className="side-section">
            <div className="quick-actions glass-card">
              <h2>Quick Actions</h2>
              <div className="actions-list">
                <Link to="/menu" className="action-item">
                  <span className="action-icon">📖</span>
                  <div>
                    <h4>View Menu</h4>
                    <p>Explore seasonal dishes</p>
                  </div>
                  <span className="arrow">→</span>
                </Link>
                <button 
                  onClick={() => { setShowProfileModal(true); setErrorMsg(''); setSuccessMsg(''); }} 
                  className="action-item action-btn-link"
                >
                  <span className="action-icon">👤</span>
                  <div>
                    <h4>Profile Settings</h4>
                    <p>Update your details & password</p>
                  </div>
                  <span className="arrow">→</span>
                </button>
                <Link to="/contact" className="action-item">
                  <span className="action-icon">💬</span>
                  <div>
                    <h4>Contact Us</h4>
                    <p>Special arrangements</p>
                  </div>
                  <span className="arrow">→</span>
                </Link>
              </div>
            </div>

            <div className="past-section glass-card mt-30">
              <h2>Past Visits</h2>
              {pastBookings.length > 0 ? (
                <div className="past-list">
                  {pastBookings.map(booking => (
                    <div key={booking.id} className="past-booking">
                      <div className="past-booking-info">
                        <strong>{new Date(booking.date).toLocaleDateString()}</strong>
                        <span>{booking.guests} guests ({booking.seatingArea})</span>
                      </div>
                      <span className={`status-dot ${booking.status}`} title={booking.status}></span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No past visits yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Update Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h2>Profile Settings</h2>
              <button 
                className="close-btn" 
                onClick={() => { setShowProfileModal(false); setErrorMsg(''); setSuccessMsg(''); }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              {errorMsg && <div className="profile-alert error">{errorMsg}</div>}
              {successMsg && <div className="profile-alert success">{successMsg}</div>}

              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>

              <div className="password-section">
                <h3>Change Password <span className="optional">(Optional)</span></h3>
                
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary outline"
                  onClick={() => { setShowProfileModal(false); setErrorMsg(''); setSuccessMsg(''); }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;