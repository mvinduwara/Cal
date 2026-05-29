import express from 'express';
import cors from 'cors';
import calculateRouter from './routes/calculate';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.use('/api/calculate', calculateRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Calculator API running → http://localhost:${PORT}`);
});