import React from 'react';
import { SentimentData } from '../types';


interface DataGridProps {
  data: SentimentData[];
  filters: {
    teamId: number;
    sprint: string;
    sentiment: string[];
    Domain: string;
    theme: string | string[];
    improvementOpportunity: string; // Updated to handle both single-select (string) and multi-select (string[])
  };
}

const getSentimentEmoji = (score: number) => {
  if (score > 0) return '😊';
  if (score == 0) return '😐';
  if (score < 0) return '😞';
};

const getRAGColor = (score: number) => {
  if (score > 0) return 'bg-green-500';
  if (score == 0) return 'bg-yellow-500';
  if (score < 0) return 'bg-red-500';
  return 'bg-red-500';
};

const DataGrid: React.FC<DataGridProps> = ({ data, filters }) => {
  // Log filters for debugging
  console.log('Filters in DataGrid:', filters);
  // Normalize filters.theme to handle both single-select (string) and multi-select (string[])
  const selectedThemes = Array.isArray(filters.theme) ? filters.theme : [filters.theme || ''];
  // Filter data based on all filters except themes (themes will be handled separately)
  const filteredData = data.filter(item => {
    const matchesTeamId = !filters.teamId || item.teamId === filters.teamId;
    const matchesSprint = !filters.sprint || item.sprint === filters.sprint;
    const matchesDomain = !filters.Domain || item.Domain === filters.Domain;
    return matchesTeamId && matchesSprint && matchesDomain;
  });
  // Determine which columns to show based on selected themes
  const showReasonForSuccess = selectedThemes.includes('reasonForSuccessRate');
  const showWhatDidNotGoWell = selectedThemes.includes('What Did Not Go Well Themes');
  const showWhatWentWell = selectedThemes.includes('What Went Well Themes');
  const showReasonForChurn = selectedThemes.includes('ReasonForChurnThemes');
  // If no themes are selected or "All Themes" is selected, show all relevant columns
  const hasSelectedThemes = selectedThemes.length > 0 && !selectedThemes.includes('');
  const displayData = hasSelectedThemes
    ? filteredData.filter(item => {
        return (
          (showReasonForSuccess && item.reasonForSuccessRate) ||
          (showWhatDidNotGoWell && item.whatDidNotGoWell) ||
          (showWhatWentWell && item.whatWentWell) ||
          (showReasonForChurn && item.reasonToChurn)
        );
      })
    : filteredData;
  // Log displayData for debugging
  console.log('Display Data:', displayData);
  if (displayData.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-lg mt-6 text-center text-gray-500 dark:text-gray-400">
        No data matches the selected filters.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Issue Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Team ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sprint Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              What Went Well
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              What Did Not Go Well
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Domain
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sentiment
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            improvementOpportunity
            </th>
            {showReasonForSuccess && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reason For Success
              </th>
            )}
            {showWhatDidNotGoWell && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                What Did Not Go Well
              </th>
            )}
            {showWhatWentWell && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                What Went Well
              </th>
            )}
            {showReasonForChurn && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reason For Churn
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.issueKey}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                {row.teamId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                {row.sprint}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.updated.toString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="max-w-xs overflow-hidden text-ellipsis">
                  {row.whatWentWell} | {row.whatWentWellScore.toFixed(2)} | {getSentimentEmoji(row.whatWentWellScore)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="max-w-xs overflow-hidden text-ellipsis">
                  {row.whatDidNotGoWell} | {row.whatDidNotGoWellScore.toFixed(2)} | {getSentimentEmoji(row.whatDidNotGoWellScore)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="max-w-xs overflow-hidden text-ellipsis">
                  {row.Domain}
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {row.sentimentScore?.toFixed(2) || '0.00'} {getSentimentEmoji(row.sentimentScore || 0)}
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-md ${getRAGColor(row.sentimentScore || 0)} text-white`}
                >
                  {row.sentimentScore?.toFixed(2) || '0.00'} 
                </span>
                {' '}{getSentimentEmoji(row.sentimentScore || 0)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="max-w-xs overflow-hidden text-ellipsis">
                  {row.improvementOpportunity}
                </div>
              </td>
              {showWhatDidNotGoWell && (
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  <div className="max-w-xs overflow-hidden text-ellipsis">
                    {row.whatDidNotGoWell || '-'}
                  </div>
                </td>
              )}
              {showWhatWentWell && (
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  <div className="max-w-xs overflow-hidden text-ellipsis">
                    {row.whatWentWell || '-'}
                  </div>
                </td>
              )}
              {showReasonForChurn && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {row.reasonToChurn || '-'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;