import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Over Luca", path: "/over-luca" },
    { name: "Diensten", path: "/dit-doe-ik-graag" },
    { name: "Projecten", path: "/projecten" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-3rem)] max-w-4xl`}>
      <div className={`flex justify-between items-center px-6 py-3 rounded-full transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-md border border-gray-100 shadow-lg" : "bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm"}`}>
        <Link to="/" className="flex items-center">
          <img src="/wtc-logo.png" alt="WE THE CROWD" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-sm font-semibold hover:text-brand-accent transition-colors ${location.pathname === link.path ? "text-brand-accent" : "text-gray-600"}`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className="px-5 py-2 bg-black text-white rounded-full text-sm font-bold hover:brightness-90 transition-all"
          >
            Bespreek jouw event
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full left-0 w-full mt-4 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl md:hidden py-8 px-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-2xl font-bold hover:text-brand-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-black text-white rounded-full font-bold text-center"
            >
              Bespreek jouw event
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
