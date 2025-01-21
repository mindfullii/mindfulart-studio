import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // 生成页码数组，显示当前页附近的页码
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // 当前页前后显示的页数

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // 第一页
        i === totalPages || // 最后一页
        (i >= currentPage - delta && i <= currentPage + delta) // 当前页附近
      ) {
        pages.push(i);
      }
    }

    // 添加省略号
    const withEllipsis = [];
    let prev = 0;
    for (const page of pages) {
      if (prev && page - prev > 1) {
        withEllipsis.push('...');
      }
      withEllipsis.push(page);
      prev = page;
    }

    return withEllipsis;
  };

  return (
    <nav className="flex justify-center gap-2">
      {/* 上一页 */}
      <Link
        href={currentPage === 1 ? '#' : `${baseUrl}?page=${currentPage - 1}`}
        className={cn(
          'px-4 py-2 text-sm border rounded-lg transition-colors',
          currentPage === 1
            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      {/* 页码 */}
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-4 py-2 text-sm text-gray-500"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={cn(
              'px-4 py-2 text-sm border rounded-lg transition-colors',
              currentPage === page
                ? 'bg-primary text-white border-primary'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            {page}
          </Link>
        )
      ))}

      {/* 下一页 */}
      <Link
        href={currentPage === totalPages ? '#' : `${baseUrl}?page=${currentPage + 1}`}
        className={cn(
          'px-4 py-2 text-sm border rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  );
} 