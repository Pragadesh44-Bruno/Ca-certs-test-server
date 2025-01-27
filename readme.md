# SSL-Backed Node.js Web Service

This repository demonstrates how to create a secure SSL/TLS-backed web service using Node.js. The web service uses self-signed certificates generated via a custom Certificate Authority (CA).

## Features
- HTTPS support with custom CA certificates
- Basic web service created using Node.js and Express
- Secure communication with SSL/TLS encryption

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- OpenSSL (to generate the certificates)

---

## Setup Instructions

### 1. Generate the Certificates

#### a. Create a Certificate Authority (CA)
```bash
openssl genrsa -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
```

#### b. Generate a Private Key and CSR for the Server
```bash
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
```

#### c. Sign the Server Certificate Using the CA
```bash
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -sha256
```

This process generates the following files:
- `ca.key`: Private key for the CA
- `ca.crt`: Certificate for the CA
- `server.key`: Private key for the server
- `server.csr`: Certificate Signing Request for the server
- `server.crt`: Server certificate signed by the CA

---

### 2. Install Dependencies

Run the following command to install necessary packages:
```bash
npm install express
```

---

### 3. Configure the Web Service

Create a file named `server.js` and use the following code:

```javascript
const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

// Load the server certificate and private key
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
  ca: fs.readFileSync("ca.crt"),
};

// Define a test route
app.get("/", (req, res) => {
  res.send("Welcome to the SSL-backed Node.js web service!");
});

// Create an HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log("Server is running at https://localhost");
});
```

---

### 4. Run the Web Service

Start the server with:
```bash
node server.js
```

Visit `https://localhost` in your browser.

> **Note**: You may encounter a security warning because your custom CA is not trusted by default.

---

### 5. Trust the CA Certificate (Optional)

To avoid browser warnings, trust the CA certificate:

#### a. Linux
Copy `ca.crt` to `/usr/local/share/ca-certificates/` and update certificates:
```bash
sudo cp ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

#### b. macOS
Import `ca.crt` into Keychain Access and mark it as "Always Trust."

#### c. Windows
Use the Certificate Manager to import `ca.crt` into the "Trusted Root Certification Authorities" store.

---

## Project Structure
```
.
├── ca.crt            # Certificate Authority certificate
├── ca.key            # Certificate Authority private key
├── server.crt        # Server certificate
├── server.csr        # Server certificate signing request
├── server.key        # Server private key
├── server.js         # Node.js web service
├── package.json      # Node.js dependencies
└── README.md         # Documentation
```

---

## Additional Notes

### Self-Signed Certificates
This setup uses self-signed certificates for development and testing. For production environments, it’s recommended to use certificates from a trusted CA like [Let's Encrypt](https://letsencrypt.org/).

### Using Client Certificates
To enable mutual TLS (client and server authentication):
1. Generate client certificates similarly to the server certificates.
2. Update `server.js` to validate client certificates by setting `requestCert: true` in the HTTPS options.

---

## License
This project is licensed under the MIT License. Feel free to modify and use it as needed.
