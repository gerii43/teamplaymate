
import { motion } from "framer-motion";

export const Stats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Estadísticas que importan</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Datos precisos para tomar mejores decisiones táctticas
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-gray-600">Precisión en el registro</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600">Métricas disponibles</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-gray-600">Equipos confían en nosotros</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
