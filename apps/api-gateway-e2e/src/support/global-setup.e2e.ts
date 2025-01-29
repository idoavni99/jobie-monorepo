/* eslint-disable */
const { setup: setupDevServer } = require('jest-dev-server');
const compose = require('docker-compose');
const path = require('path');

/* eslint-disable */
var __COMPOSE__: typeof compose;
var __path__: typeof path;
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');
  globalThis.__COMPOSE__ = compose;
  globalThis.__path__ = path;

  console.log(process.cwd());

  await globalThis.__COMPOSE__.upAll({
    cwd: path.join(__dirname),
    commandOptions: [['--build'], ['--force-recreate']],
    callback: (chunk: Buffer) => {
      console.log('Compose up in progress: ', chunk.toString());
    },
  });

  globalThis.server = await setupDevServer({
    command: 'node dist/apps/api-gateway/main.js',
    port: '3000',
    launchTimeout: 60000,
  });

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
