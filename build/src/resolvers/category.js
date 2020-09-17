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
const Category_1 = __importDefault(require("../entities/Category"));
const index_1 = __importDefault(require("./middleware/index"));
exports.default = {
    Query: {
        getCategories: (_, __, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const categories = yield typeorm_1.getConnection().getRepository(Category_1.default).find({ relations: ['recipes'] });
            return categories;
        }),
        getOneCategory: (_, { id }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const category = yield typeorm_1.getConnection().getRepository(Category_1.default).findOne(id, { relations: ['recipes'] });
            if (category) {
                return category;
            }
            throw new apollo_server_express_1.UserInputError('There is no category with this id');
        }),
    },
    Mutation: {
        createCategory: (_, { input }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            const newCategory = new Category_1.default();
            newCategory.name = input.name;
            newCategory.recipes = [];
            try {
                const savedCategory = yield typeorm_1.getManager().save(newCategory);
                return savedCategory;
            }
            catch (error) {
                console.log(error);
                throw new Error('Server error, we will fix it soon');
            }
        }),
        updateCategory: (_, { id, input }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            try {
                const categoryRepository = yield typeorm_1.getConnection().getRepository(Category_1.default);
                const categoryToUpdate = yield categoryRepository.findOne(id);
                if (!categoryToUpdate)
                    throw new apollo_server_express_1.UserInputError('Category not found');
                const categoryUpdated = Object.assign(Object.assign({}, categoryToUpdate), { name: input.name });
                yield categoryRepository.save(categoryUpdated);
                return categoryUpdated;
            }
            catch (_e) {
                let error = _e;
                console.log(error);
                if (error.name !== 'UserInputError')
                    error = new Error('Server error, we will fix it soon');
                throw error;
            }
        }),
        deleteCategory: (_, { id }, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            index_1.default(email);
            try {
                const categoryToDelete = yield typeorm_1.getConnection().getRepository(Category_1.default).findOne(id, { relations: ['recipes'] });
                if (!categoryToDelete)
                    throw new apollo_server_express_1.UserInputError('Category not found');
                yield typeorm_1.getConnection().createQueryBuilder().delete().from(Category_1.default)
                    .where('id = :id', { id })
                    .execute();
                return categoryToDelete;
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
//# sourceMappingURL=category.js.map