import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill out all fields.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-success-container">
        <div className="success-card">
          <div className="success-icon">✉️</div>
          <h2>Message Sent!</h2>
          <p>Thank you, <strong>{formData.name}</strong>. Your message regarding <strong>"{formData.subject}"</strong> has been received.</p>
          <p>Our support team will get back to you at <strong>{formData.email}</strong> within 24 hours.</p>
          <button onClick={() => setSubmitted(false)} className="btn btn-primary">Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <h1 className="page-title">Contact Support & Faculty</h1>
      <p className="page-subtitle">Have questions about courses, certifications, or accounts? We're here to help.</p>

      <div className="contact-grid">
        {/* Info Column */}
        <div className="contact-info-panel">
          <h2>Get in Touch</h2>
          <p>Reach out to KGP LMS administrative offices or open a ticket directly with student support.</p>

          <div className="contact-details-list">
            <div className="contact-detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <h4>Main Campus Address</h4>
                <p>KGP LMS Center, Navy Mumbai, Maharashtra, India</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <span className="detail-icon">✉️</span>
              <div>
                <h4>Support Email</h4>
                <p>kgplms@sparkle.indevs.in</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <span className="detail-icon">📞</span>
              <div>
                <h4>Toll-Free Phone</h4>
                <p>+91 1234567890 (Mon-Fri, 9am - 6pm)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="contact-form-panel">
          <h3>Send us a Message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="contact-name">Full Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                placeholder="yourname@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                placeholder="Course Inquiry, Technical Issue, etc."
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Type your query here..."
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
