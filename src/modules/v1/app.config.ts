export interface AppConfig {
    port: string;
    host: string;
    env: string;
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        s3: {
            bucket: string;
        };
    };
}
