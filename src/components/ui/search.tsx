import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface SearchOption {
  id: string;
  label: string;
  value: string;
  category?: string;
  icon?: React.ReactNode;
}

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onSelect?: (option: SearchOption) => void;
  options?: SearchOption[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  showClear?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  minLength?: number;
  maxResults?: number;
  categories?: string[];
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onSelect,
  options = [],
  loading = false,
  disabled = false,
  className,
  showClear = true,
  autoFocus = false,
  debounceMs = 300,
  minLength = 2,
  maxResults = 10,
  categories = [],
  onCategoryChange,
  selectedCategory
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounce input value
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue, debounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedValue.length >= minLength) {
      onSearch?.(debouncedValue);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedValue, minLength, onSearch]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || options.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < options.length) {
            handleSelect(options[selectedIndex]);
          } else if (inputValue.trim()) {
            onSearch?.(inputValue.trim());
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, selectedIndex, inputValue, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    onSearch?.('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (option: SearchOption) => {
    setInputValue(option.label);
    onChange?.(option.label);
    onSelect?.(option);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const filteredOptions = options
    .filter(option => 
      !selectedCategory || option.category === selectedCategory
    )
    .slice(0, maxResults);

  const groupedOptions = categories.length > 0 
    ? categories.reduce((acc, category) => {
        const categoryOptions = filteredOptions.filter(opt => opt.category === category);
        if (categoryOptions.length > 0) {
          acc[category] = categoryOptions;
        }
        return acc;
      }, {} as Record<string, SearchOption[]>)
    : { '': filteredOptions };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-10",
            isOpen && "rounded-b-none border-b-0"
          )}
          onFocus={() => {
            if (inputValue.length >= minLength && options.length > 0) {
              setIsOpen(true);
            }
          }}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {showClear && inputValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex space-x-1 mt-2 overflow-x-auto">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange?.('')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange?.(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 right-0 z-50 bg-background border border-t-0 rounded-b-lg shadow-lg",
            "max-h-60 overflow-y-auto"
          )}
        >
          {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
            <div key={category}>
              {category && (
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                  {category}
                </div>
              )}
              {categoryOptions.map((option, index) => {
                const globalIndex = filteredOptions.findIndex(opt => opt.id === option.id);
                const isSelected = globalIndex === selectedIndex;
                
                return (
                  <button
                    key={option.id}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                      "flex items-center space-x-2",
                      isSelected && "bg-muted"
                    )}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && inputValue.length >= minLength && !loading && filteredOptions.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border border-t-0 rounded-b-lg shadow-lg">
          <div className="px-3 py-4 text-center text-muted-foreground">
            No results found for "{inputValue}"
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 