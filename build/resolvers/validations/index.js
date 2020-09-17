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
const class_validator_1 = require("class-validator");
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("../../entities/User"));
exports.generalValidation = (objToValidate) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = yield class_validator_1.validate(objToValidate);
    console.log('errors', errors);
    if (errors.length > 0) {
        const messageErrors = errors.map((error) => {
            const { constraints } = error;
            return `${error.property} is "${error.value}" and must be ${constraints[Object.keys(constraints)[0]]}`;
        });
        throw new apollo_server_express_1.UserInputError(messageErrors.toString());
    }
});
const validatePassword = (password) => {
    const HasANumber = /\d/.test(password);
    const hasAUppercaseCharacter = /[A-Z]/.test(password);
    const hasALowercaseCharacter = /[a-z]/.test(password);
    const hasThreeCharactersInARowRepeated = /(.)\1\1/.test(password);
    if (!hasThreeCharactersInARowRepeated
        && HasANumber
        && hasAUppercaseCharacter
        && hasALowercaseCharacter) {
        console.log('The password is strong');
    }
    else {
        throw new apollo_server_express_1.UserInputError(`The password must have at least one number,
     one uppercase letter, one lowercase letter, a minimum length of 8 characters,
      a maximum length of 20 characters and it must not have more than two characters in a row repeated`);
    }
};
const emailIsUnique = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield typeorm_1.getConnection().getRepository(User_1.default).findOne({ where: { email }, relations: ['recipes'] });
    if (user)
        throw new apollo_server_express_1.UserInputError('This email is already in use');
});
const validateEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase()))
        throw new apollo_server_express_1.UserInputError('The email must be a email like example@example.com');
    yield emailIsUnique(email);
});
const validateName = (name) => {
    const hasAMinLengthOfFive = /.{5}/.test(name);
    if (!hasAMinLengthOfFive) {
        throw new apollo_server_express_1.UserInputError('The name must have a min length of 5');
    }
};
exports.userValidation = (userToValidate) => __awaiter(void 0, void 0, void 0, function* () {
    if (userToValidate.password)
        validatePassword(userToValidate.password);
    if (userToValidate.email)
        yield validateEmail(userToValidate.email);
    if (userToValidate.name)
        validateName(userToValidate.name);
});
//# sourceMappingURL=index.js.map