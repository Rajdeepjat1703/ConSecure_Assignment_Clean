export interface Threat {
  id: number;
  Threat_Category: string;
  IOCs: string[];
  Threat_Actor: string | null;
  Attack_Vector: string | null;
  Geography: string | null;
  Sentiment: number | null;
  Severity_Score: number;
  Predicted_Threat: string | null;
  Suggested_Action: string | null;
  Risk_Level: string | null;
  Cleaned_Threat_Description: string | null;
  Keywords: string[];
  Named_Entities: string[];
  Topic_Model: string | null;
  Word_Count: number;
}

export interface ThreatStats {
  total: number;
  byCategory: Array<{
    Threat_Category: string;
    _count: {
      _all: number;
    };
  }>;
  bySeverity: Array<{
    Severity_Score: number;
    _count: {
      _all: number;
    };
  }>;
}

export interface ThreatsResponse {
  threats: Threat[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    category: string | null;
    search: string | null;
  };
}

export interface ThreatFilters {
  page?: number;
  limit?: number;
  category?: string[];
  search?: string;
} 