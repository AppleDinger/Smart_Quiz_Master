import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

// simple health
app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
