import React from 'react';

const Background = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#047857]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0),rgba(0,0,0,0.5))]" />
    </div>
  );
};

export default Background;