import React from 'react';
import { motion } from 'framer-motion';

const VideoPlayer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full min-w-[300px] h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
      style={{ backgroundColor: 'var(--modal-overlay)' }}
    >
      <video
        className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
        autoPlay
        muted
        loop
        playsInline
        controls
      >
        <source
          src="https://s3.conexcondo.com.br/fmg/674fbdd286f2f2dc633b9fc7%20%281%29.mp4"
          type="video/mp4"
        />
        Seu navegador não suporta o elemento de vídeo.
      </video>
    </motion.div>
  );
};

export default VideoPlayer;