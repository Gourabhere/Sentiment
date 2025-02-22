export interface SentimentData {
  issueKey: string;
  teamId: string;
  sprintProject: string;
  updated: string;
  reasonForSuccessRateThemes: string;
  whatDidNotGoWellThemes: string;
  whatWentWellThemes: string;
  reasonForChurnThemes: string;
  domain: string;
  whatDidNotGoWell: string;
  whatWentWell: string;
  reasonToChurn: string;
  improvementOpportunity: string;
  reasonForSuccessRate: string;
  comments: string;
  sentimentScore: number;
}

export interface KPICard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
}