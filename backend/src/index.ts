import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import threatRoutes from './routes/threat.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/threats', threatRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
