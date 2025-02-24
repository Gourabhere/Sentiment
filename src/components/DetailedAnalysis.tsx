// import React from 'react';
// import { SentimentData } from '../types';

// interface DetailedAnalysisProps {
//   data: SentimentData[];
//   filters: {
//     teamId: string;
//     sprint: string;
//     sentiment: string[];
//     Domain: string;
//     theme: string | string[]; // Updated to handle both single-select (string) and multi-select (string[])
//   };
// }

// const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ data, filters }) => {
//   // Normalize filters.theme to handle both single-select (string) and multi-select (string[])
//   const selectedThemes = Array.isArray(filters.theme) ? filters.theme : [filters.theme];

//   // Filter data based on all filters except themes (themes will be handled separately)
//   const filteredData = data.filter((item) => {
//     const matchesTeamId = !filters.teamId || item.teamId.toString() === filters.teamId;
//     const matchesSprint = !filters.sprint || item.sprint === filters.sprint;
//     const matchesDomain = !filters.Domain || item.Domain === filters.Domain;
//     const matchesSentiment =
//       !filters.sentiment.length ||
//       filters.sentiment.includes('All Sentiments') ||
//       (filters.sentiment.includes('positive') && item.sentimentScore > 0) ||
//       (filters.sentiment.includes('neutral') && item.sentimentScore === 0) ||
//       (filters.sentiment.includes('negative') && item.sentimentScore < 0);
//     return matchesTeamId && matchesSprint && matchesDomain && matchesSentiment;
//   });

//   // Filter data based on themes
//   const themeFilteredData = selectedThemes.length > 0
//     ? filteredData.filter(item => {
//         const hasTheme = (
//           selectedThemes.some(theme => 
//             (item.reasonForSuccessRateThemes && item.reasonForSuccessRateThemes.includes(theme)) ||
//             (item.whatDidNotGoWellThemes && item.whatDidNotGoWellThemes.includes(theme)) ||
//             (item.whatWentWellThemes && item.whatWentWellThemes.includes(theme)) ||
//             (item.reasonForChurnThemes && item.reasonForChurnThemes.includes(theme))
//           )
//         );
//         return hasTheme;
//       })
//     : filteredData;

//   const displayData = themeFilteredData;


//   if (displayData.length === 0) {
//     return (
//       <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-lg mt-6 text-center text-gray-500 dark:text-gray-400">
//         No data matches the selected filters.
//       </div>

//     );
//   }

//   return (
//     <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-lg mt-6">
//       <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Detailed Analysis</h2>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-200 dark:bg-gray-600">
//              <th className="p-2 border-b border-gray-300 dark:border-gray-500">Domain</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">Sprint</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">Team ID</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">What Did Not Go Well</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">What Went Well</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">Reason For Churn</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">Improvement Opportunity</th>
//               <th className="p-2 border-b border-gray-300 dark:border-gray-500">Reason For Success</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayData.map((item, index) => (
//               <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.sprint}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.teamId}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.Domain}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.whatDidNotGoWell || '-'}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.whatWentWell || '-'}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.reasonToChurn || '-'}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.improvementOpportunity || '-'}</td>
//                 <td className="p-2 border-b border-gray-200 dark:border-gray-600">{item.reasonForSuccessRate || '-'}</td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DetailedAnalysis;