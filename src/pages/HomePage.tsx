// pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const carouselData = [
  {
    id: 1,
    title: "An Evening to Remember",
    description: "Experience culinary mastery in an atmosphere of pure elegance.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
  },
  {
    id: 2,
    title: "Taste Of Islamabad",
    description: "Traditionl flavours elevated with modern sophistication.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
  },
  {
    id: 3,
    title: "Authentic Pakistani cuisine",
    description: "A journey through spice,heritage and refined taste .",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200"
  }
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="homepage">
      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="carousel-container">
          {carouselData.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <div className="hero-buttons mt-30">
                  <Link to="/reservations" className="btn-primary">Reserve a Table</Link>
                  <Link to="/menu" className="btn-secondary">View Menu</Link>
                </div>
              </div>
            </div>
          ))}
          <div className="carousel-indicators">
            {carouselData.map((_, index) => (
              <button 
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;