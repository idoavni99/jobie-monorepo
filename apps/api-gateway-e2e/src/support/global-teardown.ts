const { teardown: teardownDevServer } = require('jest-dev-server');

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  await teardownDevServer(globalThis.server);
  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
