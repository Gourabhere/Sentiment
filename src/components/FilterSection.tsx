import React from 'react';
import { Filter } from 'lucide-react';

interface FilterSectionProps {
  onFilterChange: (filters: {
    teamId: string;
    projectId: string;
    sentiment: string[];
    reviewCategory: string;
  }) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    teamId: '',
    projectId: '',
    sentiment: [] as string[],
    reviewCategory: ''
  });

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team ID
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter team ID"
            value={filters.teamId}
            onChange={(e) => handleFilterChange('teamId', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project ID
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter project ID"
            value={filters.projectId}
            onChange={(e) => handleFilterChange('projectId', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sentiment
          </label>
          <div className="flex flex-wrap gap-2">
            {['positive', 'neutral', 'negative'].map((sentiment) => (
              <label key={sentiment} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={filters.sentiment.includes(sentiment)}
                  onChange={(e) => {
                    const newSentiments = e.target.checked
                      ? [...filters.sentiment, sentiment]
                      : filters.sentiment.filter(s => s !== sentiment);
                    handleFilterChange('sentiment', newSentiments);
                  }}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {sentiment}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Review Category
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.reviewCategory}
            onChange={(e) => handleFilterChange('reviewCategory', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="sprint">Sprint Review</option>
            <option value="release">Release Review</option>
            <option value="technical">Technical Review</option>
            <option value="quality">Quality Review</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;