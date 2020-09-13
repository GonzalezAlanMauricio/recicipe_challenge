import { gql } from 'apollo-server-express';

export default gql`

  type Query {
    users: [User!]
    user(id: ID): User
    getRecipes: [Recipe!]
    getCategories: [Category!]
    getOneRecipe(id: ID): Recipe
  }

  type User{
    id: ID!,
    name: String!,
    email: String!,
    password: String!
    recipes: [Recipe!]
  }

  type Category{
    id: ID!,
    name: String!
    recipes: [Category!]
  }

  type Recipe{
    id: ID!
    name: String!
    description: String!
    category: Category!
    user: User!
  }

  input newUser {
    name: String!
    email: String!
    password: String!
  }

  input newRecipe {
    name: String!,
    description: String!,
    categoryId: ID!
    userId: ID!
  }

  input newCategory {
    name: String!,
  }

  type Mutation{
    signUp(input: newUser!): User
    createRecipe(input: newRecipe!): Recipe
    createCategory(input: newCategory!): Category
  }

`;
