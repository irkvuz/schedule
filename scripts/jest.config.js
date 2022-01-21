// This config is only for files inside `./scripts` folder

const config = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
};

module.exports = config;
