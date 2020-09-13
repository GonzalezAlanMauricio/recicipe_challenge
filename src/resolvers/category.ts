import { UserInputError } from 'apollo-server-express';
import { getConnection, getManager } from 'typeorm';

import Category from '../entities/Category';

export default {
  Query: {

    getCategories: async () => {
      const categories = await getConnection().getRepository(Category).find({ relations: ['recipes'] });
      return categories;
    },

  },
  Mutation: {

    createCategory: async (_: null,
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

    updateCategory: async (_: null, { id, input }: { id: string, input: { name: string } }) => {
      try {
        const categoryRepository = await getConnection().getRepository(Category);
        const categoryToUpdate = await categoryRepository.findOne(id);
        if (!categoryToUpdate) throw new UserInputError('Category not found');
        categoryToUpdate.name = input.name;
        await categoryRepository.save(categoryToUpdate);
        return categoryToUpdate;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

    deleteCategory: async (_: null, { id }: { id: string }) => {
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
