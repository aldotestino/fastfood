import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { Cookies, ErrorCode, UserRole } from '../utils/types';

async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  if(!(Cookies.TOKEN in req.cookies)) {
    next(new CustomError('Autenticazione necessaria', ErrorCode.UNAUTHORIZED));
  }else {
    const token: string = req.cookies[Cookies.TOKEN];
    const userRole: UserRole = req.cookies[Cookies.ROLE];

    if(token === '') {
      next(new CustomError('Token nullo', ErrorCode.UNAUTHORIZED));
    }else {
      const id = String(jwt.verify(token, process.env.JWT_SECRET!));

      if(userRole === UserRole.CLIENT) {
        const user = await prisma.client.findUnique({
          where: {
            id
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        });

        if(!user) {
          next(new CustomError('Utente inesistente', ErrorCode.UNAUTHORIZED));
        }else {
          req.client = user;
          next();
        }

      }else if(userRole === UserRole.COOK) {
        const user = await prisma.cook.findUnique({
          where: {
            id
          },
          select: {
            id: true,
            email: true
          }
        });

        if(!user) {
          next(new CustomError('Utente inesistente', ErrorCode.UNAUTHORIZED));
        }else {
          req.cook = user;
          next();
        }

      }    
    }
  }
}

function handleError(err: CustomError, req: Request, res: Response, next: NextFunction) {
  res.statusCode = err.code;
  res.json({
    success: false,
    data: {
      errorMessage: err.message
    }
  });
}

export {
  authenticateUser,
  handleError
};