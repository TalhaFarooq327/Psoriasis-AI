import React from 'react';
import './AuthIllustration.css';

/**
 * Inline SVG medical/dermatology illustration for auth pages.
 * variant: 'login' | 'register'
 */
const AuthIllustration = ({ variant = 'login' }) => {
  if (variant === 'register') {
    return (
      <div className="auth-illustration-wrap auth-illustration-wrap--register">
        {/* Register: DNA + Shield + new user concept */}
        <svg
          viewBox="0 0 320 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="auth-illustration"
          aria-label="Join Psoriasis AI illustration"
          role="img"
        >
          {/* Glow background */}
          <ellipse cx="160" cy="130" rx="120" ry="100" fill="rgba(255,255,255,0.06)" />

          {/* Central shield */}
          <g className="ill-shield">
            <path
              d="M160 40 L200 58 L200 100 C200 128 182 150 160 158 C138 150 120 128 120 100 L120 58 Z"
              fill="rgba(255,255,255,0.14)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
            />
            {/* checkmark */}
            <path d="M146 99 L157 110 L175 88" stroke="rgba(104,211,145,1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Orbiting dots */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r = 88;
            const rad = (deg * Math.PI) / 180;
            const cx = 160 + r * Math.cos(rad);
            const cy = 130 + r * Math.sin(rad);
            return (
              <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 5 : 3.5}
                fill={i % 2 === 0 ? 'rgba(104,211,145,0.75)' : 'rgba(118,228,247,0.65)'}
                className={`ill-dot ill-dot--${i}`}
              />
            );
          })}

          {/* Orbit ring */}
          <ellipse cx="160" cy="130" rx="88" ry="88"
            stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 6" />

          {/* Skin cells (circles) */}
          <circle cx="80" cy="80" r="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <circle cx="240" cy="85" r="13" fill="rgba(104,211,145,0.12)" stroke="rgba(104,211,145,0.35)" strokeWidth="1" />
          <circle cx="250" cy="175" r="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <circle cx="70" cy="178" r="13" fill="rgba(118,228,247,0.12)" stroke="rgba(118,228,247,0.35)" strokeWidth="1" />

          {/* User icon */}
          <g transform="translate(143, 170)">
            <circle cx="17" cy="8" r="8" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" />
            <path d="M2 28 C2 20 8 15 17 15 C26 15 32 20 32 28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* plus badge */}
            <circle cx="30" cy="6" r="7" fill="#68D391" />
            <path d="M30 3 L30 9 M27 6 L33 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Floating labels */}
          <g transform="translate(18, 108)">
            <rect width="72" height="26" rx="13" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="12" y="17" fontSize="10" fill="white" fontFamily="Inter, sans-serif" fontWeight="600">AI Analysis</text>
          </g>
          <g transform="translate(225, 140)">
            <rect width="68" height="26" rx="13" fill="rgba(104,211,145,0.22)" stroke="rgba(104,211,145,0.45)" strokeWidth="1" />
            <text x="10" y="17" fontSize="10" fill="white" fontFamily="Inter, sans-serif" fontWeight="600">Secure Data</text>
          </g>
        </svg>
      </div>
    );
  }

  /* ── Login illustration: AI + skin scanning ── */
  return (
    <div className="auth-illustration-wrap">
      <svg
        viewBox="0 0 320 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="auth-illustration"
        aria-label="Psoriasis AI login illustration"
        role="img"
      >
        {/* Background glow */}
        <ellipse cx="160" cy="130" rx="115" ry="95" fill="rgba(255,255,255,0.05)" />

        {/* Outer ring */}
        <circle cx="160" cy="130" r="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 7" />

        {/* Phone/tablet frame */}
        <rect x="112" y="52" width="96" height="156" rx="16"
          fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

        {/* Screen */}
        <rect x="120" y="68" width="80" height="110" rx="8" fill="rgba(255,255,255,0.08)" />

        {/* Scan line animation area */}
        <rect x="124" y="72" width="72" height="102" rx="6" fill="rgba(49,130,206,0.08)" />

        {/* Scan lines */}
        {[82, 92, 102, 112, 122, 132, 142, 152].map((y, i) => (
          <line key={i} x1="128" y1={y} x2="196" y2={y}
            stroke={i % 3 === 0 ? 'rgba(11,197,234,0.5)' : 'rgba(255,255,255,0.12)'}
            strokeWidth={i % 3 === 0 ? 1.2 : 0.8} />
        ))}

        {/* Skin texture dots on screen */}
        {[
          [140, 90], [155, 88], [165, 95], [145, 105], [160, 108], [170, 102],
          [138, 118], [152, 122], [168, 115], [142, 132], [158, 135], [172, 128],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 4 === 0 ? 3.5 : 2.5}
            fill={i % 4 === 0 ? 'rgba(252,129,129,0.65)' : 'rgba(255,255,255,0.3)'} />
        ))}

        {/* Scan line (animated via CSS) */}
        <line x1="124" y1="120" x2="196" y2="120"
          stroke="#0BC5EA" strokeWidth="1.8"
          className="ill-scanline" />

        {/* Scan corners */}
        {[
          [124, 72, 10, 0], [196, 72, 0, 0], [196, 174, 0, -10], [124, 174, 10, -10]
        ].map(([x, y, dx, dy], i) => (
          <path key={i}
            d={`M${x + dx} ${y} L${x} ${y} L${x} ${y - dy} L${x} ${y + 10 + dy}`}
            stroke="#0BC5EA" strokeWidth="2" strokeLinecap="round" fill="none" />
        ))}

        {/* AI readout card */}
        <g transform="translate(60, 186)">
          <rect width="200" height="38" rx="12"
            fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
          <circle cx="19" cy="19" r="9" fill="rgba(11,197,234,0.3)" stroke="rgba(11,197,234,0.6)" strokeWidth="1" />
          <path d="M14 19 h10 M19 14 v10" stroke="#0BC5EA" strokeWidth="1.5" strokeLinecap="round" />
          <text x="36" y="13" fontSize="9" fill="rgba(255,255,255,0.65)" fontFamily="Inter,sans-serif" fontWeight="500">AI Detection</text>
          <text x="36" y="26" fontSize="11" fill="white" fontFamily="Inter,sans-serif" fontWeight="700">Psoriasis: Low Risk</text>
          <circle cx="178" cy="19" r="5" fill="rgba(104,211,145,0.9)" />
        </g>

        {/* Side floating stats */}
        <g transform="translate(20, 84)">
          <rect width="64" height="50" rx="12"
            fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <text x="10" y="18" fontSize="8.5" fill="rgba(255,255,255,0.6)" fontFamily="Inter,sans-serif">Accuracy</text>
          <text x="10" y="34" fontSize="17" fill="white" fontFamily="Inter,sans-serif" fontWeight="800">99%</text>
        </g>
        <g transform="translate(234, 84)">
          <rect width="66" height="50" rx="12"
            fill="rgba(56,161,105,0.2)" stroke="rgba(56,161,105,0.4)" strokeWidth="1" />
          <text x="10" y="18" fontSize="8.5" fill="rgba(255,255,255,0.6)" fontFamily="Inter,sans-serif">Reports</text>
          <text x="10" y="34" fontSize="17" fill="white" fontFamily="Inter,sans-serif" fontWeight="800">12K+</text>
        </g>

        {/* Bottom dot indicator */}
        <rect x="154" y="198" width="12" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
};

export default AuthIllustration;
