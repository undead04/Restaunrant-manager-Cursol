import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Manager API",
      version: "1.0.0",
      description: "API documentation for Restaurant Manager System",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Auth server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Path to the API routes and models
};

export const swaggerSpec = swaggerJsdoc(options);
