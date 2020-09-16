import { UserInputError } from 'apollo-server-express';
import { getConnection, getManager } from 'typeorm';

import Ingredient from '../entities/Ingredient';

import isAuthenticated from './middleware/index';

export default {
  Query: {

    getIngredients: async (_: null,
      __: null, { email }: { email: string }): Promise<Ingredient[]> => {
      isAuthenticated(email);
      const ingredients = await getConnection().getRepository(Ingredient).find();
      return ingredients;
    },

    getOneIngredient: async (_: null,
      { id }: { id: number }, { email }: { email: string }): Promise<Ingredient> => {
      isAuthenticated(email);
      const ingredient = await getConnection().getRepository(Ingredient).findOne(id);
      if (ingredient) {
        return ingredient;
      }
      throw new UserInputError('There is no ingredient with this id');
    },

  },
  Mutation: {

    createIngredient: async (_: null,
      { input }: { input: { name: string; unitOfMeasurement: string } },
      { email }: { email: string }): Promise<Ingredient> => {
      isAuthenticated(email);
      const newIngredient = new Ingredient();
      newIngredient.name = input.name;
      newIngredient.unitOfMeasurement = input.unitOfMeasurement;
      try {
        const savedIngredient = await getManager().save(newIngredient);
        return savedIngredient;
      } catch (error) {
        console.log(error);
        throw new Error('Server error, we will fix it soon');
      }
    },

    updateIngredient: async (_: null,
      { id, input }: { id: string; input: { name: string; unitOfMeasurement: string } },
      { email }: { email: string }): Promise<Ingredient> => {
      isAuthenticated(email);
      try {
        const IngredientRepository = await getConnection().getRepository(Ingredient);
        const IngredientToUpdate = await IngredientRepository.findOne(id);
        if (!IngredientToUpdate) throw new UserInputError('Ingredient not found');
        const IngredientUpdated = {
          ...IngredientToUpdate,
          name: input.name,
          unitOfMeasurement: input.unitOfMeasurement,
        };
        await IngredientRepository.save(IngredientUpdated);
        return IngredientUpdated;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

    deleteIngredient: async (_: null, { id }: { id: string },
      { email }: { email: string }): Promise<Ingredient> => {
      isAuthenticated(email);
      try {
        const IngredientToDelete = await getConnection().getRepository(Ingredient).findOne(id);
        if (!IngredientToDelete) throw new UserInputError('Ingredient not found');
        await getConnection().createQueryBuilder().delete().from(Ingredient)
          .where('id = :id', { id })
          .execute();
        return IngredientToDelete;
      } catch (_e) {
        let error: Error = _e;
        console.log(error);
        if (error.name !== 'UserInputError') error = new Error('Server error, we will fix it soon');
        throw error;
      }
    },

  },
};
