import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

/* ── animated scan dot that appears on the skin image ── */
const ScanDot = ({ x, y, label, delay, color = 'var(--accent)' }) => (
  <div className="scan-dot" style={{ left: `${x}%`, top: `${y}%`, animationDelay: delay }}>
    <div className="scan-dot__ring" style={{ borderColor: color, animationDelay: delay }} />
    <div className="scan-dot__core" style={{ background: color }} />
    <div className="scan-dot__label" style={{ borderColor: color }}>
      <span className="scan-dot__label-text">{label}</span>
    </div>
  </div>
);



const SkinVisual = () => {
  const [scanActive, setScanActive] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const progressRef = useRef(null);

  useEffect(() => {
    // Start scan loop
    const startCycle = () => {
      setScanActive(false);
      setDotsVisible(false);
      setScanProgress(0);

      setTimeout(() => {
        setScanActive(true);
        // Animate progress bar
        let p = 0;
        progressRef.current = setInterval(() => {
          p += 1.2;
          setScanProgress(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(progressRef.current);
            setDotsVisible(true);
          }
        }, 30);
      }, 600);
    };

    startCycle();
    const loop = setInterval(startCycle, 8000);
    return () => {
      clearInterval(loop);
      clearInterval(progressRef.current);
    };
  }, []);

  return (
    <div className="skin-visual">
      {/* Main skin photo */}
      <div className="skin-visual__frame">
        <img
          src="/skin-hero.png"
          alt="Skin Analysis Demonstration"
          className="skin-visual__img"
        />

        {/* dark gradient overlay bottom */}
        <div className="skin-visual__overlay" />

        {/* Scan corner brackets */}
        <div className="scan-bracket scan-bracket--tl" />
        <div className="scan-bracket scan-bracket--tr" />
        <div className="scan-bracket scan-bracket--bl" />
        <div className="scan-bracket scan-bracket--br" />

        {/* Scan sweeping line */}
        {scanActive && (
          <div className="scan-sweep">
            <div className="scan-sweep__line" />
            <div className="scan-sweep__glow" />
          </div>
        )}

        {/* Grid overlay */}
        <div className={`scan-grid ${scanActive ? 'scan-grid--active' : ''}`} />

        {/* Detection dots */}
        {dotsVisible && (
          <>
            <ScanDot x={38} y={45} label="Psoriasis Patch" delay="0s" color="#f97316" />
            <ScanDot x={62} y={30} label="Inflamed Area" delay="0.2s" color="#ef4444" />
            <ScanDot x={55} y={65} label="Healthy Skin" delay="0.4s" color="#22c55e" />
          </>
        )}

        {/* Progress bar at bottom */}
        <div className="scan-progress-bar">
          <div
            className="scan-progress-bar__fill"
            style={{ width: `${scanProgress}%` }}
          />
          <span className="scan-progress-bar__label">
            {scanProgress < 100 ? `Analyzing… ${Math.round(scanProgress)}%` : 'Analysis Complete ✓'}
          </span>
        </div>
      </div>




    </div>
  );
};

const Hero = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section className="hero" id="home">
      <div className="hero__bg">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
        <div className="hero__grid" />
        <div className="hero__noise" />
      </div>

      <div className="container hero__container">
        {/* ── Left: Text ── */}
        <div className={`hero__content ${visible ? 'hero__content--visible' : ''}`}>


          <h1 className="hero__title">
            Detect <span className="text-gradient">Psoriasis</span>
            <br />Instantly with AI
          </h1>

          <p className="hero__subtitle">
            Upload a photo of your skin and get a clinical-grade analysis in under&nbsp;1&nbsp;minute.
            Powered by deep learning trained on 60,000+ dermatology images.
          </p>

          <div className="hero__cta">
            <Link to="/analyze" className="btn-primary hero__cta-btn" id="hero-try-now-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-14 9V3z" fill="white" />
              </svg>
              Analyze My Skin — Free
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary hero__cta-learn"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </a>
          </div>



          {/* Mini stat row */}
          <div className="hero__stats-row">
            <div className="hero__mini-stat">
              <div className="hero__mini-stat-num">120K+</div>
              <div className="hero__mini-stat-lbl">Predictions</div>
            </div>
            <div className="hero__mini-stat-divider" />
            <div className="hero__mini-stat">
              <div className="hero__mini-stat-num">99%</div>
              <div className="hero__mini-stat-lbl">Accuracy</div>
            </div>
            <div className="hero__mini-stat-divider" />
            <div className="hero__mini-stat">
              <div className="hero__mini-stat-num">4.9★</div>
              <div className="hero__mini-stat-lbl">User Rating</div>
            </div>
          </div>
        </div>

        {/* ── Right: Skin Scan Visual ── */}
        <div className={`hero__visual ${visible ? 'hero__visual--visible' : ''}`}>
          <SkinVisual />
        </div>
      </div>


    </section>
  );
};

export default Hero;
