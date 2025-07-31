import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  mobileView?: 'cards' | 'scroll' | 'stack';
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  headers, 
  children, 
  className,
  mobileView = 'cards'
}) => {
  if (mobileView === 'cards') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {headers.map((header, index) => (
                    <th 
                      key={index}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {children}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mobileView === 'scroll') {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-3 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
    );
  }

  // Stack view
  return (
    <div className={cn('space-y-2', className)}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          {child}
        </div>
      ))}
    </div>
  );
};

export default ResponsiveTable; 