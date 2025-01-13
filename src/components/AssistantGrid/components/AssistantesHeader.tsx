import React, { useState } from 'react';
import { List, Table } from 'lucide-react';

interface AssistantesHeaderProps {
  title: string;
  viewType: 'grid' | 'table';
  setViewType: (type: 'grid' | 'table') => void;
  onAddBot: (name: string) => void;
}

const AssistantesHeader: React.FC<AssistantesHeaderProps> = ({
  title,
  viewType,
  setViewType,
  onAddBot
}) => {
  const [botName, setBotName] = useState('');

  const handleAddBot = () => {
    if (botName.trim()) {
      onAddBot(botName.trim());
      setBotName('');
    }
  };

  return (
    <div 
      className="rounded-lg p-6"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        boxShadow: 'var(--shadow-elevation-medium)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewType('grid')}
              className="p-2 rounded-lg"
              style={{
                backgroundColor: viewType === 'grid' ? 'var(--bg-secondary)' : 'transparent',
                color: 'var(--text-primary)'
              }}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className="p-2 rounded-lg"
              style={{
                backgroundColor: viewType === 'table' ? 'var(--bg-secondary)' : 'transparent',
                color: 'var(--text-primary)'
              }}
            >
              <Table className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Nome do assistente"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          />
          <button
            onClick={handleAddBot}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--text-primary)'
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantesHeader; 