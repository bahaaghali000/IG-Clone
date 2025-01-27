const http = require("http");
require("dotenv").config();
const app = require("./app");
require("./db");
const { initializeSocket } = require("./sockets/socket.js");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});
