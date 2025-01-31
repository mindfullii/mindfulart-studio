import Link from 'next/link';

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function ServerPagination({ currentPage, totalPages, baseUrl }: ServerPaginationProps) {
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
      <Link
        href={currentPage === 1 ? '#' : `${baseUrl}?page=${currentPage - 1}`}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>
      
      {getVisiblePages().map((page, index) => (
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="w-10 h-10 flex items-center justify-center text-sm text-gray-600"
          >
            {page}
          </span>
        ) : (
          <Link
            key={index}
            href={`${baseUrl}?page=${page}`}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
              page === currentPage
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        )
      ))}
      
      <Link
        href={currentPage === totalPages ? '#' : `${baseUrl}?page=${currentPage + 1}`}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  );
} 