import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Student.css';

export default function StudentDashboard({ currentUser, enrolledCourses }) {
  const navigate = useNavigate();
  const studentName = currentUser?.name || 'Guest Student';
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header-card student-header">
        <span className="dashboard-badge">Student Portal</span>
        <h1>Welcome Back, {studentName}!</h1>
        <p>Ready to continue your education? Pick up right where you left off.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card main-progress">
          <h3>My Enrollments</h3>
          {enrolledCourses.length === 0 ? (
            <p className="empty-enrollments-msg">You are not enrolled in any courses yet.</p>
          ) : (
            <div className="progress-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {enrolledCourses.map((course) => {
                const progressPct = course.totalLectures > 0 
                  ? Math.round((course.completedLectures / course.totalLectures) * 100)
                  : 0;
                return (
                  <div 
                    key={course.id} 
                    className="progress-item-card" 
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="progress-details">
                      <span>{course.icon} {course.title}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                    </div>
                    
                    {/* Duration & Lectures Completed Info */}
                    <div className="enrollment-stats-row">
                      <span>⏱️ Course Duration: {course.duration}</span>
                      <span>📚 Completed: {course.completedLectures} / {course.totalLectures} lectures</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons-grid">
            <Link to="/courses" className="btn btn-sm btn-primary">Browse All Courses</Link>
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => alert("Claim Certificate functionality coming soon!")}
            >
              Claim Certifications
            </button>
            <Link to="/contact" className="btn btn-sm btn-secondary">Get Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
