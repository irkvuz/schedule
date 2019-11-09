module.exports = {
  plugins: ['jest', 'import'],
  extends: [
    'react-app',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    curly: ['error', 'multi-line'],
    'import/order': ['error'],
  },
};
