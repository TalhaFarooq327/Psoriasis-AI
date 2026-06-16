import React, { useEffect, useRef, useState } from 'react';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Upload Skin Image',
    desc: 'Simply drag and drop or browse to select a clear photo of the affected skin area. Supports JPG and PNG formats.',
    color: '#3182CE',
    bg: 'rgba(49,130,206,0.08)',
  },
  {
    number: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    title: 'AI Processes Your Image',
    desc: 'Our deep learning model (ResNet-50) analyzes skin patterns, texture, and color signatures to evaluate psoriasis indicators.',
    color: '#0BC5EA',
    bg: 'rgba(11,197,234,0.08)',
  },
  {
    number: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Get Prediction Results',
    desc: 'Receive an instant prediction indicating whether psoriasis signs are detected — all in under 1 minute.',
    color: '#38A169',
    bg: 'rgba(56,161,105,0.08)',
  },
  {
    number: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'View Confidence Score & Guidance',
    desc: 'Review the AI confidence score, risk level, and actionable health guidance to decide your next steps.',
    color: '#805AD5',
    bg: 'rgba(128,90,213,0.08)',
  },
];

const HowItWorks = () => {
  const [visible, setVisible] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => setVisible(prev => [...prev, i]), i * 200);
          });
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="how" id="how-it-works" ref={sectionRef}>
      <div className="how__bg">
        <div className="how__bg-circle how__bg-circle--1"></div>
        <div className="how__bg-circle how__bg-circle--2"></div>
      </div>

      <div className="container">
        <div className="how__header">

          <h2 className="section-title">
            How to Check Your Skin in<br />
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p className="section-subtitle">
            Our streamlined workflow makes psoriasis screening fast, simple, and accessible from anywhere.
          </p>
        </div>

        <div className="how__steps">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`how__step ${visible.includes(i) ? 'how__step--visible' : ''}`}
              id={`step-${i + 1}`}
            >
              {i < steps.length - 1 && <div className="how__connector"></div>}

              <div className="how__step-number-wrap">
                <div className="how__step-number" style={{ color: step.color, borderColor: step.color + '30', background: step.bg }}>
                  {step.number}
                </div>
              </div>

              <div className="how__step-card">
                <div className="how__step-icon" style={{ color: step.color, background: step.bg }}>
                  {step.icon}
                </div>
                <h3 className="how__step-title">{step.title}</h3>
                <p className="how__step-desc">{step.desc}</p>
                <div className="how__step-tag" style={{ color: step.color, background: step.bg }}>
                  Step {step.number}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
