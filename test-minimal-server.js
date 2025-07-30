import express from 'express';

const app = express();
const PORT = 3002;

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

console.log('Starting test server...');