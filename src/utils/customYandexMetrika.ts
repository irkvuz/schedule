declare global {
  interface Window {
    ym: (id: number, action: 'hit' | 'reachGoal', args: any) => void;
  }
}

const YM_ID = Number(process.env.YANDEX_METRIKA_IDENTIFIER);

const isProduction = process.env.NODE_ENV === 'production';

export function reachGoal(identifier: string) {
  if (typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', identifier);
  } else {
    if (isProduction) {
      console.error('Tracking is missing');
    }
  }
}

export function hit(url: string) {
  if (typeof window.ym === 'function') {
    window.ym(YM_ID, 'hit', url);
  } else {
    if (isProduction) {
      console.error('Tracking is missing');
    }
  }
}
