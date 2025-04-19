import React from 'react';
import { Layers, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Layers className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold text-white">BuildWave</span>
            </div>
            <p className="mb-4 text-gray-400 max-w-md">
              The easiest way to build professional websites without coding. 
              Drag, drop, customize, and launch your site in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#twitter" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#facebook" className="text-gray-400 hover:text-blue-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#instagram" className="text-gray-400 hover:text-blue-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#linkedin" className="text-gray-400 hover:text-blue-400 transition">
                <Linkedin size={20} />
              </a>
              <a href="#github" className="text-gray-400 hover:text-blue-400 transition">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
              <li><a href="#templates" className="hover:text-blue-400 transition">Templates</a></li>
              <li><a href="#pricing" className="hover:text-blue-400 transition">Pricing</a></li>
              <li><a href="#enterprise" className="hover:text-blue-400 transition">Enterprise</a></li>
              <li><a href="#updates" className="hover:text-blue-400 transition">Updates</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#blog" className="hover:text-blue-400 transition">Blog</a></li>
              <li><a href="#guides" className="hover:text-blue-400 transition">Guides</a></li>
              <li><a href="#tutorials" className="hover:text-blue-400 transition">Tutorials</a></li>
              <li><a href="#docs" className="hover:text-blue-400 transition">Documentation</a></li>
              <li><a href="#community" className="hover:text-blue-400 transition">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#careers" className="hover:text-blue-400 transition">Careers</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
              <li><a href="#privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-blue-400 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} BuildWave. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <select className="bg-gray-800 text-gray-300 border border-gray-700 rounded-md py-1 px-2 text-sm">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;