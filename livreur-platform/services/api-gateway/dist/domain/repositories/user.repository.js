"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../models/user.model");
class UserRepository {
    async create(userData) {
        const user = new user_model_1.User(userData);
        return user.save();
    }
    async findById(id) {
        return user_model_1.User.findById(id).exec();
    }
    async findOne(filter) {
        return user_model_1.User.findOne(filter).exec();
    }
    async find(filter = {}) {
        return user_model_1.User.find(filter).exec();
    }
    async findPaginated(filter = {}, options = {}) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const query = user_model_1.User.find(filter);
        if (options.select) {
            query.select(options.select);
        }
        if (options.sort) {
            query.sort(options.sort);
        }
        const [data, total] = await Promise.all([
            query.skip(skip).limit(limit).exec(),
            user_model_1.User.countDocuments(filter).exec(),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            totalPages,
        };
    }
    async findByIdAndUpdate(id, update, options = { new: true }) {
        return user_model_1.User.findByIdAndUpdate(id, update, options).exec();
    }
    async findOneAndUpdate(filter, update, options = { new: true }) {
        return user_model_1.User.findOneAndUpdate(filter, update, options).exec();
    }
    async deleteOne(filter) {
        const result = await user_model_1.User.deleteOne(filter).exec();
        return result.deletedCount > 0;
    }
    async countDocuments(filter = {}) {
        return user_model_1.User.countDocuments(filter).exec();
    }
    async exists(filter) {
        const count = await user_model_1.User.countDocuments(filter).exec();
        return count > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map