import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Build stunning websites <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">without code</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Create professional websites with our intuitive drag-and-drop builder. 
              No coding skills required. Launch your site in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#getstarted" 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-medium text-center hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
              >
                Start Building Free
              </a>
              <a 
                href="#templates" 
                className="px-8 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 text-center flex items-center justify-center gap-2 transition"
              >
                See Templates
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    <img 
                      src={`https://images.pexels.com/photos/22${i}0${i}/pexels-photo-22${i}0${i}.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=40`} 
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="ml-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">10,000+</span> websites created last month
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-12 right-6 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              <img 
                src="https://images.pexels.com/photos/5926387/pexels-photo-5926387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Website Builder Interface" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;