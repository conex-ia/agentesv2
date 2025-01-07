import React, { useState, useEffect } from 'react';
import AssistantGrid from '../Dashboard/components/AssistantGrid';
import AssistantesHeader from '../Dashboard/components/AssistantesHeader';
import StatsCards from '../Dashboard/components/StatsCards';
import { useBots } from '../../hooks/useBots';

const WhatsApp: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'table'>('table');
  const { bots } = useBots();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddAssistant = async (name: string) => {
    try {
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao criar assistente' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 sm:px-6 py-4">
          <div className="max-w-[1440px] mx-auto space-y-6">
            <div className="overflow-x-auto pb-4">
              <StatsCards />
            </div>
            <AssistantesHeader
              viewType={viewType}
              onViewTypeChange={setViewType}
              onAddAssistant={handleAddAssistant}
            />
            <div className="overflow-x-auto">
              <AssistantGrid 
                viewType={viewType} 
                onViewTypeChange={setViewType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;
