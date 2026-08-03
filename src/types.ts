export type NavTab = 'dashboard' | 'learn' | 'scan' | 'library' | 'settings';

export type Language = 'es' | 'en';

export interface DiseaseActivity {
  id: string;
  titleEs: string;
  titleEn: string;
  locationEs: string;
  locationEn: string;
  timeEs: string;
  timeEn: string;
  statusEs: string;
  statusEn: string;
  statusType: 'ACTIONED' | 'URGENT';
  image: string;
  confidence?: string;
}

export interface Pathogen {
  id: string;
  scientificName: string;
  commonNameEs: string;
  commonNameEn: string;
  severityEs: 'Crítico' | 'Moderado' | 'Alerta Max';
  severityEn: 'Critical' | 'Moderate' | 'Max Alert';
  descriptionEs: string;
  descriptionEn: string;
  symptomsEs: string[];
  symptomsEn: string[];
  controlMeasuresEs: string[];
  controlMeasuresEn: string[];
  image: string;
  category: 'fungal' | 'bacterial' | 'viral';
}

export interface LearnStage {
  id: string;
  stageNumber: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  tagsEs: string[];
  tagsEn: string[];
  icon: string;
  image?: string;
  images?: string[];
  targetPh?: string;
  statusBadgeEs?: string;
  statusBadgeEn?: string;
  keyTakeawaysEs: string[];
  keyTakeawaysEn: string[];
}

export interface WeatherAlert {
  regionEs: string;
  regionEn: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  humidity: string;
  temperature: string;
}

export interface ScanResult {
  pathogenName: string;
  scientificName: string;
  commonName: string;
  confidence: number;
  severity: 'CRÍTICO' | 'MODERADO' | 'URGENTE' | 'NORMAL';
  symptoms: string[];
  controlMeasures: string[];
  phytosanitaryNotes: string;
}

export interface CropFolderStep {
  id: string;
  dayRange: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  completed: boolean;
  type: 'PREVENTION' | 'NUTRITION' | 'SANITATION' | 'HARVEST';
}

export interface CropFolder {
  id: string;
  name: string;
  phaseEs: string;
  phaseEn: string;
  plantCount: number;
  startDate?: string;
  steps: CropFolderStep[];
}

export interface NotificationItem {
  id: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'scan' | 'crop_task';
  folderName?: string;
  actionType?: 'FUMIGAR' | 'DESLAVAR' | 'COSECHAR' | 'NUTRICION' | 'OTRO';
  actionPrompt?: string;
}
