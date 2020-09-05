"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./entities/User"));
exports.default = () => {
    const app = express_1.default();
    app.use(express_1.default.json());
    const PORT = process.env.PORT || '3000';
    const typeDefs = apollo_server_express_1.gql `

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
            greetings: () => 'Hello!',
            users: () => __awaiter(void 0, void 0, void 0, function* () {
                const users = yield typeorm_1.getConnection().getRepository(User_1.default).find();
                console.log('users', users);
                return users;
            }),
        },
    };
    const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
    server.applyMiddleware({ app, path: '/recipes' });
    app.listen(PORT, () => {
        console.log(`Server running in ${PORT}`);
        console.log(`Graphql endpoint ${server.graphqlPath}`);
    });
};
