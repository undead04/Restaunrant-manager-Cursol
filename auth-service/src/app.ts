import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import runSeeds from "./database/seeds/user.seed";
import { errorHandler } from "./middleware/error.middleware";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use(errorHandler);

// Database initialization and server start
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    runSeeds();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(
        `Auth service is running on port ${PORT}, http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

export default app;
