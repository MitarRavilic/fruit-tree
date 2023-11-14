import type { FastifyInstance } from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import s3 from '../s3/s3.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export function EvidenceModule(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    // Register fastify modules
    fastify.register(fastifyMultipart);

    /**
     * Each route can be decompose within a module/file
     * This is just for demo purposes
     */
    fastify.get('/', async (request, reply) => {
        reply.send({ hello: 'world' });
    });

    fastify.get(
        '/:id',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                },
            },
        },
        async (request, reply) => {
            reply.send({ hello: 'world' });
        }
    );
    
    fastify.post('/', async (request, reply) => {
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
                reply.send({ message: 'Error uploading file' });
            } else {
                reply.send({ message: 'File uploaded successfully', data });
            }
        });
    });

    fastify.patch('/:id', async (request, reply) => {
        reply.send({ hello: 'world' });
    });

    done();
}
