const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => res.send('Server Test OK'));

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
