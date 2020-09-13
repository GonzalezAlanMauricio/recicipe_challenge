import { gql } from 'apollo-server-express';

import userTypeDefs from './user';
import recipeTypeDefs from './recipe';
import categoryTypeDefs from './category';

const typeDefs = gql`

  type Query {
    _:String
  }

  type Mutation{
    _:String
  }

`;

export default [
  userTypeDefs, typeDefs, categoryTypeDefs, recipeTypeDefs,
];
