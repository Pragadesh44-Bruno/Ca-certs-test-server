const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

// Load the server certificate and private key
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
  ca: fs.readFileSync("ca.crt"), // Optional: Add if client certs are used
};

// Define a test route
app.get("/", (req, res) => {
  res.send("Welcome to the SSL-backed Node.js web service!");
});

// Create an HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log("Server is running at https://localhost");
});
