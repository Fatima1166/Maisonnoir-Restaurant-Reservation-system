// pages/ContactPage.tsx
import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="container contact-container">
        <div className="contact-grid">
          <div className="contact-info animate-slideInLeft">
            <h2>Get in Touch</h2>
            <p>For reservations, inquiries, or special events, reach out to us.</p>
            
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h3>Address</h3>
                  <p>F-7 Markaz, Islamabad, Pakistan<br />Next to Centaurus Mall</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h3>Phone</h3>
                  <p>
                    <a href="tel:+92512345678" className="contact-link">+92 51 2345678</a><br />
                    <a href="tel:+923001234567" className="contact-link">+92 300 1234567</a>
                  </p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:info@maisonnoir.com" className="contact-link">info@maisonnoir.com</a><br />
                    <a href="mailto:reservations@maisonnoir.com" className="contact-link">reservations@maisonnoir.com</a>
                  </p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <h3>Hours</h3>
                  <p>Monday - Sunday: 12:00 PM - 11:00 PM</p>
                </div>
              </div>
            </div>

            <div className="map-placeholder">
              <h3>Find Us</h3>
              <div className="map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.123456789012!2d73.047884!3d33.729388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf5e1234567%3A0x123456789abcdef!2sF-7%20Markaz%2C%20Islamabad!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s" 
                  width="100%" 
                  height="200" 
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen 
                  loading="lazy"
                  title="MaisonNoir Location"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="contact-form-container animate-slideInRight">
            <div className="business-hours">
              <h3>Reservation Hours</h3>
              <div className="hours-grid">
                <div className="hour-item">
                  <span className="day">Monday - Thursday</span>
                  <span className="time">12:00 PM - 10:00 PM</span>
                </div>
                <div className="hour-item">
                  <span className="day">Friday - Sunday</span>
                  <span className="time">12:00 PM - 11:00 PM</span>
                </div>
              </div>
            </div>

            <div className="quick-links">
              <h3>Quick Contacts</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  <span>📱</span> WhatsApp
                </a>
                <a href="#" className="social-link">
                  <span>📘</span> Facebook
                </a>
                <a href="#" className="social-link">
                  <span>📸</span> Instagram
                </a>
              </div>
            </div>

            <div className="reservation-note">
              <p>For table reservations, please call us directly or send an email. We recommend booking at least 2 days in advance for weekend dinners.</p>
              <div className="cta-buttons">
                <a href="tel:+92512345678" className="btn-call">
                  📞 Call Now
                </a>
                <a href="mailto:reservations@maisonnoir.com" className="btn-email">
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;