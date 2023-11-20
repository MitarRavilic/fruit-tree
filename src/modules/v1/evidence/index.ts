import type { FastifyInstance } from 'fastify';
import s3 from '../s3/s3.config';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { S3_PREFIX_EVIDENCE } from './const';
import { DeleteParams, DownloadParams } from './interface';
import config from 'config';
import {
    deleteManySchema,
    downloadSchema,
    listEvidenceSchema,
    uploadManySchema,
    uploadSchema,
} from './swagger';
import fastifyMultipart from '@fastify/multipart';

export function EvidenceModule(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    // Register fastify modules
    fastify.register(fastifyMultipart);

    // upload single file
    fastify.post(
        '/upload',
        { schema: uploadSchema },
        async (request, reply) => {
            const data = await request.file();
            if (!data) {
                return reply.send({ message: 'No file uploaded' });
            }
            const fileContent = await data.toBuffer();

            const params = new PutObjectCommand({
                Bucket: config.get<string>('aws.s3.bucket'),
                Key: `${S3_PREFIX_EVIDENCE}${data.filename}`,
                Body: fileContent,
            });

            // Upload the file to S3
            try {
                const data = await s3.send(params);
                reply.send({ message: 'File uploaded successfully', data });
            } catch (err) {
                console.error(JSON.stringify(err, null, 4));
                reply.code(400).send({ message: 'Error uploading file' });
            }
        }
    );

fastify.post('/uploadMany', { schema: uploadManySchema }, async (request, reply) => {
    const filesIterator = request.files(); // Get an asynchronous iterator for the files
    const uploadPromises = [];

    for await (const file of filesIterator) {
        const uploader = new Upload({
            client: s3,
            params: {
                Bucket: config.get<string>('aws.s3.bucket'),
                Key: `${S3_PREFIX_EVIDENCE}${file.filename}`,
                Body: file.file,
            },
        });

        uploadPromises.push(uploader.done());
    }

    try {
        if (uploadPromises.length === 0) {
            return reply
                .code(400)
                .send({ message: 'No files uploaded' });
        }
        await Promise.all(uploadPromises);
        reply.send({ message: 'Files uploaded successfully' });
    } catch (err) {
        console.error(err);
        reply.code(400).send({ message: 'Error uploading files' });
    }
});


    fastify.get(
        '/list',
        { schema: listEvidenceSchema },
        async (request, reply) => {
            try {
                const listParams = {
                    Bucket: config.get<string>('aws.s3.bucket'),
                    Prefix: S3_PREFIX_EVIDENCE, // This filters objects starting with 'evidence/'
                };

                const command = new ListObjectsV2Command(listParams);
                const data = await s3.send(command);

                const files =
                    data.Contents?.map((item) => ({
                        Key: item.Key,
                        LastModified: item.LastModified,
                        Size: item.Size,
                    })) || [];

                reply.send({ files });
            } catch (err) {
                console.error(err);
                reply.code(400).send();
            }
        }
    );

    // Download a file by filename
    fastify.post<{ Body: DownloadParams }>(
        '/download',
        { schema: downloadSchema },
        async (request, reply) => {
            const fileName = request.body.fileName;
            const key = `${S3_PREFIX_EVIDENCE}${fileName}`;

            try {
                const getParams = {
                    Bucket: config.get<string>('aws.s3.bucket'),
                    Key: key,
                };

                const command = new GetObjectCommand(getParams);
                const { Body, ContentType } = await s3.send(command);

                // NOTE: All of this is necessary because Fastify and S3 Streams are not compatible
                if (Body) {
                    const readableStream = Body.transformToWebStream();

                    // Define a WritableStream that writes to Fastify's response
                    const writableStream = new WritableStream({
                        write(chunk) {
                            return new Promise((resolve, reject) => {
                                reply.raw.write(chunk, (error) => {
                                    if (error) reject(error);
                                    else resolve();
                                });
                            });
                        },
                        close() {
                            reply.raw.end();
                        },
                        abort(err) {
                            console.error(err);
                            reply.raw.destroy(err);
                        },
                    });

                    reply.raw.writeHead(200, {
                        'Content-Type':
                            ContentType || 'application/octet-stream',
                        'Content-Disposition': `attachment; filename="${fileName}"`,
                    });

                    await readableStream.pipeTo(writableStream);
                    reply.sent = true; // Mark the reply as sent
                } else {
                    reply.code(404).send('File not found');
                }
            } catch (err) {
                console.error(err);
                if (err instanceof Error && err.name === 'NoSuchKey') {
                    reply.code(404).send('File not found');
                }
                reply.code(400).send('Error downloading file');
            }
        }
    );

    // Delete files by filenames
    fastify.delete<{ Body: DeleteParams }>(
        '/deleteMany',
        { schema: deleteManySchema },
        async (request, reply) => {
            const filenames = request.body.fileNames;
            const deletePromises = [];
            const errors: string[] = [];

            for (const filename of filenames) {
                const key = `${S3_PREFIX_EVIDENCE}${filename}`;

                const deleteParams = {
                    Bucket: config.get<string>('aws.s3.bucket'),
                    Key: key,
                };

                const command = new DeleteObjectCommand(deleteParams);
                deletePromises.push(
                    s3.send(command).catch((err) => {
                        console.error(err);
                        errors.push(`Error deleting file: ${filename}`);
                    })
                );
            }

            await Promise.all(deletePromises);

            if (errors.length > 0) {
                reply
                    .code(400)
                    .send({ message: 'Error deleting some files', errors });
            } else {
                reply.send({ message: 'Files deleted successfully' });
            }
        }
    );

    done();
}
