import { gql } from 'apollo-server-express';

export default gql`

  extend type Query {
    getCategories: [Category!]
  }

  type Category{
    id: ID!,
    name: String!
    recipes: [Category!]
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
