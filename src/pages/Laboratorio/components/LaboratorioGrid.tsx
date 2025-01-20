import React from 'react';
import { LaboratorioData } from '../types';
import LaboratorioCard from './LaboratorioCard';

interface LaboratorioGridProps {
  items: LaboratorioData[];
  onView?: (item: LaboratorioData) => void;
  onDelete?: (item: LaboratorioData) => void;
}

const LaboratorioGrid: React.FC<LaboratorioGridProps> = ({
  items,
  onView,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <LaboratorioCard
          key={item.uid}
          item={item}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default LaboratorioGrid;
