import { gql } from 'apollo-server-express';

export default gql`

  extend type Query {
    users: [User!]
    user(id: ID): User
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

  extend type Mutation{
    signUp(input: newUser!): User
  }

`;
