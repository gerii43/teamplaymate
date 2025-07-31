const { supabase } = require('../config/supabase.js');
const Stripe = require('stripe');

class PaymentService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.table = 'payment_methods';
  }

  async getPaymentMethods(userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async addPaymentMethod(userId, paymentData) {
    try {
      const { type, cardNumber, expiryMonth, expiryYear, cvv } = paymentData;

      if (type === 'card') {
        // Create payment method in Stripe
        const paymentMethod = await this.stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: cardNumber,
            exp_month: parseInt(expiryMonth),
            exp_year: parseInt(expiryYear),
            cvc: cvv
          }
        });

        // Get customer
        const customer = await this.getOrCreateCustomer(userId);

        // Attach payment method to customer
        await this.stripe.paymentMethods.attach(paymentMethod.id, {
          customer: customer.id
        });

        // Save to database
        const { data, error } = await supabase
          .from(this.table)
          .insert({
            user_id: userId,
            stripe_payment_method_id: paymentMethod.id,
            type: 'card',
            last4: paymentMethod.card.last4,
            brand: paymentMethod.card.brand,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
            is_default: false
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else if (type === 'paypal') {
        // Handle PayPal payment method
        const { data, error } = await supabase
          .from(this.table)
          .insert({
            user_id: userId,
            type: 'paypal',
            paypal_email: paymentData.email,
            is_default: false
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      throw new Error('Unsupported payment method type');
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  async updatePaymentMethod(userId, paymentMethodId, updateData) {
    try {
      // Verify payment method belongs to user
      const { data: existingMethod, error: fetchError } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !existingMethod) {
        throw new Error('Payment method not found');
      }

      if (existingMethod.stripe_payment_method_id) {
        // Update in Stripe
        await this.stripe.paymentMethods.update(existingMethod.stripe_payment_method_id, {
          card: {
            exp_month: updateData.expiryMonth,
            exp_year: updateData.expiryYear
          }
        });
      }

      // Update in database
      const { data, error } = await supabase
        .from(this.table)
        .update({
          exp_month: updateData.expiryMonth,
          exp_year: updateData.expiryYear
        })
        .eq('id', paymentMethodId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  async deletePaymentMethod(userId, paymentMethodId) {
    try {
      // Verify payment method belongs to user
      const { data: existingMethod, error: fetchError } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !existingMethod) {
        throw new Error('Payment method not found');
      }

      if (existingMethod.stripe_payment_method_id) {
        // Detach from Stripe
        await this.stripe.paymentMethods.detach(existingMethod.stripe_payment_method_id);
      }

      // Delete from database
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', paymentMethodId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(userId, paymentMethodId) {
    try {
      // Verify payment method belongs to user
      const { data: existingMethod, error: fetchError } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !existingMethod) {
        throw new Error('Payment method not found');
      }

      // Remove default from all other payment methods
      await supabase
        .from(this.table)
        .update({ is_default: false })
        .eq('user_id', userId);

      // Set as default
      const { data, error } = await supabase
        .from(this.table)
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .select()
        .single();

      if (error) throw error;

      // Update default payment method in Stripe customer
      if (existingMethod.stripe_payment_method_id) {
        const customer = await this.getOrCreateCustomer(userId);
        await this.stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: existingMethod.stripe_payment_method_id
          }
        });
      }

      return data;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  async handleStripeWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return event;
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }

  async handlePayPalWebhook(payload) {
    try {
      // Implement PayPal webhook handling
      // This would depend on your PayPal integration
      console.log('PayPal webhook received:', payload);
      return payload;
    } catch (error) {
      console.error('Error handling PayPal webhook:', error);
      throw error;
    }
  }

  async handlePaymentSucceeded(paymentIntent) {
    try {
      console.log('Payment succeeded:', paymentIntent.id);
      // Update order status, send confirmation email, etc.
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
    }
  }

  async handlePaymentFailed(paymentIntent) {
    try {
      console.log('Payment failed:', paymentIntent.id);
      // Update order status, send failure notification, etc.
    } catch (error) {
      console.error('Error handling payment failed:', error);
    }
  }

  async handleSubscriptionCreated(subscription) {
    try {
      console.log('Subscription created:', subscription.id);
      
      // Update subscription status in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error handling subscription created:', error);
    }
  }

  async handleSubscriptionUpdated(subscription) {
    try {
      console.log('Subscription updated:', subscription.id);
      
      // Update subscription in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  }

  async handleSubscriptionDeleted(subscription) {
    try {
      console.log('Subscription deleted:', subscription.id);
      
      // Update subscription status in database
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error handling subscription deleted:', error);
    }
  }

  async handleInvoicePaymentSucceeded(invoice) {
    try {
      console.log('Invoice payment succeeded:', invoice.id);
      // Handle successful invoice payment
    } catch (error) {
      console.error('Error handling invoice payment succeeded:', error);
    }
  }

  async handleInvoicePaymentFailed(invoice) {
    try {
      console.log('Invoice payment failed:', invoice.id);
      // Handle failed invoice payment
    } catch (error) {
      console.error('Error handling invoice payment failed:', error);
    }
  }

  async getOrCreateCustomer(userId) {
    try {
      // Check if customer exists
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .not('stripe_customer_id', 'is', null)
        .single();

      if (subscription?.stripe_customer_id) {
        return await this.stripe.customers.retrieve(subscription.stripe_customer_id);
      }

      // Get user details
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Create new customer
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          user_id: userId
        }
      });

      return customer;
    } catch (error) {
      console.error('Error getting or creating customer:', error);
      throw error;
    }
  }
}

module.exports = PaymentService; 