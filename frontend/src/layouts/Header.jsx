import React, { useState, useEffect } from 'react';
import { Menu, X, Layers } from 'lucide-react';
import { NavLink } from '../components/NavLink';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      } nd:flex justify-around`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              BuildWave
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-around bg-white space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#templates ">Templates</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
            <NavLink 
              href="/SignUp" 
              className="text-blue-600 font-medium transition hover:text-blue-700"
            >
              Log in
            </NavLink>
            <NavLink 
              href="#signup" 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-medium transition hover:from-blue-700 hover:to-indigo-700"
            >
              Get Started
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
            <NavLink href="#templates" onClick={() => setIsMenuOpen(false)}>Templates</NavLink>
            <NavLink href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</NavLink>
            <NavLink href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</NavLink>
            <div className="pt-4 flex flex-col space-y-3">
              <NavLink 
                href="#login" 
                className="w-full text-center py-2 text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </NavLink>
              <NavLink 
                href="#signup" 
                className="w-full text-center py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;