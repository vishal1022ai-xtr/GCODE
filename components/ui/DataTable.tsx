import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import { LoadingSpinner } from './LoadingStates';
import { Badge } from './StatusBadges';

// Table Column Definition
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Table Props
interface DataTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    showPageInfo?: boolean;
  };
  sorting?: {
    enabled: boolean;
    defaultSort?: { key: string; direction: 'asc' | 'desc' };
  };
  emptyState?: React.ReactNode;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
}

// Sort Direction Type
type SortDirection = 'asc' | 'desc' | null;

// Enhanced Data Table Component
export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination = { enabled: false, pageSize: 10, showPageInfo: true },
  sorting = { enabled: false },
  emptyState,
  onRowClick,
  className = ""
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({
    key: sorting.defaultSort?.key || '',
    direction: sorting.defaultSort?.direction || null
  });

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sorting.enabled || !sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, sorting.enabled]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData;
    
    const startIndex = (currentPage - 1) * (pagination.pageSize || 10);
    const endIndex = startIndex + (pagination.pageSize || 10);
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / (pagination.pageSize || 10));

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sorting.enabled) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getSortIcon = (key: string) => {
    if (!sorting.enabled || sortConfig.key !== key) {
      return <span className="text-gray-400">⇅</span>;
    }
    return sortConfig.direction === 'asc' ? 
      <span className="text-blue-600">↑</span> : 
      <span className="text-blue-600">↓</span>;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {emptyState}
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${sorting.enabled && column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sorting.enabled && column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
                } transition-colors`}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.enabled && totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            {pagination.showPageInfo && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((currentPage - 1) * (pagination.pageSize || 10)) + 1} to{' '}
                {Math.min(currentPage * (pagination.pageSize || 10), sortedData.length)} of{' '}
                {sortedData.length} results
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick Stats Table Component
interface StatsTableProps {
  title: string;
  stats: Array<{
    label: string;
    value: string | number;
    change?: {
      value: number;
      positive: boolean;
    };
    status?: 'success' | 'warning' | 'danger' | 'info';
  }>;
}

export const StatsTable: React.FC<StatsTableProps> = ({ title, stats }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stat.value}
                </span>
                {stat.change && (
                  <span className={`text-xs ${
                    stat.change.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change.positive ? '+' : ''}{stat.change.value}%
                  </span>
                )}
                {stat.status && (
                  <Badge variant={stat.status} size="sm">
                    {stat.status}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};