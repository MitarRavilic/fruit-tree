import { S3 } from '@aws-sdk/client-s3';
import config from 'config';
import { AppConfig } from '../app.config';

// Load AWS configuration using config
const awsConfig = config.get('aws') as AppConfig['aws'];

// Extract AWS configuration values
const { accessKeyId, secretAccessKey, region } = awsConfig;
const s3Bucket = awsConfig.s3.bucket;

// Throw an error if any of the required configuration variables are missing
if (!accessKeyId || !secretAccessKey || !region || !s3Bucket) {
    throw new Error(
        'Missing required configuration variables for S3 client setup'
    );
}

// Set up the S3 client
const s3 = new S3({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    region: region,
});

// Export the S3 client
export default s3;
