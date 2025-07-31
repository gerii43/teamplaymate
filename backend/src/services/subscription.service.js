const { supabase } = require('../config/supabase.js');
const Stripe = require('stripe');

class SubscriptionService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.table = 'subscriptions';
  }

  async getAvailablePlans() {
    try {
      const plans = [
        {
          id: 'starter',
          name: 'Starter',
          price: 0,
          currency: 'EUR',
          interval: 'month',
          features: [
            '1 Team',
            'Up to 15 Players',
            'Basic Analytics',
            'Email Support'
          ],
          maxTeams: 1,
          maxPlayers: 15,
          aiAccess: false,
          advancedAnalytics: false,
          prioritySupport: false
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 299,
          currency: 'EUR',
          interval: 'year',
          features: [
            'Up to 5 Teams',
            'Up to 50 Players per Team',
            'Advanced Analytics',
            'AI Assistant',
            'Priority Support',
            'Export Reports'
          ],
          maxTeams: 5,
          maxPlayers: 50,
          aiAccess: true,
          advancedAnalytics: true,
          prioritySupport: true
        },
        {
          id: 'club',
          name: 'Club',
          price: 250,
          currency: 'EUR',
          interval: 'month',
          features: [
            'Unlimited Teams',
            'Unlimited Players',
            'Premium Analytics',
            'Advanced AI Assistant',
            '24/7 Support',
            'Custom Reports',
            'API Access',
            'White-label Options'
          ],
          maxTeams: -1, // Unlimited
          maxPlayers: -1, // Unlimited
          aiAccess: true,
          advancedAnalytics: true,
          prioritySupport: true
        }
      ];

      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }

  async getCurrentSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Return free plan if no active subscription
        const plans = await this.getAvailablePlans();
        return {
          plan: plans[0], // Starter plan
          status: 'active',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        };
      }

      // Get plan details
      const plans = await this.getAvailablePlans();
      const plan = plans.find(p => p.id === data.plan_id);

      return {
        ...data,
        plan
      };
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error;
    }
  }

  async createSubscription(userId, subscriptionData) {
    try {
      const { planId, paymentMethodId, billingCycle = 'monthly' } = subscriptionData;

      // Get plan details
      const plans = await this.getAvailablePlans();
      const plan = plans.find(p => p.id === planId);

      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      if (plan.price === 0) {
        // Free plan - create subscription record
        const { data, error } = await supabase
          .from(this.table)
          .insert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
            stripe_subscription_id: null,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Paid plan - create Stripe subscription
      const customer = await this.getOrCreateCustomer(userId);

      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: this.getStripePriceId(planId, billingCycle) }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        default_payment_method: paymentMethodId
      });

      // Save subscription to database
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          user_id: userId,
          plan_id: planId,
          status: subscription.status,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customer.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        stripeSubscription: subscription
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(userId, cancelAtPeriodEnd = true) {
    try {
      const subscription = await this.getCurrentSubscription(userId);

      if (!subscription.stripe_subscription_id) {
        // Free plan - just update status
        const { data, error } = await supabase
          .from(this.table)
          .update({
            status: 'canceled',
            cancel_at_period_end: true
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Paid plan - cancel in Stripe
      const stripeSubscription = await this.stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        {
          cancel_at_period_end: cancelAtPeriodEnd
        }
      );

      // Update database
      const { data, error } = await supabase
        .from(this.table)
        .update({
          status: cancelAtPeriodEnd ? 'active' : 'canceled',
          cancel_at_period_end: cancelAtPeriodEnd
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        stripeSubscription
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  async upgradeSubscription(userId, upgradeData) {
    try {
      const { planId, paymentMethodId } = upgradeData;

      const currentSubscription = await this.getCurrentSubscription(userId);

      if (!currentSubscription.stripe_subscription_id) {
        // Upgrade from free plan
        return await this.createSubscription(userId, upgradeData);
      }

      // Upgrade existing paid subscription
      const plans = await this.getAvailablePlans();
      const newPlan = plans.find(p => p.id === planId);

      if (!newPlan) {
        throw new Error('Invalid plan ID');
      }

      const stripeSubscription = await this.stripe.subscriptions.update(
        currentSubscription.stripe_subscription_id,
        {
          items: [{
            id: currentSubscription.stripe_subscription_id,
            price: this.getStripePriceId(planId, 'monthly')
          }],
          proration_behavior: 'create_prorations'
        }
      );

      // Update database
      const { data, error } = await supabase
        .from(this.table)
        .update({
          plan_id: planId,
          current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        stripeSubscription
      };
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  }

  async reactivateSubscription(userId) {
    try {
      const subscription = await this.getCurrentSubscription(userId);

      if (!subscription.stripe_subscription_id) {
        throw new Error('No paid subscription to reactivate');
      }

      const stripeSubscription = await this.stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        {
          cancel_at_period_end: false
        }
      );

      // Update database
      const { data, error } = await supabase
        .from(this.table)
        .update({
          status: 'active',
          cancel_at_period_end: false
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        stripeSubscription
      };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  async getInvoices(userId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const subscription = await this.getCurrentSubscription(userId);

      if (!subscription.stripe_customer_id) {
        return {
          invoices: [],
          pagination: { page, limit, total: 0 }
        };
      }

      const invoices = await this.stripe.invoices.list({
        customer: subscription.stripe_customer_id,
        limit,
        starting_after: offset > 0 ? offset.toString() : undefined
      });

      return {
        invoices: invoices.data,
        pagination: {
          page,
          limit,
          total: invoices.total_count
        }
      };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async getUsage(userId, period = 'current') {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      const plans = await this.getAvailablePlans();
      const plan = plans.find(p => p.id === subscription.plan_id);

      // Get usage statistics from database
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id')
        .eq('user_id', userId);

      if (teamsError) throw teamsError;

      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id')
        .in('team_id', teams.map(t => t.id));

      if (playersError) throw playersError;

      return {
        plan: plan.name,
        limits: {
          teams: plan.maxTeams,
          players: plan.maxPlayers
        },
        usage: {
          teams: teams.length,
          players: players.length
        },
        remaining: {
          teams: plan.maxTeams === -1 ? -1 : Math.max(0, plan.maxTeams - teams.length),
          players: plan.maxPlayers === -1 ? -1 : Math.max(0, plan.maxPlayers - players.length)
        }
      };
    } catch (error) {
      console.error('Error fetching usage:', error);
      throw error;
    }
  }

  async startTrial(userId, planId) {
    try {
      const plans = await this.getAvailablePlans();
      const plan = plans.find(p => p.id === planId);

      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      // Create trial subscription
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'trialing',
          trial_start: new Date().toISOString(),
          trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
          cancel_at_period_end: false
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        plan
      };
    } catch (error) {
      console.error('Error starting trial:', error);
      throw error;
    }
  }

  async getTrialStatus(userId) {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'trialing')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return {
          hasTrial: false,
          trialEnd: null,
          daysRemaining: 0
        };
      }

      const trialEnd = new Date(data.trial_end);
      const now = new Date();
      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

      return {
        hasTrial: true,
        trialEnd: data.trial_end,
        daysRemaining: Math.max(0, daysRemaining)
      };
    } catch (error) {
      console.error('Error fetching trial status:', error);
      throw error;
    }
  }

  async getOrCreateCustomer(userId) {
    try {
      // Check if customer exists
      const { data: subscription, error } = await supabase
        .from(this.table)
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

  getStripePriceId(planId, interval) {
    // This should be configured based on your Stripe price IDs
    const priceIds = {
      'pro-monthly': process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      'pro-yearly': process.env.STRIPE_PRO_YEARLY_PRICE_ID,
      'club-monthly': process.env.STRIPE_CLUB_MONTHLY_PRICE_ID,
      'club-yearly': process.env.STRIPE_CLUB_YEARLY_PRICE_ID
    };

    const key = `${planId}-${interval}`;
    return priceIds[key];
  }
}

module.exports = SubscriptionService; 