
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl text-secondary">Statsor</h3>
            <p className="text-gray-600 text-sm">
              Software integral para entrenadores de fútbol que revoluciona la gestión de equipos, estadísticas y entrenamientos.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">Producto</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary text-sm">Inicio</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-primary text-sm">Precios</Link></li>
              <li><Link to="/demo" className="text-gray-600 hover:text-primary text-sm">Demo</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">Recursos</h4>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="text-gray-600 hover:text-primary text-sm">Documentación</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary text-sm">Blog</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary text-sm">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">Empresa</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary text-sm">Sobre Nosotros</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary text-sm">Contacto</Link></li>
              <li><Link to="/legal" className="text-gray-600 hover:text-primary text-sm">Legal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">© 2025 Statsor. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">Política de Privacidad</Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Términos de Servicio</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
