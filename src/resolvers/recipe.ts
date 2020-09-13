import { UserInputError } from 'apollo-server-express';
import { getConnection, getManager } from 'typeorm';

import User from '../entities/User';
import Recipe from '../entities/Recipe';
import Category from '../entities/Category';

export default {
  Query: {

    getRecipes: async () => {
      const recipes = await getConnection().getRepository(Recipe).find({ relations: ['category', 'user'] });
      return recipes;
    },

    getOneRecipe: async (_parent: null, { id }: { id: number }) => {
      const recipe = await getConnection().getRepository(Recipe).findOne(id, { relations: ['category', 'user'] });
      if (recipe) {
        console.log('recipe', recipe);
        return recipe;
      }
      throw new Error('there is no recipe with this id');
    },

  },
  Mutation: {

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

    deleteRecipe: async (_parent: null, { id }: { id: string }) => {
      try {
        const recipeToDelete = await getConnection().getRepository(Recipe).findOne(id, { relations: ['category', 'user'] });
        if (!recipeToDelete) throw new UserInputError('Recipe not found');
        await getConnection().createQueryBuilder().delete().from(Recipe)
          .where('id = :id', { id })
          .execute();
        return recipeToDelete;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

  },
};