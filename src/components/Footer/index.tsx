import React from 'react';
import AboutSection from './AboutSection';
import LinksSection from './LinksSection';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import Background from './Background';

const Footer = () => {
  return (
    <footer id="sobre" className="relative py-24 overflow-hidden bg-[#111827]">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 place-items-center">
          <div className="w-full max-w-sm">
            <AboutSection />
          </div>
          <div className="w-full max-w-sm">
            <LinksSection />
          </div>
          <div className="w-full lg:col-span-2 max-w-xl">
            <ContactForm />
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10">
          <ContactInfo />
        </div>
      </div>
    </footer>
  );
};

export default Footer;