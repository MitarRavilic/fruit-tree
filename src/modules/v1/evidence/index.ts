import type { FastifyInstance } from 'fastify';

export function EvidenceModule(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
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
        reply.send({ hello: 'world' });
    });

    fastify.patch('/:id', async (request, reply) => {
        reply.send({ hello: 'world' });
    });

    done();
}
