import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';

/**
 * Courses Catalog Page
 * Receives `courses` from App.jsx (INITIAL_COURSES) and `enrolledCourses` for enrollment status.
 */
export default function Courses({ courses = [], enrolledCourses = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query)
    );
  });

  // Check if current user is already enrolled in a course
  const isEnrolledInCourse = (courseId) => {
    return enrolledCourses.some((e) => e.id === courseId);
  };

  return (
    <div className="courses-container">
      <h1 className="page-title">Explore Our Courses</h1>
      <p className="page-subtitle">Grow your skills with {courses.length}+ expert-led courses</p>

      {/* Search Bar */}
      <div className="courses-search-wrapper">
        <div className="courses-search-bar">
          <div className="search-input-container">
            <input
              type="text"
              className="search-input-field"
              placeholder="Search courses, topics, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="courses-no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No Courses Found</h3>
            <p className="no-results-text">
              No courses match &quot;{searchQuery}&quot;. Try a different keyword.
            </p>
            <button className="btn btn-sm btn-secondary" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const enrolled = isEnrolledInCourse(course.id);
            return (
              <div className="course-card" key={course.id}>
                <div className="course-header">
                  <span className="course-icon">{course.icon}</span>
                  <span className="course-difficulty">{course.difficulty}</span>
                </div>
                <div className="course-body">
                  <p className="course-category">{course.category}</p>
                  <h3>{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                  <div className="course-meta">
                    <span>⭐ {course.rating}</span>
                    <span>⏱ {course.duration}</span>
                    <span>({course.reviews?.toLocaleString()} reviews)</span>
                  </div>
                </div>
                <div className="course-footer">
                  <span className="course-price">{course.price}</span>
                  <Link to={`/courses/${course.id}`} className="btn btn-sm btn-primary">
                    {enrolled ? 'Resume Course' : 'View Details'}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
