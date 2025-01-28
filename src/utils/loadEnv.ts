import { getVariableByEnv } from './commonFunctions';

const loadEnv = () => {
    const databaseUrl = getVariableByEnv('DATABASE_URL');
    const blobToken = getVariableByEnv('READ_WRITE_TOKEN');

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined for the current environment');
    }

    if (!blobToken) {
        throw new Error('READ_WRITE_TOKEN is not defined for the current environment');
    }

    process.env.DATABASE_URL = databaseUrl;
    process.env.BLOB_READ_WRITE_TOKEN = blobToken; 
};

export default loadEnv;
