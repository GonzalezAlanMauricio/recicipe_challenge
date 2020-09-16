import { gql } from 'apollo-server-express';

export default gql`

  extend type Query {
    users: [User!]
    user(id: ID): User
    getMyRecipes: [Recipe!]
  }

  type User{
    id: ID!,
    name: String!,
    email: String!,
    password: String!
    recipes: [Recipe!]
  }

  input newUser {
    name: String!
    email: String!
    password: String!
  }

  input updateInput {
    name: String
    email: String
    password: String
  }


  input loginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  extend type Mutation{
    signUp(input: newUser!): User
    login(input: loginInput!): Token
    updateMyAccount(input: updateInput!): User
  }

`;
