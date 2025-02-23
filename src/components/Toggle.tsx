import React from 'react';

interface ToggleProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Toggle: React.FC<ToggleProps> = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={`focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default Toggle;