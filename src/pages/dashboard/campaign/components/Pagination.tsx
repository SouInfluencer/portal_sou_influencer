import React from 'react';

// Add mobile-first styles
const styles = `
/* Base styles */
:root {
  --min-touch-target: clamp(2.75rem, 8vw, 3rem); /* 44-48px */
  --container-padding: clamp(1rem, 5vw, 2rem);
  --font-size-base: clamp(0.875rem, 4vw, 1rem);
  --spacing-base: clamp(1rem, 4vw, 1.5rem);
  --border-radius: clamp(0.75rem, 3vw, 1rem);
}

/* Mobile-first media queries */
@media (max-width: 480px) {
  .pagination-container {
    flex-direction: column;
    gap: var(--spacing-base);
  }
  
  .pagination-info {
    text-align: center;
    width: 100%;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .pagination-button {
    min-height: var(--min-touch-target);
    min-width: var(--min-touch-target);
    padding: 0;
    justify-content: center;
  }
  
  .page-numbers {
    display: none;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .pagination-button {
    min-height: var(--min-touch-target);
    min-width: var(--min-touch-target);
  }
}
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Trigger mount animation
    setMounted(true);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className={`mt-6 flex items-center justify-between pagination-container transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex justify-between items-center pagination-controls sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 pagination-button"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 pagination-button"
        >
          Próxima
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="pagination-info">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> até{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>
        <div className="pagination-controls">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center justify-center px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)] disabled:opacity-50 disabled:cursor-not-allowed pagination-button"
            >
              Anterior
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center justify-center px-4 py-2 border text-sm font-medium min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)] ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center justify-center px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 min-h-[var(--min-touch-target)] min-w-[var(--min-touch-target)] disabled:opacity-50 disabled:cursor-not-allowed pagination-button"
            >
              Próxima
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}