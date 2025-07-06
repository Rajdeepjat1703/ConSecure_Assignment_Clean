import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { threatApi } from '../services/api';
import { Threat, ThreatsResponse, ThreatFilters } from '../types/threat';
import ThreatDetail from './ThreatDetail';

const Threats: React.FC = () => {
  const [threats, setThreats] = useState<ThreatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filtersInitialized, setFiltersInitialized] = useState(false); 

  const [filters, setFilters] = useState<ThreatFilters>({
    page: 1,
    limit: 10,
    category: [],
    search: '',
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category')?.split(',') || [];
    const limit = Number(searchParams.get('limit')) || 10;

    setFilters(prev => ({ ...prev, page, search, category, limit }));
    setFiltersInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    threatApi.getAllCategories().then(setAllCategories).catch(() => setAllCategories([]));
  }, []);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const prevFiltersRef = useRef<ThreatFilters | null>(null);

  useEffect(() => {
    if (!filtersInitialized) return;
  
    const prevFilters = prevFiltersRef.current;
    const isSame =
      prevFilters &&
      JSON.stringify(prevFilters) === JSON.stringify(filters);
  
    if (isSame) return;
  
    prevFiltersRef.current = filters;
  
    if (debounceRef.current) clearTimeout(debounceRef.current);
  
    if (filters.search) {
      debounceRef.current = setTimeout(() => {
        fetchThreats();
      }, 400);
    } else {
      fetchThreats();
    }
  }, [filters, filtersInitialized]);
  

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const data = await threatApi.getThreats(filters);
      setThreats(data);
    } catch (err) {
      setError('Failed to load threats');
      console.error('Error fetching threats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
    if (value) {
      searchParams.set('search', value);
    } else {
      searchParams.delete('search');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleCategoryFilter = (selected: string[]) => {
    setFilters(prev => ({ ...prev, category: selected, page: 1 }));
    if (selected.length > 0) {
      searchParams.set('category', selected.join(','));
    } else {
      searchParams.delete('category');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const clearCategories = () => {
    handleCategoryFilter([]);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    searchParams.set('page', String(page));
    setSearchParams(searchParams);
  };

  const handleThreatClick = (threat: Threat) => {
    setSelectedThreat(threat);
    setShowDetail(true);
  };

  const getSeverityColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 6) return 'bg-orange-100 text-orange-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 8) return 'Critical';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  const handleLimitChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
    searchParams.set('limit', String(limit));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Threats</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {threats ? (
            <>Showing {threats.threats.length} of {threats.pagination.totalItems} threats</>
          ) : (
            'Loading...'
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search threats..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="input w-full text-left pl-10 pr-8 min-h-[40px]"
              onClick={() => setDropdownOpen(prev => !prev)}
            >
              {Array.isArray(filters.category) && filters.category.length === 0 ? (
                <span className="text-gray-400">Select a category</span>
              ) : (
                (filters.category || []).map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center mr-2 mb-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {cat}
                    <X
                      onClick={(e) => {
                        e.stopPropagation();
                        clearCategories();
                      }}
                      className="ml-1 h-4 w-4 cursor-pointer text-gray-600 dark:text-gray-300"
                    />
                  </span>
                ))
              )}
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg max-h-60 overflow-auto">
                {allCategories.map((cat) => (
                  <div
                    key={cat}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                    onClick={() => {
                      handleCategoryFilter([cat]);
                      setDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items per page */}
          <div>
            <select
              value={filters.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="input"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threats Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">{error}</div>
              <button 
                onClick={fetchThreats} 
                className="btn btn-primary"
              >
                Retry
              </button>
            </div>
          ) : threats && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Threat Actor</th>
                  <th>Geography</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {threats.threats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="font-medium">#{threat.id}</td>
                    <td>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                        {threat.Threat_Category}
                      </span>
                    </td>
                    <td className="max-w-xs">
                      <div className="truncate" title={threat.Cleaned_Threat_Description || 'No description'}>
                        {threat.Cleaned_Threat_Description || 'No description'}
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.Severity_Score)}`}>
                        {threat.Severity_Score} - {getSeverityLabel(threat.Severity_Score)}
                      </span>
                    </td>
                    <td>
                      <div className="truncate max-w-32" title={threat.Threat_Actor || 'Unknown'}>
                        {threat.Threat_Actor || 'Unknown'}
                      </div>
                    </td>
                    <td>
                      <div className="truncate max-w-24" title={threat.Geography || 'Unknown'}>
                        {threat.Geography || 'Unknown'}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleThreatClick(threat)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {threats && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((threats.pagination.currentPage - 1) * threats.pagination.itemsPerPage) + 1} to{' '}
              {Math.min(threats.pagination.currentPage * threats.pagination.itemsPerPage, threats.pagination.totalItems)} of{' '}
              {threats.pagination.totalItems} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(threats.pagination.currentPage - 1)}
                disabled={!threats.pagination.hasPrevPage}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {threats.pagination.currentPage} of {threats.pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(threats.pagination.currentPage + 1)}
                disabled={!threats.pagination.hasNextPage}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Threat Detail Modal */}
      {showDetail && selectedThreat && (
        <ThreatDetail
          threat={selectedThreat}
          onClose={() => {
            setShowDetail(false);
            setSelectedThreat(null);
          }}
        />
      )}
    </div>
  );
};

export default Threats;
