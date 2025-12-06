"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userValidationSchema = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.UserRole = {
    ADMIN: 'admin',
    DELIVERY_PERSON: 'delivery_person',
    CUSTOMER: 'customer',
};
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String },
    role: {
        type: String,
        enum: Object.values(exports.UserRole),
        default: exports.UserRole.CUSTOMER
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
});
// Schéma de validation avec Zod
exports.userValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    phoneNumber: zod_1.z.string().optional(),
    role: zod_1.z.enum([exports.UserRole.ADMIN, exports.UserRole.DELIVERY_PERSON, exports.UserRole.CUSTOMER]).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
    const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
    return bcrypt.compare(candidatePassword, this.password);
};
// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.model.js.map