require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Contact Identification API",
      description: "API to manage customer contact identification and linking",
      version: "1.0.0",
    },
  },
  apis: ["./controllers/contactController.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/identify", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/identify", contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
