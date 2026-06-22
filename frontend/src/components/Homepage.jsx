import React from 'react';
import { Link } from 'react-router-dom';
import alumni1 from '../assets/alumni1.jpeg';
import alumni2 from '../assets/alumni2.jpeg';
import alumni3 from '../assets/alumni3.jpeg';
import './Homepage.css';

export default function Homepage() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">Ignite your Intellect</span>
                    <h1 className="hero-title">Start Smart learning with KGP</h1>
                    <p className="hero-subtitle">
                        KGP Educational Institute is committed to providing quality education and fostering academic excellence through innovative learning methods.
                        This platform empowers students with flexible, interactive, and technology-driven education for their academic success.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
                        <Link to="/signup" className="btn btn-secondary">Get Started Free</Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="gradient-sphere"></div>

                    <div className="hero-card-floating card-1">
                        <div className="floating-icon">🕒</div>
                        <div>
                            <h4>24/7 Learning Access</h4>
                            <p>Anytime, Anywhere</p>
                        </div>
                    </div>

                    <div className="hero-card-floating card-2">
                        <div className="floating-icon">📜</div>
                        <div>
                            <h4>Certificate Preview</h4>
                            <p>Earn Verified Certificates</p>
                        </div>
                    </div>

                    <div className="hero-card-floating card-3">
                        <div className="floating-icon">👨‍🎓</div>
                        <div>
                            <h4>2000+ Students</h4>
                            <p>Enrolled</p>
                        </div>
                    </div>

                    <div className="hero-card-floating card-4">
                        <div className="floating-icon">🏆</div>
                        <div>
                            <h4>95% Success Rate</h4>
                            <p>Student Success</p>
                        </div>
                    </div>

                    <div className="hero-card-floating card-5">
                        <div className="floating-icon">⭐</div>
                        <div>
                            <h4>Top Rated Faculty</h4>
                            <p>From global institutes</p>
                        </div>
                    </div>


                </div>
            </section>


            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Learn from Leading Educators</h2>
                <p className="section-subtitle">We offer everything you need to succeed in your professional and academic goals.</p>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Flexible Learning</h3>
                        <p>Study at your own pace from anywhere in the world on any device.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Hands-on Practice</h3>
                        <p>Real-world projects, interactive quizzes, and coding environments.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🏆</div>
                        <h3>Certifications</h3>
                        <p>Earn verified credentials to share with employers and boost your resume.</p>
                    </div>
                </div>
                {/* Alumni Insights Section */}
                <section className="alumni-section">
                    <h2 className="section-title">Insights from Alumni</h2>
                    <p className="section-subtitle">Hear what our graduates say about their learning experience on KGP LMS.</p>

                    <div className="alumni-grid">
                        {/* Alumni Card 1 */}
                        <div className="alumni-card">
                            <div className="alumni-card-header">
                                <img src={alumni1} alt="Donald Jackman" className="alumni-avatar" />
                                <div className="alumni-info">
                                    <h4>Donald Jackman</h4>
                                    <p>SWE 1 @ Amazon</p>
                                </div>
                            </div>
                            <div className="alumni-card-body">
                                <div className="alumni-rating">
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                </div>
                                <p className="alumni-text">
                                    I've been using KGP LMS for nearly two years, primarily for upskilling, and it has been incredibly user-friendly, helping me secure my dream role at Amazon.
                                </p>
                                <a href="#readmore" className="alumni-readmore">Read more</a>
                            </div>
                        </div>

                        {/* Alumni Card 2 */}
                        <div className="alumni-card">
                            <div className="alumni-card-header">
                                <img src={alumni2} alt="Richard Nelson" className="alumni-avatar" />
                                <div className="alumni-info">
                                    <h4>Richard Nelson</h4>
                                    <p>SWE 2 @ Samsung</p>
                                </div>
                            </div>
                            <div className="alumni-card-body">
                                <div className="alumni-rating">
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star empty">★</span>
                                </div>
                                <p className="alumni-text">
                                    The hands-on practice modules and structured course paths were highly impactful. It provided the clarity and validation needed to transition into tech.
                                </p>
                                <a href="#readmore" className="alumni-readmore">Read more</a>
                            </div>
                        </div>

                        {/* Alumni Card 3 */}
                        <div className="alumni-card">
                            <div className="alumni-card-header">
                                <img src={alumni3} alt="James Washington" className="alumni-avatar" />
                                <div className="alumni-info">
                                    <h4>James Washington</h4>
                                    <p>SWE 2 @ Google</p>
                                </div>
                            </div>
                            <div className="alumni-card-body">
                                <div className="alumni-rating">
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star filled">★</span>
                                    <span className="star empty">★</span>
                                </div>
                                <p className="alumni-text">
                                    Instructors were exceptional and the lessons extremely engaging. The certification credential carried significant weight during recruiter screens.
                                </p>
                                <a href="#readmore" className="alumni-readmore">Read more</a>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}
