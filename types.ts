
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
}

export interface Voucher {
  id: string;
  title: string;
  cost: string;
}
