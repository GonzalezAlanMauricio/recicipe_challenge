import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || '3000';

const typeDefs = gql`
  type Query {
    greetings: String
  }
`;

const resolvers = {
  Query: {
    greetings: (): String => 'Hello!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/recipes' });

app.listen(PORT, () => {
  console.log(`Server running in ${PORT}`);
  console.log(`Graphql endpoint ${server.graphqlPath}`);
});
