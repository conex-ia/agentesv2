import React from 'react';

const Background = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://s3.conexcondo.com.br/fmg/review-flavio-marcelo-guardia.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
    </div>
  );
};

export default Background;