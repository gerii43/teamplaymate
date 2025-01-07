import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Professional Teams" },
  { value: "10K+", label: "Active Users" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "Support" },
];

export const Stats = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};