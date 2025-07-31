import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hover?: boolean;
  onClick?: () => void;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ 
  children, 
  className,
  padding = { sm: 'p-4', md: 'p-6', lg: 'p-6', xl: 'p-8' },
  shadow = 'md',
  hover = false,
  onClick
}) => {
  const getPadding = () => {
    const paddingClasses = [];
    if (padding.sm) paddingClasses.push(padding.sm);
    if (padding.md) paddingClasses.push(`md:${padding.md}`);
    if (padding.lg) paddingClasses.push(`lg:${padding.lg}`);
    if (padding.xl) paddingClasses.push(`xl:${padding.xl}`);
    return paddingClasses.join(' ');
  };

  return (
    <div 
      className={cn(
        'bg-white rounded-lg border border-gray-200',
        `shadow-${shadow}`,
        getPadding(),
        hover && 'transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ResponsiveCard; 