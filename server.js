const express = require("express");
const path = require("node:path");
const app = express();
const server = require("node:http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "../public")));

// Route for "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
