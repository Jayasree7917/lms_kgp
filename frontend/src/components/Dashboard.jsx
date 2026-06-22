import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  // Redirect to home if user is not logged in
  if (!user) {
    return (
      <div className="dashboard-unauthorized">
        <div className="unauth-card">
          <h2>Access Denied</h2>
          <p>Please create an account or sign in to view your learning dashboard.</p>
          <Link to="/signup" className="btn btn-primary">Create Account</Link>
        </div>
      </div>
    );
  }

  const activeCourses = [
    {
      id: 1,
      title: 'Introduction to Computer Science',
      progress: 75,
      nextLesson: 'Lesson 8: Recursion and Algorithms',
      instructor: 'Dr. Sarah Jenkins',
      category: 'Technology',
      icon: '💻'
    },
    {
      id: 2,
      title: 'Advanced Web Design & UI/UX',
      progress: 30,
      nextLesson: 'Lesson 4: Grids & Flexbox Layouts',
      instructor: 'Alex Rivera',
      category: 'Design',
      icon: '🎨'
    }
  ];

  const achievements = [
    { id: 1, title: 'Quick Learner', desc: 'Completed 5 lessons in a single day', badge: '⚡' },
    { id: 2, title: 'Orientation Completed', desc: 'Finished KGP LMS onboarding tour', badge: '🎓' }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <header className="dashboard-header">
        <div className="welcome-text">
          <span className="user-role-badge">{user.role === 'instructor' ? 'Instructor' : 'Student'} Panel</span>
          <h1>Welcome back, {user.name}!</h1>
          <p>Ready to continue your learning journey today? Keep up the great work.</p>
        </div>
        <div className="header-actions">
          <Link to="/courses" className="btn btn-primary">Browse Catalog</Link>
          <button onClick={onLogout} className="btn btn-secondary">Log Out</button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Left Column: Progress & Courses */}
        <div className="dashboard-main-col">
          {/* Stats Bar */}
          <section className="dashboard-stats-grid">
            <div className="db-stat-card">
              <div className="stat-icon">📚</div>
              <div>
                <h3>{activeCourses.length}</h3>
                <p>Active Courses</p>
              </div>
            </div>
            <div className="db-stat-card">
              <div className="stat-icon">⌛</div>
              <div>
                <h3>14.5 hrs</h3>
                <p>Study Hours</p>
              </div>
            </div>
            <div className="db-stat-card">
              <div className="stat-icon">🏆</div>
              <div>
                <h3>1</h3>
                <p>Certificates</p>
              </div>
            </div>
          </section>

          {/* Active Courses */}
          <section className="active-courses-section">
            <h2>Current Courses</h2>
            <div className="active-courses-list">
              {activeCourses.map(course => (
                <div key={course.id} className="active-course-card">
                  <div className="course-card-header">
                    <span className="course-icon-bg">{course.icon}</span>
                    <div className="course-title-block">
                      <span className="course-meta-tag">{course.category}</span>
                      <h3>{course.title}</h3>
                      <p className="instructor-name">By {course.instructor}</p>
                    </div>
                  </div>
                  
                  <div className="course-card-progress">
                    <div className="progress-info">
                      <span>Course Progress</span>
                      <strong>{course.progress}%</strong>
                    </div>
                    <div className="progress-track-bar">
                      <div className="progress-fill-bar" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="course-card-footer">
                    <div className="next-lesson-info">
                      <span>Next up:</span>
                      <p>{course.nextLesson}</p>
                    </div>
                    <button className="btn btn-sm btn-primary">Resume Class</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Achievements & Resources */}
        <div className="dashboard-side-col">
          {/* User Profile Summary Card */}
          <section className="profile-summary-card">
            <div className="profile-avatar-large">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p className="profile-email">{user.email}</p>
            <div className="profile-divider"></div>
            <div className="profile-meta-row">
              <span>Account Type:</span>
              <strong style={{ textTransform: 'capitalize' }}>{user.role}</strong>
            </div>
            <div className="profile-meta-row">
              <span>Member Since:</span>
              <strong>June 2026</strong>
            </div>
          </section>

          {/* Badges Achievements */}
          <section className="achievements-card">
            <h3>Recent Badges</h3>
            <div className="achievements-list">
              {achievements.map(badge => (
                <div key={badge.id} className="achievement-item">
                  <span className="badge-emoji">{badge.badge}</span>
                  <div>
                    <h4>{badge.title}</h4>
                    <p>{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
