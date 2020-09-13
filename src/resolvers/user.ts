import { getConnection, getManager } from 'typeorm';

import bcryptjs from 'bcryptjs';

import User from '../entities/User';

export default {
  Query: {

    users: async () => {
      const users = await getConnection().getRepository(User).find({ relations: ['recipes'] });
      return users;
    },

    user: async (_parent: null, { id }: { id: number }) => {
      const user = await getConnection().getRepository(User).findOne(id, { relations: ['recipes'] });
      if (user) {
        return user;
      }
      throw new Error('there is no user with this id');
    },

  },

  Mutation: {
    signUp: async (_parent: null,
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
