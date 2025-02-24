import React from 'react';
import { Filter } from 'lucide-react';
import Select, { MultiValue } from 'react-select';
import { SentimentData } from '../types';

interface FilterSectionProps {
  data: SentimentData[];
  onFilterChange: (filters: {
    teamId: string;
    sprint: string;
    sentiment: string[];
    Domain: string;
    theme: string[];
    improvementOpportunity: string;
  }) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ data, onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    teamId: '',
    sprint: '',
    sentiment: [] as string[],
    Domain: '',
    theme: [] as string[],
    improvementOpportunity: '',
  });

  // Define theme categories (column names) explicitly, including "All Themes" as the default
  const themeCategories = [
    { value: '', label: 'All Themes' },
    { value: 'Reason For Success Rate Themes', label: 'Reason For Success Rate Themes' },
    { value: 'What Did Not Go Well Themes', label: 'What Did Not Go Well Themes' },
    { value: 'What Went Well Themes', label: 'What Went Well Themes' },
    { value: 'ReasonForChurnThemes', label: 'ReasonForChurnThemes' },
  ];

  // Extract unique values for other dropdowns
  const uniqueTeamIds = React.useMemo(() =>
    Array.from(new Set(data.map(item => item.teamId))).sort(),
    [data]
  );

  const uniqueSprints = React.useMemo(() =>
    Array.from(new Set(data.map(item => item.sprint))).sort(),
    [data]
  );

  const uniqueDomains = React.useMemo(() =>
    Array.from(new Set(data.map(item => item.Domain))).sort(),
    [data]
  );

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearTheme = () => {
    const newFilters = { ...filters, theme: [] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle theme selection (remove "All Themes" if specific themes are selected)
  const handleThemeChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    const values = selectedOptions.map(option => option.value);
    if (values.includes('')) {
      // If "All Themes" is selected, clear all specific themes
      handleFilterChange('theme', []);
    } else {
      // Remove "All Themes" from the selection if any specific theme is selected
      handleFilterChange('theme', values.filter(value => value !== ''));
    }
  };

  // Custom styles for react-select to match your design
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#ffffff',
      borderColor: '#d1d5db',
      borderRadius: '0.375rem',
      padding: '0.25rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af',
      },
      minHeight: '2.5rem',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#ffffff',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
    option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#d1d5db' : state.isFocused ? '#f3f4f6' : '#ffffff',
      color: '#1f2937',
      padding: '0.5rem 0.75rem',
      cursor: 'pointer',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#e5e7eb',
      borderRadius: '0.25rem',
      padding: '0.25rem 0.5rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#1f2937',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#f3f4f6',
        color: '#374151',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#6b7280',
    }),
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
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.teamId}
            onChange={(e) => handleFilterChange('teamId', e.target.value)}
          >
            <option value="">All Teams</option>
            {uniqueTeamIds.map((teamId) => (
              <option key={teamId} value={teamId}>
                {teamId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project ID
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.sprint}
            onChange={(e) => handleFilterChange('sprint', e.target.value)}
          >
            <option value="">All Projects</option>
            {uniqueSprints.map((sprint) => (
              <option key={sprint} value={sprint}>
                {sprint}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Themes
          </label>
          <Select
            isMulti
            options={themeCategories}
            value={themeCategories.filter(option => filters.theme.includes(option.value))}
            onChange={handleThemeChange}
            placeholder="All Themes"
            styles={customStyles}
            className="w-full"
            classNamePrefix="react-select"
          />
          {filters.theme.length > 0 && (
            <button
              onClick={handleClearTheme}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1"
            >
              Clear Themes
            </button>
          )}
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
            Domain
          </label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={filters.Domain}
            onChange={(e) => handleFilterChange('Domain', e.target.value)}
          >
            <option value="">All Domains</option>
            {uniqueDomains.map((Domain) => (
              <option key={Domain} value={Domain}>
                {Domain}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;