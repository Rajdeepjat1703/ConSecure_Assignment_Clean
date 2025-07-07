import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { threatApi } from '../services/api';
import { ThreatStats } from '../types/threat';
import { io as socketIOClient } from 'socket.io-client';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ThreatStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activityFeed, setActivityFeed] = useState<{description: string, predicted_category: string, timestamp: string}[]>([]);
  const socketRef = useRef<any>(null);

  // Load feed from localStorage on mount
  useEffect(() => {
    const savedFeed = localStorage.getItem('activityFeed');
    if (savedFeed) setActivityFeed(JSON.parse(savedFeed));
    socketRef.current = socketIOClient('http://localhost:5000');
    socketRef.current.on('analysis', (data: any) => {
      setActivityFeed(feed => {
        const updated = [data, ...feed.slice(0, 19)];
        localStorage.setItem('activityFeed', JSON.stringify(updated));
        return updated;
      });
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Save feed to localStorage whenever it changes (for manual updates)
  useEffect(() => {
    localStorage.setItem('activityFeed', JSON.stringify(activityFeed));
  }, [activityFeed]);

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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/threats/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ description: analysisInput })
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data.predicted_category);
      } else {
        setAnalysisError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setAnalysisError('Prediction failed');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setAnalysisInput('');
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Threat Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Analyze Threat
          </button>
        </div>
      </div>

      {/* Modal Dialog for Analysis */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Threat Description Analysis</h3>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Paste a new threat description here..."
                value={analysisInput}
                onChange={e => setAnalysisInput(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={analysisLoading}
              >
                {analysisLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>
            {analysisResult && (
              <div className="mt-4 text-green-700 font-bold">
                Predicted Category: {analysisResult}
              </div>
            )}
            {analysisError && (
              <div className="mt-4 text-red-600">
                {analysisError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Activity Feed */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Live Activity Feed</h3>
        <ul className="max-h-48 overflow-y-auto">
          {activityFeed.length === 0 && <li className="text-gray-500">No activity yet.</li>}
          {activityFeed.map((item, idx) => (
            <li key={idx} className="py-1 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold">{item.predicted_category}</span> — {item.description}
              <span className="text-xs text-gray-400 ml-2">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
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