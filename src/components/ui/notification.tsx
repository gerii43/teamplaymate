import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface NotificationProps {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
  onAction?: () => void;
  actionText?: string;
  className?: string;
  persistent?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  onAction,
  actionText,
  className,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative border rounded-lg p-4 shadow-lg transition-all duration-300",
        "transform translate-x-0 opacity-100",
        isExiting && "translate-x-full opacity-0",
        getTypeStyles(),
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h4>
              {message && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="ml-4 flex-shrink-0 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {onAction && actionText && (
            <div className="mt-3 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAction}
                className="text-xs"
              >
                {actionText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Notification Container Component
interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  className?: string;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  position = 'top-right',
  maxNotifications = 5,
  className
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const visibleNotifications = notifications.slice(0, maxNotifications);

  return (
    <div
      className={cn(
        "fixed z-50 space-y-2 pointer-events-none",
        getPositionStyles(),
        className
      )}
    >
      {visibleNotifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Notification
            {...notification}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
};

// Notification Bell Component
interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  count = 0,
  onClick,
  className,
  variant = 'ghost',
  size = 'md'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn("relative", getSizeClasses(), className)}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  );
};

export default Notification; 