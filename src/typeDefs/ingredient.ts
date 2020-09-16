import { gql } from 'apollo-server-express';

export default gql`

  extend type Query {
    getIngredients: [Ingredient!]
    getOneIngredient(id: ID!): Ingredient
  }

  type Ingredient{
    id: ID!,
    name: String!
    unitOfMeasurement: String!
  }

  input newIngredient {
    name: String!,
    unitOfMeasurement: String!
  }

  input updatedIngredient {
    name: String!,
    unitOfMeasurement: String
  }

  extend type Mutation{
    createIngredient(input: newIngredient!): Ingredient
    updateIngredient(id: ID!, input: updatedIngredient!): Ingredient
    deleteIngredient(id: ID!): Ingredient
  }

`;
