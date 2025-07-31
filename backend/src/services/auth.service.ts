import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '../config/config';
import { DatabaseService } from './database.service';
import { EmailService } from './email.service';
import { logger } from '../utils/logger';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'email' | 'google';
  sport?: 'soccer' | 'futsal';
  sportSelected: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  name: string;
  picture?: string;
  provider: 'email' | 'google';
  googleId?: string;
}

export class AuthService {
  private databaseService: DatabaseService;
  private emailService: EmailService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.emailService = new EmailService();
    this.initializePassport();
  }

  private initializePassport(): void {
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await this.findUserByGoogleId(profile.id);
        
        if (!user) {
          // Create new user from Google profile
          user = await this.createUser({
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || '',
            picture: profile.photos?.[0]?.value,
            provider: 'google',
            googleId: profile.id
          });

          // Send welcome email
          await this.emailService.sendWelcomeEmail(user.email, user.name);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));

    // JWT Strategy
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret
    }, async (payload, done) => {
      try {
        const user = await this.findUserById(payload.userId);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }));

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await this.findUserById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  async register(userData: CreateUserDto): Promise<{ user: User; token: string }> {
    try {
      // Check if user exists
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password if provided
      let hashedPassword;
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 12);
      }

      // Create user
      const user = await this.createUser({
        ...userData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = this.generateToken(user);

      // Send verification email for email signups
      if (userData.provider === 'email') {
        await this.emailService.sendVerificationEmail(user.email, user.name, token);
      }

      // Send welcome email
      await this.emailService.sendWelcomeEmail(user.email, user.name);

      logger.info(`User registered: ${user.email}`);
      return { user, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const userData = await this.databaseService.getUserWithPassword(user.id);
      if (!userData.password || !await bcrypt.compare(password, userData.password)) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user);

      logger.info(`User logged in: ${user.email}`);
      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      const user = await this.findUserById(decoded.userId);
      
      if (!user) {
        throw new Error('Invalid token');
      }

      // Update email verification status
      const updatedUser = await this.databaseService.updateUser(user.id, {
        emailVerified: true
      });

      logger.info(`Email verified for user: ${user.email}`);
      return updatedUser;
    } catch (error) {
      logger.error('Email verification error:', error);
      throw error;
    }
  }

  async updateSportPreference(userId: string, sport: 'soccer' | 'futsal'): Promise<User> {
    try {
      const user = await this.databaseService.updateUser(userId, {
        sport,
        sportSelected: true
      });

      logger.info(`Sport preference updated for user ${userId}: ${sport}`);
      return user;
    } catch (error) {
      logger.error('Sport preference update error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ user: User; token: string }> {
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
      const user = await this.findUserById(decoded.userId);
      
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate new token
      const newToken = this.generateToken(user);

      logger.info(`Token refreshed for user: ${user.email}`);
      return { user, token: newToken };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  private async createUser(userData: CreateUserDto): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: userData.provider,
      sportSelected: false,
      emailVerified: userData.provider === 'google', // Auto-verify Google users
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.databaseService.createUser(user, userData.password);
  }

  private async findUserById(id: string): Promise<User | null> {
    return await this.databaseService.getUserById(id);
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return await this.databaseService.getUserByEmail(email);
  }

  private async findUserByGoogleId(googleId: string): Promise<User | null> {
    return await this.databaseService.getUserByGoogleId(googleId);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as string }
    );
  }
}