import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';
import { taskCreationValidator,taskUpdateValidator } from '../validators/taskValidators.js';
import { me, createTask, getTask, updateTask, deleteTask } from '../controllers/taskController.js';

const routes=express.Router();

//protected route example
routes.get('/me',authMiddleware,me);
routes.post('/create-task',authMiddleware,taskCreationValidator,validationMiddleware,createTask);
routes.get('/get-tasks',authMiddleware,getTask);
routes.put('/update-task/:id',authMiddleware,taskUpdateValidator,validationMiddleware,updateTask);
routes.delete('/delete-task/:id',authMiddleware,deleteTask);

export default routes;