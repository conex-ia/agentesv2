import React from 'react';
import { Beaker, LayoutGrid, Table } from 'lucide-react';
import { ViewType } from '../types';
import ViewToggle from '../../../components/ViewToggle';

interface LaboratorioHeaderProps {
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  onAddItem?: () => void;
}

export const LaboratorioHeader: React.FC<LaboratorioHeaderProps> = ({
  viewType,
  onViewTypeChange,
  onAddItem
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: 'var(--status-success-bg)',
            border: '1px solid var(--status-success-color)30'
          }}
        >
          <Beaker size={24} style={{ color: 'var(--status-success-color)' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Laboratório
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Gerencie seus experimentos e testes
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ViewToggle
          viewType={viewType}
          onViewTypeChange={onViewTypeChange}
          gridIcon={LayoutGrid}
          tableIcon={Table}
        />
      </div>
    </div>
  );
};

export default LaboratorioHeader;
