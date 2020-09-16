import { UserInputError } from 'apollo-server-express';
import { getConnection, getManager } from 'typeorm';

import Category from '../entities/Category';

import isAuthenticated from './middleware/index';

export default {
  Query: {

    getCategories: async (_: null, __: null, { email }: { email: string }): Promise<Category[]> => {
      isAuthenticated(email);
      const categories = await getConnection().getRepository(Category).find({ relations: ['recipes'] });
      return categories;
    },

    getOneCategory: async (_: null,
      { id }: { id: number }, { email }: { email: string }): Promise<Category> => {
      isAuthenticated(email);
      const category = await getConnection().getRepository(Category).findOne(id, { relations: ['recipes'] });
      if (category) {
        return category;
      }
      throw new UserInputError('There is no category with this id');
    },

  },
  Mutation: {

    createCategory: async (_: null,
      { input }: { input: { name: string } }, { email }: { email: string }): Promise<Category> => {
      isAuthenticated(email);
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

    updateCategory: async (_: null,
      { id, input }: { id: string; input: { name: string } },
      { email }: { email: string }): Promise<Category> => {
      isAuthenticated(email);
      try {
        const categoryRepository = await getConnection().getRepository(Category);
        const categoryToUpdate = await categoryRepository.findOne(id);
        if (!categoryToUpdate) throw new UserInputError('Category not found');
        const categoryUpdated = { ...categoryToUpdate, name: input.name };
        await categoryRepository.save(categoryUpdated);
        return categoryUpdated;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

    deleteCategory: async (_: null, { id }: { id: string },
      { email }: { email: string }): Promise<Category> => {
      isAuthenticated(email);
      try {
        const categoryToDelete = await getConnection().getRepository(Category).findOne(id, { relations: ['recipes'] });
        if (!categoryToDelete) throw new UserInputError('Category not found');
        await getConnection().createQueryBuilder().delete().from(Category)
          .where('id = :id', { id })
          .execute();
        return categoryToDelete;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

  },
};
