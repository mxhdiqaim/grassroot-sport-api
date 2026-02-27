export const getEnvVariable = (key: string): string => {
    // Bun.env is a plain JS object containing all environment variables
    const value = Bun.env[key];

    if (!value) {
        throw new Error(`Environment variable "${key}" is missing. Please check your .env file.`);
    }

    return value;
};