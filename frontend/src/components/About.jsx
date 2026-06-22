import React from 'react';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About KGP Learning Initiative</h1>
        <p>
          Founded in 2026, KGP is dedicated to making world-class education accessible to everyone, everywhere.
          We collaborate with leading experts and institutions to design courses that help you achieve your goals.
        </p>
      </div>
      <div className="about-details">
        <div className="about-card">
          <h3>Our Mission</h3>
          <p>To eliminate barriers to learning and empower students to build the future they want through modern, hands-on digital training.</p>
        </div>
        <div className="about-card">
          <h3>Our Vision</h3>
          <p>A global classroom where any curious mind has immediate access to professional mentorship, peer networks, and practical skills.</p>
        </div>
      </div>
    </div>
  );
}
