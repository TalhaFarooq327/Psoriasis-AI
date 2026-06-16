import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'FAQs', href: '#faqs' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ];

  const handleNav = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" fillOpacity="0.9" />
                    <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="footer__logo-text">Psoriasis<span className="footer__logo-accent"> AI</span></span>
              </div>
              <p className="footer__brand-desc">
                AI-powered psoriasis screening using deep learning. Fast, private, and accessible to everyone — anytime, anywhere.
              </p>
              <div className="footer__socials">
                <a href="#" className="footer__social" aria-label="Twitter" id="footer-twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                </a>
                <a href="#" className="footer__social" aria-label="LinkedIn" id="footer-linkedin">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a href="#" className="footer__social" aria-label="GitHub" id="footer-github">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="footer__col">
              <h4 className="footer__col-title">Navigation</h4>
              <ul className="footer__links">
                {navLinks.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="footer__link" onClick={(e) => handleNav(e, l.href)}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="footer__col">
              <h4 className="footer__col-title">Resources</h4>
              <ul className="footer__links">
                <li><a href="#" className="footer__link">Documentation</a></li>
                <li><a href="#" className="footer__link">AI Model Info</a></li>
                <li><a href="#" className="footer__link">Research Papers</a></li>
                <li><a href="#" className="footer__link">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer__col">
              <h4 className="footer__col-title">Contact</h4>
              <div className="footer__contact-items">
                <a href="mailto:support@psoriasisai.com" className="footer__contact-item" id="footer-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  support@psoriasisai.com
                </a>
                <div className="footer__contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Support: Mon–Fri, 9am–6pm
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer__divider">
        <div className="container">
          <div className="footer__disclaimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>
              <strong>Medical Disclaimer:</strong> This is an AI-based screening tool and not a substitute for professional medical diagnosis.
              Psoriasis AI provides preliminary risk assessments only. Always consult a certified dermatologist for clinical evaluation and treatment.
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copyright">© {year} Psoriasis AI. All rights reserved.</p>
            <div className="footer__legal">
              {legalLinks.map(l => (
                <a key={l.label} href={l.href} className="footer__legal-link">{l.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
