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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../entities/User"));
exports.default = (req) => __awaiter(void 0, void 0, void 0, function* () {
    req.email = null;
    req.userId = null;
    try {
        if (req.headers.authorization) {
            const bearerHeader = req.headers.authorization || '';
            const token = bearerHeader.split(' ')[1];
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield typeorm_1.getConnection()
                .getRepository(User_1.default).findOne({ where: { email: payload.email }, relations: ['recipes'] });
            if (!user)
                throw new Error('Incorrect token');
            req.email = payload.email;
            req.userId = user.id;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error('Incorrect token');
    }
});
//# sourceMappingURL=index.js.map