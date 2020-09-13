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
    category: Category!
    user: User!
  }

  input newRecipe {
    name: String!
    description: String!
    categoryId: ID!
    userId: ID!
  }

  extend type Mutation{
    createRecipe(input: newRecipe!): Recipe
    deleteRecipe(id: ID!): Recipe
  }

`;
