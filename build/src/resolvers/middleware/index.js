"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_resolvers_1 = require("graphql-resolvers");
exports.default = (email) => {
    if (!email)
        throw new Error('Access denied, a token is needed to access');
    return graphql_resolvers_1.skip;
};
//# sourceMappingURL=index.js.map