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
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("../entities/User"));
const Recipe_1 = __importDefault(require("../entities/Recipe"));
const Category_1 = __importDefault(require("../entities/Category"));
const index_1 = __importDefault(require("./middleware/index"));
exports.default = {
    Query: {
        getRecipes: (_, __, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const recipes = yield typeorm_1.getConnection().getRepository(Recipe_1.default).find({ relations: ['category', 'user'] });
            return recipes;
        }),
        getOneRecipe: (_, { id }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const recipe = yield typeorm_1.getConnection().getRepository(Recipe_1.default).findOne(id, { relations: ['category', 'user'] });
            if (recipe) {
                console.log('recipe', recipe);
                return recipe;
            }
            throw new Error('there is no recipe with this id');
        }),
    },
    Mutation: {
        createRecipe: (_, { input }, { email, userId }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const newRecipe = new Recipe_1.default();
            newRecipe.name = input.name;
            newRecipe.ingredients = input.ingredients;
            newRecipe.description = input.description;
            try {
                const category = yield typeorm_1.getConnection().getRepository(Category_1.default).findOne(input.categoryId);
                console.log('userId', userId);
                const user = yield typeorm_1.getConnection().getRepository(User_1.default).findOne(userId);
                if (category) {
                    newRecipe.user = user;
                    newRecipe.category = category;
                    const savedRecipe = yield typeorm_1.getManager().save(newRecipe);
                    return savedRecipe;
                }
                throw new apollo_server_express_1.UserInputError('Category not found');
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
        updateRecipe: (_, { id, input }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            try {
                const recipeRepository = yield typeorm_1.getConnection().getRepository(Recipe_1.default);
                const recipeToUpdate = yield recipeRepository.findOne(id);
                if (!recipeToUpdate)
                    throw new apollo_server_express_1.UserInputError('Recipe not found');
                const recipeUpdated = Object.assign(Object.assign({}, recipeToUpdate), input);
                const category = yield typeorm_1.getConnection().getRepository(Category_1.default).findOne(input.categoryId);
                const user = yield typeorm_1.getConnection().getRepository(User_1.default).findOne(input.userId);
                if (user) {
                    recipeUpdated.user = user;
                }
                else {
                    throw new apollo_server_express_1.UserInputError('User not found');
                }
                if (category) {
                    recipeUpdated.category = category;
                    yield recipeRepository.save(recipeUpdated);
                    return recipeUpdated;
                }
                throw new apollo_server_express_1.UserInputError('Category not found');
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
        deleteRecipe: (_, { id }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            try {
                const recipeToDelete = yield typeorm_1.getConnection().getRepository(Recipe_1.default).findOne(id, { relations: ['category', 'user'] });
                if (!recipeToDelete)
                    throw new apollo_server_express_1.UserInputError('Recipe not found');
                yield typeorm_1.getConnection().createQueryBuilder().delete().from(Recipe_1.default)
                    .where('id = :id', { id })
                    .execute();
                return recipeToDelete;
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
    },
};
//# sourceMappingURL=recipe.js.map