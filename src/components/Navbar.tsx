
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary">
              Statsor
            </a>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Funciones</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Precios</a>
            <a href="#demo" className="text-gray-600 hover:text-primary transition-colors">Demo</a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contacto</a>
          </div>

          <Button className="bg-primary hover:bg-primary/90">
            Solicitar Demo
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};
