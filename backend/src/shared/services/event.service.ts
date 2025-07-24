import { EventEmitter as NodeEventEmitter } from 'events';
import { logger } from '../utils/logger';

export class EventEmitter {
  private emitter: NodeEventEmitter;

  constructor() {
    this.emitter = new NodeEventEmitter();
    this.emitter.setMaxListeners(100); // Increase max listeners for high-traffic events
  }

  emit(event: string, data: any): void {
    try {
      logger.debug(`Event emitted: ${event}`, data);
      this.emitter.emit(event, data);
    } catch (error) {
      logger.error(`Error emitting event ${event}:`, error);
    }
  }

  on(event: string, listener: (data: any) => void): void {
    this.emitter.on(event, listener);
    logger.debug(`Event listener registered for: ${event}`);
  }

  off(event: string, listener: (data: any) => void): void {
    this.emitter.off(event, listener);
    logger.debug(`Event listener removed for: ${event}`);
  }

  once(event: string, listener: (data: any) => void): void {
    this.emitter.once(event, listener);
    logger.debug(`One-time event listener registered for: ${event}`);
  }

  removeAllListeners(event?: string): void {
    this.emitter.removeAllListeners(event);
    logger.debug(`All listeners removed${event ? ` for: ${event}` : ''}`);
  }

  listenerCount(event: string): number {
    return this.emitter.listenerCount(event);
  }

  getEventNames(): string[] {
    return this.emitter.eventNames() as string[];
  }
}

// Global event emitter instance
export const globalEventEmitter = new EventEmitter();