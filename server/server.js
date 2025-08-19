const express = require('express');
const app = express();
const {PORT} = require("./constants");

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running: Key-N-Share');
});

app.listen(PORT, () => {
  console.log(`Key-N-Share: Server running on port ${PORT}`);
});
