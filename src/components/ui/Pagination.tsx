import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    
    if (currentPage <= 3) return [...pages.slice(0, 5), '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', ...pages.slice(-5)];
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Previous
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
          disabled={page === '...'}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-gray-100 text-gray-900'
              : page === '...'
              ? 'cursor-default'
              : 'hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
} 