import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { Cookie, ErrorCode, UserRole } from '../utils/types';

async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const cookie = req.cookies[Cookie.TOKEN];
  if(!cookie) {
    next(new CustomError('Autenticazione necessaria', ErrorCode.UNAUTHORIZED));
  }else {
    const token = jwt.verify(req.cookies[Cookie.TOKEN], process.env.JWT_SECRET!) as JwtPayload;

    if(!token || !token.id && !token.role) {
      next(new CustomError('Token errato', ErrorCode.UNAUTHORIZED));
    }else {
      if(token.role === UserRole.CUSTOMER) {
        const user = await prisma.customer.findUnique({
          where: {
            id: token.id
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        });

        if(!user) {
          res.clearCookie(Cookie.TOKEN);
          next(new CustomError('Utente inesistente', ErrorCode.UNAUTHORIZED));
        }else {
          req.customer = user;
          next();
        }

      }else if(token.role === UserRole.COOK) {
        const user = await prisma.cook.findUnique({
          where: {
            id: token.id
          },
          select: {
            id: true,
            email: true
          }
        });

        if(!user) {
          res.clearCookie(Cookie.TOKEN);
          next(new CustomError('Utente inesistente', ErrorCode.UNAUTHORIZED));
        }else {
          req.cook = user;
          next();
        }
      }else {
        const { ROOT_ID } = process.env;
        if(token.id === ROOT_ID) {
          req.isAdmin = true;
          next();
        }else {
          res.clearCookie(Cookie.TOKEN);
          next(new CustomError('Utente inesistente', ErrorCode.UNAUTHORIZED));
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