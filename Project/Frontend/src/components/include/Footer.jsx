import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="app-footer bg-dark text-white pt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="footer-brand">
              <span className="brand-icon">⚙️</span>
              EquipTrack
            </h5>
            <p className="footer-text">
              Equipment Tracking & Maintenance — reliable tools and dashboards
              to monitor assets, schedule maintenance and reduce downtime.
            </p>
            <div className="social-icons" aria-label="Social links">
              <a href="#" aria-label="Facebook" className="social-link">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.1V12h2.1V9.8c0-2.1 1.2-3.3 3-3.3.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.62-1.3 1.26V12h2.2l-.35 2.9h-1.85v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M22 5.92c-.63.28-1.3.47-2 .56a3.5 3.5 0 001.54-1.93 7 7 0 01-2.22.85 3.48 3.48 0 00-5.93 3.17A9.88 9.88 0 013 4.9a3.48 3.48 0 001.08 4.65c-.5 0-.98-.15-1.4-.38v.04a3.48 3.48 0 002.79 3.41 3.5 3.5 0 01-1.57.06 3.49 3.49 0 003.26 2.42A7 7 0 012 19.54a9.86 9.86 0 005.34 1.56c6.42 0 9.93-5.32 9.93-9.93v-.45A7.1 7.1 0 0022 5.92z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M4.98 3.5A2.5 2.5 0 112.5 6a2.5 2.5 0 012.48-2.5zM3 8.98h3.98V21H3V8.98zM9.5 8.98h3.82v1.6h.05c.53-1 1.83-2.04 3.77-2.04 4.03 0 4.78 2.65 4.78 6.09V21h-3.98v-5.1c0-1.22 0-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.69V21H9.5V8.98z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="col-md-3">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-5">
            <h6 className="footer-title">Contact & Newsletter</h6>
            <address className="text-white small mb-2">
              <strong>Email:</strong>{" "}
              <a href="mailto:equiptrack.organization@gmail.com">
                equiptrack.organization@gmail.com
              </a>
              <br />
              <strong>Phone:</strong> +91 456 7890
              <br />
              <strong>Address:</strong> 123 Main St, Hyderabad, India
            </address>

            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter" className="visually-hidden">
                Subscribe to newsletter
              </label>
              <div className="d-flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Your email"
                />
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "var(--primary-light)" }}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-2 small">
          <div>
            &copy; {new Date().getFullYear()} EquipTrack. All rights reserved.
          </div>
          <div className="mt-2 mt-md-0">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
