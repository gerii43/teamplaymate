
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, CreditCard, Shield, Zap, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { 
    plans, 
    currentPlan, 
    subscription, 
    loading, 
    subscribe, 
    cancelSubscription,
    hasFeature 
  } = useSubscription();
  const navigate = useNavigate();
  
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error(language === 'en' ? 'Please sign in to subscribe' : 'Por favor inicia sesión para suscribirte');
      navigate('/signin');
      return;
    }

    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    if (!selectedPlan) return;

    const success = await subscribe(selectedPlan);
    if (success) {
      setShowPaymentModal(false);
      setSelectedPlan(null);
      navigate('/dashboard');
    }
  };

  const handleCancelSubscription = async () => {
    const success = await cancelSubscription();
    if (success) {
      navigate('/dashboard');
    }
  };

  const getPlanPrice = (plan: any) => {
    if (billingInterval === 'yearly') {
      return plan.price;
    } else {
      // Monthly pricing (convert yearly to monthly)
      return Math.round(plan.price / 12);
    }
  };

  const getSavings = (plan: any) => {
    if (billingInterval === 'yearly' && plan.price > 0) {
      const monthlyPrice = Math.round(plan.price / 12);
      const yearlyTotal = monthlyPrice * 12;
      return yearlyTotal - plan.price;
    }
    return 0;
  };

  const features = [
    {
      icon: Users,
      title: language === 'en' ? 'Team Management' : 'Gestión de Equipos',
      description: language === 'en' ? 'Manage multiple teams and players' : 'Gestiona múltiples equipos y jugadores'
    },
    {
      icon: BarChart3,
      title: language === 'en' ? 'Advanced Analytics' : 'Analíticas Avanzadas',
      description: language === 'en' ? 'Detailed performance insights' : 'Insights detallados de rendimiento'
    },
    {
      icon: Zap,
      title: language === 'en' ? 'AI Assistant' : 'Asistente IA',
      description: language === 'en' ? 'Tactical AI recommendations' : 'Recomendaciones tácticas con IA'
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Priority Support' : 'Soporte Prioritario',
      description: language === 'en' ? '24/7 dedicated support' : 'Soporte dedicado 24/7'
    }
  ];

  return (
    <div className={`min-h-screen py-20 px-4 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'en' ? 'Choose Your Plan' : 'Escoge tu plan'}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {language === 'en' 
              ? "Unlock premium features to increase productivity and streamline your workflow. Choose the plan that suits you best."
              : "Desbloquea funciones premium para aumentar la productividad y agilizar tu flujo de trabajo. Elige el plan que más te convenga."
            }
          </motion.p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center items-center gap-4 mb-12"
        >
          <span className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' ? 'Monthly Billing' : 'Facturación Mensual'}
          </span>
          <Switch
            checked={billingInterval === 'yearly'}
            onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
            className="data-[state=checked]:bg-green-600"
          />
          <span className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' ? 'Annual Billing' : 'Facturación Anual'}
          </span>
          {billingInterval === 'yearly' && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {language === 'en' ? 'Save up to 60€!' : '¡Ahorras hasta 60€!'}
            </Badge>
          )}
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <Card className={`h-full border-2 transition-all duration-300 ${
                plan.popular 
                  ? 'border-green-500 shadow-2xl scale-105' 
                  : theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800' 
                    : 'border-gray-200 bg-white'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-2">
                      <Crown className="w-4 h-4 mr-1" />
                      {language === 'en' ? 'Most Popular' : 'Más Popular'}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      €{getPlanPrice(plan)}
                    </span>
                    <span className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      /{billingInterval === 'yearly' ? 'año' : 'mes'}
                    </span>
                  </div>
                  {getSavings(plan) > 0 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">
                      {language === 'en' ? `Save €${getSavings(plan)}` : `Ahorras €${getSavings(plan)}`}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.05, duration: 0.5 }}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {currentPlan?.id === plan.id ? (
                      <div className="space-y-3">
                        <Button
                          disabled
                          className="w-full bg-green-500 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'Current Plan' : 'Plan Actual'}
                        </Button>
                        {subscription?.status === 'active' && (
                          <Button
                            variant="outline"
                            onClick={handleCancelSubscription}
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? '...' : language === 'en' ? 'Cancel Subscription' : 'Cancelar Suscripción'}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loading}
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {loading && selectedPlan === plan.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            {language === 'en' ? 'Processing...' : 'Procesando...'}
                          </>
                        ) : (
                          <>
                            {plan.price === 0 
                              ? (language === 'en' ? 'Start Free Trial' : 'Comenzar Prueba Gratuita')
                              : (language === 'en' ? 'Subscribe Now' : 'Suscribirse Ahora')
                            }
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'All Plans Include' : 'Todos los Planes Incluyen'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  theme === 'dark' ? 'bg-gray-800 text-green-400' : 'bg-green-100 text-green-600'
                }`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">
            {language === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: language === 'en' ? 'Can I change my plan anytime?' : '¿Puedo cambiar mi plan en cualquier momento?',
                a: language === 'en' ? 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' : 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios tienen efecto inmediato.'
              },
              {
                q: language === 'en' ? 'Is there a free trial?' : '¿Hay una prueba gratuita?',
                a: language === 'en' ? 'Yes, all plans come with a 7-day free trial. No credit card required.' : 'Sí, todos los planes incluyen una prueba gratuita de 7 días. No se requiere tarjeta de crédito.'
              },
              {
                q: language === 'en' ? 'What payment methods do you accept?' : '¿Qué métodos de pago aceptan?',
                a: language === 'en' ? 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' : 'Aceptamos todas las tarjetas de crédito principales, PayPal y transferencias bancarias para planes anuales.'
              },
              {
                q: language === 'en' ? 'Can I cancel anytime?' : '¿Puedo cancelar en cualquier momento?',
                a: language === 'en' ? 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.' : 'Sí, puedes cancelar tu suscripción en cualquier momento. Mantendrás el acceso hasta el final de tu período de facturación.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.q}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to Get Started?' : '¿Listo para Comenzar?'}
          </h2>
          <p className={`text-lg mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' 
              ? "Join thousands of coaches who are already using Statsor to improve their team's performance."
              : "Únete a miles de entrenadores que ya están usando Statsor para mejorar el rendimiento de su equipo."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/signup')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              {language === 'en' ? 'Start Free Trial' : 'Comenzar Prueba Gratuita'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="px-8 py-3 text-lg"
            >
              {language === 'en' ? 'Learn More' : 'Saber Más'}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          plan={plans.find(p => p.id === selectedPlan)}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handlePaymentSubmit}
          loading={loading}
          language={language}
          theme={theme}
        />
      )}
    </div>
  );
};

// Payment Modal Component
interface PaymentModalProps {
  plan: any;
  onClose: () => void;
  onSubmit: (paymentData: any) => void;
  loading: boolean;
  language: string;
  theme: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  plan, 
  onClose, 
  onSubmit, 
  loading, 
  language, 
  theme 
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paymentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`max-w-md w-full p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h3 className="text-xl font-bold mb-4">
          {language === 'en' ? 'Complete Your Subscription' : 'Completa tu Suscripción'}
        </h3>
        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {language === 'en' 
            ? `Subscribe to ${plan?.name} plan for €${plan?.price}`
            : `Suscríbete al plan ${plan?.name} por €${plan?.price}`
          }
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {language === 'en' ? 'Card Number' : 'Número de Tarjeta'}
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
              className={`w-full p-3 border rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {language === 'en' ? 'Expiry Date' : 'Fecha de Vencimiento'}
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                className={`w-full p-3 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                className={`w-full p-3 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {language === 'en' ? 'Cardholder Name' : 'Nombre del Titular'}
            </label>
            <input
              type="text"
              placeholder={language === 'en' ? 'John Doe' : 'Juan Pérez'}
              value={paymentData.name}
              onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
              className={`w-full p-3 border rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {language === 'en' ? 'Processing...' : 'Procesando...'}
                </>
              ) : (
                language === 'en' ? 'Subscribe' : 'Suscribirse'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Pricing;
