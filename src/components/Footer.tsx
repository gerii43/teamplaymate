import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl text-secondary">Traihero</h3>
            <p className="text-gray-600 text-sm">
              Save time and make better decisions. Optimised management, strategy and performance platform.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary text-sm">Home</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-primary text-sm">Pricing</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="text-gray-600 hover:text-primary text-sm">Documentation</Link></li>
              <li><Link to="/api" className="text-gray-600 hover:text-primary text-sm">API Reference</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary text-sm">Blog</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary text-sm">About</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-primary text-sm">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary text-sm">Contact</Link></li>
              <li><Link to="/legal" className="text-gray-600 hover:text-primary text-sm">Legal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">© 2024 Traihero. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};