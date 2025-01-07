import React from 'react';

const Background = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://s3.conexcondo.com.br/fmg/3d-rendering-abstract-background-basis-plexus.jpg')`,
        }}
      />
      <div 
        className="absolute inset-0 backdrop-blur-[2px] bg-black/25"
      />
    </div>
  );
};

export default Background;