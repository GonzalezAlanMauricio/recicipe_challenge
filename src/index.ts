import { createConnection } from 'typeorm';
import 'reflect-metadata';
import startApp from './app';

import User from './entities/User';
import Recipe from './entities/Recipe';
import Category from './entities/Category';

require('dotenv').config();

const startDBConnection = async () => {
  try {
    await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      entities: [
        User, Recipe, Category,
      ],
    });
    startApp();
    console.log('Connected to data base');
  } catch (error) {
    console.log('TypeOrm error');
    console.log(error);
  }
};

startDBConnection();
