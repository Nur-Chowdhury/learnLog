import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LearnLog API Documentation",
            version: "1.0.0",
        },
    },
    apis: ["./backend/routes/*.js"],
};

const customCss = `
    .topbar {
        display: flex !important;
        justify-content: space-between !important;
        padding: 20px !important; /* optional spacing */
    }

    .topbar .topbar-wrapper {
        display: flex !important;
        width: 100% !important;
        justify-content: space-between !important;
        align-items: center;
    }
`;

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {customCss}));
};

export default setupSwagger;
