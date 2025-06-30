import React from 'react';
import './Form.css';

// Form Container
export const Form = ({ children, onSubmit, className = '', ...props }) => {
  return (
    <form className={`form ${className}`} onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
};

// Form Group
export const FormGroup = ({ children, className = '' }) => {
  return <div className={`form-group ${className}`}>{children}</div>;
};

// Form Label
export const FormLabel = ({
  children,
  htmlFor,
  required = false,
  className = '',
}) => {
  return (
    <label htmlFor={htmlFor} className={`form-label ${className}`}>
      {children}
      {required && <span className="form-required">*</span>}
    </label>
  );
};

// Form Input
export const FormInput = ({
  type = 'text',
  error = false,
  helperText = '',
  className = '',
  ...props
}) => {
  const inputClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-input-wrapper">
      <input type={type} className={inputClasses} {...props} />
      {helperText && (
        <div className={`form-helper-text ${error ? 'form-helper-error' : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Form Textarea
export const FormTextarea = ({
  error = false,
  helperText = '',
  rows = 4,
  className = '',
  ...props
}) => {
  const textareaClasses = [
    'form-textarea',
    error ? 'form-textarea-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-textarea-wrapper">
      <textarea rows={rows} className={textareaClasses} {...props} />
      {helperText && (
        <div className={`form-helper-text ${error ? 'form-helper-error' : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Form Select
export const FormSelect = ({
  children,
  error = false,
  helperText = '',
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  const selectClasses = [
    'form-select',
    error ? 'form-select-error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-select-wrapper">
      <select className={selectClasses} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      {helperText && (
        <div className={`form-helper-text ${error ? 'form-helper-error' : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Form Checkbox
export const FormCheckbox = ({
  label,
  error = false,
  helperText = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`form-checkbox-wrapper ${className}`}>
      <label className="form-checkbox-label">
        <input
          type="checkbox"
          className={`form-checkbox ${error ? 'form-checkbox-error' : ''}`}
          {...props}
        />
        <span className="form-checkbox-text">{label}</span>
      </label>
      {helperText && (
        <div className={`form-helper-text ${error ? 'form-helper-error' : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Form Radio Group
export const FormRadioGroup = ({
  children,
  name,
  error = false,
  helperText = '',
  className = '',
}) => {
  return (
    <div className={`form-radio-group ${className}`}>
      <div className="form-radio-options">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { name, error }),
        )}
      </div>
      {helperText && (
        <div className={`form-helper-text ${error ? 'form-helper-error' : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// Form Radio
export const FormRadio = ({
  label,
  value,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`form-radio-label ${className}`}>
      <input
        type="radio"
        value={value}
        className={`form-radio ${error ? 'form-radio-error' : ''}`}
        {...props}
      />
      <span className="form-radio-text">{label}</span>
    </label>
  );
};

export default Form;
