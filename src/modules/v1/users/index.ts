import type { FastifyInstance } from 'fastify';

export function UsersModule(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    /**
     * Each route can be decompose within a module/file
     * This is just for demo purposes
     */
    fastify.get('/users', async (request, reply) => {
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

    fastify.post(
        '/login',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                },
                body: {
                    type: 'object',
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string' },
                    },
                },
            },
        },
        async (request, reply) => {
            reply.send({ hello: 'world' });
        }
    );

    fastify.post('/', async (request, reply) => {
        reply.send({ hello: 'world' });
    });

    fastify.patch('/:id', async (request, reply) => {
        reply.send({ hello: 'world' });
    });

    done();
}
