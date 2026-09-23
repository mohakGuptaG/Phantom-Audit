import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(
      `Backend server running on port ${env.PORT} in ${env.NODE_ENV} mode`
    );
  });
};

startServer();