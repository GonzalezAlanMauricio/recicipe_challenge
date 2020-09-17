"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `

  extend type Query {
    getCategories: [Category!]
    getOneCategory(id: ID!): Category
  }

  type Category{
    id: ID!,
    name: String!
    recipes: [Recipe!]
  }

  input newCategory {
    name: String!,
  }

  input updatedCategory {
    name: String!,
  }

  extend type Mutation{
    createCategory(input: newCategory!): Category
    updateCategory(id: ID!, input: updatedCategory!): Category
    deleteCategory(id: ID!): Category
  }

`;
//# sourceMappingURL=category.js.map