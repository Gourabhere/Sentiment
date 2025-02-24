import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { MessageSquare, Users, CheckSquare, MessageCircle } from 'lucide-react';
import Header from './components/Header';
import KPICard from './components/KPICard';
import SentimentChart from './components/SentimentChart';
import DataGrid from './components/DataGrid';
import Sentiment from 'sentiment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import FilterSection from './components/FilterSection';
import { ChartData, SentimentData } from './types';

// Initialize sentiment analysis
const sentiment = new Sentiment();

const analyzeSentiment = (text: string): number => {
    return sentiment.analyze(text).score;
};

const calculateFinalSentimentScore = (whatWentWell: string, whatDidNotGoWell: string): number => {
    let score = analyzeSentiment(whatWentWell) - analyzeSentiment(whatDidNotGoWell);
    return Math.max(-1, Math.min(1, score));
};


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState<SentimentData[]>([]);
  const [filteredData, setFilteredData] = useState<SentimentData[]>([]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prevIsDarkMode => !prevIsDarkMode);
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    }
    else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      // Transform data to match our format and calculate sentiment scores
      const transformedData: SentimentData[] = jsonData.map((row: any) => ({
        issueKey: row.issue_key || '',
        teamId: row.team_id || 0,
        sprint: row.sprint || '',
        updated: row.updated || '',
        reasonForSuccessRateThemes: row.Reason_for_reported_success_rate_Themes || '',
        whatDidNotGoWellThemes: row.What_did_not_go_well_Themes || '', 
        whatWentWellThemes: row.What_went_well_Themes || '', 
        reasonForChurnThemes: row.Rason_for_Churn_Themes || '',
        Domain: row.Domain || '',
        whatDidNotGoWell: row.What_did_not_go_well || '',
        whatWentWell: row.What_went_well || '',
        reasonToChurn: row.ReasontoChurn || '',
        improvementOpportunity: row.improvementOpportunity || '', 
        reasonForSuccessRate: row.reasonForSuccessRate || '',
        comments: row.comments || '',
        sentimentScore: calculateFinalSentimentScore(row.What_went_well, row.What_did_not_go_well),
        whatWentWellScore: analyzeSentiment(row.What_went_well),
        whatDidNotGoWellScore: analyzeSentiment(row.What_did_not_go_well)
        }));

      
      
      
      setData(transformedData);
      setFilteredData(transformedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFilterChange = (filters: {
    teamId: string;
    sprint: string;
    sentiment: string[];
    Domain: string;
    theme: string[];
}) => {
    let filtered = [...data];

    if (filters.teamId) {
      filtered = filtered.filter(item => item.teamId.toString() === filters.teamId);
    }

    if (filters.sprint) {
      filtered = filtered.filter(item => 
        filters.sprint.includes(item.sprint)
      );
    }

    if (filters.theme.length > 0) {
      filtered = filtered.filter(item => {
          const itemThemes = [
              ...(item.reasonForSuccessRateThemes || []),
              ...(item.whatDidNotGoWellThemes || []),
              ...(item.whatWentWellThemes || []),
              ...(item.reasonForChurnThemes || [])
          ];
          return filters.theme.some(theme => itemThemes.includes(theme));
      });
    }


    if (filters.sentiment.length > 0) {
      filtered = filtered.filter(item => {
        const sentimentCategory = 
          item.sentimentScore > 0 ? 'positive' :
          item.sentimentScore < 0 ? 'negative' : 'neutral';
        return filters.sentiment.includes(sentimentCategory)
    });
    }

    if (filters.Domain) {
      filtered = filtered.filter(item => 
        filters.Domain.includes(item.Domain)
      ); 
    }

    setFilteredData(filtered);
  };

  const kpiCards = [
    {
      title: 'Average Sentiment',
      value: filteredData.length ? parseFloat(
        (filteredData.reduce((acc, curr) => acc + curr.sentimentScore, 0) / filteredData.length).toFixed(2)
        ) : 0,
      change: 12,
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Team Members',
      value: filteredData.length ? new Set(filteredData.map(d => d.teamId)).size : 0,
      change: 8,
      icon: <Users className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Stories Delivered',
      value: filteredData.length || 0,
      change: -5,
      icon: <CheckSquare className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Communication Score',
      value: 85,
      change: 15,
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />
    }
  ];

  const sentimentDistribution = [
    { name: 'Positive', value: filteredData.filter(d => d.whatWentWellScore > 0).length },
    { name: 'Neutral',  value: filteredData.filter(d => 
      d.whatWentWellScore === 0 ||  // Either what went well is neutral
      d.whatDidNotGoWellScore === 0 // OR what didn't go well is neutral
    ).length  },
    { name: 'Negative', value: filteredData.filter(d => d.whatDidNotGoWellScore < 0).length }
  ];

  const teamSentimentData: ChartData[] = [
    {
      name: 'Positive', value: filteredData.length ? filteredData.reduce((acc, curr) => acc + curr.whatWentWellScore, 0) / filteredData.length : 0,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    },
    {
      name: 'Negetive', value: filteredData.length ? filteredData.reduce((acc, curr) => acc + curr.whatDidNotGoWellScore, 0) / filteredData.length : 0,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    },
  ];

  const TeamSentimentBarChart: React.FC<{ data: ChartData[] }> = ({ data }) => { 
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: isDarkMode ? '#fff' : '#333' }}
          />
          <YAxis domain={[-1, 1]} tick={{ fill: isDarkMode ? '#fff' : '#333' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1F2937' : '#fff',
              borderColor: isDarkMode ? '#374151' : '#e5e7eb'
            }}
            itemStyle={{ color: isDarkMode ? '#fff' : '#333' }}
            formatter={(value: number) => [value.toFixed(2), 'Score']}
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Positive' ? '#4CAF50' : '#f44336'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onFileUpload={handleFileUpload}
      />

      <main className="container mx-auto px-4 py-8">
        <FilterSection data={data} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <KPICard key={index} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Sentiment Distribution
            </h2>
            <SentimentChart data={sentimentDistribution} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Team Sentiment Overview
            </h2>
            <TeamSentimentBarChart data={teamSentimentData} />
            {/* Add another chart component here */}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Detailed Analysis
            </h2>
          </div>
          <DataGrid data={filteredData} filters={{
            teamId: 0,
            sprint: '',
            sentiment: [],
            Domain: '',
            theme: [],
            improvementOpportunity: '',
          }} />
        </div>
      </main>
    </div>
  );
}

export default App;