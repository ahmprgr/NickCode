const app = require("./app");
const { port } = require("./../configs/env")
const runDB = require("./../configs/db");


async function bootstrap() {
  await app.listen(port, () => {
    console.log(`The server is runnig on port ${port}`);
  });
  await runDB();
}
bootstrap();
