import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div 
      className="flex items-center justify-center h-full"
      style={{ color: 'var(--text-secondary)' }}
    >
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};
