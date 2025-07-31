const { supabase } = require('../config/supabase.js');
const bcrypt = require('bcryptjs');

class UserService {
  constructor() {
    this.table = 'users';
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select(`
          id,
          email,
          name,
          phone,
          location,
          bio,
          timezone,
          language,
          photo_url,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated via profile
      const { email, password, ...safeUpdateData } = updateData;

      const { data, error } = await supabase
        .from(this.table)
        .update({
          ...safeUpdateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async updateProfilePhoto(userId, photoUrl) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update({
          photo_url: photoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get current user
      const { data: user, error: fetchError } = await supabase
        .from(this.table)
        .select('password')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      const { error: updateError } = await supabase
        .from(this.table)
        .update({
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async getUserSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default settings if none exist
      if (!data) {
        return {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false
          }
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  async updateUserSettings(userId, settings) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  async getNotificationPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default preferences if none exist
      if (!data) {
        return {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          notificationTypes: {
            matchReminders: true,
            teamUpdates: true,
            playerStats: true,
            systemAlerts: true,
            marketing: false
          },
          frequency: 'immediate',
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00'
          }
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default preferences if none exist
      if (!data) {
        return {
          sport: 'football',
          favoriteTeam: null,
          favoritePlayer: null,
          preferredPosition: null,
          experienceLevel: 'beginner',
          goals: [],
          interests: []
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async getUserActivity(userId, options = {}) {
    try {
      const { page = 1, limit = 20, type } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        activities: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  async getUserSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }

  async revokeSession(userId, sessionId) {
    try {
      // Verify session belongs to user
      const { data: session, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !session) {
        throw new Error('Session not found');
      }

      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error revoking session:', error);
      throw error;
    }
  }

  async revokeAllSessions(userId) {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error revoking all sessions:', error);
      throw error;
    }
  }

  async getSecuritySettings(userId) {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default security settings if none exist
      if (!data) {
        return {
          twoFactorEnabled: false,
          twoFactorMethod: 'totp',
          loginNotifications: true,
          suspiciousActivityAlerts: true,
          passwordLastChanged: null,
          lastLogin: null,
          failedLoginAttempts: 0,
          accountLocked: false
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  }

  async updateSecuritySettings(userId, settings) {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  }

  async enableTwoFactor(userId, method = 'totp') {
    try {
      // Generate secret for TOTP
      const secret = this.generateTOTPSecret();
      const qrCode = this.generateQRCode(userId, secret);

      // Update security settings
      const { data, error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: userId,
          twoFactorEnabled: true,
          twoFactorMethod: method,
          twoFactorSecret: secret,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        secret,
        qrCode
      };
    } catch (error) {
      console.error('Error enabling two-factor authentication:', error);
      throw error;
    }
  }

  async disableTwoFactor(userId, code) {
    try {
      // Verify the code
      const isValid = await this.verifyTOTPCode(userId, code);
      if (!isValid) {
        throw new Error('Invalid verification code');
      }

      // Update security settings
      const { data, error } = await supabase
        .from('security_settings')
        .update({
          twoFactorEnabled: false,
          twoFactorSecret: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error disabling two-factor authentication:', error);
      throw error;
    }
  }

  async verifyTwoFactor(userId, code) {
    try {
      return await this.verifyTOTPCode(userId, code);
    } catch (error) {
      console.error('Error verifying two-factor authentication:', error);
      throw error;
    }
  }

  async exportUserData(userId, format = 'json') {
    try {
      // Get all user data
      const profile = await this.getUserProfile(userId);
      const settings = await this.getUserSettings(userId);
      const preferences = await this.getUserPreferences(userId);
      const notificationPrefs = await this.getNotificationPreferences(userId);
      const securitySettings = await this.getSecuritySettings(userId);

      const userData = {
        profile,
        settings,
        preferences,
        notificationPreferences: notificationPrefs,
        securitySettings,
        exportedAt: new Date().toISOString()
      };

      // Convert to requested format
      let exportData;
      switch (format) {
        case 'json':
          exportData = JSON.stringify(userData, null, 2);
          break;
        case 'csv':
          exportData = this.convertToCSV(userData);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      return {
        format,
        data: exportData,
        filename: `user_data_${userId}_${new Date().toISOString().split('T')[0]}.${format}`
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  async deleteUserAccount(userId, password, reason) {
    try {
      // Verify password
      const { data: user, error: fetchError } = await supabase
        .from(this.table)
        .select('password')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Log deletion reason
      await supabase
        .from('account_deletions')
        .insert({
          user_id: userId,
          reason,
          deleted_at: new Date().toISOString()
        });

      // Delete user data (this would cascade based on your database setup)
      const { error: deleteError } = await supabase
        .from(this.table)
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      return true;
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }

  async deactivateUserAccount(userId, reason) {
    try {
      // Update user status
      const { data, error } = await supabase
        .from(this.table)
        .update({
          status: 'deactivated',
          deactivated_at: new Date().toISOString(),
          deactivation_reason: reason
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log deactivation
      await supabase
        .from('account_deactivations')
        .insert({
          user_id: userId,
          reason,
          deactivated_at: new Date().toISOString()
        });

      return data;
    } catch (error) {
      console.error('Error deactivating user account:', error);
      throw error;
    }
  }

  async reactivateUserAccount(userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update({
          status: 'active',
          deactivated_at: null,
          deactivation_reason: null,
          reactivated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log reactivation
      await supabase
        .from('account_reactivations')
        .insert({
          user_id: userId,
          reactivated_at: new Date().toISOString()
        });

      return data;
    } catch (error) {
      console.error('Error reactivating user account:', error);
      throw error;
    }
  }

  // Helper methods for 2FA
  generateTOTPSecret() {
    // This would generate a TOTP secret
    // In a real implementation, you'd use a library like speakeasy
    return 'JBSWY3DPEHPK3PXP';
  }

  generateQRCode(userId, secret) {
    // This would generate a QR code for the TOTP secret
    // In a real implementation, you'd use a library like qrcode
    return `otpauth://totp/Statsor:${userId}?secret=${secret}&issuer=Statsor`;
  }

  async verifyTOTPCode(userId, code) {
    // This would verify a TOTP code
    // In a real implementation, you'd use a library like speakeasy
    // For now, return true for demo purposes
    return true;
  }

  convertToCSV(data) {
    // This would convert data to CSV format
    // For now, return a simple CSV string
    return 'profile,settings,preferences\n';
  }
}

module.exports = UserService; 