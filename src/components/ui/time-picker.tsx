import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface TimePickerProps {
  time?: string; // Format: "HH:MM"
  onTimeChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  step?: number; // Minutes step
}

const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
  placeholder = "Select time",
  disabled = false,
  className,
  step = 15
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += step) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "sm:w-auto sm:min-w-[120px]",
            !time && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="p-2">
          <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto">
            {timeOptions.map((timeOption) => (
              <Button
                key={timeOption}
                variant={time === timeOption ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  onTimeChange?.(timeOption);
                  setIsOpen(false);
                }}
              >
                {timeOption}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker; 