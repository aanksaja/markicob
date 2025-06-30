import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? 'btn-disabled' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  const fullWidthClass = fullWidth ? 'btn-full-width' : '';

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    loadingClass,
    fullWidthClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="btn-spinner" />
          <span>Loading...</span>
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          <span className="btn-icon btn-icon-left">{icon}</span>
          <span>{children}</span>
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          <span>{children}</span>
          <span className="btn-icon btn-icon-right">{icon}</span>
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
