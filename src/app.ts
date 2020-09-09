import express from 'express';
import { ApolloServer, gql, UserInputError } from 'apollo-server-express';
import { getConnection, getManager } from 'typeorm';

import bcryptjs from 'bcryptjs';

import User from './entities/User';
import Recipe from './entities/Recipe';
import Category from './entities/Category';

export default () => {
  const app = express();

  app.use(express.json());

  const PORT = process.env.PORT || '3000';

  const typeDefs = gql`

  type Query {
    users: [User!]
    user(id: ID): User
    getRecipes: [Recipe!]
    getCategories: [Category!]
    getOneRecipe(id: ID): Recipe
  }

  type User{
    id: ID!,
    name: String!,
    email: String!,
  }

  type Category{
    id: ID!,
    name: String!
    recipes: [Category!]
  }

  type Recipe{
    id: ID!
    name: String!
    description: String!
    category: Category!
  }

  input newUser {
    name: String!
    email: String!
    password: String!
  }

  input newRecipe {
    name: String!,
    description: String!,
    categoryId: ID!
  }

  input newCategory {
    name: String!,
  }

  type Mutation{
    signUp(input: newUser!): User
    createRecipe(input: newRecipe!): Recipe
    createCategory(input: newCategory!): Category
  }

`;

  const resolvers = {
    Query: {

      users: async () => {
        const users = await getConnection().getRepository(User).find();
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
        const recipes = await getConnection().getRepository(Recipe).find({ relations: ['category'] });
        console.log('recipes', recipes);
        return recipes;
      },

      getOneRecipe: async (_parent: null, { id }: { id: number }) => {
        const recipe = await getConnection().getRepository(Recipe).findOne(id, { relations: ['category'] });
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
        console.log('Input', input);
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
        { input }: { input: { name: string, description: string, categoryId: Category } }) => {
        const newRecipe = new Recipe();
        console.log('..........-------------------');
        console.log(input);
        console.log('..........-------------------');
        newRecipe.name = input.name;
        newRecipe.description = input.description;
        try {
          const category = await getConnection().getRepository(Category).findOne(input.categoryId);
          if (category) {
            newRecipe.category = category;
            console.log('category', category);
            if (!category.recipes) category.recipes = [];
            category.recipes.push(newRecipe);
            await getManager().save(category);
            const savedRecipe = await getManager().save(newRecipe);
            console.log('savedRecipe', savedRecipe);
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
          console.log('savedCategory', savedCategory);
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
