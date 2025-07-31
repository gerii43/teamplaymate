/**
 * Environment Validation Utility
 * Validates required environment variables and provides helpful error messages
 */

interface EnvVar {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'url' | 'email';
  description: string;
  defaultValue?: string | number | boolean;
  validation?: (value: string) => boolean;
}

const requiredEnvVars: EnvVar[] = [
  // Server Configuration
  {
    name: 'NODE_ENV',
    required: true,
    type: 'string',
    description: 'Application environment (development, production, test)',
    defaultValue: 'development',
    validation: (value) => ['development', 'production', 'test'].includes(value)
  },
  {
    name: 'PORT',
    required: true,
    type: 'number',
    description: 'Server port number',
    defaultValue: '3001',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0 && Number(value) < 65536
  },
  {
    name: 'HOST',
    required: false,
    type: 'string',
    description: 'Server host address',
    defaultValue: 'localhost'
  },

  // Database Configuration
  {
    name: 'SUPABASE_URL',
    required: true,
    type: 'url',
    description: 'Supabase project URL'
  },
  {
    name: 'SUPABASE_ANON_KEY',
    required: true,
    type: 'string',
    description: 'Supabase anonymous key'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    type: 'string',
    description: 'Supabase service role key'
  },

  // JWT Configuration
  {
    name: 'JWT_SECRET',
    required: true,
    type: 'string',
    description: 'JWT signing secret',
    validation: (value) => value.length >= 32
  },
  {
    name: 'JWT_EXPIRES_IN',
    required: false,
    type: 'string',
    description: 'JWT token expiration time',
    defaultValue: '7d'
  },

  // Session Configuration
  {
    name: 'SESSION_SECRET',
    required: true,
    type: 'string',
    description: 'Session encryption secret',
    validation: (value) => value.length >= 32
  },

  // OAuth Configuration
  {
    name: 'GOOGLE_CLIENT_ID',
    required: false,
    type: 'string',
    description: 'Google OAuth client ID'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    required: false,
    type: 'string',
    description: 'Google OAuth client secret'
  },
  {
    name: 'GITHUB_CLIENT_ID',
    required: false,
    type: 'string',
    description: 'GitHub OAuth client ID'
  },
  {
    name: 'GITHUB_CLIENT_SECRET',
    required: false,
    type: 'string',
    description: 'GitHub OAuth client secret'
  },

  // Email Configuration
  {
    name: 'EMAIL_HOST',
    required: false,
    type: 'string',
    description: 'SMTP host server',
    defaultValue: 'smtp.gmail.com'
  },
  {
    name: 'EMAIL_PORT',
    required: false,
    type: 'number',
    description: 'SMTP port number',
    defaultValue: '587',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0
  },
  {
    name: 'EMAIL_USER',
    required: false,
    type: 'email',
    description: 'SMTP username/email'
  },
  {
    name: 'EMAIL_PASS',
    required: false,
    type: 'string',
    description: 'SMTP password/app password'
  },

  // AI Service Configuration
  {
    name: 'DEEPSEEK_API_KEY',
    required: false,
    type: 'string',
    description: 'DeepSeek AI API key'
  },
  {
    name: 'OPENROUTER_API_KEY',
    required: false,
    type: 'string',
    description: 'OpenRouter AI API key'
  },
  {
    name: 'GROQ_API_KEY',
    required: false,
    type: 'string',
    description: 'Groq AI API key'
  },

  // Payment Configuration
  {
    name: 'STRIPE_SECRET_KEY',
    required: false,
    type: 'string',
    description: 'Stripe secret key'
  },
  {
    name: 'STRIPE_PUBLISHABLE_KEY',
    required: false,
    type: 'string',
    description: 'Stripe publishable key'
  },

  // Redis Configuration
  {
    name: 'REDIS_URL',
    required: false,
    type: 'url',
    description: 'Redis connection URL',
    defaultValue: 'redis://localhost:6379'
  },

  // File Upload Configuration
  {
    name: 'UPLOAD_MAX_SIZE',
    required: false,
    type: 'number',
    description: 'Maximum file upload size in bytes',
    defaultValue: '10485760',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0
  },

  // CORS Configuration
  {
    name: 'CORS_ORIGIN',
    required: false,
    type: 'string',
    description: 'CORS allowed origins',
    defaultValue: 'http://localhost:5173,http://localhost:3000'
  },

  // Rate Limiting
  {
    name: 'RATE_LIMIT_WINDOW_MS',
    required: false,
    type: 'number',
    description: 'Rate limit window in milliseconds',
    defaultValue: '900000',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0
  },
  {
    name: 'RATE_LIMIT_MAX_REQUESTS',
    required: false,
    type: 'number',
    description: 'Maximum requests per window',
    defaultValue: '100',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0
  },

  // Logging Configuration
  {
    name: 'LOG_LEVEL',
    required: false,
    type: 'string',
    description: 'Logging level',
    defaultValue: 'info',
    validation: (value) => ['error', 'warn', 'info', 'debug'].includes(value)
  },

  // Security Configuration
  {
    name: 'BCRYPT_ROUNDS',
    required: false,
    type: 'number',
    description: 'BCrypt salt rounds',
    defaultValue: '12',
    validation: (value) => !isNaN(Number(value)) && Number(value) >= 10 && Number(value) <= 14
  },

  // Feature Flags
  {
    name: 'ENABLE_CHATBOT',
    required: false,
    type: 'boolean',
    description: 'Enable chatbot functionality',
    defaultValue: 'true'
  },
  {
    name: 'ENABLE_ANALYTICS',
    required: false,
    type: 'boolean',
    description: 'Enable analytics functionality',
    defaultValue: 'true'
  },
  {
    name: 'ENABLE_NOTIFICATIONS',
    required: false,
    type: 'boolean',
    description: 'Enable notifications functionality',
    defaultValue: 'true'
  },
  {
    name: 'ENABLE_FILE_UPLOAD',
    required: false,
    type: 'boolean',
    description: 'Enable file upload functionality',
    defaultValue: 'true'
  },
  {
    name: 'ENABLE_OAUTH',
    required: false,
    type: 'boolean',
    description: 'Enable OAuth authentication',
    defaultValue: 'true'
  },
  {
    name: 'ENABLE_PAYMENTS',
    required: false,
    type: 'boolean',
    description: 'Enable payment functionality',
    defaultValue: 'true'
  },
  {
    name: 'ENABLE_WEBSOCKETS',
    required: false,
    type: 'boolean',
    description: 'Enable WebSocket functionality',
    defaultValue: 'true'
  }
];

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
  invalid: string[];
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private validationResult: ValidationResult | null = null;

  private constructor() {}

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  /**
   * Validate all environment variables
   */
  validate(): ValidationResult {
    if (this.validationResult) {
      return this.validationResult;
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const missing: string[] = [];
    const invalid: string[] = [];

    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar.name];
      
      // Check if required variable is missing
      if (envVar.required && !value) {
        missing.push(envVar.name);
        errors.push(`Missing required environment variable: ${envVar.name} - ${envVar.description}`);
        continue;
      }

      // Use default value if not set
      const actualValue = value || envVar.defaultValue;
      
      if (!actualValue) {
        continue;
      }

      // Type validation
      if (!this.validateType(actualValue, envVar.type)) {
        invalid.push(envVar.name);
        errors.push(`Invalid type for ${envVar.name}: expected ${envVar.type}, got "${actualValue}"`);
        continue;
      }

      // Custom validation
      if (envVar.validation && !envVar.validation(actualValue)) {
        invalid.push(envVar.name);
        errors.push(`Invalid value for ${envVar.name}: "${actualValue}"`);
        continue;
      }

      // Warnings for optional but recommended variables
      if (!envVar.required && !value && envVar.name.includes('API_KEY')) {
        warnings.push(`Optional but recommended: ${envVar.name} - ${envVar.description}`);
      }
    }

    // Additional validation checks
    this.validateDependencies(errors, warnings);

    this.validationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      missing,
      invalid
    };

    return this.validationResult;
  }

  /**
   * Validate data type of environment variable
   */
  private validateType(value: string, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return !isNaN(Number(value));
      case 'boolean':
        return ['true', 'false', '1', '0'].includes(value.toLowerCase());
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      default:
        return true;
    }
  }

  /**
   * Validate dependencies between environment variables
   */
  private validateDependencies(errors: string[], warnings: string[]): void {
    // OAuth dependencies
    const hasGoogleClientId = process.env.GOOGLE_CLIENT_ID;
    const hasGoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (hasGoogleClientId && !hasGoogleClientSecret) {
      errors.push('GOOGLE_CLIENT_ID is set but GOOGLE_CLIENT_SECRET is missing');
    }
    if (hasGoogleClientSecret && !hasGoogleClientId) {
      errors.push('GOOGLE_CLIENT_SECRET is set but GOOGLE_CLIENT_ID is missing');
    }

    const hasGithubClientId = process.env.GITHUB_CLIENT_ID;
    const hasGithubClientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    if (hasGithubClientId && !hasGithubClientSecret) {
      errors.push('GITHUB_CLIENT_ID is set but GITHUB_CLIENT_SECRET is missing');
    }
    if (hasGithubClientSecret && !hasGithubClientId) {
      errors.push('GITHUB_CLIENT_SECRET is set but GITHUB_CLIENT_ID is missing');
    }

    // Email dependencies
    const hasEmailUser = process.env.EMAIL_USER;
    const hasEmailPass = process.env.EMAIL_PASS;
    
    if (hasEmailUser && !hasEmailPass) {
      warnings.push('EMAIL_USER is set but EMAIL_PASS is missing - email functionality may not work');
    }
    if (hasEmailPass && !hasEmailUser) {
      warnings.push('EMAIL_PASS is set but EMAIL_USER is missing - email functionality may not work');
    }

    // Stripe dependencies
    const hasStripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const hasStripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    
    if (hasStripeSecretKey && !hasStripePublishableKey) {
      warnings.push('STRIPE_SECRET_KEY is set but STRIPE_PUBLISHABLE_KEY is missing - payment functionality may not work properly');
    }
    if (hasStripePublishableKey && !hasStripeSecretKey) {
      warnings.push('STRIPE_PUBLISHABLE_KEY is set but STRIPE_SECRET_KEY is missing - payment functionality may not work properly');
    }

    // AI Service dependencies
    const hasAnyAIKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;
    if (!hasAnyAIKey) {
      warnings.push('No AI service API keys found - chatbot functionality will be limited');
    }
  }

  /**
   * Get environment variable with type casting
   */
  get<T = string>(name: string, defaultValue?: T): T {
    const value = process.env[name];
    
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Environment variable ${name} is not set`);
    }

    // Try to infer type from defaultValue
    if (defaultValue !== undefined) {
      if (typeof defaultValue === 'number') {
        return Number(value) as T;
      }
      if (typeof defaultValue === 'boolean') {
        return (value.toLowerCase() === 'true' || value === '1') as T;
      }
    }

    return value as T;
  }

  /**
   * Get boolean environment variable
   */
  getBoolean(name: string, defaultValue: boolean = false): boolean {
    const value = process.env[name];
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Get number environment variable
   */
  getNumber(name: string, defaultValue: number): number {
    const value = process.env[name];
    if (value === undefined) {
      return defaultValue;
    }
    const num = Number(value);
    if (isNaN(num)) {
      return defaultValue;
    }
    return num;
  }

  /**
   * Print validation results to console
   */
  printResults(): void {
    const result = this.validate();
    
    console.log('\n🔍 Environment Validation Results:');
    console.log('=====================================');
    
    if (result.isValid) {
      console.log('✅ All required environment variables are valid!');
    } else {
      console.log('❌ Environment validation failed!');
    }

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    if (result.missing.length > 0) {
      console.log('\n📝 Missing Variables:');
      result.missing.forEach(name => {
        const envVar = requiredEnvVars.find(v => v.name === name);
        console.log(`  • ${name}: ${envVar?.description || 'No description available'}`);
      });
    }

    if (result.invalid.length > 0) {
      console.log('\n🚫 Invalid Variables:');
      result.invalid.forEach(name => {
        const envVar = requiredEnvVars.find(v => v.name === name);
        console.log(`  • ${name}: ${envVar?.description || 'No description available'}`);
      });
    }

    console.log('\n💡 Tips:');
    console.log('  • Copy env.example to .env and fill in your values');
    console.log('  • Check the documentation for required API keys');
    console.log('  • Ensure all URLs are properly formatted');
    console.log('  • Use strong secrets for JWT and session keys');
    console.log('=====================================\n');
  }

  /**
   * Clear cached validation result
   */
  clearCache(): void {
    this.validationResult = null;
  }
}

// Export singleton instance
export const envValidator = EnvironmentValidator.getInstance();

// Export helper functions
export const getEnv = <T = string>(name: string, defaultValue?: T): T => {
  return envValidator.get(name, defaultValue);
};

export const getEnvBoolean = (name: string, defaultValue: boolean = false): boolean => {
  return envValidator.getBoolean(name, defaultValue);
};

export const getEnvNumber = (name: string, defaultValue: number): number => {
  return envValidator.getNumber(name, defaultValue);
};

// Export validation function
export const validateEnvironment = (): ValidationResult => {
  return envValidator.validate();
};

// Export for direct use
export default envValidator; 