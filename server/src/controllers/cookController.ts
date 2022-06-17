import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import CustomError from '../utils/CustomError';
import { Cookie, ErrorCode, UserRole } from '../utils/types';
import { authenticateUser } from '../utils/middlewares';
import { CookSignupSchema, LoginSchema } from '../utils/validators';
import { aDayInMillis } from '../utils/vars';
import { Order, OrderState } from '@prisma/client';

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
    next(new CustomError('Email inesistente', ErrorCode.EMAIL_NOT_FOUND));
    return;
  }

  const passwordMacth = await bcrypt.compare(password, user.password);
  if(!passwordMacth) {
    next(new CustomError('Email errata', ErrorCode.WRONG_PASSWORD));
    return;
  }

  const token = jwt.sign({ id: user.id, role: UserRole.COOK }, process.env.JWT_SECRET!);

  res.cookie(Cookie.TOKEN, token, { maxAge: aDayInMillis });

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

cookController.get('/orders', authenticateUser, async (req, res, next) => {
  if(req.cook) {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{
          state: OrderState.PENDING
        },
        {
          cookId: req.cook.id
        }]
      },
      orderBy: {
        dateTime: 'desc'
      }
    });

    const pendingOrders = orders.filter(order => order.state === OrderState.PENDING);
    const myOrders = orders.filter(order => order.state !== OrderState.PENDING);

    res.json({
      success: true,
      data: {
        pendingOrders,
        myOrders
      }
    });
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

cookController.post('/take-order', authenticateUser, async (req, res, next) => {
  if(req.cook) {
    const order = await prisma.order.findUnique({
      where: {
        id: req.body.orderId
      }
    });

    if(!order || order.state !== OrderState.PENDING) {
      next(new CustomError('Ordine inesistente o già preso in carico', ErrorCode.VALIDATION_ERROR));
    }else {
      const orderNewState: Order = await prisma.order.update({
        where: {
          id: req.body.orderId
        },
        data: {
          cookId: req.cook.id,
          state: OrderState.TAKEN
        }
      });

      req.ioSocket.emit(orderNewState.customerId, {
        orderId: orderNewState.id,
        state: orderNewState.state,
        cookEmail: req.cook.email,
        cookId: req.cook.id
      });

      req.ioSocket.emit('order-taken', {
        orderId: orderNewState.id,
        state: orderNewState.state,
        cookEmail: req.cook.email,
        cookId: req.cook.id
      });

      res.json({
        success: true,
        data: {
          order: orderNewState
        }
      });
    }
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

cookController.post('/close-order', authenticateUser, async (req, res, next) => {
  if(req.cook) {
    const order = await prisma.order.findUnique({
      where: {
        id: req.body.orderId,
      }
    });

    if(!order || order.cookId !== req.cook.id) {
      next(new CustomError('Ordine inesistente o già preso in carico', ErrorCode.VALIDATION_ERROR));
    }else {
      const orderNewState = await prisma.order.update({
        where: {
          id: req.body.orderId
        },
        data: {
          cookId: req.cook.id,
          state: OrderState.CLOSED
        }
      });

      req.ioSocket.emit(orderNewState.customerId, {
        orderId: orderNewState.id,
        state: orderNewState.state,
        cookEmail: req.cook.email,
        cookId: req.cook.id
      });

      req.ioSocket.emit(req.cook.id, {
        orderId: orderNewState.id,
        state: orderNewState.state,
        cookEmail: req.cook.email,
        cookId: req.cook.id
      });

      res.json({
        success: true,
        data: {
          order: orderNewState
        }
      });
    }
  }else {
    next(new CustomError('Utente non loggato', ErrorCode.UNAUTHORIZED));
  }
});

export default cookController;