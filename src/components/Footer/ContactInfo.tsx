import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin size={20} />,
    text: 'Rua Exemplo, 123 - São Paulo, SP',
  },
  {
    icon: <Phone size={20} />,
    text: '(11) 1234-5678',
    href: 'tel:+551112345678',
  },
  {
    icon: <Mail size={20} />,
    text: 'contato@conexia.com',
    href: 'mailto:contato@conexia.com',
  },
];

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap gap-8 justify-center items-center text-gray-300"
    >
      {contactInfo.map((info, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          {info.href ? (
            <a
              href={info.href}
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors duration-200"
            >
              {info.icon}
              <span>{info.text}</span>
            </a>
          ) : (
            <>
              {info.icon}
              <span>{info.text}</span>
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContactInfo;