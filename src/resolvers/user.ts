import { getConnection, getManager } from 'typeorm';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-express';

import User from '../entities/User';
import Recipe from '../entities/Recipe';

import isAuthenticated from './middleware/index';

export default {
  Query: {

    getMyRecipes: async (_: null, __: null,
      { email, userId }: { email: string; userId: number }): Promise<Recipe[]> => {
      isAuthenticated(email);
      const recipes = await getConnection().getRepository(Recipe).find({ where: { user: userId }, relations: ['category'] });
      return recipes;
    },

    users: async (): Promise<User[]> => {
      const users = await getConnection().getRepository(User).find({ relations: ['recipes'] });
      return users;
    },

    user: async (_: null, { id }: { id: number }): Promise<User> => {
      const user = await getConnection().getRepository(User).findOne(id, { relations: ['recipes'] });
      if (user) {
        return user;
      }
      throw new Error('there is no user with this id');
    },

  },

  Mutation: {

    updateMyAccount: async (_: null, { input }: {
      input: { name: string; email: string; password: string };
    }, { email, userId }: { email: string; userId: number }): Promise<User> => {
      isAuthenticated(email);
      try {
        const userRepository = await getConnection().getRepository(User);
        const userToUpdate = await userRepository.findOne(userId);
        let userUpdated = { ...userToUpdate, ...input };
        if (input.password) {
          const hashPassword = await bcryptjs.hash(input.password, 12);
          userUpdated = { ...userUpdated, hashPassword };
        }
        await userRepository.save(userUpdated);
        return userUpdated as User;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },
    deleteMyAccount: async (_: null, __: null,
      { email, userId }: { email: string; userId: number }): Promise<User> => {
      isAuthenticated(email);
      try {
        const userToDelete = await getConnection()
          .getRepository(User).findOne(userId, { relations: ['recipes'] });
        if (!userToDelete) throw new UserInputError('User not found');
        await getConnection().createQueryBuilder().delete().from(User)
          .where('id = :id', { id: userId })
          .execute();
        return userToDelete;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

    login: async (_: null,
      { input }: { input: { email: string; password: string } }): Promise<object> => {
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
      { input }: { input: { name: string; email: string; password: string } }): Promise<User> => {
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
