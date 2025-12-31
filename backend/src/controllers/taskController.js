import User from '../models/User.js';
import Task from '../models/Task.js';

const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name role");
        res.status(200).json({ message: `Hello ${user.name}, you have accessed a protected route!` });
    } catch (error) {
        console.log(error);
        // res.status(500).json({ message: 'Server error' });
        next(error);
    }
};

const createTask = async(req,res)=>{
    try{
        const {title,description}=req.body;
        if(!title || !description){
            return res.status(400).json({message:'Please provide title and description'});
        }

        const task=await Task.create({
            title,
            description,
            createdBy:req.user.id
        });
        await task.save();

        res.status(201).json({message:'Task created successfully',task});
    }catch(error){
        console.log(error);
        // res.status(500).json({message:'Server error'});
        next(error);
    }
}

const getTask = async(req,res)=>{
    try{
        let tasks;
        if(req.user.role==='admin'){
            tasks=await Task.find().populate('createdBy','name email');
            // res.status(200).json({tasks});
        }else{
            tasks=await Task.find({createdBy:req.user.id});
        }

        res.status(200).json({tasks});
    }catch(error){
        console.log(error);
        // res.status(500).json({message:'Server error'});
        next(error);
    }
}

const updateTask = async(req,res)=>{
    try{
        const {id} = req.params;        //task id from url
        const task = await Task.findById(id);
        if(!task){
            // return res.status(404).json({message:'Task not found'});
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        //only creator or admin can update
        if(task.createdBy.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({message:'Not allowed to update this task'});
        }

        const updatedTask = await Task.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
        });

        res.status(200).json({
            message:'Task updated successfully',
            task:updatedTask,
        });
    }catch(error){
        console.log(error);
        // res.status(500).json({
        //     message:'Server error',
        //     error:error.message,
        // });
        next(error);
    }
}

const deleteTask = async(req,res)=>{
    try{
        const {id} = req.params;        //task id from url
        const task = await Task.findById(id);
        if (!task) {
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        //only creator or admin can delete
        if(task.createdBy.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({message:'Not allowed to delete this task'});
        }

        // const deletedTask = await Task.findByIdAndDelete(id);
        const deletedTask = await task.deleteOne(); 

        res.status(200).json({message:'Task deleted successfully',task:deletedTask});
    }catch(error){
        console.log(error);
        // res.status(500).json({message:'Server error'});
        next(error);
    }
}



export { me, createTask, getTask, updateTask, deleteTask };