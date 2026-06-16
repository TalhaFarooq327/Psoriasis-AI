import React, { useEffect, useRef, useState } from 'react';
import './QuickInsight.css';

const QuickInsight = () => {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          let start = 0;
          const end = 60;
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) clearInterval(timer);
          }, 25);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="insight" ref={ref}>
      <div className="insight__bg">
        <div className="insight__bg-pattern"></div>
      </div>
      <div className="container">
        <div className={`insight__inner ${visible ? 'insight__inner--visible' : ''}`}>
          <div className="insight__left">

            <h2 className="section-title">
              What do you know in<br />
              <span className="insight__timer">
                <span className="insight__count">{count}</span>
                <span className="insight__sec">sec</span>
              </span>?
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '520px' }}>
              In less than <strong>60 seconds</strong>, Psoriasis AI can analyze your skin image and provide a preliminary psoriasis risk assessment using deep learning models trained on thousands of clinical samples.
            </p>
            <a href="#" className="btn-primary insight__cta" id="insight-cta-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-14 9V3z" fill="white" />
              </svg>
              Start Analysis Now
            </a>
          </div>

          <div className="insight__right">
            <div className="insight__timeline">
              {[
                { time: '0s', label: 'Image uploaded', done: true, color: '#3182CE' },
                { time: '15s', label: 'Pre-processing image', done: true, color: '#0BC5EA' },
                { time: '30s', label: 'Running ResNet-50 model', done: true, color: '#38A169' },
                { time: '45s', label: 'Analyzing skin patterns', done: true, color: '#805AD5' },
                { time: '< 60s', label: 'Prediction ready ✓', done: true, color: '#F6AD55', highlight: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`insight__tl-item ${visible ? 'insight__tl-item--visible' : ''} ${item.highlight ? 'insight__tl-item--highlight' : ''}`}
                  style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
                >
                  <div className="insight__tl-dot" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}60` }}></div>
                  <div className="insight__tl-content">
                    <span className="insight__tl-time" style={{ color: item.color }}>{item.time}</span>
                    <span className="insight__tl-label">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickInsight;
