// pages/AdminBookings.tsx
import React, { useState } from 'react';
import { useBookings, Booking } from '../context/BookingContext';
import './AdminBookings.css';

const AdminBookings: React.FC = () => {
  const { bookings, updateBookingStatus } = useBookings();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const filteredBookings = bookings
    .filter(booking => {
      if (filter === 'all') return true;
      return booking.status === filter;
    })
    .sort((a, b) => b.id.localeCompare(a.id)); // Newest IDs (timestamps) first

  const [editingTable, setEditingTable] = useState<{id: string, value: string} | null>(null);

  const handleStatusChange = (id: string, status: Booking['status'], tableNumber?: string) => {
    updateBookingStatus(id, status, tableNumber);
    setEditingTable(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="admin-bookings">
      <div className="bookings-header">
        <h2>Booking Management</h2>
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Contact</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Seating</th>
              <th>Table</th>
              <th>Special Requests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>
                  <div className="guest-info">
                    <strong>{booking.userName}</strong>
                  </div>
                </td>
                <td>
                  <div>{booking.userEmail}</div>
                  <div className="phone-small">{booking.userPhone}</div>
                </td>
                <td>
                  <div>{booking.date}</div>
                  <div className="time-small">{booking.time}</div>
                </td>
                <td>{booking.guests}</td>
                <td>
                  <span className="seating-info">{booking.seatingArea}</span>
                </td>
                <td>
                  {booking.tableNumber ? (
                    <span className="table-badge">{booking.tableNumber}</span>
                  ) : (
                    <span className="no-table">Not Assigned</span>
                  )}
                </td>
                <td className="special-requests">
                  {booking.specialRequests || '-'}
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {booking.status === 'pending' && (
                      <div className="pending-actions">
                        <div className="confirm-row">
                          <input 
                            type="text" 
                            placeholder="T-1" 
                            className="table-input-small"
                            onChange={(e) => setEditingTable({id: booking.id, value: e.target.value})}
                          />
                          <button 
                            className="action-btn confirm"
                            onClick={() => handleStatusChange(booking.id, 'confirmed', editingTable?.id === booking.id ? editingTable.value : undefined)}
                          >
                            Confirm
                          </button>
                        </div>
                        <button 
                          className="action-btn cancel"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <button 
                        className="action-btn complete"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    {(booking.status === 'cancelled' || booking.status === 'completed') && (
                      <span className="action-disabled">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            <p>No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;