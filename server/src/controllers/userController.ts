import { Router } from 'express';
import CustomError from '../utils/CustomError';
import { authenticateUser } from '../utils/middlewares';
import { Cookie, ErrorCode, UserRole } from '../utils/types';

const userController = Router();

userController.get('/me', authenticateUser, (req, res, next) => {
  if(req.customer) {
    res.json({
      success: true,
      data: {
        user: req.customer,
        role: UserRole.CUSTOMER
      }
    });
  }else if(req.cook) {
    res.json({
      success: true,
      data: {
        user: req.cook,
        role: UserRole.COOK
      }
    });
  }else if(req.isAdmin) {  
    res.json({
      success: true,
      data: {
        role: UserRole.ADMIN,
        id: process.env.ROOT_ID
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

userController.get('/logout', authenticateUser, (req, res, next) => {
  if(req.isAdmin || req.cook || req.customer) {
    res.clearCookie(Cookie.TOKEN);
    res.json({
      success: true
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

export default userController;