import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.route.js';
import cors from 'cors';

const app = express();
dotenv.config();

app.use(express.json());



//routes
app.use("/fms/api/v1",authRoutes);

const port = process.env.PORT;
app.listen(port,async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectDB();

})