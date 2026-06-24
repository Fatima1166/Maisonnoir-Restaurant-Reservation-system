// context/BookingContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: string;
  seatingArea: 'Indoor' | 'Garden' | 'Rooftop' | 'VIP Lounge';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  userBookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'tableNumber'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status'], tableNumber?: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  getBookingById: (id: string) => Booking | undefined;
  getAllBookings: () => Booking[];
  getPendingBookings: () => Booking[];
  getTodayBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const storedToken = localStorage.getItem('maisonnoir_token');
        const response = await fetch(`${API_BASE}/bookings`, {
          headers: storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
          localStorage.setItem('maisonnoir_bookings', JSON.stringify(data));
        } else {
          throw new Error('Failed to load bookings from API');
        }
      } catch (err) {
        console.warn('API is offline or unreachable. Falling back to local storage for bookings.', err);
        const stored = localStorage.getItem('maisonnoir_bookings');
        if (stored) {
          setBookings(JSON.parse(stored));
        } else {
          // Default Sample data
          const sampleBookings: Booking[] = [
            {
              id: '1',
              userId: 'user1',
              userName: 'Ali Khan',
              userEmail: 'ali@example.com',
              userPhone: '+92 300 1234567',
              date: new Date().toISOString().split('T')[0],
              time: '19:00',
              guests: 4,
              tableNumber: 'T-12',
              seatingArea: 'Indoor',
              status: 'confirmed',
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              userId: 'user2',
              userName: 'Sara Ahmed',
              userEmail: 'sara@example.com',
              userPhone: '+92 300 7654321',
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              time: '20:30',
              guests: 2,
              tableNumber: 'G-05',
              seatingArea: 'Garden',
              status: 'pending',
              createdAt: new Date().toISOString()
            }
          ];
          setBookings(sampleBookings);
          localStorage.setItem('maisonnoir_bookings', JSON.stringify(sampleBookings));
        }
      }
    };

    fetchBookings();
  }, []);

  const saveLocally = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('maisonnoir_bookings', JSON.stringify(newBookings));
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const newBooking = await response.json();
        const updated = [newBooking, ...bookings];
        setBookings(updated);
        localStorage.setItem('maisonnoir_bookings', JSON.stringify(updated));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create booking on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Creating booking locally.', err);
      
      const newBooking: Booking = {
        ...bookingData,
        id: 'bk_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      saveLocally([newBooking, ...bookings]);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status'], tableNumber?: string) => {
    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
        },
        body: JSON.stringify({ status, tableNumber })
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        const updated = bookings.map(b => b.id === id ? updatedBooking : b);
        setBookings(updated);
        localStorage.setItem('maisonnoir_bookings', JSON.stringify(updated));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update booking status on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Updating status locally.', err);
      const updated = bookings.map(booking =>
        booking.id === id ? { ...booking, status, tableNumber: tableNumber || booking.tableNumber } : booking
      );
      saveLocally(updated);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const storedToken = localStorage.getItem('maisonnoir_token');
      const response = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        const updated = bookings.map(b => b.id === id ? updatedBooking : b);
        setBookings(updated);
        localStorage.setItem('maisonnoir_bookings', JSON.stringify(updated));
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel booking on server');
      }
    } catch (err) {
      console.warn('API is offline or unreachable. Canceling booking locally.', err);
      await updateBookingStatus(id, 'cancelled');
    }
  };

  const getBookingById = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  const getAllBookings = () => {
    return bookings;
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };

  const getTodayBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === today);
  };

  const userBookings = bookings; // Handled dynamically since backend now restricts view by current user token!

  return (
    <BookingContext.Provider value={{
      bookings,
      userBookings,
      createBooking,
      updateBookingStatus,
      cancelBooking,
      getBookingById,
      getAllBookings,
      getPendingBookings,
      getTodayBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
};