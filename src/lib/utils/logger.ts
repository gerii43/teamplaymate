export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  error?: Error;
}

export class Logger {
  private component: string;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(component: string, logLevel: LogLevel = LogLevel.INFO) {
    this.component = component;
    this.logLevel = logLevel;
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, undefined, error);
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      data,
      error
    };

    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.outputToConsole(entry);

    // Store in localStorage for persistence
    this.persistLogs();
  }

  private outputToConsole(entry: LogEntry): void {
    const { timestamp, level, component, message, data, error } = entry;
    const prefix = `[${timestamp}] [${component}] [${LogLevel[level]}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data);
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, data, error);
        break;
    }
  }

  private persistLogs(): void {
    try {
      const recentLogs = this.logs.slice(-100); // Keep only 100 most recent logs
      localStorage.setItem(`logs_${this.component}`, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to persist logs', error);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(`logs_${this.component}`);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  static getAllLogs(): LogEntry[] {
    const allLogs: LogEntry[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('logs_')) {
        try {
          const logs = JSON.parse(localStorage.getItem(key) || '[]');
          allLogs.push(...logs);
        } catch (error) {
          console.error(`Failed to parse logs for ${key}`, error);
        }
      }
    }
    
    return allLogs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  static clearAllLogs(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('logs_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}