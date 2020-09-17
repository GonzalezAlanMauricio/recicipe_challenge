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
const index_1 = __importDefault(require("./typeDefs/index"));
const index_2 = __importDefault(require("./resolvers/index"));
const index_3 = __importDefault(require("./helper/index"));
exports.default = () => {
    const app = express_1.default();
    app.use(express_1.default.json());
    const PORT = process.env.PORT || '3000';
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: index_1.default,
        resolvers: index_2.default,
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            let contextObj = {};
            yield index_3.default(req);
            contextObj = { email: req.email, userId: req.userId };
            return contextObj;
        }),
    });
    server.applyMiddleware({ app, path: '/recipes' });
    app.listen(PORT, () => {
        console.log(`Server running in ${PORT}`);
        console.log(`Graphql endpoint ${server.graphqlPath}`);
    });
};
//# sourceMappingURL=app.js.map