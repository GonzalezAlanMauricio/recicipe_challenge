import { getConnection, getManager } from 'typeorm';

import Category from '../entities/Category';

export default {
  Query: {

    getCategories: async () => {
      const categories = await getConnection().getRepository(Category).find();
      return categories;
    },

  },
  Mutation: {

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
