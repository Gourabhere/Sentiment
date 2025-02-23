import React from 'react';
import { Filter } from 'lucide-react';
import { SentimentData } from '../types';

interface FilterSectionProps {
    data: SentimentData[];
    onFilterChange: (filters: {
        teamId: string;
        sprint: string;
        sentiment: string[];
        Domain: string;
    }) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ data, onFilterChange }) => {
    const [filters, setFilters] = React.useState({
        teamId: '',
        sprint: '',
        sentiment: [] as string[],
        Domain: ''
    });

    // Extract unique values for dropdowns
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