import { S3 } from "@aws-sdk/client-s3";

// Load environment variables
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;

// Throw an error if any of the required environment variables are missing
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET) {
  throw new Error('Missing required environment variables for S3 client setup');
}

// Set up the S3 client
const s3 = new S3({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: AWS_REGION,
});

// Export the S3 client
export default s3;
