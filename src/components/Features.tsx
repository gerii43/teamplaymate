import { motion } from "framer-motion";
import { Activity, Users, Calendar, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Data-Driven Success",
    description: "Transform your coaching decisions with real-time analytics and performance insights that give you the competitive edge.",
  },
  {
    icon: Users,
    title: "Streamlined Management",
    description: "Save hours of administrative work with our intuitive team management tools, focusing more time on what matters - coaching.",
  },
  {
    icon: Calendar,
    title: "Strategic Excellence",
    description: "Elevate your game preparation with advanced tactical planning tools and detailed match analysis capabilities.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Join hundreds of successful teams who have improved their win rate by 40% using our comprehensive tracking system.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Transform Your Team's Performance</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Experience the power of professional-grade analytics and management tools, designed to elevate your team's success at any level.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <feature.icon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-secondary">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};