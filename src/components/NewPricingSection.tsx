import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export const NewPricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  return <section className="py-16 bg-card-DEFAULT">
      <div className="container px-4 mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <div className="bg-primary text-white rounded-3xl p-12 mb-12 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
            <p className="text-xl text-white/90">
              Unlock premium features to boost productivity and streamline your workflow. Choose the plan that suits you best!
            </p>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-4 text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly billing
            </span>
            <button onClick={() => setIsAnnual(!isAnnual)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isAnnual ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`ml-4 text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual billing
            </span>
            <span className="ml-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
              Save up to 20%!
            </span>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} viewport={{
          once: true
        }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">BASIC</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                €{isAnnual ? '7' : '9'}
              </div>
              <p className="text-gray-500">per month</p>
            </div>
            
            <ul className="space-y-3 flex-grow mb-8">
              <li className="text-gray-700">3 Projects</li>
              <li className="text-gray-700">250 objects per project</li>
              <li className="text-gray-700">One Active User</li>
            </ul>
            
            <Button className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
              Choose this plan
            </Button>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="bg-white p-8 rounded-2xl shadow-xl border-4 border-primary transform scale-105 flex flex-col h-full relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">PROFESSIONAL</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                €{isAnnual ? '24' : '29'}
              </div>
              <p className="text-gray-500">per month</p>
            </div>
            
            <ul className="space-y-3 flex-grow mb-8">
              <li className="text-gray-700">20 Projects</li>
              <li className="text-gray-700">800 objects per project</li>
              <li className="text-gray-700">10 Active Users</li>
              <li className="text-gray-700">Team Collaboration</li>
            </ul>
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Choose this plan
            </Button>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} viewport={{
          once: true
        }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">ENTERPRISE</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                €{isAnnual ? '79' : '99'}
              </div>
              <p className="text-gray-500">per month</p>
            </div>
            
            <ul className="space-y-3 flex-grow mb-8">
              <li className="text-gray-700">Unlimited Projects</li>
              <li className="text-gray-700">No object limit</li>
              <li className="text-gray-700">Unlimited Users</li>
              <li className="text-gray-700">Team Collaboration</li>
              <li className="text-gray-700">Priority Support</li>
            </ul>
            
            <Button className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
              Choose this plan
            </Button>
          </motion.div>
        </div>
      </div>
    </section>;
};