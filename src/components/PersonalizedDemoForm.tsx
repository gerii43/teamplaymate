import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Headphones, Users } from 'lucide-react';

export const PersonalizedDemoForm: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    club: '',
    modality: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const features = [
    {
      icon: CheckCircle,
      title: language === 'en' ? 'Personalized Demo' : 'Demo personalizada',
      description: language === 'en' ? 'Tailored to your specific needs' : 'Adaptada a tus necesidades específicas'
    },
    {
      icon: Clock,
      title: language === 'en' ? '14-Day Trial' : '14 días de prueba',
      description: language === 'en' ? 'Full access to all features' : 'Acceso completo a todas las funciones'
    },
    {
      icon: Headphones,
      title: language === 'en' ? 'Technical Support' : 'Soporte técnico',
      description: language === 'en' ? 'Expert assistance throughout' : 'Asistencia experta durante todo el proceso'
    },
    {
      icon: Users,
      title: language === 'en' ? 'Implementation Advisory' : 'Asesoría de implementación',
      description: language === 'en' ? 'Guidance for successful setup' : 'Orientación para una configuración exitosa'
    }
  ];

  const modalities = [
    { value: 'football-11', label: language === 'en' ? 'Football 11-a-side' : 'Fútbol 11' },
    { value: 'futsal', label: 'Futsal' },
    { value: 'football-7', label: language === 'en' ? 'Football 7-a-side' : 'Fútbol 7' },
    { value: 'other', label: language === 'en' ? 'Other' : 'Otro' }
  ];

  if (isSubmitted) {
    return (
      <section className={`py-20 px-4 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gradient-to-br from-green-50 to-blue-50 text-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {language === 'en' ? 'Thank You!' : '¡Gracias!'}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl mb-8"
          >
            {language === 'en' 
              ? "We've received your demo request. Our team will contact you within 24 hours to schedule your personalized demonstration."
              : "Hemos recibido tu solicitud de demo. Nuestro equipo te contactará en las próximas 24 horas para programar tu demostración personalizada."
            }
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-full"
            >
              {language === 'en' ? 'Request Another Demo' : 'Solicitar Otra Demo'}
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 px-4 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-green-50 to-blue-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'en' ? 'Request Your Personalized Demo' : 'Solicita tu demo personalizada'}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {language === 'en' 
              ? "Discover how Statsor can transform your team's management. Complete the form and we'll contact you to schedule a demonstration."
              : "Descubre cómo Statsor puede transformar la gestión de tu equipo. Completa el formulario y te contactaremos para agendar una demostración."
            }
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className={`border-0 shadow-2xl ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Full Name *' : 'Nombre completo *'}
                </label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder={language === 'en' ? 'Your full name' : 'Tu nombre completo'}
                      required
                      className={`${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Email *' : 'Email *'}
                </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={language === 'en' ? 'your@email.com' : 'tu@email.com'}
                      required
                      className={`${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Club or Team *' : 'Club o equipo *'}
                </label>
                    <Input
                      type="text"
                      value={formData.club}
                      onChange={(e) => handleInputChange('club', e.target.value)}
                      placeholder={language === 'en' ? 'Name of your club or team' : 'Nombre de tu club o equipo'}
                      required
                      className={`${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {language === 'en' ? 'Modality *' : 'Modalidad *'}
                </label>
                    <Select value={formData.modality} onValueChange={(value) => handleInputChange('modality', value)}>
                      <SelectTrigger className={`${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}>
                        <SelectValue placeholder={language === 'en' ? 'Select the modality' : 'Selecciona la modalidad'} />
                      </SelectTrigger>
                      <SelectContent>
                        {modalities.map((modality) => (
                          <SelectItem key={modality.value} value={modality.value}>
                            {modality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        language === 'en' ? 'Request Demo' : 'Solicitar demo'
                      )}
              </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
            </motion.div>
            
          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
              <div>
              <h3 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'What your demo includes' : 'Lo que incluye tu demo'}
              </h3>
                <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-2 rounded-full ${
                      theme === 'dark' ? 'bg-green-600' : 'bg-green-100'
                    }`}>
                      <feature.icon className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-white' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
              
            {/* Questions Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`p-6 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-blue-900/50 border border-blue-700' 
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <h4 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
              }`}>
                {language === 'en' ? 'Have specific questions?' : '¿Tienes preguntas específicas?'}
              </h4>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
              }`}>
                {language === 'en' 
                  ? "During the demo you can resolve all your doubts about functionalities, prices, and adaptation to your training methodology."
                  : "Durante la demo podrás resolver todas tus dudas sobre funcionalidades, precios y adaptación a tu metodología de entrenamiento."
                }
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedDemoForm;