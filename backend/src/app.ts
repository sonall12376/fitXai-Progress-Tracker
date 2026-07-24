console.log("APP.TS IS RUNNING");
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import progressRoutes from './routes/progress.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/progress', progressRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FitAI-X Backend running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
