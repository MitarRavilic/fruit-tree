import type { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import s3 from '../s3/s3.config';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_PREFIX_EVIDENCE } from './const';
import { DownloadParams } from './interface';

export function EvidenceModule(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    // Register fastify modules
    fastify.register(fastifyMultipart);
    
    fastify.post('/upload', async (request, reply) => {
        const data = await request.file();
        if(!data) {
            return reply.send({ message: 'No file uploaded' });
        }
        const fileContent = await data.toBuffer();

        const params = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `evidence/${data.filename}`,
            Body: fileContent,
        });

        // Upload the file to S3
        s3.send(params, function(err, data) {
            if (err) {
                console.error(err);
                reply.code(400).send({ message: 'Error uploading file' });
            } else {
                reply.send({ message: 'File uploaded successfully', data });
            }
        });
    });

    fastify.post('/uploadMany', async (request, reply) => {
        const filesIterator = request.files(); // Get an asynchronous iterator for the files
        const uploadPromises = [];
    
        for await (const file of filesIterator) {
            const putCommand = new PutObjectCommand({
                Bucket: 'your-bucket-name',
                Key: `your-folder/${file.filename}`,
                Body: file.file, // Stream the file directly
            });
    
            uploadPromises.push(s3.send(putCommand));
        }
    
        try {
            // Wait for all uploads to complete in parallel
            await Promise.all(uploadPromises);
            reply.send({ message: 'Files uploaded successfully' });
        } catch (err) {
            console.error(err);
            reply.code(400).send({ message: 'Error uploading files' });        }
    });


    fastify.get('/list-evidence', async (request, reply) => {
        try {
            const listParams = {
                Bucket: process.env.AWS_S3_BUCKET, 
                Prefix: S3_PREFIX_EVIDENCE // This filters objects starting with 'evidence/'
            };
    
            const command = new ListObjectsV2Command(listParams);
            const data = await s3.send(command);
    
            const files = data.Contents?.map(item => ({
                Key: item.Key,
                LastModified: item.LastModified,
                Size: item.Size
            })) || [];
    
            reply.send({ files });
        } catch (err) {
            console.error(err)
            reply.code(400).send();
        }
    });

    // Download a file by filename
    fastify.post<{ Body: DownloadParams }>('/download', async (request, reply) => {
        const fileName = request.body.fileName;
        const key = `${S3_PREFIX_EVIDENCE}${fileName}`; // Construct the file key
    
        try {
            const getParams = {
                Bucket: process.env.AWS_S3_BUCKET, 
                Key: key
            };
    
            const command = new GetObjectCommand(getParams);
            const { Body, ContentType } = await s3.send(command);
    
            if (Body) {
                reply.type(ContentType || 'application/octet-stream');
                reply.send(Body);
            } else {
                reply.code(404).send('File not found');
            }
        } catch (err) {
            console.error(err)
            reply.code(400).send();
        }
    });
    
    done();
}
