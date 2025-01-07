import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import VantagensSection from '../components/VantagensSection';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const Landing: React.FC = () => {
  return (
    <main 
      className="min-h-screen bg-[#111827] text-white"
    >
      <Navbar />
      <Hero />
      <ServicesSection />
      <VantagensSection />
      <Footer />
      <AuthModal />
    </main>
  );
};

export default Landing;