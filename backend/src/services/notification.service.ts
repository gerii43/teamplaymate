/**
 * Notification Service
 * Handles push notifications, email notifications, and in-app notifications
 */

import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import emailService from './enhancedEmailService.js';
import { getEnv, getEnvBoolean } from '../../../src/utils/envValidation.js';

interface Notification {
  id?: string;
  userId: string;
  type: 'email' | 'push' | 'in_app' | 'sms';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  metadata?: Record<string, any>;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'in_app';
  subject?: string;
  title: string;
  message: string;
  variables: string[];
  isActive: boolean;
}

interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms: boolean;
  matchUpdates: boolean;
  teamUpdates: boolean;
  achievementUpdates: boolean;
  systemUpdates: boolean;
  marketingUpdates: boolean;
}

interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationService {
  private static instance: NotificationService;
  private templates: Map<string, NotificationTemplate> = new Map();
  private webPush: any = null;

  private constructor() {
    this.initializeTemplates();
    this.initializeWebPush();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification templates
   */
  private async initializeTemplates(): Promise<void> {
    try {
      const { data: templates } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('is_active', true);

      if (templates) {
        templates.forEach(template => {
          this.templates.set(template.id, template);
        });
      }

      logger.info(`Loaded ${this.templates.size} notification templates`);
    } catch (error) {
      logger.error('Error loading notification templates:', error);
    }
  }

  /**
   * Initialize Web Push notifications
   */
  private async initializeWebPush(): Promise<void> {
    try {
      if (getEnvBoolean('ENABLE_PUSH_NOTIFICATIONS', true)) {
        // This would typically use web-push library
        // For now, we'll use a placeholder
        this.webPush = {
          sendNotification: async (subscription: any, payload: any) => {
            logger.info('Sending push notification:', { subscription, payload });
            return { statusCode: 200 };
          }
        };
      }
    } catch (error) {
      logger.error('Error initializing Web Push:', error);
    }
  }

  /**
   * Send notification to a user
   */
  async sendNotification(notification: Omit<Notification, 'id' | 'status' | 'sentAt'>): Promise<string> {
    try {
      // Create notification record
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority,
          status: 'pending',
          scheduled_at: notification.scheduledAt?.toISOString(),
          metadata: notification.metadata
        })
        .select('id')
        .single();

      if (error) {
        logger.error('Failed to create notification record:', error);
        throw error;
      }

      const notificationId = data.id;

      // Check user preferences
      const preferences = await this.getUserPreferences(notification.userId);
      if (!preferences[notification.type === 'in_app' ? 'inApp' : notification.type]) {
        logger.info(`Notification type ${notification.type} disabled for user ${notification.userId}`);
        return notificationId;
      }

      // Send notification based on type
      switch (notification.type) {
        case 'email':
          await this.sendEmailNotification(notificationId, { ...notification, status: 'pending' });
          break;
        case 'push':
          await this.sendPushNotification(notificationId, { ...notification, status: 'pending' });
          break;
        case 'in_app':
          await this.sendInAppNotification(notificationId, { ...notification, status: 'pending' });
          break;
        case 'sms':
          await this.sendSMSNotification(notificationId, { ...notification, status: 'pending' });
          break;
      }

      return notificationId;
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send notification using template
   */
  async sendTemplateNotification(
    templateId: string,
    userId: string,
    variables: Record<string, any>,
    type: 'email' | 'push' | 'in_app' = 'in_app'
  ): Promise<string> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      if (template.type !== type) {
        throw new Error(`Template type ${template.type} doesn't match requested type ${type}`);
      }

      // Replace variables in template
      let title = template.title;
      let message = template.message;
      let subject = template.subject;

      for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        title = title.replace(new RegExp(placeholder, 'g'), value);
        message = message.replace(new RegExp(placeholder, 'g'), value);
        if (subject) {
          subject = subject.replace(new RegExp(placeholder, 'g'), value);
        }
      }

      return await this.sendNotification({
        userId,
        type,
        title,
        message,
        data: variables,
        priority: 'normal',
        metadata: { templateId }
      });
    } catch (error) {
      logger.error('Error sending template notification:', error);
      throw error;
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(
    notifications: Array<Omit<Notification, 'id' | 'status' | 'sentAt'>>
  ): Promise<string[]> {
    try {
      const results = await Promise.allSettled(
        notifications.map(notification => this.sendNotification(notification))
      );

      const successful: string[] = [];
      const failed: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value);
        } else {
          failed.push(notifications[index].userId);
          logger.error(`Failed to send notification to user ${notifications[index].userId}:`, result.reason);
        }
      });

      logger.info(`Bulk notification results: ${successful.length} successful, ${failed.length} failed`);
      return successful;
    } catch (error) {
      logger.error('Error sending bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // Get user email
      const { data: user } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', notification.userId)
        .single();

      if (!user?.email) {
        throw new Error(`User ${notification.userId} has no email address`);
      }

      // Send email
      await emailService.sendEmail({
        to: user.email,
        subject: notification.title,
        template: 'notification',
        context: {
          name: user.name,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          actionUrl: notification.data?.actionUrl,
          unsubscribeUrl: notification.data?.unsubscribeUrl
        }
      });

      // Update notification status
      await this.updateNotificationStatus(notificationId, 'sent');
    } catch (error) {
      logger.error('Error sending email notification:', error);
      await this.updateNotificationStatus(notificationId, 'failed');
      throw error;
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      if (!this.webPush) {
        throw new Error('Web Push not initialized');
      }

      // Get user's push subscriptions
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', notification.userId)
        .eq('is_active', true);

      if (!subscriptions || subscriptions.length === 0) {
        logger.info(`No active push subscriptions for user ${notification.userId}`);
        await this.updateNotificationStatus(notificationId, 'failed');
        return;
      }

      const payload: PushNotificationPayload = {
        title: notification.title,
        body: notification.message,
        data: notification.data,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: notification.data?.tag,
        requireInteraction: notification.priority === 'urgent',
        actions: notification.data?.actions
      };

      // Send to all user's devices
      const results = await Promise.allSettled(
        subscriptions.map(subscription =>
          this.webPush.sendNotification(subscription.subscription, JSON.stringify(payload))
        )
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      logger.info(`Push notification results: ${successful} successful, ${failed} failed`);

      if (successful > 0) {
        await this.updateNotificationStatus(notificationId, 'sent');
      } else {
        await this.updateNotificationStatus(notificationId, 'failed');
      }
    } catch (error) {
      logger.error('Error sending push notification:', error);
      await this.updateNotificationStatus(notificationId, 'failed');
      throw error;
    }
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // In-app notifications are stored in the database and retrieved by the frontend
      // Update status to sent immediately
      await this.updateNotificationStatus(notificationId, 'sent');
      
      logger.info(`In-app notification sent: ${notificationId}`);
    } catch (error) {
      logger.error('Error sending in-app notification:', error);
      await this.updateNotificationStatus(notificationId, 'failed');
      throw error;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(notificationId: string, notification: Notification): Promise<void> {
    try {
      // Get user's phone number
      const { data: user } = await supabase
        .from('users')
        .select('phone')
        .eq('id', notification.userId)
        .single();

      if (!user?.phone) {
        throw new Error(`User ${notification.userId} has no phone number`);
      }

      // This would typically use an SMS service like Twilio
      // For now, we'll log the SMS
      logger.info('SMS notification:', {
        to: user.phone,
        message: notification.message
      });

      await this.updateNotificationStatus(notificationId, 'sent');
    } catch (error) {
      logger.error('Error sending SMS notification:', error);
      await this.updateNotificationStatus(notificationId, 'failed');
      throw error;
    }
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: 'all' | 'unread' | 'read';
      type?: string;
    } = {}
  ): Promise<{ notifications: Notification[]; total: number }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.status === 'unread') {
        query = query.is('read_at', null);
      } else if (options.status === 'read') {
        query = query.not('read_at', 'is', null);
      }

      if (options.type) {
        query = query.eq('type', options.type);
      }

      if (options.limit) {
        query = query.range(options.offset || 0, (options.offset || 0) + options.limit - 1);
      }

      const { data, count, error } = await query;

      if (error) {
        throw error;
      }

      return {
        notifications: data || [],
        total: count || 0
      };
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      logger.info(`Notification ${notificationId} marked as read`);
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null);

      if (error) {
        throw error;
      }

      logger.info(`All notifications marked as read for user ${userId}`);
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      logger.info(`Notification ${notificationId} deleted`);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (!data) {
        // Return default preferences
        return {
          userId,
          email: true,
          push: true,
          inApp: true,
          sms: false,
          matchUpdates: true,
          teamUpdates: true,
          achievementUpdates: true,
          systemUpdates: true,
          marketingUpdates: false
        };
      }

      return data;
    } catch (error) {
      logger.error('Error getting user notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        });

      if (error) {
        throw error;
      }

      logger.info(`Notification preferences updated for user ${userId}`);
    } catch (error) {
      logger.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(userId: string, subscription: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          subscription: subscription,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      logger.info(`User ${userId} subscribed to push notifications`);
    } catch (error) {
      logger.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(userId: string, subscription: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('subscription', subscription);

      if (error) {
        throw error;
      }

      logger.info(`User ${userId} unsubscribed from push notifications`);
    } catch (error) {
      logger.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    read: number;
    byType: Record<string, number>;
  }> {
    try {
      const { data: notifications } = await supabase
        .from('notifications')
        .select('type, read_at')
        .eq('user_id', userId);

      if (!notifications) {
        return { total: 0, unread: 0, read: 0, byType: {} };
      }

      const total = notifications.length;
      const unread = notifications.filter(n => !n.read_at).length;
      const read = total - unread;

      const byType = notifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { total, unread, read, byType };
    } catch (error) {
      logger.error('Error getting notification statistics:', error);
      throw error;
    }
  }

  /**
   * Update notification status
   */
  private async updateNotificationStatus(notificationId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          status,
          sent_at: status === 'sent' ? new Date().toISOString() : null
        })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Error updating notification status:', error);
      throw error;
    }
  }

  /**
   * Clean up old notifications
   */
  async cleanupOldNotifications(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { count, error } = await supabase
        .from('notifications')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      logger.info(`Cleaned up ${count} old notifications`);
      return count || 0;
    } catch (error) {
      logger.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Export for direct use
export default notificationService; 