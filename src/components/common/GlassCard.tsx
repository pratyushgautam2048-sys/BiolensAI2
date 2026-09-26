import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  interactive = false,
  onClick,
  id
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-card ${interactive ? 'glass-card-interactive cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
