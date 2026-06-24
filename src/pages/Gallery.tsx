// pages/Gallery.tsx
import React, { useState, useEffect } from 'react';
import './Gallery.css';

const galleryImages = [
  {
    id: 1,
    title: "Elegant Dining Hall",
    category: "dining",
    description: "Experience luxury in our main dining area with ambient lighting",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    largeImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600"
  },
  {
    id: 2,
    title: "Private Dining Room",
    category: "dining",
    description: "Intimate setting for special occasions and private events",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    largeImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
  },
  {
    id: 3,
    title: "Bar & Lounge Area",
    category: "lounge",
    description: "Relax and unwind in our sophisticated lounge",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800",
    largeImage: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1600"
  },
  {
    id: 4,
    title: "Outdoor Terrace",
    category: "outdoor",
    description: "Al fresco dining with beautiful city views",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
    largeImage: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600"
  },
  {
    id: 5,
    title: "Chef's Table",
    category: "dining",
    description: "Exclusive dining experience with chef's special tasting menu",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
    largeImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600"
  },
  {
    id: 6,
    title: "Wine Cellar",
    category: "lounge",
    description: "Extensive collection of international wines",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800",
    largeImage: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1600"
  },
  {
    id: 8,
    title: "VIP Section",
    category: "dining",
    description: "Premium seating with enhanced privacy",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800",
    largeImage: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1600"
  },
  {
    id: 9,
    title: "Live Music Corner",
    category: "entertainment",
    description: "Evening entertainment with live performances",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
    largeImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600"
  },
  {
    id: 10,
    title: "Breakfast Area",
    category: "dining",
    description: "Morning light dining experience",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800",
    largeImage: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1600"
  },
  {
    id: 11,
    title: "Rooftop Dining",
    category: "outdoor",
    description: "Stunning sunset views from our rooftop",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800",
    largeImage: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1600"
  },
  {
    id: 12,
    title: "Coffee Corner",
    category: "lounge",
    description: "Artisanal coffee and pastries",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800",
    largeImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600"
  }
];

const categories = [
  { id: "all", name: "All Photos", icon: "📸" },
  { id: "dining", name: "Dining Areas", icon: "🍽️" },
  { id: "lounge", name: "Lounge & Bar", icon: "🥂" },
  { id: "outdoor", name: "Outdoor Spaces", icon: "🌿" },
  { id: "entertainment", name: "Entertainment", icon: "🎵" }
];

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory]);

  const openModal = (image: typeof galleryImages[0]) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <div className="gallery-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <h1 className="animate-fadeInUp">Our Gallery</h1>
          <p className="animate-fadeInUp delay-1">
            Step into the world of MaisonNoir - where elegance meets culinary excellence
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="gallery-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">12+</span>
              <span className="stat-label">Dining Spaces</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Guests Daily</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Awards Won</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container">
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container">
        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item animate-scaleIn"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => openModal(image)}
            >
              <div className="gallery-image-wrapper">
                <img src={image.image} alt={image.title} loading="lazy" />
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <span className="view-icon">🔍</span>
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="testimonial-section">
        <div className="container">
          <div className="testimonial-content">
            <span className="quote-icon">"</span>
            <p className="testimonial-text">
              The ambiance at MaisonNoir is absolutely breathtaking. 
              Every corner tells a story of elegance and sophistication.
            </p>
            <div className="testimonial-author">
              <strong>Sarah Khan</strong>
              <span>Food Critic, The Daily Times</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img src={selectedImage.largeImage} alt={selectedImage.title} />
            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
              <div className="modal-category">
                {categories.find(c => c.id === selectedImage.category)?.icon}
                <span>{categories.find(c => c.id === selectedImage.category)?.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;