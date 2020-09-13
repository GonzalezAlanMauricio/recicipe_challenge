import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './typeDefs/index';
import resolvers from './resolvers/index';

export default () => {
  const app = express();

  app.use(express.json());

  const PORT = process.env.PORT || '3000';

  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: '/recipes' });

  app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`);
    console.log(`Graphql endpoint ${server.graphqlPath}`);
  });
};
