"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const app = express_1.default();
app.use(express_1.default.json());
const PORT = process.env.PORT || '3000';
const typeDefs = apollo_server_express_1.gql `
  type Query {
    greetings: String
  }
`;
const resolvers = {
    Query: {
        greetings: () => 'Hello!',
    },
};
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/recipes' });
app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`);
    console.log(`Graphql endpoint ${server.graphqlPath}`);
});
