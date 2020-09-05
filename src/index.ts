import { createConnection } from 'typeorm';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const startApp = () => {
  const app = express();

  app.use(express.json());

  const PORT = process.env.PORT || '3000';

  const typeDefs = gql`

  type Query {
    greetings: String
    users: [User!]
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
      users: () => {
        console.log('users');
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

const startDBConnection = async () => {
  try {
    await createConnection();
    // here you can start to work with your entities
    startApp();
    console.log('Connected to data base');
  } catch (error) {
    console.log('TypeOrm error');
    console.log(error);
  }
};

startDBConnection();
