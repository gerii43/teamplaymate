/**
 * Environment Validation Utility
 * Validates required environment variables and provides helpful error messages
 */
interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    missing: string[];
    invalid: string[];
}
declare class EnvironmentValidator {
    private static instance;
    private validationResult;
    private constructor();
    static getInstance(): EnvironmentValidator;
    /**
     * Validate all environment variables
     */
    validate(): ValidationResult;
    /**
     * Validate data type of environment variable
     */
    private validateType;
    /**
     * Validate dependencies between environment variables
     */
    private validateDependencies;
    /**
     * Get environment variable with type casting
     */
    get<T = string>(name: string, defaultValue?: T): T;
    /**
     * Get boolean environment variable
     */
    getBoolean(name: string, defaultValue?: boolean): boolean;
    /**
     * Get number environment variable
     */
    getNumber(name: string, defaultValue: number): number;
    /**
     * Print validation results to console
     */
    printResults(): void;
    /**
     * Clear cached validation result
     */
    clearCache(): void;
}
export declare const envValidator: EnvironmentValidator;
export declare const getEnv: <T = string>(name: string, defaultValue?: T) => T;
export declare const getEnvBoolean: (name: string, defaultValue?: boolean) => boolean;
export declare const getEnvNumber: (name: string, defaultValue: number) => number;
export declare const validateEnvironment: () => ValidationResult;
export default envValidator;
//# sourceMappingURL=envValidation.d.ts.map