declare global {
  interface Window {
    ym: (id: number, action: 'hit' | 'reachGoal', args: any) => void;
  }
}

const YM_ID = Number(process.env.YANDEX_METRIKA_IDENTIFIER);

const isProduction = process.env.NODE_ENV === 'production';

export function reachGoal(identifier: string) {
  if(!isProduction) {
    console.log('[Yandex Metrika] reachGoal', identifier);
  }

  if (isProduction && typeof window.ym !== 'function') {
    console.error('Tracking is missing');
    return;
  }

  window.ym(YM_ID, 'reachGoal', identifier)
}

export function hit(url: string) {
  if(!isProduction) {
    console.log('[Yandex Metrika] hit', url);
  }

  if (isProduction && typeof window.ym !== 'function') {
    console.error('Tracking is missing');
    return;
  }

  window.ym(YM_ID, 'hit', url);
}
