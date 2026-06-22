import React from 'react';
import './Privacy.css';

export default function Privacy() {
  return (
    <div className="privacy-container">
      <div className="privacy-header-section">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-subtitle">
          KGP Learning Management System Commitment to Data Protection, Confidentiality, and Security.
        </p>
      </div>

      <div className="privacy-layout">
        {/* Table of Contents Sticky Sidebar */}
        <aside className="privacy-sidebar" aria-label="Table of Contents">
          <h4>Sections</h4>
          <ul className="privacy-nav-list">
            <li className="privacy-nav-item"><a href="#commitment">Privacy Commitment</a></li>
            <li className="privacy-nav-item"><a href="#collect">Information We Collect</a></li>
            <li className="privacy-nav-item"><a href="#use">How We Use Information</a></li>
            <li className="privacy-nav-item"><a href="#sharing">Information Sharing</a></li>
            <li className="privacy-nav-item"><a href="#security">Data Security</a></li>
            <li className="privacy-nav-item"><a href="#cookies">Cookies & Tracking</a></li>
            <li className="privacy-nav-item"><a href="#retention">Data Retention</a></li>
            <li className="privacy-nav-item"><a href="#rights">User Rights</a></li>
            <li className="privacy-nav-item"><a href="#thirdparty">Third-Party Services</a></li>
            <li className="privacy-nav-item"><a href="#updates">Policy Updates</a></li>
            <li className="privacy-nav-item"><a href="#contact">Contact Us</a></li>
          </ul>
        </aside>

        {/* Content Panel */}
        <main className="privacy-content-panel">
          
          <section id="commitment" className="privacy-section-card">
            <h2>🤝 Privacy Commitment</h2>
            <p>
              At KGP Learning Management System (KGP LMS), we are committed to protecting the privacy, confidentiality, and security of the information entrusted to us. This Privacy Policy outlines how we collect, use, store, and safeguard personal information while providing a secure and effective digital learning environment.
            </p>
            <p>
              By accessing or using KGP LMS, you acknowledge and agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section id="collect" className="privacy-section-card">
            <h2>📋 Information We Collect</h2>
            <p>
              To deliver educational services efficiently, KGP LMS may collect the following categories of information:
            </p>
            
            <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '16px' }}>Personal Information</h3>
            <ul className="privacy-list">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Contact Number</li>
              <li>Student or Employee Identification Number</li>
            </ul>

            <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '16px' }}>Academic Information</h3>
            <ul className="privacy-list">
              <li>Course Registrations and Enrollments</li>
              <li>Assignment and Project Submissions</li>
              <li>Assessment and Examination Results</li>
              <li>Learning Progress and Completion Records</li>
              <li>Attendance and Participation Data</li>
            </ul>
          </section>

          <section id="use" className="privacy-section-card">
            <h2>⚙️ How We Use Your Information</h2>
            <p>The information collected is used to:</p>
            <ul className="privacy-list">
              <li>Provide access to courses, learning materials, and educational resources.</li>
              <li>Facilitate enrollment, assessments, and certification processes.</li>
              <li>Monitor academic performance and learning progress.</li>
              <li>Communicate important updates, announcements, and support information.</li>
              <li>Enhance platform functionality, performance, and user experience.</li>
              <li>Maintain platform security and prevent unauthorized access.</li>
              <li>Comply with applicable legal, regulatory, and institutional obligations.</li>
            </ul>
          </section>

          <section id="sharing" className="privacy-section-card">
            <h2>🛡️ Information Sharing and Disclosure</h2>
            <p>
              KGP LMS respects your privacy and does not sell, rent, or disclose personal information for commercial purposes.
            </p>
            <p>Information may be shared only with:</p>
            
            <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '16px' }}>Authorized Academic Personnel</h3>
            <ul className="privacy-list">
              <li>Instructors and Faculty Members</li>
              <li>Academic Coordinators</li>
              <li>Institutional Administrators</li>
            </ul>

            <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '16px' }}>Trusted Service Providers</h3>
            <p>Third-party vendors supporting:</p>
            <ul className="privacy-list">
              <li>Cloud Hosting</li>
              <li>Email Communications</li>
              <li>Analytics and Reporting</li>
              <li>Technical Infrastructure</li>
            </ul>

            <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '16px' }}>Legal and Regulatory Authorities</h3>
            <p>Where disclosure is required by law, court order, or governmental regulation.</p>
          </section>

          <section id="security" className="privacy-section-card">
            <h2>🔒 Data Security</h2>
            <p>
              Protecting user information is a priority. KGP LMS employs industry-standard security measures, including:
            </p>
            <ul className="privacy-list">
              <li>Secure Authentication and Access Controls</li>
              <li>Encrypted Data Transmission (SSL/TLS)</li>
              <li>Role-Based Authorization Mechanisms</li>
              <li>Continuous Monitoring and Security Audits</li>
              <li>Secure Backup and Recovery Procedures</li>
            </ul>
            <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
              * While we strive to maintain the highest security standards, no electronic transmission or storage system can be guaranteed to be completely secure.
            </p>
          </section>

          <section id="cookies" className="privacy-section-card">
            <h2>🍪 Cookies and Tracking Technologies</h2>
            <p>KGP LMS may utilize cookies and similar technologies to:</p>
            <ul className="privacy-list">
              <li>Maintain User Sessions</li>
              <li>Remember User Preferences</li>
              <li>Improve Platform Performance</li>
              <li>Analyze Usage Patterns</li>
              <li>Enhance Overall User Experience</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Users may manage cookie preferences through their browser settings.
            </p>
          </section>

          <section id="retention" className="privacy-section-card">
            <h2>⏳ Data Retention</h2>
            <p>Personal and academic information is retained only for as long as necessary to:</p>
            <ul className="privacy-list">
              <li>Deliver Educational Services</li>
              <li>Maintain Academic and Administrative Records</li>
              <li>Fulfill Legal and Regulatory Requirements</li>
              <li>Resolve Disputes and Enforce Institutional Policies</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              When information is no longer required, it will be securely deleted, archived, or anonymized in accordance with applicable regulations.
            </p>
          </section>

          <section id="rights" className="privacy-section-card">
            <h2>🙋 User Rights</h2>
            <p>
              Subject to applicable laws and institutional policies, users may have the right to:
            </p>
            <ul className="privacy-list">
              <li>Access their personal information.</li>
              <li>Request correction of inaccurate or incomplete information.</li>
              <li>Request deletion of eligible personal data.</li>
              <li>Withdraw consent where applicable.</li>
              <li>Raise concerns regarding data handling practices.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Requests may be submitted through the contact channels provided below.
            </p>
          </section>

          <section id="thirdparty" className="privacy-section-card">
            <h2>🔗 Third-Party Services</h2>
            <p>
              KGP LMS may integrate with third-party platforms and services to enhance learning experiences, including:
            </p>
            <ul className="privacy-list">
              <li>Video Streaming Services (e.g., YouTube Embedded Player)</li>
              <li>Cloud Storage Solutions</li>
              <li>Communication and Notification Systems</li>
              <li>Assessment and Collaboration Tools</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Such services operate under their own privacy policies and terms of service.
            </p>
          </section>

          <section id="updates" className="privacy-section-card">
            <h2>📅 Policy Updates</h2>
            <p>
              KGP LMS reserves the right to modify or update this Privacy Policy at any time to reflect changes in legal requirements, institutional practices, or technological advancements.
            </p>
            <p>
              Any updates will be published on this page with a revised effective date.
            </p>
          </section>

          <section id="contact" className="privacy-section-card">
            <h2>✉️ Contact Us</h2>
            <p>
              For questions, concerns, or requests regarding this Privacy Policy, please contact:
            </p>
            
            <div className="contact-card-box">
              <strong style={{ color: 'var(--text-h)', fontSize: '15px' }}>KGP Learning Management System</strong>
              <div className="contact-detail-item">
                <span>📧 Email:</span>
                <a href="mailto:kgplms@sparkle.indevs.in">kgplms@sparkle.indevs.in</a>
              </div>
              <div className="contact-detail-item">
                <span>📞 Phone:</span>
                <span>+91 1234567890</span>
              </div>
            </div>
          </section>

          <section className="privacy-section-card" style={{ borderLeft: '4px solid var(--accent)', background: 'var(--accent-bg)' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--text-h)', marginBottom: '10px' }}>Acknowledgment</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
              By accessing and using KGP Learning Management System, you acknowledge that you have read, understood, and agreed to the terms outlined in this Privacy Policy and consent to the collection and use of information as described herein.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
