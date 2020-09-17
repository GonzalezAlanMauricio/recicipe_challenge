"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `

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
//# sourceMappingURL=recipe.js.map