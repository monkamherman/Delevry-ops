"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const constants_1 = require("../core/constants");
const logger_1 = __importDefault(require("../utils/logger"));
const prisma = new client_1.PrismaClient();
const userController = {
    postUser: async (req, res) => {
        const { name } = req.body;
        const user = await prisma.user.create({
            data: name
        });
        res.status(constants_1.HttpCode.OK).json(user);
        logger_1.default.info(user);
    }
};
exports.default = userController;
//# sourceMappingURL=controllers.js.map