//backend/src/routes/authRoutes.js
import express from 'express';
import { registerUser,loginUser,logoutUser,adminOnly,getAllUsers,updateUserRole } from '../controllers/authController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';
import {registerValidator,loginValidator} from '../validators/authValidators.js';

const router=express.Router();

router.post('/register', registerValidator, validationMiddleware, registerUser);
router.post('/login', loginValidator, validationMiddleware, loginUser);
router.post('/logout',authMiddleware,logoutUser);
router.get('/admin-only',authMiddleware,roleMiddleware('admin'),adminOnly);
router.get('/admin/users',authMiddleware,roleMiddleware('admin'),getAllUsers);
router.put('/admin/users/:id/role',authMiddleware,roleMiddleware('admin'),updateUserRole);

export default router;

