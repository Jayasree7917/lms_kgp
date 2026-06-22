import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Auth from './components/Auth';
import SelectRole from './components/SelectRole';
import CourseDetails from './components/CourseDetails';
import Courses from './components/Courses';
import About from './components/About';
import StudentDashboard from './components/Student';
import InstructorDashboard from './components/Instructor';
import Privacy from './components/Privacy';

import './App.css';

// Static fallback courses (shown when backend DB is empty)
import { INITIAL_COURSES } from './coursesData';
import API from './api/axios';


// ── Route Guards ───────────────────────────────────────────────────────────────

function ProtectedRoute({ currentUser, allowedRole, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && currentUser.role !== allowedRole) {
    if (currentUser.role === 'student') return <Navigate to="/student" replace />;
    if (currentUser.role === 'instructor') return <Navigate to="/instructor" replace />;
    return <Navigate to="/select-role" replace />;
  }
  return children;
}

function GuestRoute({ currentUser, children }) {
  if (currentUser) {
    if (currentUser.role === 'student') return <Navigate to="/student" replace />;
    if (currentUser.role === 'instructor') return <Navigate to="/instructor" replace />;
    return <Navigate to="/select-role" replace />;
  }
  return children;
}

function SelectRoleRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role) {
    return <Navigate to={currentUser.role === 'instructor' ? '/instructor' : '/student'} replace />;
  }
  return children;
}


// ── App ────────────────────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Load currentUser from localStorage to preserve session across refresh
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Course list — starts with static data, backend courses merged in on load
  const [courses, setCourses] = useState(INITIAL_COURSES);

  // Enrolled courses — hydrated from backend when user is logged in
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Maps courseId (string _id) → enrollment document _id (for progress API)
  const [enrollmentIdMap, setEnrollmentIdMap] = useState({});

  // Star ratings — persisted locally
  const [ratings, setRatings] = useState(() => {
    return JSON.parse(localStorage.getItem('ratings')) || {};
  });

  // ── Theme sync ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Fetch Courses from Backend ─────────────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        const backendCourses = res.data?.data?.courses || [];

        if (backendCourses.length > 0) {
          // Normalize backend course shape to match what components expect
          const normalized = backendCourses.map((c) => ({
            _id: c._id,
            id: c._id,                    // use MongoDB _id as the route id
            title: c.title,
            category: c.category,
            description: c.description,
            difficulty: c.difficulty,
            instructor: c.instructor?.name || 'Instructor',
            thumbnail: c.thumbnail || '',
            image: c.thumbnail || '',
            price: c.price === 0 ? 'Free' : `$${c.price}`,
            rating: c.averageRating || 0,
            reviews: c.totalReviews || 0,
            duration: c.duration ? `${c.duration} mins` : 'Self-paced',
            icon: '📚',
            isPublished: c.isPublished,
            structure: [],
          }));

          // Backend courses first, then static courses as fallback content
          setCourses([...normalized, ...INITIAL_COURSES]);
        }
        // If 0 backend courses → INITIAL_COURSES remain (already default)
      } catch (err) {
        console.warn('Backend unavailable, using static courses:', err.message);
      }
    };

    fetchCourses();
  }, []);

  // ── Hydrate Enrolled Courses from Backend ──────────────────────────────────
  useEffect(() => {
    if (!currentUser || !localStorage.getItem('kgp_token')) return;

    const fetchEnrollments = async () => {
      try {
        const res = await API.get('/enrollments/my');
        const enrollments = res.data?.data?.enrollments || [];

        if (enrollments.length > 0) {
          const idMap = {};
          const normalized = enrollments.map((e) => {
            const c = e.course;
            idMap[c._id] = e._id; // courseId → enrollmentId

            return {
              id: c._id,
              _id: c._id,
              enrollmentId: e._id,
              title: c.title,
              category: c.category,
              instructor: c.instructor?.name || 'Instructor',
              icon: '📚',
              duration: c.duration ? `${c.duration} mins` : 'Self-paced',
              completedLectures: e.completedLectures?.length || 0,
              completedLectureIds: e.completedLectures || [],
              totalLectures: 0,
              progress: e.progress || 0,
              status: e.status,
            };
          });

          setEnrolledCourses(normalized);
          setEnrollmentIdMap(idMap);
        }
      } catch (err) {
        console.warn('Could not fetch enrollments:', err.message);
      }
    };

    fetchEnrollments();
  }, [currentUser]);


  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEnrolledCourses([]);
    setEnrollmentIdMap({});
    localStorage.removeItem('user');
    localStorage.removeItem('kgp_token');
  };

  // Called by CourseDetails after a successful enroll API call
  const handleEnroll = (courseId, studentDetails) => {
    const courseObj = courses.find(
      (c) => c.id === courseId || c._id === courseId || c.id === parseInt(courseId, 10)
    );
    if (!courseObj) return;

    const totalLecs = courseObj.structure
      ? courseObj.structure.reduce((acc, m) => acc + m.lectures.length, 0)
      : 0;

    const newEnrollment = {
      id: courseId,
      title: courseObj.title,
      category: courseObj.category,
      instructor: courseObj.instructor,
      icon: courseObj.icon,
      duration: courseObj.duration,
      completedLectures: 0,
      completedLectureIds: [],
      totalLectures: totalLecs,
      studentDetails,
    };

    setEnrolledCourses((prev) => {
      const exists = prev.some(
        (e) => e.id === courseId || e.id === parseInt(courseId, 10)
      );
      if (exists) return prev;
      return [...prev, newEnrollment];
    });
  };

  // Stores the MongoDB enrollment _id after a successful enroll call
  const handleUpdateEnrollmentId = (courseId, enrollmentId) => {
    setEnrollmentIdMap((prev) => ({ ...prev, [courseId]: enrollmentId }));
  };

  const handleUpdateLectureProgress = (courseId, lectureId) => {
    setEnrolledCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId || course.id === parseInt(courseId, 10)) {
          const alreadyCompleted = course.completedLectureIds.includes(lectureId);
          if (alreadyCompleted) return course;
          const updatedIds = [...course.completedLectureIds, lectureId];
          return {
            ...course,
            completedLectureIds: updatedIds,
            completedLectures: updatedIds.length,
          };
        }
        return course;
      })
    );
  };

  const handleRateCourse = (courseId, stars) => {
    const updated = { ...ratings, [courseId]: stars };
    setRatings(updated);
    localStorage.setItem('ratings', JSON.stringify(updated));
  };


  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Global Responsive Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route
            path="/courses"
            element={<Courses courses={courses} enrolledCourses={enrolledCourses} />}
          />

          {/* Course Details / Learning Player */}
          <Route
            path="/courses/:id"
            element={
              <CourseDetails
                currentUser={currentUser}
                courses={courses}
                enrolledCourses={enrolledCourses}
                enrollmentIdMap={enrollmentIdMap}
                onEnroll={handleEnroll}
                onUpdateLectureProgress={handleUpdateLectureProgress}
                onUpdateEnrollmentId={handleUpdateEnrollmentId}
                setEnrolledCourses={setEnrolledCourses}
                ratings={ratings}
                onRateCourse={handleRateCourse}
              />
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route
            path="/signup"
            element={
              <GuestRoute currentUser={currentUser}>
                <Auth setCurrentUser={setCurrentUser} />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute currentUser={currentUser}>
                <Auth setCurrentUser={setCurrentUser} />
              </GuestRoute>
            }
          />
          <Route
            path="/select-role"
            element={
              <SelectRoleRoute currentUser={currentUser}>
                <SelectRole currentUser={currentUser} setCurrentUser={setCurrentUser} />
              </SelectRoleRoute>
            }
          />

          {/* Dashboards */}
          <Route
            path="/student"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="student">
                <StudentDashboard currentUser={currentUser} enrolledCourses={enrolledCourses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRole="instructor">
                <InstructorDashboard
                  currentUser={currentUser}
                  courses={courses}
                  setCourses={setCourses}
                  enrolledCourses={enrolledCourses}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
