import React from 'react';
import { SentimentData } from '../types';

interface DataGridProps {
  data: SentimentData[];
}

const getSentimentEmoji = (score: number) => {
  if (score >= 0.7) return '😊';
  if (score >= 0.3) return '😐';
  return '😞';
};

const getRAGColor = (score: number) => {
  if (score >= 0.7) return 'bg-green-500';
  if (score >= 0.3) return 'bg-yellow-500';
  return 'bg-red-500';
};

const DataGrid: React.FC<DataGridProps> = ({ data }) => {
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sentiment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
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
                  {row.whatWentWell}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="max-w-xs overflow-hidden text-ellipsis">
                  {row.whatDidNotGoWell}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                <div className="max-w-xs overflow-hidden text-ellipsis">
                  {row.Domain}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {row.sentimentScore.toFixed(2)} {getSentimentEmoji(row.sentimentScore)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRAGColor(row.sentimentScore)}`}>
                  &nbsp;
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;