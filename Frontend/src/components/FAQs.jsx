import React, { useState, useEffect, useRef } from 'react';
import './FAQs.css';

const faqs = [
  {
    q: 'How accurate is Psoriasis AI?',
    a: 'Our AI model is based on ResNet-50 and has been validated with a 99% accuracy rate on clinical dermatology datasets. However, it is designed as a screening tool and should not replace professional medical diagnosis.',
  },
  {
    q: 'What type of images should I upload?',
    a: 'Upload a clear, well-lit photo of the affected skin area in JPG or PNG format. Avoid blurry images or images with obstructions. The closer and clearer the image, the more accurate the result.',
  },
  {
    q: 'Is my uploaded image stored or shared?',
    a: 'No. Your images are processed in real-time using 256-bit encryption and are not stored on our servers after analysis. We are fully HIPAA-compliant and take your privacy seriously.',
  },
  {
    q: 'Can Psoriasis AI diagnose other skin conditions?',
    a: 'Psoriasis AI is specifically trained to detect psoriasis indicators. It does not diagnose other skin conditions. For comprehensive skin health evaluation, please consult a licensed dermatologist.',
  },
  {
    q: 'How long does the analysis take?',
    a: 'In most cases, results are delivered in under 2 seconds. The AI processes the uploaded image, runs it through our deep learning pipeline, and returns a confidence score with risk level assessment almost instantly.',
  },
  {
    q: 'Do I need to create an account to use it?',
    a: 'No account is required for basic analysis. Simply upload your image and receive your results immediately. Creating an account allows you to save history and access detailed reports.',
  },
  {
    q: 'Should I see a doctor after using Psoriasis AI?',
    a: 'Yes — if you receive a positive or uncertain result, we strongly recommend consulting a certified dermatologist. Psoriasis AI provides a preliminary screening, not a clinical diagnosis.',
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <div
    className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}
    id={`faq-item-${index + 1}`}
  >
    <button
      className="faq__question"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="faq__q-num">0{index + 1}</span>
      <span className="faq__q-text">{faq.q}</span>
      <div className="faq__chevron">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
    <div className="faq__answer">
      <p>{faq.a}</p>
    </div>
  </div>
);

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0);
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
    <section className="faqs" id="faqs" ref={ref}>
      <div className="container">
        <div className="faqs__inner">
          {/* Left */}
          <div className={`faqs__left ${visible ? 'faqs__left--visible' : ''}`}>

            <h2 className="section-title">
              Frequently Asked<br />
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>
              Everything you need to know about Psoriasis AI — how it works, your privacy, and what to expect.
            </p>

            <div className="faqs__contact-box">
              <div className="faqs__contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="faqs__contact-title">Still have questions?</div>
                <a href="mailto:support@psoriasisai.com" className="faqs__contact-link">support@psoriasisai.com</a>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className={`faqs__right ${visible ? 'faqs__right--visible' : ''}`}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
