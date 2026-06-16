import React, { useEffect, useRef, useState } from 'react';
import './EarlyDetection.css';

const points = [
  { icon: '🔬', text: 'Psoriasis affects over 125 million people worldwide and an estimated 5–7 million people in Pakistan, making early detection critical for effective treatment.' },
  { icon: '⚡', text: 'AI screening identifies early-stage skin changes that may be missed during routine visual inspection.' },
  { icon: '🏥', text: 'Earlier awareness leads to faster specialist referrals, reducing long-term skin damage.' },
  { icon: '🧬', text: 'Our model analyzes micro-patterns invisible to the human eye, trained on clinical dermatology datasets.' },
];

const EarlyDetection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="early" ref={ref}>
      <div className="container">
        <div className={`early__inner ${visible ? 'early__inner--visible' : ''}`}>
          {/* Left Visual */}
          <div className="early__visual">
            <div className="early__visual-card">
              <div className="early__skin-scan">
                <div className="early__scan-ring early__scan-ring--1"></div>
                <div className="early__scan-ring early__scan-ring--2"></div>
                <div className="early__scan-ring early__scan-ring--3"></div>
                <div className="early__scan-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(49,130,206,0.15)" stroke="#3182CE" strokeWidth="2" />
                    <path d="M8 12h8M12 8v8" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="early__detection-label">
                <div className="early__detection-dot"></div>
                AI Monitoring Active
              </div>
              <div className="early__timeline-mini">
                {['Stage 1', 'Stage 2', 'Early Detected', 'Treatment'].map((s, i) => (
                  <div key={i} className="early__tm-step">
                    <div className={`early__tm-node ${i <= 2 ? 'early__tm-node--active' : ''}`}></div>
                    <div className="early__tm-label">{s}</div>
                    {i < 3 && <div className={`early__tm-line ${i <= 1 ? 'early__tm-line--active' : ''}`}></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="early__alert-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#38A169"><path d="M22 11.08V12C22 17.52 17.52 22 12 22S2 17.52 2 12 6.48 2 12 2c1.88 0 3.64.52 5.14 1.42" stroke="#38A169" strokeWidth="2" /><polyline points="22 4 12 14.01 9 11.01" stroke="#38A169" strokeWidth="2" /></svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1A202C' }}>Early Stage Detected</div>
                <div style={{ fontSize: 11, color: '#718096' }}>Recommend dermatologist visit</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="early__content">

            <h2 className="section-title">
              Early Detection Saves<br />
              <span className="text-gradient-green">Skin Health</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>
              Catching psoriasis in its earliest stages dramatically improves treatment outcomes and quality of life. Our AI bridges the gap between symptom onset and professional diagnosis.
            </p>

            <div className="early__points">
              {points.map((p, i) => (
                <div
                  key={i}
                  className={`early__point ${visible ? 'early__point--visible' : ''}`}
                  style={{ transitionDelay: `${0.2 + i * 0.12}s` }}
                >
                  <div className="early__point-icon">{p.icon}</div>
                  <p className="early__point-text">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarlyDetection;
