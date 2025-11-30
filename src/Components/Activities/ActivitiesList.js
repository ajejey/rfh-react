import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../Header';
import { activitiesData } from './activitiesData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './ActivitiesList.css';

function ActivitiesList() {
  return (
    <div className="activities-list-page">
      <Helmet>
        <title>Our Impact & Activities | Rupee For Humanity</title>
        <meta 
          name="description" 
          content="Explore the impactful activities and accomplishments of Rupee For Humanity. See how we're transforming lives through education, healthcare, and community support across India." 
        />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="activities-hero">
        <div className="activities-hero-overlay"></div>
        <div className="activities-hero-content">
          <h1>Our Impact Stories</h1>
          <p>Every activity is a step towards a brighter India. Explore how your support transforms lives.</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="activities-stats-bar">
        <div className="stat-item">
          <span className="stat-number">40+</span>
          <span className="stat-label">Activities Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">1200+</span>
          <span className="stat-label">Families Supported</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">205+</span>
          <span className="stat-label">Children Helped</span>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="activities-grid-section">
        <div className="activity-container">
          <div className="activities-grid">
            {activitiesData.map((activity, index) => (
              <Link 
                to={`/activities/${activity.slug}`} 
                key={activity.id}
                className={`activity-card ${index === 0 ? 'featured' : ''}`}
              >
                <div className="activity-card-image">
                  <img src={activity.heroImage} alt={activity.title} loading="lazy" />
                  <div className="activity-card-overlay"></div>
                  <div className="activity-impact-badge">
                    <span className="impact-num">{activity.impactNumber}</span>
                    <span className="impact-text">{activity.impactLabel}</span>
                  </div>
                </div>
                <div className="activity-card-content">
                  <div className="activity-card-meta">
                    <span><FontAwesomeIcon icon={faCalendarAlt} /> {activity.date}</span>
                    <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {activity.location}</span>
                  </div>
                  <h3>{activity.title}</h3>
                  <p>{activity.subtitle}</p>
                  <span className="read-more">
                    Read Full Story <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon Placeholder */}
          <div className="coming-soon-section">
            <h2>More Stories Coming Soon</h2>
            <p>We're documenting 30+ more activities that showcase our journey of impact. Stay tuned!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="activities-list-cta">
        <div>
          <h2>Want to Create Impact?</h2>
          <p>Join us in our mission to transform lives. Every contribution makes a difference.</p>
          <div className="cta-buttons">
            <Link to="/?donate=true" className="btn-primary-cta">Donate Now</Link>
            <Link to="/volunteer-register" className="btn-secondary-cta">Become a Volunteer</Link>
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
    </div>
  );
}

export default ActivitiesList;
