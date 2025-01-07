import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen bg-secondary text-white relative overflow-hidden">
      <nav className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">TraiHero</div>
          <div className="flex gap-8">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Optimize Your Team's Performance
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Advanced analytics and management tools for modern football coaches
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-colors mb-12"
          >
            Get Started
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/lovable-uploads/bfe9a75b-3b2e-4dc8-8920-c751277ff233.png" 
              alt="Coach Dashboard Interface" 
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};