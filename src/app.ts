import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { getConnection } from 'typeorm';
import User from './entities/User';

export default () => {
  const app = express();

  app.use(express.json());

  const PORT = process.env.PORT || '3000';

  const typeDefs = gql`

  type Query {
    greetings: String
    users: [User!]
    user: User
  }

  type User{
    id: ID,
    name: String,
    email: String,
    hashPassword: String
  }

`;

  const resolvers = {
    Query: {
      greetings: (): String => 'Hello!',
      users: async () => {
        const users = await getConnection().getRepository(User).find();
        console.log('users', users);
        return users;
      },
      user: async (_parent: null, { id }: { id: number }) => {
        const user = await getConnection().getRepository(User).findOne(id);
        if (user) {
          return user;
        }
        return {};
      },

    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: '/recipes' });

  app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`);
    console.log(`Graphql endpoint ${server.graphqlPath}`);
  });
};
