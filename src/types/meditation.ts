export interface Theme {
  id: string;
  label: string;
  description: string;
  healingProperties: string[];
  resonancePattern: string;
  visualElements: string[];
}

export interface ThemeCategory {
  title: string;
  description: string;
  themes: Theme[];
} 