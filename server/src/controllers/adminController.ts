import { Router } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError';
import { Cookie, ErrorCode, UserRole } from '../utils/types';
import { LoginSchema } from '../utils/validators';
import { aDayInMillis } from '../utils/vars';

const adminController = Router();

adminController.post('/login', (req, res, next) => {
  if(req.cookies[Cookie.TOKEN]) {
    next(new CustomError('Utente già loggato', ErrorCode.UNAUTHORIZED));
    return;
  }

  try {
    LoginSchema.validateSync(req.body);
  }catch(e: any) {
    next(new CustomError(e.message, ErrorCode.VALIDATION_ERROR));
    return;
  }

  const { email, password, remember } = req.body;
  const { ROOT_EMAIL, ROOT_PASSWORD, ROOT_ID } = process.env;

  if(email === ROOT_EMAIL && password === ROOT_PASSWORD) {
    const token = jwt.sign({ id: ROOT_ID, role: UserRole.ADMIN }, process.env.JWT_SECRET!);
    res.cookie(Cookie.TOKEN, token, { maxAge: remember ? aDayInMillis : undefined });
    res.json({
      success: true,
      data: {
        id: ROOT_ID
      }
    });
  }else {
    next(new CustomError('Email o password errati', ErrorCode.UNAUTHORIZED));
  }
});

export default adminController;