import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import cors from 'cors';

const app = express();
dotenv.config();

//routes
app.get('/', (req, res) => {
    res.send('Hello World!');
})
const port = process.env.PORT;
app.listen(port,async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    await connectDB();

})