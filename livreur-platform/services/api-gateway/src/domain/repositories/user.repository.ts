import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { IUser, User } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<IUser>;
  findById(id: string | Types.ObjectId): Promise<IUser | null>;
  findOne(filter: FilterQuery<IUser>): Promise<IUser | null>;
  find(filter?: FilterQuery<IUser>): Promise<IUser[]>;
  findPaginated(
    filter: FilterQuery<IUser>,
    options: {
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
      select?: string;
    }
  ): Promise<{ data: IUser[]; total: number; page: number; totalPages: number }>;
  findByIdAndUpdate(
    id: string | Types.ObjectId,
    update: UpdateQuery<UpdateUserDto>,
    options?: { new: boolean }
  ): Promise<IUser | null>;
  findOneAndUpdate(
    filter: FilterQuery<IUser>,
    update: UpdateQuery<UpdateUserDto>,
    options?: { new: boolean }
  ): Promise<IUser | null>;
  deleteOne(filter: FilterQuery<IUser>): Promise<boolean>;
  countDocuments(filter?: FilterQuery<IUser>): Promise<number>;
  exists(filter: FilterQuery<IUser>): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async create(userData: CreateUserDto): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async findOne(filter: FilterQuery<IUser>): Promise<IUser | null> {
    return User.findOne(filter).exec();
  }

  async find(filter: FilterQuery<IUser> = {}): Promise<IUser[]> {
    return User.find(filter).exec();
  }

  async findPaginated(
    filter: FilterQuery<IUser> = {},
    options: {
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
      select?: string;
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const query = User.find(filter);

    if (options.select) {
      query.select(options.select);
    }

    if (options.sort) {
      query.sort(options.sort);
    }

    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      User.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      totalPages,
    };
  }

  async findByIdAndUpdate(
    id: string | Types.ObjectId,
    update: UpdateQuery<UpdateUserDto>,
    options: { new: boolean } = { new: true }
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, update, options).exec();
  }

  async findOneAndUpdate(
    filter: FilterQuery<IUser>,
    update: UpdateQuery<UpdateUserDto>,
    options: { new: boolean } = { new: true }
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(filter, update, options).exec();
  }

  async deleteOne(filter: FilterQuery<IUser>): Promise<boolean> {
    const result = await User.deleteOne(filter).exec();
    return result.deletedCount > 0;
  }

  async countDocuments(filter: FilterQuery<IUser> = {}): Promise<number> {
    return User.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<IUser>): Promise<boolean> {
    const count = await User.countDocuments(filter).exec();
    return count > 0;
  }
}
