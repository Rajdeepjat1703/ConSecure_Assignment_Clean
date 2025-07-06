import React from 'react';
import { X, AlertTriangle, MapPin, User, Target, FileText, Tag, Hash } from 'lucide-react';
import { Threat } from '../types/threat';

interface ThreatDetailProps {
  threat: Threat;
  onClose: () => void;
}

const ThreatDetail: React.FC<ThreatDetailProps> = ({ threat, onClose }) => {
  const getSeverityColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 8) return 'Critical';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Threat #{threat.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {threat.Threat_Category}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Severity Score
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(threat.Severity_Score)}`}>
                  {threat.Severity_Score} - {getSeverityLabel(threat.Severity_Score)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Level
                </label>
                <span className="text-gray-900 dark:text-gray-100">
                  {threat.Risk_Level || 'Not specified'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sentiment Score
                </label>
                <span className="text-gray-900 dark:text-gray-100">
                  {threat.Sentiment !== null ? threat.Sentiment.toFixed(2) : 'Not available'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Threat Actor
                </label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {threat.Threat_Actor || 'Unknown'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Geography
                </label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {threat.Geography || 'Unknown'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attack Vector
                </label>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {threat.Attack_Vector || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Word Count
                </label>
                <span className="text-gray-900 dark:text-gray-100">
                  {threat.Word_Count} words
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Threat Description
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {threat.Cleaned_Threat_Description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Predicted Threat & Suggested Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Predicted Threat
              </label>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-900 dark:text-gray-100">
                  {threat.Predicted_Threat || 'No prediction available'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suggested Action
              </label>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-gray-900 dark:text-gray-100">
                  {threat.Suggested_Action || 'No action suggested'}
                </p>
              </div>
            </div>
          </div>

          {/* IOCs */}
          {threat.IOCs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Hash className="h-4 w-4 inline mr-1" />
                Indicators of Compromise (IOCs)
              </label>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {threat.IOCs.map((ioc, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm font-mono"
                    >
                      {ioc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Keywords */}
          {threat.Keywords.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="h-4 w-4 inline mr-1" />
                Keywords
              </label>
              <div className="flex flex-wrap gap-2">
                {threat.Keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Named Entities */}
          {threat.Named_Entities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Named Entities
              </label>
              <div className="flex flex-wrap gap-2">
                {threat.Named_Entities.map((entity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-sm"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Topic Model */}
          {threat.Topic_Model && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic Model
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-gray-100">
                  {threat.Topic_Model}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetail; 