const { teardown: teardownDevServer } = require('jest-dev-server');

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  await teardownDevServer(globalThis.server);
  await globalThis.__COMPOSE__.down({
    cwd: globalThis.__path__.join(__dirname),
    commandOptions: [['--volumes'], ['--remove-orphans'], ['-t', '1']],
    callback: (chunk: Buffer) => {
      console.log('Compose down in progress: ', chunk.toString());
    },
  });
  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
