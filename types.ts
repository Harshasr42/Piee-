
export enum SceneType {
  CORE = 'CORE',
  NOISE = 'NOISE',
  VOUCHER = 'VOUCHER',
  ECHOES = 'ECHOES',
  REASONS = 'REASONS',
  DREAMS = 'DREAMS',
  PROMISE = 'PROMISE',
  UNFOLD = 'UNFOLD'
}

export type ThemeType = 'rose' | 'lavender' | 'gold' | 'sea';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
}

export interface Bubble {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface Memory {
  id: number;
  url: string;
  caption: string;
  isFavorite?: boolean;
  voiceNoteId?: number;
}

export interface VoiceNote {
  id: number;
  data: string;
  date: string;
  duration?: string;
}

export interface Voucher {
  id: string;
  title: string;
  cost: string;
}

export interface DreamItem {
  id: string;
  label: string;
  description: string;
  image: string;
}

export interface DreamCategory {
  id: string;
  title: string;
  icon: string;
  items?: DreamItem[];
  subCategories?: DreamCategory[];
}
