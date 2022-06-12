import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import CustomError from '../utils/CustomError';
import { Cookie, ErrorCode, UserRole } from '../utils/types';
import { authenticateUser } from '../utils/middlewares';
import { LoginSchema, CustomerSignupSchema } from '../utils/validators';
import { OrderState } from '@prisma/client';

const customerController = Router();

customerController.post('/signup', async (req, res, next) => {
  try {    
    const body = await CustomerSignupSchema.validate(req.body);
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.customer.create({
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

customerController.post('/login', async (req, res, next) => {

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
  const user = await prisma.customer.findUnique({
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

  const token = jwt.sign({ id: user.id, role: UserRole.CUSTOMER }, process.env.JWT_SECRET!);

  res.cookie(Cookie.TOKEN, token);

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

customerController.get('/me', authenticateUser, (req, res, next) => {
  if(req.customer) {
    res.json({
      success: true,
      data: {
        user: req.customer
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

customerController.get('/logout', authenticateUser, (req, res, next) => {  
  if(req.customer) {
    res.clearCookie(Cookie.TOKEN);
    res.json({
      success: true
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

customerController.get('/orders', authenticateUser, async (req, res, next) => {
  if(req.customer) {
    const orders = await prisma.order.findMany({
      where: {
        customerId: req.customer.id
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

customerController.post('/orders', authenticateUser, async (req, res, next) => {
  if(req.customer) {

    interface ReqBodyItem {
      itemId: string,
      quantity: number
    }

    const items = await prisma.item.findMany({
      where: {
        id: {
          in: req.body.map((i: ReqBodyItem) => i.itemId)
        }
      },
      select: {
        id: true,
        price: true
      }
    });

    const itemsWithQuantity = items.map(i1 => ({
      ...i1,
      quantity: req.body.filter((i2: ReqBodyItem) => i2.itemId === i1.id).reduce((sum: number, c: ReqBodyItem) => sum += c.quantity, 0)
    }));

    const newOrder = await prisma.order.create({
      data: {
        customerId: req.customer.id,
        state: OrderState.PENDING,
        amount: itemsWithQuantity.reduce((sum, c) => sum += c.price*c.quantity, 0)
      }
    });

    const newOrderItems = await prisma.orderItem.createMany({
      data: itemsWithQuantity.map(i => ({
        orderId: newOrder.id,
        quantity: i.quantity,
        itemId: i.id
      }))
    });

    res.json({
      success: true,
      data: {
        order: {
          ...newOrder,
          items: newOrderItems
        }
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

// customerController.get('/orders', authenticateUser, async (req, res, next) => {
//   if(req.customer) {
//     const orders = await prisma.order.findMany({
//       where: {
//         customerId: req.customer.id
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

export default customerController;