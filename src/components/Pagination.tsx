import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas números
    if (/^\d*$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(inputPage);
      if (newPage >= 1 && newPage <= totalPages) {
        onPageChange(newPage);
      } else {
        // Reset para página atual se valor for inválido
        setInputPage(currentPage.toString());
      }
    }
  };

  // Atualiza o input quando a página muda externamente
  React.useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            ':hover': { backgroundColor: 'var(--bg-hover)' }
          }}
        >
          <ChevronLeft size={16} />
        </motion.button>
      )}
      
      <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
        <input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-12 px-2 py-1 rounded-md text-center border transition-colors focus:outline-none focus:ring-1"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--accent-color-transparent)',
            ':hover': { borderColor: 'var(--accent-color)' },
            ':focus': { 
              borderColor: 'var(--accent-color)',
              ringColor: 'var(--accent-color)'
            }
          }}
          aria-label="Número da página"
        />
        <span>de {totalPages}</span>
      </div>

      {currentPage < totalPages && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            ':hover': { backgroundColor: 'var(--bg-hover)' }
          }}
        >
          <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default Pagination;