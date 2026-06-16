import React from 'react';
import './Reviews.css';

const reviews = [
  {
    name: 'Ahmad Butt',
    role: 'Patient, Age 34',
    avatar: 'AB',
    rating: 5,
    text: 'Very fast and easy to use. I uploaded my image and within seconds had a clear result. The confidence score really helped me understand the risk level.',
    color: '#3182CE',
  },
  {
    name: 'Dr. Ali Hussnain',
    role: 'General Practitioner',
    avatar: 'AH',
    rating: 5,
    text: 'Helpful for early skin analysis. As a GP, I recommend this as a first-step screening tool for patients concerned about skin changes. Impressive technology.',
    color: '#38A169',
  },
  {
    name: 'Priya Sharma',
    role: 'Patient, Age 28',
    avatar: 'PS',
    rating: 5,
    text: 'Clean and professional interface. I was skeptical at first, but the AI gave me results that matched what my dermatologist later confirmed. Amazing!',
    color: '#805AD5',
  },
  {
    name: 'Tom Henriksen',
    role: 'Healthcare Student',
    avatar: 'TH',
    rating: 5,
    text: 'Accurate and impressive results. The ResNet-based model clearly works well. I tested it as part of my research on AI in dermatology — excellent performance.',
    color: '#0BC5EA',
  },
  {
    name: 'Amina Al-Rashid',
    role: 'Caregiver',
    avatar: 'AR',
    rating: 5,
    text: "I used this to monitor my mother's skin condition between hospital visits. It's reassuring to have an AI tool that's this reliable and accessible at home.",
    color: '#F6AD55',
  },
  {
    name: 'Sara Mehmood',
    role: 'Patient, Age 41',
    avatar: 'SM',
    rating: 5,
    text: 'I was worried about a patch on my arm for months. This tool gave me the push to finally see a doctor. The result was spot on. Truly life-changing.',
    color: '#E53E3E',
  },
  {
    name: 'Dr. Kamran Iqbal',
    role: 'Dermatologist',
    avatar: 'KI',
    rating: 5,
    text: 'As a dermatologist, I find this tool incredibly useful for triaging patients remotely. The ResNet model performs well on common psoriasis presentations.',
    color: '#ED8936',
  },
];

const StarRating = ({ count }) => (
  <div className="review__stars">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#F6AD55">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ r, id }) => (
  <div className="reviews__card" id={id}>
    <div className="reviews__card-top">
      <div className="reviews__avatar" style={{ background: r.color + '20', color: r.color }}>
        {r.avatar}
      </div>
      <div className="reviews__user">
        <div className="reviews__name">{r.name}</div>
        <div className="reviews__role">{r.role}</div>
      </div>
      <div className="reviews__quote-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: r.color, opacity: 0.25 }}>
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      </div>
    </div>

    <StarRating count={r.rating} />

    <p className="reviews__text">"{r.text}"</p>

    <div className="reviews__verified">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#38A169">
        <path d="M22 11.08V12C22 17.52 17.52 22 12 22S2 17.52 2 12 6.48 2 12 2c1.88 0 3.64.52 5.14 1.42" stroke="#38A169" strokeWidth="2" />
        <polyline points="22 4 12 14.01 9 11.01" stroke="#38A169" strokeWidth="2" />
      </svg>
      Verified User
    </div>
  </div>
);

const Reviews = () => {
  // Duplicate cards for seamless infinite loop
  const allCards = [...reviews, ...reviews];

  return (
    <section className="reviews" id="reviews">
      <div className="reviews__bg">
        <div className="reviews__bg-blob" />
      </div>

      <div className="container">
        <div className="reviews__header">
          <h2 className="section-title">
            What Our Users Are <span className="text-gradient">Saying</span>
          </h2>
          <p className="section-subtitle">
            Trusted by patients, caregivers, and healthcare professionals worldwide.
          </p>

          <div className="reviews__summary">
            <div className="reviews__summary-score">4.9</div>
            <div className="reviews__summary-right">
              <StarRating count={5} />
              <div className="reviews__summary-text">Based on 2,400+ reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width marquee — outside container so it bleeds edge to edge */}
      <div className="reviews__marquee-wrapper">
        {/* Fade edges */}
        <div className="reviews__fade reviews__fade--left" />
        <div className="reviews__fade reviews__fade--right" />

        <div className="reviews__marquee-track">
          {allCards.map((r, i) => (
            <ReviewCard key={i} r={r} id={i < reviews.length ? `review-card-${i + 1}` : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
