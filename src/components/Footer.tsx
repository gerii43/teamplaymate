import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { name: t('nav.home'), href: '/' },
      { name: t('nav.pricing'), href: '/pricing' },
      { name: t('blog.title'), href: '/blog' },
      { name: t('nav.demo'), href: '/demo' }
    ],
    resources: [
      { name: 'Documentación', href: '/documentation' },
      { name: t('blog.title'), href: '/blog' },
      { name: 'Preguntas Frecuentes', href: '/faq' },
      { name: 'API', href: '/api' }
    ],
    company: [
      { name: 'Sobre Nosotros', href: '/about' },
      { name: t('nav.contact'), href: '/contact' },
      { name: 'Legal', href: '/legal' },
      { name: 'Carreras', href: '/careers' }
    ],
    support: [
      { name: 'Centro de Ayuda', href: '/help' },
      { name: 'Soporte Técnico', href: '/support' },
      { name: 'Estado del Sistema', href: '/status' },
      { name: 'Comunidad', href: '/community' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className={`py-16 relative overflow-hidden ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${isDark ? '#10b981' : '#3b82f6'} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
                alt="Statsor" 
                className="h-10 w-auto"
              />
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Statsor
              </span>
            </div>
            <p className={`text-sm leading-relaxed max-w-md ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Software integral para entrenadores de fútbol que revoluciona la gestión de equipos, estadísticas y entrenamientos con tecnología de vanguardia.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className={`h-4 w-4 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  contacto@statsor.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className={`h-4 w-4 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  +34 900 123 456
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className={`h-4 w-4 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Madrid, España
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div 
              key={category}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className={`font-semibold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t(`footer.${category}`)}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (linkIndex * 0.05), duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      to={link.href} 
                      className={`text-sm transition-all duration-300 hover:text-green-600 ${
                        isDark ? 'text-gray-300 hover:text-green-400' : 'text-gray-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className={`p-8 rounded-2xl mb-12 ${
            isDark 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <h3 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {t('footer.newsletter.title')}
            </h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('footer.newsletter.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
                {t('footer.newsletter.button')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className={`border-t pt-8 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('footer.rights')}
            </p>
            <div className="flex items-center space-x-6">
              <Link 
                to="/privacy" 
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                to="/terms" 
                className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {t('footer.terms')}
              </Link>
              <motion.button
                onClick={scrollToTop}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800 text-gray-400 hover:bg-green-600 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white'
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};