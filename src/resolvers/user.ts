import { getConnection, getManager } from 'typeorm';

import * as dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UserInputError } from 'apollo-server-express';
import User from '../entities/User';

dotenv.config();

export default {
  Query: {

    users: async () => {
      const users = await getConnection().getRepository(User).find({ relations: ['recipes'] });
      return users;
    },

    user: async (_: null, { id }: { id: number }) => {
      const user = await getConnection().getRepository(User).findOne(id, { relations: ['recipes'] });
      if (user) {
        return user;
      }
      throw new Error('there is no user with this id');
    },

  },

  Mutation: {

    login: async (_: null, { input }: { input: { email: string, password: string } }) => {
      try {
        const { password, email } = input;
        const user = await getConnection().getRepository(User).findOne({ where: { email }, relations: ['recipes'] });
        if (!user) throw new UserInputError('The e-mail address or password you entered was incorrect');
        const passwordIsValid = await bcryptjs.compare(password, user.hashPassword);
        if (!passwordIsValid) throw new UserInputError('The e-mail address or password you entered was incorrect');
        const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        return { token };
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

    signUp: async (_: null,
      { input }: { input: { name: string, email: string, password: string } }) => {
      const newUser = new User();
      newUser.name = input.name;
      newUser.email = input.email;
      newUser.hashPassword = await bcryptjs.hash(input.password, 12);
      try {
        const savedUser = await getManager().save(newUser);
        return savedUser;
      } catch (error) {
        console.log(error);
        throw new Error('Server error, we will fix it soon');
      }
    },

  },
};
