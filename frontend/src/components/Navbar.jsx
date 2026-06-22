import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo_lms.png';
import API from '../api/axios';
import './Navbar.css';

export default function Navbar({ theme, toggleTheme, currentUser, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // ── Notification State ────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    const token = localStorage.getItem('kgp_token');
    if (!token || !currentUser) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data?.data?.notifications || []);
    } catch {
      // Silently fail — notifications non-critical
    }
  };

  // Poll every 30 seconds when logged in
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Silently fail
    }
  };

  const handleDeleteNotif = async (e, notifId) => {
    e.stopPropagation();
    try {
      await API.delete(`/notifications/${notifId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
    } catch {
      // Silently fail
    }
  };

  const handleMarkRead = async (notifId) => {
    try {
      await API.put(`/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch {
      // Silently fail
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'enrollment': return '🎓';
      case 'new_lecture': return '🎬';
      case 'assessment_available': return '📝';
      case 'result': return '🏆';
      default: return '🔔';
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">

        {/* Left Side: Brand Logo and Name */}
        <Link to="/" className="navbar-logo-link" aria-label="KGP LMS Home">
          <img src={logoImg} alt="KGP LMS Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">KGP</span>
        </Link>

        {/* Right Side: Actions & Student/Instructor Links */}
        <div className="navbar-actions">

          {/* Desktop Student & Instructor Links */}
          {currentUser && currentUser.role && (
            <nav className="navbar-roles-nav" aria-label="Role Navigation">
              {currentUser.role === 'student' && (
                <Link to="/student" className={`navbar-role-link ${location.pathname === '/student' ? 'active' : ''}`}>
                  Student Dashboard
                </Link>
              )}
              {currentUser.role === 'instructor' && (
                <Link to="/instructor" className={`navbar-role-link ${location.pathname === '/instructor' ? 'active' : ''}`}>
                  Instructor Panel
                </Link>
              )}
            </nav>
          )}

          {/* ── Notification Bell (only when logged in) ── */}
          {currentUser && (
            <div className="navbar-notif-wrapper" ref={notifRef}>
              <button
                className="navbar-notif-btn"
                onClick={() => {
                  setShowNotifDropdown((prev) => !prev);
                  if (!showNotifDropdown) fetchNotifications();
                }}
                aria-label={`Notifications (${unreadCount} unread)`}
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="navbar-notif-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="navbar-notif-dropdown">
                  <div className="navbar-notif-header">
                    <span className="navbar-notif-header-title">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="navbar-notif-unread-chip">{unreadCount} new</span>
                      )}
                    </span>
                    {unreadCount > 0 && (
                      <button className="navbar-notif-markall" onClick={handleMarkAllRead}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="navbar-notif-list">
                    {notifications.length === 0 ? (
                      <div className="navbar-notif-empty">
                        <span style={{ fontSize: '28px' }}>🔔</span>
                        <span>No notifications yet</span>
                      </div>
                    ) : (
                      notifications.slice(0, 12).map((notif) => (
                        <div
                          key={notif._id}
                          className={`navbar-notif-item ${!notif.isRead ? 'unread' : ''}`}
                          onClick={() => handleMarkRead(notif._id)}
                        >
                          <span className="navbar-notif-icon">{getNotifIcon(notif.type)}</span>
                          <div className="navbar-notif-body">
                            <span className="navbar-notif-item-title">{notif.title}</span>
                            <span className="navbar-notif-item-msg">{notif.message}</span>
                            <span className="navbar-notif-item-time">{formatTimeAgo(notif.createdAt)}</span>
                          </div>
                          <button
                            className="navbar-notif-delete"
                            onClick={(e) => handleDeleteNotif(e, notif._id)}
                            title="Dismiss"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="navbar-theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            <div className={`theme-toggle-icon-wrapper ${theme}`}>
              {/* Sun Icon */}
              <svg
                className="sun-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              {/* Moon Icon */}
              <svg
                className="moon-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
          </button>

          {/* Conditional Signup/Login or Logout button */}
          {currentUser ? (
            <button onClick={handleLogout} className="navbar-signup-btn navbar-logout-btn">
              Logout ({currentUser.name})
            </button>
          ) : (
            <div className="navbar-auth-buttons-desktop" style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="navbar-signup-btn navbar-logout-btn" style={{ display: 'inline-flex' }}>
                Log In
              </Link>
              <Link to="/signup" className="navbar-signup-btn">
                Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger Menu Icon */}
          <button
            onClick={toggleMenu}
            className={`navbar-burger ${isOpen ? 'is-active' : ''}`}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={`navbar-mobile-menu ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="navbar-mobile-content">
          <nav className="navbar-mobile-links" aria-label="Mobile Navigation">
            <Link to="/" className={`navbar-mobile-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/courses" className={`navbar-mobile-link ${location.pathname === '/courses' ? 'active' : ''}`}>
              Courses
            </Link>

            {/* Conditional Mobile Dashboard Links */}
            {currentUser && currentUser.role === 'student' && (
              <Link to="/student" className={`navbar-mobile-link ${location.pathname === '/student' ? 'active' : ''}`}>
                Student Dashboard
              </Link>
            )}
            {currentUser && currentUser.role === 'instructor' && (
              <Link to="/instructor" className={`navbar-mobile-link ${location.pathname === '/instructor' ? 'active' : ''}`}>
                Instructor Panel
              </Link>
            )}

            <Link to="/about" className={`navbar-mobile-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>
            <Link to="/contact" className={`navbar-mobile-link ${location.pathname === '/contact' ? 'active' : ''}`}>
              Contact Support
            </Link>

            {currentUser ? (
              <button onClick={handleLogout} className="navbar-mobile-signup-btn navbar-mobile-logout-btn">
                Logout ({currentUser.name})
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <Link to="/login" className="navbar-mobile-signup-btn navbar-mobile-logout-btn" style={{ margin: 0, textAlign: 'center' }}>
                  Log In
                </Link>
                <Link to="/signup" className="navbar-mobile-signup-btn" style={{ margin: 0, textAlign: 'center' }}>
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
