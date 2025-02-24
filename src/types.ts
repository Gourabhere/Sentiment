export interface SentimentData {
  issueKey: string;
  teamId: number;
  sprint: string;
  updated: Date;
  reasonForSuccessRateThemes: string;
  whatDidNotGoWellThemes: string;
  whatWentWellThemes: string;
  reasonForChurnThemes: string;
  Domain: string;
  whatDidNotGoWell: string;
  whatWentWell: string;
  reasonToChurn: string;
  improvementOpportunity: string;
  reasonForSuccessRate: string;
  comments: string;
  sentimentScore: number;
  whatWentWellScore: number,
  whatDidNotGoWellScore: number;
}

export interface KPICard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

export interface ChartData {
  x: string | number | undefined;
  y: string | number | undefined;
  width: string | number | undefined;
  height: string | number | undefined;
  name: string;
  value: number;
}
