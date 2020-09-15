import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs/index';
import resolvers from './resolvers/index';

import getUserId from './helper/index';

export default (): void => {
  const app = express();

  app.use(express.json());

  const PORT = process.env.PORT || '3000';

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }: {
      req: {
        headers: {
          authorization: string;
        }; email: string | null; userId: number | null;
      };
    }): Promise<object> => {
      let contextObj = {};
      await getUserId(req);
      contextObj = { email: req.email, userId: req.userId };
      return contextObj;
    },

  });
  server.applyMiddleware({ app, path: '/recipes' });

  app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`);
    console.log(`Graphql endpoint ${server.graphqlPath}`);
  });
};
