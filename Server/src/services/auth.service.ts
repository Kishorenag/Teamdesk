import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { ICreateUserInput, ILoginInput, IAuthResponse } from '../types/index';

export class AuthService {
  async register(data: ICreateUserInput): Promise<IAuthResponse> {
    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id!.toString(), user.email);

    // Return response
    const userWithoutPassword = user.toObject();
    delete (userWithoutPassword as any).password;

    return {
      token,
      user: userWithoutPassword as any,
    };
  }

  async login(data: ILoginInput): Promise<IAuthResponse> {
    // Find user
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id!.toString(), user.email);

    // Return response
    const userWithoutPassword = user.toObject();
    delete (userWithoutPassword as any).password;

    return {
      token,
      user: userWithoutPassword as any,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const authService = new AuthService();
