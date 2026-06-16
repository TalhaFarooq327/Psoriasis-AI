import React from 'react';
import './FormInput.css';

/**
 * Reusable form input component for auth pages.
 * Props:
 *  id, label, type, value, onChange, error, placeholder,
 *  autoComplete, icon (leading SVG), suffix (trailing element e.g. toggle btn)
 */
const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  icon,
  suffix,
}) => {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>

      <div className="form-input-wrap">
        {icon && (
          <span className="form-input-icon" aria-hidden="true">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`form-input ${icon ? 'form-input--with-icon' : ''} ${suffix ? 'form-input--with-suffix' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          spellCheck={false}
        />

        {suffix && (
          <span className="form-input-suffix">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="form-error-msg" id={`${id}-error`} role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
