import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './CourseDetails.css';

/**
 * CourseDetails — Full-page view for previewing OR learning a course.
 *
 * Props:
 *  - currentUser        : The logged-in user object (null if guest)
 *  - courses            : All courses from INITIAL_COURSES (passed from App.jsx)
 *  - enrolledCourses    : The user's enrolled course list (numeric IDs)
 *  - onEnroll           : Callback to enroll in a course (courseId, studentDetails)
 *  - onUpdateLectureProgress : Callback to mark a lecture complete
 *  - ratings            : Map of { [courseId]: stars }
 *  - onRateCourse       : Callback to rate a course
 */
export default function CourseDetails({
  currentUser,
  courses = [],
  enrolledCourses = [],
  enrollmentIdMap = {},
  onEnroll,
  onUpdateLectureProgress,
  onUpdateEnrollmentId,
  setEnrolledCourses,
  ratings = {},
  onRateCourse
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Support both numeric (static) and MongoDB string ids
  const numericId = parseInt(id, 10);
  // Match by string id first (backend courses), then by numeric id (static courses)
  const course = courses.find((c) => c._id === id || c.id === id || c.id === numericId) || null;

  // Derived enrollment state — match by string or numeric id
  const isEnrolled = enrolledCourses.some((e) => e.id === id || e.id === numericId || e._id === id);
  const enrollmentInfo = enrolledCourses.find((e) => e.id === id || e.id === numericId || e._id === id);

  // The MongoDB enrollment document id (for PUT /enrollments/:id/progress)
  const enrollmentId = enrollmentIdMap[id] || enrollmentInfo?.enrollmentId || null;

  // Player state
  const [activeLecture, setActiveLecture] = useState(null);
  const [openSection, setOpenSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Backend lectures — fetched when enrolled
  const [backendLectures, setBackendLectures] = useState([]);
  const [lecturesLoading, setLecturesLoading] = useState(false);

  // Reviews from backend
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Quizzes from backend
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Enrollment modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    studentId: '',
    phone: '',
    email: '',
    department: '',
    year: '1st',
    dob: ''
  });
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Star rating hover state
  const [hoveredStar, setHoveredStar] = useState(0);
  const currentRating = ratings[numericId] || 0;

  // Helper: show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Set first lecture as active when backend lectures load
  useEffect(() => {
    if (backendLectures.length > 0 && !activeLecture) {
      setActiveLecture(backendLectures[0]);
    }
  }, [backendLectures]);

  // Set first static lecture as active when course loads (fallback for static courses)
  useEffect(() => {
    if (backendLectures.length === 0 && course?.structure?.length > 0) {
      const firstLec = course.structure[0]?.lectures?.[0];
      if (firstLec) setActiveLecture(firstLec);
    }
  }, [course, backendLectures]);

  // Fetch real backend lectures when enrolled
  useEffect(() => {
    if (!isEnrolled) {
      setBackendLectures([]);
      return;
    }
    const mongoId = course?._id;
    if (!mongoId) return; // static course — no backend lectures

    const fetchLectures = async () => {
      setLecturesLoading(true);
      try {
        const res = await API.get(`/courses/${mongoId}/lectures`);
        const lectures = res.data?.data?.lectures || [];
        setBackendLectures(lectures);
      } catch (err) {
        console.warn('Could not fetch lectures:', err.message);
      } finally {
        setLecturesLoading(false);
      }
    };
    fetchLectures();
  }, [isEnrolled, course?._id]);

  // Fetch reviews from backend (public, no auth needed)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/courses/${id}/reviews`);
        setReviews(res.data.data.reviews || []);
      } catch {
        // Reviews unavailable — not a critical failure
      }
    };
    fetchReviews();
  }, [id]);

  // Fetch quizzes from backend when enrolled
  useEffect(() => {
    if (!isEnrolled) {
      setQuizzes([]);
      return;
    }
    const fetchQuizzes = async () => {
      try {
        const res = await API.get(`/courses/${id}/assessments`);
        setQuizzes(res.data.data.assessments || []);
      } catch {
        // Quizzes unavailable
      }
    };
    fetchQuizzes();
  }, [id, isEnrolled]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLectureSelect = (lecture) => {
    setActiveLecture(lecture);
    setIsPlaying(false);
  };

  const handlePlayClick = () => {
    if (!activeLecture) {
      showToast('No lectures available for this course yet.', 'info');
      return;
    }
    if (!isEnrolled && !activeLecture.isFree) {
      showToast('Please enroll in the course to watch this lecture.', 'error');
      return;
    }
    setIsPlaying(true);
  };

  const handleEnrollClick = () => {
    if (!currentUser) {
      showToast('Please log in or sign up to enroll in this course.', 'error');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student') {
      showToast('Only students can enroll in courses. Please log in as a student.', 'error');
      return;
    }
    setEnrollForm({
      studentId: '',
      phone: '',
      email: currentUser.email || '',
      department: '',
      year: '1st',
      dob: ''
    });
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    // Prevent duplicate enrollment
    if (isEnrolled) {
      showToast('You are already enrolled in this course.', 'info');
      setShowEnrollModal(false);
      return;
    }

    setEnrollLoading(true);

    // Try to enroll via backend first (if user has JWT and course has MongoDB _id)
    const token = localStorage.getItem('kgp_token');
    const mongoId = course?._id;
    if (token && mongoId) {
      try {
        const res = await API.post(`/courses/${mongoId}/enroll`, { ...enrollForm });
        const newEnrollmentId = res.data?.data?.enrollment?._id;
        if (newEnrollmentId && onUpdateEnrollmentId) {
          onUpdateEnrollmentId(mongoId, newEnrollmentId);
        }
        showToast('🎉 Successfully enrolled! Welcome to the course.', 'success');
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        // If already enrolled on backend, that's fine — just continue
        if (!msg.toLowerCase().includes('already enrolled')) {
          setEnrollLoading(false);
          showToast(`Enrollment failed: ${msg}`, 'error');
          return;
        }
        showToast('You are now enrolled in the course!', 'success');
      }
    } else {
      showToast('🎉 Successfully enrolled in the course!', 'success');
    }

    // Always update local state so UI reflects enrollment immediately
    if (onEnroll) {
      onEnroll(id, { ...enrollForm });
    }
    setEnrollLoading(false);
    setShowEnrollModal(false);
  };

  const handleMarkComplete = async () => {
    if (!enrollmentInfo || !activeLecture) return;
    const lectureId = activeLecture._id || activeLecture.id;
    const alreadyDone = enrollmentInfo.completedLectureIds?.includes(lectureId);
    if (alreadyDone) {
      showToast('This lecture is already marked complete!', 'info');
      return;
    }

    // Update local state immediately for snappy UX
    if (onUpdateLectureProgress) {
      onUpdateLectureProgress(id, lectureId);
    }

    showToast('✓ Lecture marked as complete!', 'success');

    // Persist to backend if we have the enrollment id and a real lecture _id
    if (enrollmentId && activeLecture._id) {
      try {
        await API.put(`/enrollments/${enrollmentId}/progress`, {
          lectureId: activeLecture._id,
        });
      } catch (err) {
        console.warn('Could not persist lecture progress to backend:', err.message);
        // Non-fatal — local state already updated
      }
    }
  };

  const isLectureCompleted = (lectureId) => {
    return enrollmentInfo?.completedLectureIds?.includes(lectureId) ?? false;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      showToast('Please write your review before submitting.', 'error');
      return;
    }
    setReviewSubmitting(true);
    try {
      await API.post(`/courses/${id}/reviews`, {
        rating: newRating,
        review: newReviewText
      });
      showToast('Review submitted successfully!', 'success');
      setNewReviewText('');
      setNewRating(5);
      // Refresh reviews
      const res = await API.get(`/courses/${id}/reviews`);
      setReviews(res.data.data.reviews || []);
    } catch (err) {
      showToast(`Failed to submit review: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!activeQuiz) return;

    const answersArray = activeQuiz.questions.map((_, index) =>
      quizAnswers[index] !== undefined ? parseInt(quizAnswers[index], 10) : -1
    );
    if (answersArray.includes(-1)) {
      showToast('Please answer all questions before submitting.', 'error');
      return;
    }

    setQuizSubmitting(true);
    try {
      const res = await API.post(`/assessments/${activeQuiz._id}/submit`, {
        answers: answersArray
      });
      setQuizResult(res.data.data);
    } catch (err) {
      showToast(`Quiz submission failed: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setQuizSubmitting(false);
    }
  };

  // ── Format duration helper ─────────────────────────────────────────────────
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return `${h}h ${rem}m`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // ── Guard: Course not found ────────────────────────────────────────────────

  if (!course) {
    return (
      <div className="course-page-container">
        <h2 style={{ color: 'var(--text-h)', marginBottom: '16px' }}>Course not found.</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
      </div>
    );
  }

  // ── Computed values ────────────────────────────────────────────────────────

  const allStaticLectures = course.structure
    ? course.structure.flatMap((mod) => mod.lectures || [])
    : [];

  // Use backend lectures if available, else fall back to static
  const displayLectures = backendLectures.length > 0 ? backendLectures : allStaticLectures;

  // Completed count
  const completedCount = enrollmentInfo?.completedLectureIds?.length || 0;
  const totalCount = displayLectures.length || enrollmentInfo?.totalLectures || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="course-page-container">

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      {toast && (
        <div className={`cd-toast cd-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Back Button */}
      <button className="course-back-btn" onClick={() => navigate('/courses')}>
        ← Back to Courses
      </button>

      {isEnrolled ? (
        /* ======= ENROLLED / PLAYER LAYOUT (Udemy-style) ======= */
        <div className="course-player-layout course-player-layout--udemy">

          {/* LEFT: Curriculum Sidebar */}
          <div className="player-left-col player-left-col--curriculum">
            {/* Progress Bar */}
            <div className="cd-progress-card">
              <div className="cd-progress-header">
                <span className="cd-progress-title">Your Progress</span>
                <span className="cd-progress-pct">{progressPercent}%</span>
              </div>
              <div className="cd-progress-bar-track">
                <div
                  className="cd-progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="cd-progress-sub">
                {completedCount} / {totalCount} lectures completed
              </span>
            </div>

            <h2 className="structure-title">Course Curriculum</h2>

            {lecturesLoading ? (
              <div className="cd-loading-lectures">Loading lectures...</div>
            ) : backendLectures.length > 0 ? (
              /* ── Backend lectures (flat list from DB) ── */
              <div className="accordion-container">
                <div className="accordion-group">
                  <div className="accordion-content" style={{ borderTop: 'none' }}>
                    <ul className="lecture-list">
                      {backendLectures.map((lecture, idx) => {
                        const isCurrent = activeLecture?._id === lecture._id;
                        const isDone = isLectureCompleted(lecture._id);
                        const durationStr = formatDuration(lecture.duration);
                        return (
                          <li
                            key={lecture._id}
                            className={`lecture-item ${isCurrent ? 'active' : ''}`}
                            onClick={() => handleLectureSelect(lecture)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="lecture-item-left">
                              <span className="lecture-play-icon">
                                {isDone ? '✓' : '▶'}
                              </span>
                              <span>{idx + 1}. {lecture.title}</span>
                              {lecture.isFree && (
                                <span className="cd-free-badge">Free</span>
                              )}
                            </div>
                            <div className="lecture-item-right">
                              {lecture.videoUrl && !isDone && (
                                <span
                                  className="lecture-watch-link"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLectureSelect(lecture);
                                    setIsPlaying(true);
                                  }}
                                >
                                  Watch
                                </span>
                              )}
                              {durationStr && (
                                <span className="lecture-duration">{durationStr}</span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Static course structure accordion ── */
              <div className="accordion-container">
                {course.structure.map((mod, modIdx) => (
                  <div className="accordion-group" key={modIdx}>
                    <button
                      className={`accordion-header ${openSection === modIdx ? 'open' : ''}`}
                      onClick={() => setOpenSection(openSection === modIdx ? null : modIdx)}
                    >
                      <div className="accordion-header-left">
                        <span className="accordion-arrow">{openSection === modIdx ? '▲' : '▼'}</span>
                        <span>{mod.title}</span>
                      </div>
                      <span className="accordion-header-right">{mod.totalTime} · {mod.lectures.length} lectures</span>
                    </button>

                    {openSection === modIdx && (
                      <div className="accordion-content">
                        <ul className="lecture-list">
                          {mod.lectures.map((lecture) => {
                            const isCurrent = activeLecture?.id === lecture.id;
                            const isDone = isLectureCompleted(lecture.id);
                            return (
                              <li
                                key={lecture.id}
                                className={`lecture-item ${isCurrent ? 'active' : ''}`}
                                onClick={() => handleLectureSelect(lecture)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="lecture-item-left">
                                  <span className="lecture-play-icon">{isDone ? '✓' : '▶'}</span>
                                  <span>{lecture.code} — {lecture.title}</span>
                                </div>
                                <div className="lecture-item-right">
                                  <span
                                    className="lecture-watch-link"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLectureSelect(lecture);
                                      setIsPlaying(true);
                                    }}
                                  >
                                    Watch
                                  </span>
                                  <span className="lecture-duration">{lecture.duration}</span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Rating */}
            <div className="rating-section" style={{ marginTop: '24px' }}>
              <span>Rate this course:</span>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${star <= (hoveredStar || currentRating) ? 'filled' : ''}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => onRateCourse && onRateCourse(numericId, star)}
                    aria-label={`Rate ${star} star`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Your rating: {currentRating}/5
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Video Player + Below content */}
          <div className="player-right-col player-right-col--video">

            {/* Video Player */}
            <div className="video-player-container">
              {isPlaying && activeLecture?.videoUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={activeLecture.videoUrl}
                  title={activeLecture.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              ) : (
                <div className="video-play-overlay" onClick={handlePlayClick}>
                  <img
                    src={course.image || course.thumbnail}
                    alt={course.title}
                    className="video-thumbnail-img"
                  />
                  <div
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.3)', cursor: 'pointer'
                    }}
                  >
                    <div className="youtube-play-btn">
                      <div className="youtube-play-icon" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture title + complete button */}
            <div className="player-bottom-bar">
              <span className="lecture-title-display">
                {activeLecture
                  ? (activeLecture.title || `${activeLecture.code} — ${activeLecture.title}`)
                  : course.title}
              </span>
              {activeLecture && (
                <button
                  className="mark-complete-btn"
                  onClick={handleMarkComplete}
                  disabled={isLectureCompleted(activeLecture._id || activeLecture.id)}
                >
                  {isLectureCompleted(activeLecture._id || activeLecture.id) ? '✓ Completed' : 'Mark Complete'}
                </button>
              )}
            </div>

            {/* Quizzes */}
            {quizzes.length > 0 && (
              <div className="course-description-card" style={{ marginTop: '24px' }}>
                <h3>Course Quizzes</h3>
                {activeQuiz ? (
                  <div>
                    <button
                      onClick={() => { setActiveQuiz(null); setQuizAnswers({}); setQuizResult(null); }}
                      className="course-back-btn"
                      style={{ marginBottom: '16px' }}
                    >
                      ← Back to Quiz List
                    </button>
                    <h4 style={{ marginBottom: '8px' }}>{activeQuiz.title}</h4>

                    {quizResult ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{
                          padding: '16px', borderRadius: '8px',
                          backgroundColor: quizResult.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          borderLeft: `5px solid ${quizResult.passed ? '#10b981' : '#ef4444'}`,
                          color: quizResult.passed ? '#10b981' : '#ef4444', fontWeight: 'bold'
                        }}>
                          {quizResult.passed ? 'PASSED ✓' : 'FAILED ✕'} — Score: {quizResult.score}%
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}
                          onClick={() => { setActiveQuiz(null); setQuizAnswers({}); setQuizResult(null); }}>
                          Close Results
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {activeQuiz.questions.map((q, qIdx) => (
                          <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontWeight: '600' }}>{qIdx + 1}. {q.questionText}</span>
                            {q.options.map((opt, oIdx) => (
                              <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                <input
                                  type="radio"
                                  name={`q_${qIdx}`}
                                  required
                                  checked={quizAnswers[qIdx] === oIdx}
                                  onChange={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ))}
                        <button type="submit" className="btn btn-primary btn-sm" disabled={quizSubmitting}
                          style={{ alignSelf: 'flex-start' }}>
                          {quizSubmitting ? 'Submitting...' : 'Submit Answers'}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {quizzes.map((quiz) => (
                      <div key={quiz._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                        <div>
                          <strong>{quiz.title}</strong>
                          <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {quiz.questions?.length || 0} Questions · Pass: {quiz.passingScore}%
                          </span>
                        </div>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => { setActiveQuiz(quiz); setQuizAnswers({}); setQuizResult(null); }}>
                          Take Quiz
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="course-description-card" style={{ marginTop: '24px' }}>
              <h3>Student Reviews</h3>
              <form onSubmit={handleReviewSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ margin: 0 }}>Leave a Review</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Rating:</span>
                  <select value={newRating} onChange={(e) => setNewRating(parseInt(e.target.value))}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)' }}>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <textarea
                  placeholder="Share your experience with this course..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows="3"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'inherit', outline: 'none' }}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={reviewSubmitting} style={{ alignSelf: 'flex-start' }}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: 'var(--text-h)' }}>{r.student?.name || 'Anonymous'}</strong>
                        <span style={{ color: '#eab308' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-main)' }}>{r.review}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======= PREVIEW / UNENROLLED LAYOUT ======= */
        <div className="course-split-layout">

          {/* LEFT: Course Info */}
          <div className="course-preview-left">
            <div className="course-header-section">
              <div className="course-meta-pills">
                <span className="meta-pill category">{course.category}</span>
                <span className="meta-pill difficulty">{course.difficulty}</span>
              </div>
              <h1>{course.title}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                by <strong>{course.instructor}</strong> · ⭐ {course.rating} ({course.reviews?.toLocaleString()} reviews)
              </p>
            </div>

            <div className="course-description-card">
              <h3>About This Course</h3>
              <p>{course.description}</p>
            </div>

            {/* Course Structure Preview */}
            <div>
              <h2 className="structure-title">Course Structure</h2>
              <div className="accordion-container">
                {course.structure.map((mod, modIdx) => (
                  <div className="accordion-group" key={modIdx}>
                    <button
                      className={`accordion-header ${openSection === modIdx ? 'open' : ''}`}
                      onClick={() => setOpenSection(openSection === modIdx ? null : modIdx)}
                    >
                      <div className="accordion-header-left">
                        <span className="accordion-arrow">{openSection === modIdx ? '▲' : '▼'}</span>
                        <span>{mod.title}</span>
                      </div>
                      <span className="accordion-header-right">{mod.totalTime} · {mod.lectures.length} lectures</span>
                    </button>

                    {openSection === modIdx && (
                      <div className="accordion-content">
                        <ul className="lecture-list">
                          {mod.lectures.map((lecture) => (
                            <li key={lecture.id} className="lecture-item">
                              <div className="lecture-item-left">
                                <span className="lecture-play-icon">▶</span>
                                <span>{lecture.code} — {lecture.title}</span>
                              </div>
                              <span className="lecture-duration">{lecture.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="course-description-card">
              <h3>Student Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No reviews yet for this course.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: 'var(--text-h)' }}>{r.student?.name || 'Anonymous'}</strong>
                        <span style={{ color: '#eab308' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-main)' }}>{r.review}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky Enrollment Card */}
          <div>
            <div className="course-preview-right-card">
              <div className="course-preview-img-wrapper">
                <img src={course.image} alt={course.title} className="course-preview-img" />
              </div>
              <div className="price-tag">{course.price}</div>
              <div className="course-quick-details">
                <div className="detail-row">
                  <span>Duration</span>
                  <strong>{course.duration}</strong>
                </div>
                <div className="detail-row">
                  <span>Difficulty</span>
                  <strong>{course.difficulty}</strong>
                </div>
                <div className="detail-row">
                  <span>Total Lectures</span>
                  <strong>{allStaticLectures.length}</strong>
                </div>
                <div className="detail-row">
                  <span>Rating</span>
                  <strong>⭐ {course.rating}</strong>
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleEnrollClick} style={{ width: '100%' }}>
                Enroll Now
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======= ENROLLMENT MODAL ======= */}
      {showEnrollModal && (
        <div className="enroll-modal-backdrop" onClick={() => setShowEnrollModal(false)}>
          <div className="enroll-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="enroll-modal-close" onClick={() => setShowEnrollModal(false)}>✕</button>
            <h2 className="enroll-modal-title">Student Registration</h2>
            <p className="enroll-modal-subtitle">
              Enter your academic details to enroll in <strong>{course.title}</strong>.
            </p>

            <form onSubmit={handleEnrollSubmit} className="enroll-form">
              <div className="enroll-form-row">
                <div className="enroll-form-group">
                  <label htmlFor="studentId">Student ID</label>
                  <input
                    id="studentId" type="text" required className="enroll-input-field"
                    placeholder="e.g. STU12345"
                    value={enrollForm.studentId}
                    onChange={(e) => setEnrollForm((p) => ({ ...p, studentId: e.target.value }))}
                  />
                </div>
                <div className="enroll-form-group">
                  <label htmlFor="phone">Phone No.</label>
                  <input
                    id="phone" type="tel" required className="enroll-input-field"
                    placeholder="e.g. 9876543210"
                    value={enrollForm.phone}
                    onChange={(e) => setEnrollForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="enroll-form-group">
                <label htmlFor="enroll-email">Email Address</label>
                <input
                  id="enroll-email" type="email" required className="enroll-input-field"
                  value={enrollForm.email}
                  onChange={(e) => setEnrollForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="enroll-form-group">
                <label htmlFor="department">Department</label>
                <input
                  id="department" type="text" required className="enroll-input-field"
                  placeholder="e.g. Computer Science"
                  value={enrollForm.department}
                  onChange={(e) => setEnrollForm((p) => ({ ...p, department: e.target.value }))}
                />
              </div>

              <div className="enroll-form-row">
                <div className="enroll-form-group">
                  <label htmlFor="year">Year of Study</label>
                  <select
                    id="year" className="enroll-input-field"
                    value={enrollForm.year}
                    onChange={(e) => setEnrollForm((p) => ({ ...p, year: e.target.value }))}
                  >
                    <option value="1st">First Year (1st)</option>
                    <option value="2nd">Second Year (2nd)</option>
                    <option value="3rd">Third Year (3rd)</option>
                    <option value="4th">Fourth Year (4th)</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
                <div className="enroll-form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    id="dob" type="date" required className="enroll-input-field"
                    value={enrollForm.dob}
                    onChange={(e) => setEnrollForm((p) => ({ ...p, dob: e.target.value }))}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary enroll-submit-btn" disabled={enrollLoading}>
                {enrollLoading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
