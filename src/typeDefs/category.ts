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

  extend type Mutation{
    createCategory(input: newCategory!): Category
    deleteCategory(id: ID!): Category
  }

`;
