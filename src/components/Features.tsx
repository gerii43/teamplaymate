import { motion } from "framer-motion";
import { Activity, Users, Calendar, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Performance Analytics",
    description: "Track and analyze team performance with advanced metrics and insights.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Efficiently manage your squad, tactics, and training schedules.",
  },
  {
    icon: Calendar,
    title: "Match Planning",
    description: "Plan and organize matches with detailed strategies and lineups.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor individual and team progress with comprehensive statistics.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Everything You Need</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};