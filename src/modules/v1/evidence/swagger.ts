import { FastifySchema } from 'fastify';

export const uploadSchema: FastifySchema = {
    description: 'Uploads a file to the server and stores it in AWS S3.',
    tags: ['Evidences'],
    consumes: ['multipart/form-data'],
    produces: ['application/json'],
    body: {
        required: ['file'],
        properties: {
            file: {
                type: 'string',
                format: 'binary',
            },
        },
    },
    response: {
        200: {
            description: 'File uploaded successfully',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        400: {
            description: 'Error uploading file or no file uploaded',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const uploadManySchema: FastifySchema = {
    description:
        'Uploads multiple files to the server and stores them in AWS S3.',
    tags: ['Evidences'],
    consumes: ['multipart/form-data'],
    produces: ['application/json'],
    body: {
        required: ['files'],
        properties: {
            files: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    },
    response: {
        200: {
            description: 'Files uploaded successfully',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        400: {
            description: 'Error uploading files or no files uploaded',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const downloadSchema: FastifySchema = {
    description: 'Downloads a file from the server.',
    tags: ['Evidences'],
    produces: ['application/octet-stream'],
    params: {
        type: 'object',
        properties: {
            fileName: {
                type: 'string',
                description: 'The name of the file to download.',
            },
        },
    },
    response: {
        200: {
            description: 'File downloaded successfully',
            type: 'string',
            format: 'binary',
        },
        400: {
            description: 'Error downloading file',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const listEvidenceSchema: FastifySchema = {
    description: 'Lists all evidence files stored in AWS S3.',
    tags: ['Evidences'],
    response: {
        200: {
            description: 'List of evidence files',
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            Key: { type: 'string' },
                            LastModified: {
                                type: 'string',
                                format: 'date-time',
                            },
                            Size: { type: 'integer' },
                        },
                    },
                },
            },
        },
        400: {
            description: 'Error retrieving evidence files',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const deleteManySchema: FastifySchema = {
    description: 'Deletes multiple evidence files from AWS S3.',
    tags: ['Evidences'],
    summary: 'Delete multiple evidence files',
    body: {
      type: 'object',
      required: ['fileNames'],
      properties: {
        fileNames: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of filenames to be deleted'
        }
      }
    },
    response: {
      200: {
        description: 'Files deleted successfully',
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      400: {
        description: 'Error deleting some files',
        type: 'object',
        properties: {
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  };