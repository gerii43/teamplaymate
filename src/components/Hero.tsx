import { motion } from "framer-motion";
import { InteractiveDemo } from "./InteractiveDemo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pb-24 pt-10 bg-white">
      <nav className="p-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/01b5bf86-f2e7-42cd-9465-4d0bb347d2ea.png" 
              alt="Statsor" 
              className="h-16 w-auto"
            />
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="/" className="hover:text-primary transition-colors text-secondary">{t('nav.home')}</a>
            <a href="/pricing" className="hover:text-primary transition-colors text-secondary">{t('nav.pricing')}</a>
            <a href="#demo" className="hover:text-primary transition-colors text-secondary">{t('nav.demo')}</a>
            <a href="#contacto" className="hover:text-primary transition-colors text-secondary">{t('nav.contact')}</a>
            <LanguageSwitcher />
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/signin">
                  <Button variant="outline" size="sm">
                    {t('nav.signin')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
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
                <Button size="sm">
                  {t('nav.signin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto text-secondary">
            Digitize and analyze your football team's performance in real time
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="bg-primary text-white px-8 py-6 rounded-lg font-medium text-lg shadow-lg hover:bg-primary/90 transition-colors">
              Request your demo
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl mt-8"
          >
            <InteractiveDemo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};