import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../shared/config';
import { ApiError } from '../../shared/utils/ApiError';
import { logger } from '../../shared/utils/logger';
import { UserRepository } from './user.repository';
import { CacheService } from '../../shared/services/cache.service';
import { EventEmitter } from '../../shared/services/event.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coach' | 'analyst' | 'player';
  permissions: string[];
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'coach' | 'analyst' | 'player';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: 'admin' | 'coach' | 'analyst' | 'player';
  isActive?: boolean;
}

export class UserService {
  private userRepository: UserRepository;
  private cacheService: CacheService;
  private eventEmitter: EventEmitter;

  constructor() {
    this.userRepository = new UserRepository();
    this.cacheService = new CacheService();
    this.eventEmitter = new EventEmitter();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ApiError(409, 'User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await this.userRepository.create({
        id: uuidv4(),
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'player',
        permissions: this.getDefaultPermissions(userData.role || 'player'),
        isActive: true,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Cache user
      await this.cacheService.set(`user:${user.id}`, userWithoutPassword, 3600);

      // Emit user created event
      this.eventEmitter.emit('user.created', { user: userWithoutPassword });

      logger.info(`User created: ${user.email}`);
      return userWithoutPassword as User;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async login(loginData: LoginDto): Promise<{ user: User; token: string }> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new ApiError(401, 'Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.auth.jwtSecret,
        { expiresIn: config.auth.jwtExpiresIn }
      );

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Cache user
      await this.cacheService.set(`user:${user.id}`, userWithoutPassword, 3600);

      // Emit login event
      this.eventEmitter.emit('user.login', { user: userWithoutPassword });

      logger.info(`User logged in: ${user.email}`);
      return { user: userWithoutPassword as User, token };
    } catch (error) {
      logger.error('Error during login:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      // Try to get from cache first
      const cachedUser = await this.cacheService.get(`user:${id}`);
      if (cachedUser) {
        return cachedUser as User;
      }

      // Get from database
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Cache user
      await this.cacheService.set(`user:${id}`, userWithoutPassword, 3600);

      return userWithoutPassword as User;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.update(id, {
        ...updateData,
        updatedAt: new Date(),
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Update cache
      await this.cacheService.set(`user:${id}`, userWithoutPassword, 3600);

      // Emit user updated event
      this.eventEmitter.emit('user.updated', { user: userWithoutPassword });

      logger.info(`User updated: ${user.email}`);
      return userWithoutPassword as User;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        throw new ApiError(404, 'User not found');
      }

      // Remove from cache
      await this.cacheService.delete(`user:${id}`);

      // Emit user deleted event
      this.eventEmitter.emit('user.deleted', { userId: id });

      logger.info(`User deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUsers(page = 1, limit = 10, filters: any = {}): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const result = await this.userRepository.findMany(page, limit, filters);
      
      // Remove passwords from response
      const users = result.users.map(({ password, ...user }) => user as User);

      return {
        users,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new ApiError(400, 'Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.userRepository.updatePassword(id, hashedNewPassword);

      // Emit password changed event
      this.eventEmitter.emit('user.password_changed', { userId: id });

      logger.info(`Password changed for user: ${id}`);
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  private getDefaultPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      admin: ['*'], // All permissions
      coach: [
        'team.read',
        'team.write',
        'player.read',
        'player.write',
        'match.read',
        'match.write',
        'analytics.read',
      ],
      analyst: [
        'team.read',
        'player.read',
        'match.read',
        'analytics.read',
        'analytics.write',
      ],
      player: [
        'team.read',
        'player.read',
        'match.read',
        'analytics.read',
      ],
    };

    return permissions[role] || permissions.player;
  }
}