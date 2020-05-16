import ym from 'react-yandex-metrika';

export function reachGoal(identifier: String) {
  if (process.env.NODE_ENV === 'production') {
    ym('reachGoal', identifier);
  } else {
    console.log('[Yandex Metrika] reachGoal', identifier);
  }
}
