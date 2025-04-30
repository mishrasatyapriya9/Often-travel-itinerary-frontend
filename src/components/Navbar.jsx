import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L6.5 11L17.5 11L12 2Z" fill="currentColor" />
              <path
                d="M17.5 22L6.5 22L6.5 13L17.5 13L17.5 22Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="logo-text">Often</span>
        </Link>

        <div
          className="menu-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/recommendations"
              className={`nav-link ${
                location.pathname.includes("/recommendations") ? "active" : ""
              }`}
            >
              Recommendations
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/create"
              className={`nav-link ${
                location.pathname === "/create-itinerary" ? "active" : ""
              }`}
            >
              Create Itinerary
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#/explore"
              className={`nav-link ${
                location.pathname === "/explore" ? "active" : ""
              }`}
            >
              Explore
            </Link>
          </li>
        </ul>

        <div className="nav-buttons">
          <Link to="#/search" className="search-button" aria-label="Search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link to="#/profile" className="profile-button">
            <div className="profile-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 19C6 16.2386 8.68629 14 12 14C15.3137 14 18 16.2386 18 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
