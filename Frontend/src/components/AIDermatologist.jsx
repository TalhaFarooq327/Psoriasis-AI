import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './AIDermatologist.css';

const points = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: '24/7 Availability',
    desc: 'Available around the clock — no appointments, no clinic hours. Get skin analysis whenever you need it.',
    color: '#3182CE',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Fast Screening Tool',
    desc: 'Delivers preliminary psoriasis risk results in under 60 seconds — faster than any traditional diagnostic process.',
    color: '#0BC5EA',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Reduces Delay in Diagnosis',
    desc: 'Bridge the gap between symptom onset and professional consultation — reducing diagnostic delays significantly.',
    color: '#38A169',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Accessible from Anywhere',
    desc: 'Works on any device with a browser — smartphone, tablet, or desktop. No app download needed.',
    color: '#805AD5',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: 'Patient-Centred Design',
    desc: 'Built with empathy for patients — clear results, plain language explanations, and actionable next steps.',
    color: '#ED8936',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'ResNet-Based AI Model',
    desc: 'Trained on verified clinical datasets using ResNet-50 — the same architecture used in medical imaging research.',
    color: '#E53E3E',
  },
];

const AIDermatologist = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ai-derm" ref={ref}>
      <div className="ai-derm__bg">
        <div className="ai-derm__bg-blob ai-derm__bg-blob--1"></div>
        <div className="ai-derm__bg-blob ai-derm__bg-blob--2"></div>
      </div>

      <div className="container">
        <div className="ai-derm__header">
          <h2 className="section-title">
            Why is Psoriasis AI <br />
            <span className="text-gradient">Worth Using?</span>
          </h2>
          <p className="section-subtitle">
            Our AI acts as your first line of dermatological insight — fast, accurate, and always available.
          </p>
        </div>

        <div className="ai-derm__grid">
          {points.map((p, i) => (
            <div
              key={i}
              className={`ai-derm__card ${visible ? 'ai-derm__card--visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
              id={`ai-derm-card-${i + 1}`}
            >
              <div className="ai-derm__card-icon" style={{ color: p.color, background: p.color + '15' }}>
                {p.icon}
              </div>
              <div className="ai-derm__card-body">
                <h3 className="ai-derm__card-title">{p.title}</h3>
                <p className="ai-derm__card-desc">{p.desc}</p>
              </div>
              <div className="ai-derm__card-arrow" style={{ color: p.color }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className={`ai-derm__cta ${visible ? 'ai-derm__cta--visible' : ''}`}>
          <div className="ai-derm__cta-content">
            <h3 className="ai-derm__cta-title">Ready to get your AI skin analysis?</h3>
            <p className="ai-derm__cta-sub">No sign-up required. Just upload your image and get results instantly.</p>
          </div>
          <Link to="/analyze" className="btn-primary" id="ai-derm-cta-btn">
            Start Free Analysis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AIDermatologist;
