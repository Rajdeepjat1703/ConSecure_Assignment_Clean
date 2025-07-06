import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { threatApi } from '../services/api';
import { ThreatStats } from '../types/threat';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ThreatStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await threatApi.getThreatStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load threat statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const getSeverityColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50';
    if (score >= 6) return 'text-orange-600 bg-orange-50';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Threat Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Threats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Severity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.bySeverity.filter(s => s.Severity_Score >= 8).reduce((sum, s) => sum + s._count._all, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.byCategory.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Severity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {(stats.bySeverity.reduce((sum, s) => sum + (s.Severity_Score * s._count._all), 0) / stats.total).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Threat Categories</h3>
          <div className="space-y-3">
            {stats.byCategory
              .sort((a, b) => b._count._all - a._count._all)
              .slice(0, 10)
              .map((category) => (
                <div key={category.Threat_Category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                    {category.Threat_Category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${(category._count._all / stats.total) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8 text-right">
                      {category._count._all}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Severity Distribution</h3>
          <div className="space-y-3">
            {stats.bySeverity
              .sort((a, b) => b.Severity_Score - a.Severity_Score)
              .map((severity) => (
                <div key={severity.Severity_Score} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(severity.Severity_Score)}`}>
                      {severity.Severity_Score}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {severity.Severity_Score >= 8 ? 'Critical' :
                       severity.Severity_Score >= 6 ? 'High' :
                       severity.Severity_Score >= 4 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          severity.Severity_Score >= 8 ? 'bg-red-500' :
                          severity.Severity_Score >= 6 ? 'bg-orange-500' :
                          severity.Severity_Score >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${(severity._count._all / stats.total) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8 text-right">
                      {severity._count._all}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 