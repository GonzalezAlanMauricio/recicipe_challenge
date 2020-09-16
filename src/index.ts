import { createConnection } from 'typeorm';
import 'reflect-metadata';
import startApp from './app';

import User from './entities/User';
import Recipe from './entities/Recipe';
import Category from './entities/Category';
import Ingredient from './entities/Ingredient';

require('dotenv').config();

const startDBConnection = async () => {
  try {
    await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'test',
      synchronize: true,
      logging: false,
      entities: [
        User, Recipe, Category, Ingredient,
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
