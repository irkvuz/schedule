import ym from 'react-yandex-metrika';

export function reachGoal(identifier: String) {
  if (process.env.NODE_ENV === 'production') {
    ym('reachGoal', identifier);
  } else if (process.env.NODE_ENV !== 'test') {
    console.log('[Yandex Metrika] reachGoal', identifier, process.env.NODE_ENV);
  }
}
