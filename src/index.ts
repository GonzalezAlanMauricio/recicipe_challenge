import { createConnection } from 'typeorm';
import 'reflect-metadata';
import startApp from './app';
import User from './entities/User';

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
        User,
      ],
    });
    // here you can start to work with your entities
    startApp();
    console.log('Connected to data base');
  } catch (error) {
    console.log('TypeOrm error');
    console.log(error);
  }
};

startDBConnection();
