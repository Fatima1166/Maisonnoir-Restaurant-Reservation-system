// pages/AboutPage.tsx
import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>Our Story</h1>
          <p>Crafting unforgettable dining experiences since 2018</p>
        </div>
      </div>

      <div className="container about-container">
        <div className="about-content">
          <div className="about-text animate-slideInLeft">
            <h2>MaisonNoir</h2>
            <h3>Where Elegance Meets Culinary Excellence</h3>
            <p>
              Nestled in the heart of F-7 Markaz, Islamabad, MaisonNoir stands as a testament to refined dining. 
              Since our establishment in 2018, we have been dedicated to providing an unparalleled gastronomic 
              experience that combines French techniques with local inspiration.
            </p>
            <p>
              Our name, "MaisonNoir" (Black House), reflects our commitment to sophistication and mystery. 
              Step into our establishment and discover a world where every detail—from the ambient lighting 
              to the carefully curated wine list—has been designed to create the perfect dining atmosphere.
            </p>
            <div className="about-stats">
              <div>
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Guests</span>
              </div>
              <div>
                <span className="stat-number">6+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div>
                <span className="stat-number">24</span>
                <span className="stat-label">Intimate Tables</span>
              </div>
            </div>
          </div>
          <div className="about-image animate-slideInRight">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600" alt="Restaurant Interior" />
          </div>
        </div>

        <div className="philosophy-section">
          <h2>Our Philosophy</h2>
          <div className="philosophy-grid">
            <div className="philosophy-card">
              <span>🍽️</span>
              <h3>Quality Ingredients</h3>
              <p>We source only the finest, freshest ingredients from local and international partners.</p>
            </div>
            <div className="philosophy-card">
              <span>👨‍🍳</span>
              <h3>Expert Craftsmanship</h3>
              <p>Our chefs bring decades of experience and passion to every dish.</p>
            </div>
            <div className="philosophy-card">
              <span>✨</span>
              <h3>Memorable Moments</h3>
              <p>Every visit is crafted to create lasting memories for our guests.</p>
            </div>
          </div>
        </div>

        <div className="vision-section">
          <div className="vision-image">
            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600" alt="Our Vision" />
          </div>
          <div className="vision-info">
            <h2>Our Vision</h2>
            <h3>Redefining Fine Dining</h3>
            <p>
              At MaisonNoir, our vision extends beyond just serving food. We aim to create a sanctuary where culinary art meets impeccable service. Every dish is a canvas, and every meal is an unforgettable journey.
            </p>
            <p>
              "We believe that dining should engage all the senses, creating moments that linger long after the final course."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;