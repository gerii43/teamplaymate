const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { rateLimit } = require('../middleware/rateLimit.middleware');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

// Import services
const SubscriptionService = require('../services/subscription.service');
const PaymentService = require('../services/payment.service');
const subscriptionService = new SubscriptionService();
const paymentService = new PaymentService();

// Validation rules
const subscriptionValidation = [
  body('planId').isString().notEmpty().withMessage('Plan ID is required'),
  body('paymentMethodId').optional().isString().withMessage('Invalid payment method ID'),
  body('billingCycle').optional().isIn(['monthly', 'yearly']).withMessage('Invalid billing cycle')
];

const paymentMethodValidation = [
  body('type').isIn(['card', 'paypal']).withMessage('Invalid payment method type'),
  body('cardNumber').optional().isCreditCard().withMessage('Invalid card number'),
  body('expiryMonth').optional().isInt({ min: 1, max: 12 }).withMessage('Invalid expiry month'),
  body('expiryYear').optional().isInt({ min: new Date().getFullYear() }).withMessage('Invalid expiry year'),
  body('cvv').optional().isLength({ min: 3, max: 4 }).withMessage('Invalid CVV')
];

// GET /api/subscriptions/plans - Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await subscriptionService.getAvailablePlans();
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error.message
    });
  }
});

// GET /api/subscriptions/current - Get current user subscription
router.get('/current', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = await subscriptionService.getCurrentSubscription(userId);
    
    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current subscription',
      error: error.message
    });
  }
});

// POST /api/subscriptions/create - Create new subscription
router.post('/create', authenticateToken, rateLimit, subscriptionValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, paymentMethodId, billingCycle = 'monthly' } = req.body;

    const subscription = await subscriptionService.createSubscription(userId, {
      planId,
      paymentMethodId,
      billingCycle
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message
    });
  }
});

// POST /api/subscriptions/cancel - Cancel subscription
router.post('/cancel', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cancelAtPeriodEnd = true } = req.body;

    const result = await subscriptionService.cancelSubscription(userId, cancelAtPeriodEnd);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: result
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
});

// POST /api/subscriptions/upgrade - Upgrade subscription
router.post('/upgrade', authenticateToken, rateLimit, subscriptionValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, paymentMethodId } = req.body;

    const subscription = await subscriptionService.upgradeSubscription(userId, {
      planId,
      paymentMethodId
    });

    res.json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upgrade subscription',
      error: error.message
    });
  }
});

// POST /api/subscriptions/reactivate - Reactivate cancelled subscription
router.post('/reactivate', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await subscriptionService.reactivateSubscription(userId);

    res.json({
      success: true,
      message: 'Subscription reactivated successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate subscription',
      error: error.message
    });
  }
});

// GET /api/subscriptions/invoices - Get subscription invoices
router.get('/invoices', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const invoices = await subscriptionService.getInvoices(userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: invoices.length
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
});

// GET /api/subscriptions/usage - Get subscription usage
router.get('/usage', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'current' } = req.query;

    const usage = await subscriptionService.getUsage(userId, period);

    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage',
      error: error.message
    });
  }
});

// Payment Methods Routes

// GET /api/subscriptions/payment-methods - Get user payment methods
router.get('/payment-methods', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentMethods = await paymentService.getPaymentMethods(userId);

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: error.message
    });
  }
});

// POST /api/subscriptions/payment-methods - Add payment method
router.post('/payment-methods', authenticateToken, rateLimit, paymentMethodValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentData = req.body;

    const paymentMethod = await paymentService.addPaymentMethod(userId, paymentData);

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      data: paymentMethod
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add payment method',
      error: error.message
    });
  }
});

// PUT /api/subscriptions/payment-methods/:id - Update payment method
router.put('/payment-methods/:id', authenticateToken, rateLimit, paymentMethodValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const paymentMethod = await paymentService.updatePaymentMethod(userId, id, updateData);

    res.json({
      success: true,
      message: 'Payment method updated successfully',
      data: paymentMethod
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment method',
      error: error.message
    });
  }
});

// DELETE /api/subscriptions/payment-methods/:id - Delete payment method
router.delete('/payment-methods/:id', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await paymentService.deletePaymentMethod(userId, id);

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method',
      error: error.message
    });
  }
});

// POST /api/subscriptions/payment-methods/:id/default - Set default payment method
router.post('/payment-methods/:id/default', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await paymentService.setDefaultPaymentMethod(userId, id);

    res.json({
      success: true,
      message: 'Default payment method updated successfully'
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default payment method',
      error: error.message
    });
  }
});

// Webhook Routes

// POST /api/subscriptions/webhooks/stripe - Stripe webhook
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = await paymentService.handleStripeWebhook(req.body, signature);

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook error',
      error: error.message
    });
  }
});

// POST /api/subscriptions/webhooks/paypal - PayPal webhook
router.post('/webhooks/paypal', async (req, res) => {
  try {
    const event = await paymentService.handlePayPalWebhook(req.body);

    res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook error',
      error: error.message
    });
  }
});

// Trial Routes

// POST /api/subscriptions/trial/start - Start free trial
router.post('/trial/start', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    const trial = await subscriptionService.startTrial(userId, planId);

    res.json({
      success: true,
      message: 'Free trial started successfully',
      data: trial
    });
  } catch (error) {
    console.error('Error starting trial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start trial',
      error: error.message
    });
  }
});

// GET /api/subscriptions/trial/status - Get trial status
router.get('/trial/status', authenticateToken, rateLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const trialStatus = await subscriptionService.getTrialStatus(userId);

    res.json({
      success: true,
      data: trialStatus
    });
  } catch (error) {
    console.error('Error fetching trial status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trial status',
      error: error.message
    });
  }
});

module.exports = router; 