//backend main file
import 'dotenv/config.js';
import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app=express();
app.use(express.json());
app.use(cookieParser());

//connect to database
connectDB();

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
}))

//routes
app.get('/',(req,res)=>{
    res.send('API is running...');
});

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

//backend routes
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);

app.use(errorHandler);