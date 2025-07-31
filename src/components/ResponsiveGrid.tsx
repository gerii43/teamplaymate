import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4, '2xl': 5 },
  gap = { sm: 4, md: 6, lg: 8, xl: 8 },
  className 
}) => {
  const getGridCols = () => {
    const colClasses = [];
    if (cols.sm) colClasses.push(`grid-cols-${cols.sm}`);
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);
    if (cols['2xl']) colClasses.push(`2xl:grid-cols-${cols['2xl']}`);
    return colClasses.join(' ');
  };

  const getGridGap = () => {
    const gapClasses = [];
    if (gap.sm) gapClasses.push(`gap-${gap.sm}`);
    if (gap.md) gapClasses.push(`md:gap-${gap.md}`);
    if (gap.lg) gapClasses.push(`lg:gap-${gap.lg}`);
    if (gap.xl) gapClasses.push(`xl:gap-${gap.xl}`);
    return gapClasses.join(' ');
  };

  return (
    <div className={cn(
      'grid',
      getGridCols(),
      getGridGap(),
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveGrid; 