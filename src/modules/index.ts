import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import { V1 } from './v1';

export function Application(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    fastify.register(V1, { prefix: '/v1' });
    fastify.register(swagger, {
        swagger: {
            info: {
                title: 'Passionfruit API',
                description: 'API for Passionfruit',
                version: 'v1',
            },
            basePath: '/docs',
        },
    });
    done();
}
