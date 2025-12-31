import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next)=>{
    try{
        //check for token in cookies
        const token =req.cookies.token;
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }

        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user= decoded;

        next();
    }catch(error){
        console.log(error);
        res.status(401).json({message:'Unauthorized'});

    }

};

const roleMiddleware = (requiredRole)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({message:'Unauthorized'});
        }

        console.log("Required Role:", requiredRole);
        console.log("User Role:", req.user.role, requiredRole);

        if(req.user.role !== requiredRole){
            return  res.status(403).json({message:'Forbidden: Insufficient permissions'});
        }
        next();
    }
}


export { authMiddleware, roleMiddleware };