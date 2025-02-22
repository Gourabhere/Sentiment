import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          {icon}
        </div>
        <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </span>
      </div>
      <h3 className="mt-4 text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
};

export default KPICard;