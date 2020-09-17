"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const user_1 = __importDefault(require("./user"));
const recipe_1 = __importDefault(require("./recipe"));
const category_1 = __importDefault(require("./category"));
const typeDefs = apollo_server_express_1.gql `

  type Query {
    _:String
  }

  type Mutation{
    _:String
  }

`;
exports.default = [
    user_1.default, typeDefs, category_1.default, recipe_1.default,
];
//# sourceMappingURL=index.js.map