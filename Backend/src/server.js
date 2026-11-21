import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server Backend Desa Tambakrigadung aktif pada port ${env.PORT} [${env.NODE_ENV}]`);
});

const shutdown = () => {
  // eslint-disable-next-line no-console
  console.log("Shutting down backend server gracefully...");
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
