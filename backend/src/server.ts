import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`Smart-Quiz backend running at http://localhost:${PORT}`);
});
