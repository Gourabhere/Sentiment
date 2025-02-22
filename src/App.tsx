import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { MessageSquare, Users, CheckSquare, MessageCircle } from 'lucide-react';
import Header from './components/Header';
import KPICard from './components/KPICard';
import SentimentChart from './components/SentimentChart';
import DataGrid from './components/DataGrid';
import FilterSection from './components/FilterSection';
import { SentimentData } from './types';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState<SentimentData[]>([]);
  const [filteredData, setFilteredData] = useState<SentimentData[]>([]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      // Transform data to match our format
      const transformedData: SentimentData[] = jsonData.map((row: any) => ({
        nameKey: row.name_key || '',
        nameId: row.name_id || 0,
        description: row.description || '',
        updatedDate: row.updated_date || '',
        sentimentScore: row.sentiment_score || 0,
        teamId: row.team_id || '',
        projectId: row.project_id || '',
        reviewCategory: row.review_category || ''
      }));
      
      setData(transformedData);
      setFilteredData(transformedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFilterChange = (filters: {
    teamId: string;
    projectId: string;
    sentiment: string[];
    reviewCategory: string;
  }) => {
    let filtered = [...data];

    if (filters.teamId) {
      filtered = filtered.filter(item => 
        item.teamId.toLowerCase().includes(filters.teamId.toLowerCase())
      );
    }

    if (filters.projectId) {
      filtered = filtered.filter(item =>
        item.projectId.toLowerCase().includes(filters.projectId.toLowerCase())
      );
    }

    if (filters.sentiment.length > 0) {
      filtered = filtered.filter(item => {
        const sentimentCategory = 
          item.sentimentScore >= 0.7 ? 'positive' :
          item.sentimentScore >= 0.3 ? 'neutral' : 'negative';
        return filters.sentiment.includes(sentimentCategory);
      });
    }

    if (filters.reviewCategory) {
      filtered = filtered.filter(item =>
        item.reviewCategory === filters.reviewCategory
      );
    }

    setFilteredData(filtered);
  };

  const kpiCards = [
    {
      title: 'Average Sentiment',
      value: filteredData.length ? filteredData.reduce((acc, curr) => acc + curr.sentimentScore, 0) / filteredData.length : 0,
      change: 12,
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Team Members',
      value: filteredData.length ? new Set(filteredData.map(d => d.nameKey)).size : 0,
      change: 8,
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Stories Delivered',
      value: filteredData.length || 0,
      change: -5,
      icon: <CheckSquare className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Communication Score',
      value: 85,
      change: 15,
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
    },
  ];

  const sentimentDistribution = [
    { name: 'Positive', value: filteredData.filter(d => d.sentimentScore >= 0.7).length },
    { name: 'Neutral', value: filteredData.filter(d => d.sentimentScore >= 0.3 && d.sentimentScore < 0.7).length },
    { name: 'Negative', value: filteredData.filter(d => d.sentimentScore < 0.3).length },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onFileUpload={handleFileUpload}
      />
      
      <main className="container mx-auto px-4 py-8">
        <FilterSection onFilterChange={handleFilterChange} />
        
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
            {/* Add another chart component here */}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Detailed Analysis
            </h2>
          </div>
          <DataGrid data={filteredData} />
        </div>
      </main>
    </div>
  );
}

export default App;