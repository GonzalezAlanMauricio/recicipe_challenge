import express from 'express';
import { ApolloServer, UserInputError } from 'apollo-server-express';
import { getConnection, getManager } from 'typeorm';

import bcryptjs from 'bcryptjs';

import typeDefs from './typeDefs/index';

import User from './entities/User';
import Recipe from './entities/Recipe';
import Category from './entities/Category';

export default () => {
  const app = express();

  app.use(express.json());

  const PORT = process.env.PORT || '3000';

  const resolvers = {
    Query: {

      users: async () => {
        const users = await getConnection().getRepository(User).find({ relations: ['recipes'] });
        return users;
      },

      user: async (_parent: null, { id }: { id: number }) => {
        const user = await getConnection().getRepository(User).findOne(id);
        if (user) {
          return user;
        }
        throw new Error('there is no user with this id');
      },

      getRecipes: async () => {
        const recipes = await getConnection().getRepository(Recipe).find({ relations: ['category', 'user'] });
        return recipes;
      },

      getOneRecipe: async (_parent: null, { id }: { id: number }) => {
        const recipe = await getConnection().getRepository(Recipe).findOne(id, { relations: ['category', 'user'] });
        if (recipe) {
          return recipe;
        }
        throw new Error('there is no recipe with this id');
      },

      getCategories: async () => {
        const categories = await getConnection().getRepository(Category).find();
        return categories;
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

      createRecipe: async (_parent: null,
        { input }: {
          input:
          { name: string, description: string, categoryId: Category, userId: User }
        }) => {
        const newRecipe = new Recipe();
        newRecipe.name = input.name;
        newRecipe.description = input.description;
        try {
          const category = await getConnection().getRepository(Category).findOne(input.categoryId);
          const user = await getConnection().getRepository(User).findOne(input.userId);
          if (user) {
            newRecipe.user = user;
          } else {
            throw new UserInputError('User not found');
          }
          if (category) {
            newRecipe.category = category;
            const savedRecipe = await getManager().save(newRecipe);
            return savedRecipe;
          }
          throw new UserInputError('Category not found');
        } catch (_e) {
          let error: Error = _e;
          console.log(error);
          if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
          throw error;
        }
      },

      createCategory: async (_parent: null,
        { input }: { input: { name: string } }) => {
        const newCategory = new Category();
        newCategory.name = input.name;
        newCategory.recipes = [];
        try {
          const savedCategory = await getManager().save(newCategory);
          return savedCategory;
        } catch (error) {
          console.log(error);
          throw new Error('Server error, we will fix it soon');
        }
      },

    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: '/recipes' });

  app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`);
    console.log(`Graphql endpoint ${server.graphqlPath}`);
  });
};
