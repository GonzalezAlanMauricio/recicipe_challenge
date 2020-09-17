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
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = __importDefault(require("../entities/User"));
const Recipe_1 = __importDefault(require("../entities/Recipe"));
const index_1 = __importDefault(require("./middleware/index"));
const index_2 = require("./validations/index");
exports.default = {
    Query: {
        getMyRecipes: (_, __, { email, userId }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const recipes = yield typeorm_1.getConnection().getRepository(Recipe_1.default).find({ where: { user: userId }, relations: ['category'] });
            return recipes;
        }),
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield typeorm_1.getConnection().getRepository(User_1.default).find({ relations: ['recipes'] });
            return users;
        }),
        user: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield typeorm_1.getConnection().getRepository(User_1.default).findOne(id, { relations: ['recipes'] });
            if (user) {
                return user;
            }
            throw new Error('there is no user with this id');
        }),
    },
    Mutation: {
        updateMyAccount: (_, { input }, { email, userId }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            try {
                const userRepository = yield typeorm_1.getConnection().getRepository(User_1.default);
                const userToUpdate = yield userRepository.findOne(userId);
                let userUpdated = new User_1.default();
                userUpdated = Object.assign(Object.assign({}, userToUpdate), input);
                yield index_2.userValidation(userUpdated);
                if (input.password) {
                    const hashPassword = yield bcryptjs_1.default.hash(input.password, 12);
                    userUpdated = Object.assign(Object.assign({}, userUpdated), { hashPassword });
                }
                yield userRepository.save(userUpdated);
                return userUpdated;
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
        deleteMyAccount: (_, __, { email, userId }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            try {
                const userToDelete = yield typeorm_1.getConnection()
                    .getRepository(User_1.default).findOne(userId, { relations: ['recipes'] });
                if (!userToDelete)
                    throw new apollo_server_express_1.UserInputError('User not found');
                yield typeorm_1.getConnection().createQueryBuilder().delete().from(User_1.default)
                    .where('id = :id', { id: userId })
                    .execute();
                return userToDelete;
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
        login: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { password, email } = input;
                const user = yield typeorm_1.getConnection().getRepository(User_1.default).findOne({ where: { email }, relations: ['recipes'] });
                if (!user)
                    throw new apollo_server_express_1.UserInputError('The e-mail address or password you entered was incorrect');
                const passwordIsValid = yield bcryptjs_1.default.compare(password, user.hashPassword);
                if (!passwordIsValid)
                    throw new apollo_server_express_1.UserInputError('The e-mail address or password you entered was incorrect');
                const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
                return { token };
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
        signUp: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = new User_1.default();
            newUser.name = input.name;
            newUser.email = input.email;
            newUser.hashPassword = yield bcryptjs_1.default.hash(input.password, 12);
            yield index_2.userValidation(Object.assign(Object.assign({}, newUser), { password: input.password }));
            try {
                const savedUser = yield typeorm_1.getManager().save(newUser);
                return savedUser;
            }
            catch (e) {
                console.log(e);
                throw new Error('Server error, we will fix it soon');
            }
        }),
    },
};
//# sourceMappingURL=user.js.map