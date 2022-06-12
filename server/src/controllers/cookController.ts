import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import CustomError from '../utils/CustomError';
import { Cookie, ErrorCode, UserRole } from '../utils/types';
import { authenticateUser } from '../utils/middlewares';
import { CookSignupSchema, LoginSchema } from '../utils/validators';

const cookController = Router();

// Solo l'ADMIN può effettuare la registrazione di un cuoco, aggiungere middleware `isAdmin`
cookController.post('/signup', async (req, res, next) => {
  try {
    const body = await CookSignupSchema.validate(req.body);
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const user = await prisma.cook.create({
      data: {
        ...body,
        password: hashedPassword
      }
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email
        }
      }
    });

  } catch(e: any) {
    if(e.code === 'P2002') {
      next(new CustomError('Email già in uso', ErrorCode.EMAIL_IN_USE));
    }else if(e.name === 'ValidationError') {
      next(new CustomError(e.message, ErrorCode.VALIDATION_ERROR));
    }else {
      next(new CustomError('Errore del server', ErrorCode.SERVER_ERROR));
    }
  }
});

cookController.post('/login', async (req, res, next) => {

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

  const { email, password } = req.body;
  const user = await prisma.cook.findUnique({
    where: {
      email
    }
  });

  if(!user) {
    next(new CustomError('Email inesistente', ErrorCode.INVALID_EMAIL));
    return;
  }

  const passwordMacth = await bcrypt.compare(password, user.password);
  if(!passwordMacth) {
    next(new CustomError('Email errata', ErrorCode.WRONG_PASSWORD));
    return;
  }

  const token = jwt.sign({ id: user.id, role: UserRole.COOK }, process.env.JWT_SECRET!);

  res.cookie(Cookie.TOKEN, token);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email
      }
    }
  });
});

cookController.get('/me', authenticateUser, (req, res, next) => {
  if(req.cook) {
    res.json({
      success: true,
      data: {
        user: req.cook
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

cookController.get('/logout', authenticateUser, (req, res, next) => {
  if(req.cook) {
    res.clearCookie(Cookie.TOKEN);
    res.json({
      success: true
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

export default cookController;