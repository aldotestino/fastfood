import prisma from '../lib/prisma';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import CustomError from '../utils/CustomError';
import { authenticateUser } from '../utils/middlewares';
import { ErrorCode } from '../utils/types';
import { ItemSchema } from '../utils/validators';

const upload = multer({
  dest: path.join(__dirname, '..', 'public', 'images', 'items')
});

const menuController = Router();

menuController.get('/', async (_, res) => {
  const menu = await prisma.item.findMany({
    where: {
      active: true
    },
    select: {
      id: true,
      imageUrl: true,
      name: true,
      price: true,
      type: true,
      ingredients: true
    }
  });
  res.json({
    success: true,
    data: {
      menu
    }
  });
});

menuController.post('/upload-image', upload.single('image'), authenticateUser, (req, res, next) => {
  if(req.isAdmin && req.file) {
    const tmpPath = req.file.path;
    const targetPath = path.join(__dirname, '..', 'public', 'images', 'items', req.file.originalname);

    if(path.extname(req.file.originalname || '').toLowerCase() === '.png') {
      fs.rename(tmpPath, targetPath, err => {
        if(err) return next(new CustomError(err.message, 400));

        res.json({
          success: true,
        });
      });
    }else {
      fs.unlink(tmpPath, err => {
        if(err) return next(new CustomError(err.message, 400));
      });

      return next(new CustomError('Sono permessi solo file png', 400));
    }
  }else {
    next (new CustomError('Solo l\'admin può caricare delle immagini', ErrorCode.UNAUTHORIZED));
  }
});

menuController.post('/', authenticateUser, async (req, res, next) => {
  if(req.isAdmin) {
    try {
      ItemSchema.validateSync({
        name: req.body.name,
        price: req.body.price
      });

      const newItem = await prisma.item.create({
        data: req.body
      });

      res.json({
        success: true,
        data: {
          item: newItem
        }
      });
    }catch(e: any) {
      if(e.code === 'P2002') {
        next(new CustomError('Email già in uso', ErrorCode.EMAIL_IN_USE));
      }else if(e.name === 'ValidationError') {
        next(new CustomError(e.message, ErrorCode.VALIDATION_ERROR));
      }else {
        next(new CustomError('Errore del server', ErrorCode.SERVER_ERROR));
      }
    }
  }else {
    next (new CustomError('Solo l\'admin può creare un nuovo elemento del menù', ErrorCode.UNAUTHORIZED));
  }
});

menuController.delete('/', authenticateUser, async (req, res, next) => {
  if(req.isAdmin) {
    try {
      await prisma.item.update({
        where: {
          id: req.body.itemId
        },
        data: {
          active: false
        }
      });

      res.json({
        success: true
      });
    }catch(e: any) {
      next(new CustomError('Elemento inesistente', ErrorCode.ITEM_NOT_FOUND));
    }
  }
});

export default menuController;