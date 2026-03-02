import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="mb-6 block">
              <img src="/wtc-logo-wit.png" alt="WE THE CROWD" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 max-w-sm mb-8">
              Creatieve oplossingen. Strakke uitvoering. Blijvende impact.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:info@wethecrowd.nl" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">Menu</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/over-luca" className="text-gray-400 hover:text-white transition-colors">Over Luca</Link></li>
              <li><Link to="/dit-doe-ik-graag" className="text-gray-400 hover:text-white transition-colors">Diensten</Link></li>
              <li><Link to="/projecten" className="text-gray-400 hover:text-white transition-colors">Projecten</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-500">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3 whitespace-nowrap">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:luca@wethecrowd.nl" className="hover:text-white transition-colors">luca@wethecrowd.nl</a>
              </li>
              <li className="whitespace-nowrap text-sm">
                Amersfoort, Nederland
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} WE THE CROWD. Alle rechten voorbehouden.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
