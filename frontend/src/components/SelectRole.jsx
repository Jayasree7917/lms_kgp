import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './SelectRole.css';

export default function SelectRole({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signup');
    } else if (currentUser.role) {
      // Redirect if role is already assigned
      navigate(currentUser.role === 'instructor' ? '/instructor' : '/student');
    }
  }, [currentUser, navigate]);

  const handleSelectRole = async (role) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, role };

    // Optimistically update local state so UI feels instant
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Persist to backend (only if a real JWT token exists)
    const token = localStorage.getItem('kgp_token');
    if (token) {
      try {
        await API.put('/auth/me', { role });
      } catch (err) {
        console.warn('Could not persist role to backend:', err.message);
        // Non-fatal — local state is already updated
      }
    }

    // Redirect to the respective portal
    navigate(role === 'instructor' ? '/instructor' : '/student');
  };

  return (
    <div className="select-role-container">
      <h1 className="select-role-title">Choose Your Profile</h1>
      <p className="select-role-subtitle">
        Please select how you would like to use the Knowledge Gain Platform (KGP). 
        You can customize your experience at any time.
      </p>
      
      <div className="role-cards-grid">
        
        {/* Student Option */}
        <div 
          className="role-card student-card"
          onClick={() => handleSelectRole('student')}
        >
          <span className="role-icon">🎓</span>
          <h3>I am a Student</h3>
          <p className="role-desc">
            Explore our curated catalog, enroll in technical tracks, view interactive lecture structures, and track your certification progress.
          </p>
          <ul className="role-benefits">
            <li>Access 50+ programming courses</li>
            <li>Interactive Course Player & accordion</li>
            <li>Track study hours & certificates</li>
            <li>Submit course ratings & reviews</li>
          </ul>
          <button className="btn role-btn">
            Continue as Student
          </button>
        </div>

        {/* Instructor Option */}
        <div 
          className="role-card instructor-card"
          onClick={() => handleSelectRole('instructor')}
        >
          <span className="role-icon">👨‍🏫</span>
          <h3>I am an Instructor</h3>
          <p className="role-desc">
            Design rich course curricula, publish interactive modules, inspect student enrollments, and check classroom performance metrics.
          </p>
          <ul className="role-benefits">
            <li>Create & edit course structure</li>
            <li>Grade student assignments</li>
            <li>Monitor class analytics & stats</li>
            <li>Engage with student ratings</li>
          </ul>
          <button className="btn role-btn">
            Continue as Instructor
          </button>
        </div>

      </div>
    </div>
  );
}
