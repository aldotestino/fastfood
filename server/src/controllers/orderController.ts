import prisma from '../lib/prisma';
import { Router } from 'express';
import { authenticateUser } from '../utils/middlewares';
import CustomError from '../utils/CustomError';
import { ErrorCode } from '../utils/types';

const orderController = Router();

orderController.get('/:id', authenticateUser, async (req, res, next) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id
    },
    select: {
      state: true,
      amount: true,
      customerId: true,
      dateTime: true,
      cookId: true,
      id: true,
      cook: {
        select: {
          email: true,
          id: true
        }
      },
      items: {
        select: {
          quantity: true,
          item: {
            select: {
              type: true,
              ingredients: true,
              id: true,
              name: true,
              price: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });

  if(!order || (req.customer && order?.customerId !== req.customer.id)) {
    next(new CustomError('Ordine inesistente', ErrorCode.ORDER_NOT_FOUND));
  }else if(req.cook && order.cookId && order.cookId !== req.cook.id) {
    next(new CustomError('Non puoi accedere a questo ordine', ErrorCode.UNAUTHORIZED));
  }else {
    res.json({
      success: true,
      data: {
        order: order
      }
    });
  }
});

export default orderController;