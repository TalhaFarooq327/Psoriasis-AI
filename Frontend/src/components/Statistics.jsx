import React, { useEffect, useRef, useState } from 'react';
import './Statistics.css';

const stats = [
  {
    id: 'stat-predictions',
    value: 120000,
    display: '120K+',
    label: 'AI Predictions Made',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#3182CE',
    gradient: 'linear-gradient(135deg, #3182CE, #63B3ED)',
    desc: 'Psoriasis analyses completed',
  },
  {
    id: 'stat-response',
    value: 2,
    display: '< 1min',
    label: 'Average Response Time',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    color: '#0BC5EA',
    gradient: 'linear-gradient(135deg, #0BC5EA, #76E4F7)',
    desc: 'From upload to prediction result',
  },
  {
    id: 'stat-accuracy',
    value: 99,
    display: '99%',
    label: 'Model Accuracy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12C22 17.52 17.52 22 12 22S2 17.52 2 12 6.48 2 12 2c1.88 0 3.64.52 5.14 1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#38A169',
    gradient: 'linear-gradient(135deg, #38A169, #68D391)',
    desc: 'ResNet-50 clinical validation',
  },
  {
    id: 'stat-users',
    value: null,
    display: '↑ Growing',
    label: 'Active Users',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    color: '#805AD5',
    gradient: 'linear-gradient(135deg, #805AD5, #B794F4)',
    desc: 'Rapidly expanding platform',
  },
];

const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || target === null) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
};

const StatCard = ({ stat, visible, index }) => {
  const count = useCountUp(stat.value, 2000, visible);

  return (
    <div
      className={`stats__card ${visible ? 'stats__card--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
      id={stat.id}
    >
      <div className="stats__card-glow" style={{ background: stat.gradient }}></div>

      <div className="stats__card-icon" style={{ color: stat.color, background: stat.color + '18' }}>
        {stat.icon}
      </div>

      <div className="stats__card-value" style={{ color: stat.color }}>
        {stat.value !== null && stat.display.includes('%')
          ? `${count}%`
          : stat.display}
      </div>

      <div className="stats__card-label">{stat.label}</div>
      <div className="stats__card-desc">{stat.desc}</div>

      <div className="stats__card-ring" style={{ borderColor: stat.color + '20' }}></div>
    </div>
  );
};

const Statistics = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats" ref={ref}>
      <div className="stats__bg">
        <div className="stats__bg-grid"></div>
        <div className="stats__bg-glow"></div>
      </div>

      <div className="container">
        <div className="stats__header">

          <h2 className="section-title" style={{ color: 'white' }}>
            Numbers That<br />
            <span style={{ background: 'linear-gradient(135deg, #63B3ED, #76E4F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Speak for Themselves
            </span>
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Psoriasis AI is built on proven deep learning technology with measurable real-world impact.
          </p>
        </div>

        <div className="stats__grid">
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} visible={visible} index={i} />
          ))}
        </div>

        <div className={`stats__note ${visible ? 'stats__note--visible' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Statistics based on internal model benchmarks and platform usage data.
        </div>
      </div>
    </section>
  );
};

export default Statistics;
