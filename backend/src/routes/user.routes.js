const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { rateLimit } = require('../middleware/rateLimit.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

// Import services
const UserService = require('../services/user.service');
const userService = new UserService();

// Validation rules
const profileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('location').optional().isLength({ max: 100 }).withMessage('Location too long'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio too long'),
  body('timezone').optional().isLength({ max: 50 }).withMessage('Invalid timezone'),
  body('language').optional().isIn(['en', 'es']).withMessage('Invalid language')
];

const passwordValidation = [
  body('currentPassword').isLength({ min: 6 }).withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
];

const notificationValidation = [
  body('emailNotifications').optional().isBoolean().withMessage('Invalid email notifications setting'),
  body('pushNotifications').optional().isBoolean().withMessage('Invalid push notifications setting'),
  body('smsNotifications').optional().isBoolean().withMessage('Invalid SMS notifications setting'),
  body('notificationTypes').optional().isArray().withMessage('Notification types must be an array')
];

// GET /api/user/profile - Get user profile
router.get('/profile', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await userService.getUserProfile(userId);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', authenticateToken, rateLimit, profileValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedProfile = await userService.updateUserProfile(userId, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
});

// POST /api/user/profile/photo - Upload profile photo
router.post('/profile/photo', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoUrl } = req.body;

    const updatedProfile = await userService.updateProfilePhoto(userId, photoUrl);

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile photo',
      error: error.message
    });
  }
});

// PUT /api/user/password - Change password
router.put('/password', authenticateToken, rateLimit, passwordValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// GET /api/user/settings - Get user settings
router.get('/settings', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await userService.getUserSettings(userId);

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user settings',
      error: error.message
    });
  }
});

// PUT /api/user/settings - Update user settings
router.put('/settings', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const updatedSettings = await userService.updateUserSettings(userId, settings);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user settings',
      error: error.message
    });
  }
});

// GET /api/user/notifications - Get notification preferences
router.get('/notifications', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await userService.getNotificationPreferences(userId);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification preferences',
      error: error.message
    });
  }
});

// PUT /api/user/notifications - Update notification preferences
router.put('/notifications', authenticateToken, rateLimit, notificationValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    const updatedPreferences = await userService.updateNotificationPreferences(userId, preferences);

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
});

// GET /api/user/preferences - Get user preferences
router.get('/preferences', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await userService.getUserPreferences(userId);

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user preferences',
      error: error.message
    });
  }
});

// PUT /api/user/preferences - Update user preferences
router.put('/preferences', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    const updatedPreferences = await userService.updateUserPreferences(userId, preferences);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user preferences',
      error: error.message
    });
  }
});

// GET /api/user/activity - Get user activity
router.get('/activity', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type } = req.query;

    const activity = await userService.getUserActivity(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      type
    });

    res.json({
      success: true,
      data: activity,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activity.length
      }
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message
    });
  }
});

// GET /api/user/sessions - Get user sessions
router.get('/sessions', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await userService.getUserSessions(userId);

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user sessions',
      error: error.message
    });
  }
});

// DELETE /api/user/sessions/:sessionId - Revoke session
router.delete('/sessions/:sessionId', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    await userService.revokeSession(userId, sessionId);

    res.json({
      success: true,
      message: 'Session revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke session',
      error: error.message
    });
  }
});

// POST /api/user/sessions/revoke-all - Revoke all sessions except current
router.post('/sessions/revoke-all', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;

    await userService.revokeAllSessions(userId);

    res.json({
      success: true,
      message: 'All sessions revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking all sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke all sessions',
      error: error.message
    });
  }
});

// GET /api/user/security - Get security settings
router.get('/security', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const security = await userService.getSecuritySettings(userId);

    res.json({
      success: true,
      data: security
    });
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security settings',
      error: error.message
    });
  }
});

// PUT /api/user/security - Update security settings
router.put('/security', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const security = req.body;

    const updatedSecurity = await userService.updateSecuritySettings(userId, security);

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: updatedSecurity
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings',
      error: error.message
    });
  }
});

// POST /api/user/security/enable-2fa - Enable two-factor authentication
router.post('/security/enable-2fa', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { method = 'totp' } = req.body;

    const twoFactorData = await userService.enableTwoFactor(userId, method);

    res.json({
      success: true,
      message: 'Two-factor authentication enabled successfully',
      data: twoFactorData
    });
  } catch (error) {
    console.error('Error enabling two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable two-factor authentication',
      error: error.message
    });
  }
});

// POST /api/user/security/disable-2fa - Disable two-factor authentication
router.post('/security/disable-2fa', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    await userService.disableTwoFactor(userId, code);

    res.json({
      success: true,
      message: 'Two-factor authentication disabled successfully'
    });
  } catch (error) {
    console.error('Error disabling two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable two-factor authentication',
      error: error.message
    });
  }
});

// POST /api/user/security/verify-2fa - Verify two-factor authentication
router.post('/security/verify-2fa', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    const verified = await userService.verifyTwoFactor(userId, code);

    res.json({
      success: true,
      message: 'Two-factor authentication verified successfully',
      data: { verified }
    });
  } catch (error) {
    console.error('Error verifying two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify two-factor authentication',
      error: error.message
    });
  }
});

// GET /api/user/export - Export user data
router.get('/export', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { format = 'json' } = req.query;

    const exportData = await userService.exportUserData(userId, format);

    res.json({
      success: true,
      message: 'User data exported successfully',
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export user data',
      error: error.message
    });
  }
});

// DELETE /api/user/account - Delete user account
router.delete('/account', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, reason } = req.body;

    await userService.deleteUserAccount(userId, password, reason);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account',
      error: error.message
    });
  }
});

// POST /api/user/account/deactivate - Deactivate user account
router.post('/account/deactivate', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    await userService.deactivateUserAccount(userId, reason);

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating user account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user account',
      error: error.message
    });
  }
});

// POST /api/user/account/reactivate - Reactivate user account
router.post('/account/reactivate', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;

    await userService.reactivateUserAccount(userId);

    res.json({
      success: true,
      message: 'Account reactivated successfully'
    });
  } catch (error) {
    console.error('Error reactivating user account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate user account',
      error: error.message
    });
  }
});

module.exports = router; 