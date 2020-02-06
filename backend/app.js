const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

/* Defining Routes */
const prerequisiteRoutes = require("./routes/prerequisite");
const networkRoutes = require("./routes/network");
const chaincodeRoutes = require("./routes/chaincode");
const identityRoutes = require("./routes/identities");
const explorerRoutes = require("./routes/explorer");
const swaggerRoutes = require("./routes/swagger");
const dockerRoutes = require("./routes/docker");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/prerequisite", prerequisiteRoutes);
app.use("/network", networkRoutes);
app.use("/chaincode", chaincodeRoutes);
app.use("/identities", identityRoutes);
app.use("/explorer", explorerRoutes);
app.use("/swagger", swaggerRoutes);
app.use("/docker", dockerRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
