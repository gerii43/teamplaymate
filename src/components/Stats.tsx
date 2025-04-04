
import { motion } from "framer-motion";
import { BarChart3, Users2, Brain, Gauge, LineChart, Clock, Award } from "lucide-react";

const stats = [{
  icon: <Award className="w-12 h-12 text-primary mb-3" />,
  value: "",
  label: "Hundreds of data for every match"
}, {
  icon: <LineChart className="w-12 h-12 text-primary mb-3" />,
  value: "",
  label: "100% control over your performance"
}, {
  icon: <Clock className="w-12 h-12 text-primary mb-3" />,
  value: "",
  label: "In seconds, you'll have answers that used to take hours"
}];

const features = [{
  icon: <BarChart3 className="w-8 h-8 text-primary" />,
  title: "Performance Analytics",
  description: "Track team and player statistics with detailed metrics and visual reports"
}, {
  icon: <Users2 className="w-8 h-8 text-primary" />,
  title: "Team Management",
  description: "Organize squads, manage training schedules, and coordinate team activities efficiently"
}, {
  icon: <Brain className="w-8 h-8 text-primary" />,
  title: "Tactical Analysis",
  description: "Create and analyze game strategies with advanced visualization tools"
}, {
  icon: <Gauge className="w-8 h-8 text-primary" />,
  title: "Progress Tracking",
  description: "Monitor individual and team development with comprehensive progress indicators"
}];

export const Stats = () => {
  return <>
      <section className="py-20 bg-secondary">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="text-center">
                {stat.icon}
                <p className="text-gray-100 font-medium text-xl">{stat.label}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container px-4">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="text-3xl md:text-4xl font-bold text-center text-secondary mb-16">
            Big Data is Not Just for Big Teams
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>
    </>;
};
