import { motion } from "framer-motion";
import { InteractiveDemo } from "./InteractiveDemo";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pb-24 pt-10 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="p-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
              alt="Statsor" 
              className="h-12 w-auto"
            />
            <span className="ml-3 text-2xl font-bold text-gray-900">Statsor</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="/" className="hover:text-primary transition-colors text-gray-700 font-medium">{t('nav.home')}</a>
            <a href="/pricing" className="hover:text-primary transition-colors text-gray-700 font-medium">{t('nav.pricing')}</a>
            <a href="#demo" className="hover:text-primary transition-colors text-gray-700 font-medium">{t('nav.demo')}</a>
            <a href="/blog" className="hover:text-primary transition-colors text-gray-700 font-medium">{t('blog.title')}</a>
            <a href="#contacto" className="hover:text-primary transition-colors text-gray-700 font-medium">{t('nav.contact')}</a>
            <LanguageSwitcher />
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    {t('nav.signin')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            {!user && (
              <Link to="/signin">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  {t('nav.signin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 max-w-5xl mx-auto text-gray-900 leading-tight">
            {t('hero.title.digitize')}
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {t('cta.button')}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                {t('nav.pricing')}
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl mt-12 border border-gray-200"
            id="demo"
          >
            <InteractiveDemo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};