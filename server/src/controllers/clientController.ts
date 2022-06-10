import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import CustomError from '../utils/CustomError';
import { Cookies, ErrorCode, UserRole } from '../utils/types';
import { authenticateUser } from '../utils/middlewares';
import { LoginSchema, ClientSignupSchema } from '../utils/validators';

const clientController = Router();

clientController.post('/signup', async (req, res, next) => {
  try {    
    const body = await ClientSignupSchema.validate(req.body);
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.client.create({
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
          firstName: user.firstName,
          lastName: user.lastName,
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

clientController.post('/login', async (req, res, next) => {

  if(req.cookies[Cookies.TOKEN]) {
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
  const user = await prisma.client.findUnique({
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
    next(new CustomError('Password errata', ErrorCode.WRONG_PASSWORD));
    return;
  }

  const token = jwt.sign(user.id, process.env.JWT_SECRET!);

  res.cookie(Cookies.TOKEN, token);
  res.cookie(Cookies.ROLE, UserRole.CLIENT);

  res.json({
    success: true,
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        email: user.email
      }
    }
  });
});

clientController.get('/me', authenticateUser, (req, res, next) => {
  if(req.client) {
    res.json({
      success: true,
      data: {
        user: req.client
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

clientController.get('/logout', authenticateUser, (req, res, next) => {  
  if(req.client) {
    res.clearCookie(Cookies.TOKEN);
    res.clearCookie(Cookies.ROLE);
    res.json({
      success: true
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

clientController.get('/orders', authenticateUser, async(req, res, next) => {
  if(req.client) {
    const orders = await prisma.order.findMany({
      where: {
        clientId: req.client.id
      },
      select: {
        id: true,
        state: true,
        amount: true,
        dateTime: true
      }
    });
    res.json({
      success: true,
      data: {
        orders
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

// clientController.get('/orders', authenticateUser, async (req, res, next) => {
//   if(req.client) {
//     const orders = await prisma.order.findMany({
//       where: {
//         clientId: req.client.id
//       },
//       select: {
//         state: true,
//         amuount: true,
//         cook: {
//           select: {
//             id: true
//           }
//         },
//         items: {
//           select: {
//             quantity: true,
//             item: {
//               select: {
//                 name: true,
//                 price: true,
//                 imageUrl: true
//               }
//             }
//           }
//         }
//       }
//     });
//     res.json({
//       success: true,
//       data: {
//         orders
//       }
//     });
//   }else {
//     next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
//   }
// });

export default clientController;