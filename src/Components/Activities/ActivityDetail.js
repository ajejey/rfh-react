import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../Header';
import { getActivityBySlug } from './activitiesData';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faLaptop, 
  faSchool, 
  faUtensils,
  faCalendarAlt,
  faMapMarkerAlt,
  faArrowLeft,
  faHeart,
  faQuoteLeft,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faUsers,
  faRecycle,
  faHandshake,
  faLeaf,
  faAward,
  faRunning,
  faBuilding,
  faClipboard,
  faLightbulb,
  faTrophy,
  faHeartPulse,
  faNewspaper,
  faVolleyball,
  faBolt,
  faGamepad,
  faShirt,
  faMedal,
  faVenus,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import './ActivityDetail.css';

const iconMap = {
  book: faBook,
  laptop: faLaptop,
  school: faSchool,
  food: faUtensils,
  heart: faHeart,
  users: faUsers,
  recycle: faRecycle,
  handshake: faHandshake,
  leaf: faLeaf,
  award: faAward,
  running: faRunning,
  building: faBuilding,
  clipboard: faClipboard,
  lightbulb: faLightbulb,
  trophy: faTrophy,
  heartPulse: faHeartPulse,
  newspaper: faNewspaper,
  volleyball: faVolleyball,
  bolt: faBolt,
  gamepad: faGamepad,
  shirt: faShirt,
  medal: faMedal,
  female: faVenus,
  star: faStar
};

function ActivityDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activity = getActivityBySlug(slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  if (!activity) {
    return (
      <div className="activity-not-found">
        <Header />
        <div className="not-found-content">
          <h1>Activity Not Found</h1>
          <p>The activity you're looking for doesn't exist.</p>
          <Link to="/activities" className="btn btn-dark">View All Activities</Link>
        </div>
      </div>
    );
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === activity.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? activity.gallery.length - 1 : prev - 1
    );
  };

  const handleDonate = () => {
    navigate('/?donate=true');
  };

  return (
    <div className={`activity-detail-page ${isVisible ? 'visible' : ''}`}>
      <Helmet>
        <title>{activity.metaTitle}</title>
        <meta name="description" content={activity.metaDescription} />
        <meta property="og:title" content={activity.metaTitle} />
        <meta property="og:description" content={activity.metaDescription} />
        <meta property="og:image" content={activity.heroImage} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="activity-hero">
        <div className="hero-overlay"></div>
        <img 
          src={activity.heroImage} 
          alt={activity.title}
          className="hero-background-image"
        />
        <div className="hero-content">
          <Link to="/activities" className="back-link">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Activities
          </Link>
          <div className="hero-text-content">
            <div className="activity-meta">
              <span className="meta-item">
                <FontAwesomeIcon icon={faCalendarAlt} /> {activity.date}
              </span>
              <span className="meta-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {activity.location}
              </span>
            </div>
            <h1 className="activity-title">{activity.title}</h1>
            <p className="activity-subtitle">{activity.subtitle}</p>
          </div>
          <div className="impact-badge">
            <div className="impact-number">
              <CountUp end={activity.impactNumber} duration={2.5}>
                {({ countUpRef, start }) => (
                  <VisibilitySensor onChange={start} delayedCall>
                    <span ref={countUpRef} />
                  </VisibilitySensor>
                )}
              </CountUp>
            </div>
            <div className="impact-label">{activity.impactLabel}</div>
          </div>
        </div>
      </section>

      {/* Story Hook Section */}
      <section className="story-hook-section">
        <div className="container">
          <p className="story-hook">{activity.story.hook}</p>
        </div>
      </section>

      {/* Challenge & Solution Section */}
      <section className="challenge-solution-section">
        <div className="container">
          <div className="cs-grid">
            <div className="challenge-card">
              <h3>The Challenge</h3>
              <p>{activity.story.challenge}</p>
            </div>
            <div className="solution-card">
              <h3>Our Response</h3>
              <p>{activity.story.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <div className="">
          <h2 className="section-title">What We Accomplished</h2>
          <div className="highlights-grid">
            {activity.highlights.map((highlight, index) => (
              <div 
                key={index} 
                className="highlight-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="highlight-icon">
                  <FontAwesomeIcon icon={iconMap[highlight.icon]} />
                </div>
                <h4>{highlight.title}</h4>
                <p>{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="impact-statement-section">
        <div className="container">
          <div className="impact-statement">
            <FontAwesomeIcon icon={faHeart} className="heart-icon" />
            <p>{activity.story.impact}</p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="gallery-section">
        <div className="">
          <h2 className="section-title">Moments That Matter</h2>
          <div className="gallery-grid">
            {activity.gallery.map((image, index) => (
              <div 
                key={index} 
                className={`gallery-item ${index === 0 ? 'featured' : ''}`}
                onClick={() => openLightbox(index)}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <p>{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-content">
            <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
            <blockquote>
              <p>{activity.quote.text}</p>
              <cite>— {activity.quote.author}</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="activity-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{activity.cta.title}</h2>
            <p>{activity.cta.description}</p>
            <button onClick={handleDonate} className="cta-button">
              {activity.cta.buttonText}
            </button>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="tags-section">
        <div className="container">
          <div className="tags-wrapper">
            {activity.tags.map((tag, index) => (
              <span key={index} className="activity-tag">#{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <p>© Copyright 2023 Rupee for Humanity</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/terms-and-conditions">Terms and Conditions</Link>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <button 
            className="lightbox-nav lightbox-prev" 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activity.gallery[currentImageIndex].src} 
              alt={activity.gallery[currentImageIndex].alt} 
            />
            <p className="lightbox-caption">
              {activity.gallery[currentImageIndex].caption}
            </p>
          </div>
          <button 
            className="lightbox-nav lightbox-next" 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <div className="lightbox-counter">
            {currentImageIndex + 1} / {activity.gallery.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityDetail;
