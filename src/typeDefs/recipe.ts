import { gql } from 'apollo-server-express';

export default gql`

  extend type Query {
    getRecipes: [Recipe!]
    getOneRecipe(id: ID): Recipe
  }

  type Recipe{
    id: ID!
    name: String!
    description: String!
    ingredients: String!
    category: Category!
    user: User!
  }

  input newRecipe {
    name: String!
    description: String!
    ingredients: String!
    categoryId: ID!
  }

  input updatedRecipe {
    name: String
    description: String
    ingredients: String
    categoryId: ID
  }

  extend type Mutation{
    createRecipe(input: newRecipe!): Recipe
    updateRecipe(id: ID!, input: updatedRecipe!): Recipe
    deleteRecipe(id: ID!): Recipe
  }

`;
