import React, { useState } from 'react';
import API from '../utils/api'; // Or wherever your custom api setup file is
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo_lms.png';
import './Auth.css';

export default function Auth({ setCurrentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default to signup if pathname is /signup, else login
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false
  });

  // Google Account Chooser States
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [showGoogleCustomInput, setShowGoogleCustomInput] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ── Real API Auth ─────────────────────────────────────────────────────────

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && (!formData.name || !formData.email || !formData.password || !formData.agree)) {
      alert('Please fill in all fields and accept the terms.');
      return;
    }
    if (isLogin && (!formData.email || !formData.password)) {
      alert('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setLoadingMsg(isLogin ? 'Logging in...' : 'Creating your account...');

    try {
      // 1. Remove /api/v1 from the endpoint since your API baseURL already includes it
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin
        ? { email: formData.email.toLowerCase().trim(), password: formData.password }
        : { name: formData.name, email: formData.email.toLowerCase().trim(), password: formData.password };

      // 2. Use your custom API instance instead of hardcoded fetch
      const response = await API.post(endpoint, body);
      
      // Axios automatically parses JSON and places it inside response.data
      const data = response.data; 

      // Store JWT token for future API calls
      localStorage.setItem('kgp_token', data.token);

      const userData = data.data.user;
      const loggedUser = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || null,
        avatar: userData.avatar || userData.name.charAt(0).toUpperCase(),
      };

      setIsLoading(false);
      setCurrentUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      if (loggedUser.role === 'instructor') {
        navigate('/instructor');
      } else if (loggedUser.role === 'student') {
        navigate('/student');
      } else {
        navigate('/select-role');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Auth error:', err);
      
      // If the server sent a specific error message back, show it
      const errorMessage = err.response?.data?.message || 'Network error. Please ensure the backend server is running.';
      alert(errorMessage);
    }

  // ── Social Login (localStorage-simulated — no OAuth backend) ─────────────

  const handleSocialLogin = (platform) => {
    if (platform === 'Google') {
      setShowGoogleChooser(true);
      setShowGoogleCustomInput(false);
      setGoogleCustomEmail('');
      return;
    }

    // GitHub default login flow
    const displayName = 'GitHub Coder';
    const displayEmail = 'coder@github.com';
    triggerSocialAuth(displayName, displayEmail);
  };

  const triggerSocialAuth = (name, email) => {
    // Sync social login with users database
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    let foundUser = savedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      // Smart simulation for role selection based on email keywords
      let finalRole = null;
      const emailLower = email.toLowerCase();
      if (emailLower.includes('instructor') || emailLower.includes('teacher')) {
        finalRole = 'instructor';
      } else if (emailLower.includes('student') || emailLower.includes('learner')) {
        finalRole = 'student';
      }

      foundUser = {
        name: name,
        email: email,
        password: 'sociallogin123',
        role: finalRole,
        avatar: name.charAt(0).toUpperCase()
      };
      const updatedUsers = [...savedUsers, foundUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    triggerAuthSimulation(
      `Connecting to ${foundUser.email.toLowerCase().includes('github') ? 'GitHub' : 'Google'}...`,
      {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      }
    );
  };

  const triggerAuthSimulation = (message, userData) => {
    setIsLoading(true);
    setLoadingMsg(message);
    
    setTimeout(() => {
      setIsLoading(false);
      
      const loggedUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar || userData.name.charAt(0).toUpperCase()
      };

      setCurrentUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      if (loggedUser.role === 'instructor') {
        navigate('/instructor');
      } else if (loggedUser.role === 'student') {
        navigate('/student');
      } else {
        navigate('/select-role');
      }
    }, 1200);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="auth-loading-overlay">
            <div className="spinner"></div>
            <div className="loading-text">{loadingMsg}</div>
          </div>
        )}

        {/* Left Side: Brand Panel */}
        <div className="auth-info-panel">
          <img src={logoImg} className="auth-logo" alt="KGP LMS" />
          <h2>Knowledge Gain Platform</h2>
          <p>Elevate your knowledge, expand your skills, and earn certified credentials on KGP.</p>
          <ul className="benefits-list">
            <li>✓ Access 50+ professional tracks</li>
            <li>✓ Dynamic learning dashboard</li>
            <li>✓ Interactive student-instructor modules</li>
            <li>✓ Verify course certifications</li>
          </ul>
        </div>

        {/* Right Side: Form Panel */}
        <div className="auth-form-panel">
          <h3>{isLogin ? 'Sign In to LMS' : 'Create Your Account'}</h3>
          
          <form onSubmit={handleAuthSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Aditi"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="aditi@lms.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder=".........."
                value={formData.password}
                onChange={handleChange}
                required
              />
              {!isLogin && (
                <small className="password-hint" style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                  Must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 symbol.
                </small>
              )}
            </div>

            {!isLogin && (
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agree">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block">
              {isLogin ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          {/* Social Logins */}
          <div className="auth-divider">Or continue with</div>

          <div className="social-buttons">
            <button onClick={() => handleSocialLogin('Google')} className="btn-social btn-google">
              {/* Google SVG Icon */}
              <svg className="social-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14-.1.14v2.51h.02c1.94-1.79 3.13-4.42 3.13-7.5Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3c-1.08.72-2.47 1.16-4.09 1.16-3.15 0-5.81-2.13-6.76-5.01H1.28v3.1A11.996 11.996 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.24 14.24a7.16 7.16 0 0 1 0-4.48v-3.1H1.28a11.996 11.996 0 0 0 0 10.68l3.96-3.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.32 0 3.28 2.69 1.28 6.66l3.96 3.1c.95-2.88 3.61-5.01 6.76-5.01Z"
                />
              </svg>
              Google
            </button>
            
            <button onClick={() => handleSocialLogin('GitHub')} className="btn-social btn-github">
              {/* GitHub SVG Icon */}
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12Z"
                />
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Button */}
          <p className="auth-toggle-text">
            {isLogin ? "New here? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="auth-toggle-link"
              type="button"
            >
              {isLogin ? 'Create an Account' : 'Log In'}
            </button>
          </p>
        </div>

      </div>

      {showGoogleChooser && (
        <div className="google-chooser-overlay" onClick={() => setShowGoogleChooser(false)}>
          <div className="google-chooser-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Google Logo */}
            <div className="google-logo-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>

            <h2 className="google-chooser-title">Choose an account</h2>
            <p className="google-chooser-subtitle">to continue to Knowledge Gain Platform</p>

            {!showGoogleCustomInput ? (
              <>
                <div className="google-accounts-list">
                  {/* Account 1: Jayasree */}
                  <div className="google-account-row" onClick={() => {
                    triggerSocialAuth('Jayasree', 'jayasree@gmail.com');
                    setShowGoogleChooser(false);
                  }}>
                    <div className="google-account-avatar" style={{ backgroundColor: '#e8710a' }}>J</div>
                    <div className="google-account-info">
                      <span className="google-account-name">Jayasree</span>
                      <span className="google-account-email">jayasree@gmail.com</span>
                    </div>
                  </div>

                  {/* Account 2: Student */}
                  <div className="google-account-row" onClick={() => {
                    triggerSocialAuth('Default Student', 'student@lms.com');
                    setShowGoogleChooser(false);
                  }}>
                    <div className="google-account-avatar" style={{ backgroundColor: '#1a73e8' }}>S</div>
                    <div className="google-account-info">
                      <span className="google-account-name">Default Student</span>
                      <span className="google-account-email">student@lms.com</span>
                    </div>
                  </div>

                  {/* Account 3: Instructor */}
                  <div className="google-account-row" onClick={() => {
                    triggerSocialAuth('Default Instructor', 'instructor@lms.com');
                    setShowGoogleChooser(false);
                  }}>
                    <div className="google-account-avatar" style={{ backgroundColor: '#10b981' }}>I</div>
                    <div className="google-account-info">
                      <span className="google-account-name">Default Instructor</span>
                      <span className="google-account-email">instructor@lms.com</span>
                    </div>
                  </div>

                  {/* Option 4: Use another account */}
                  <div className="google-account-row" onClick={() => setShowGoogleCustomInput(true)}>
                    <div className="google-account-avatar" style={{ backgroundColor: '#5f6368', fontSize: '18px' }}>👤</div>
                    <div className="google-account-info">
                      <span className="google-account-name" style={{ fontWeight: '600' }}>Use another account</span>
                      <span className="google-account-email">Add a new email configuration</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="google-custom-input-container">
                <input
                  type="email"
                  required
                  placeholder="Enter your Google email address"
                  className="google-custom-input"
                  value={googleCustomEmail}
                  onChange={(e) => setGoogleCustomEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && googleCustomEmail.trim()) {
                      const name = googleCustomEmail.split('@')[0];
                      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                      triggerSocialAuth(formattedName, googleCustomEmail);
                      setShowGoogleChooser(false);
                    }
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button 
                    onClick={() => setShowGoogleCustomInput(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 16px', borderRadius: '4px' }}
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (!googleCustomEmail.trim() || !googleCustomEmail.includes('@')) {
                        alert('Please enter a valid Google email.');
                        return;
                      }
                      const name = googleCustomEmail.split('@')[0];
                      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                      triggerSocialAuth(formattedName, googleCustomEmail);
                      setShowGoogleChooser(false);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#1a73e8' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            <div className="google-chooser-footer">
              <span>English (United States)</span>
              <div className="google-chooser-footer-links">
                <a href="#help" onClick={(e) => e.preventDefault()}>Help</a>
                <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
                <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
