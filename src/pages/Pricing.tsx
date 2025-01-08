import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your team's needs. All plans include core features to help you manage and improve your team's performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-all duration-300 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-secondary mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">€9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Basic team management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Simple performance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Up to 15 players</span>
                </li>
              </ul>
            </div>
            <Button className="w-full mt-auto">Get Started</Button>
          </div>

          {/* Semi-Pro Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-primary relative transform hover:scale-105 transition-all duration-300 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-full text-sm">Popular</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-secondary mb-2">Semi-Pro</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">€25.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Advanced team management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Detailed analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Up to 30 players</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Training schedules</span>
                </li>
              </ul>
            </div>
            <Button className="w-full mt-auto">Get Started</Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:border-primary transition-all duration-300 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-secondary mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">€50.00</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Complete team management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Advanced analytics & reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Unlimited players</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-primary" size={20} />
                  <span className="text-gray-600">Custom features</span>
                </li>
              </ul>
            </div>
            <Button className="w-full mt-auto">Get Started</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;