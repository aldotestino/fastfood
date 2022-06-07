import prisma from '../lib/prisma';
import { Router } from 'express';

const menuController = Router();

menuController.get('/', async (_, res) => {
  const menu = await prisma.item.findMany();
  res.json({
    success: true,
    data: {
      menu
    }
  });
});

export default menuController;