import type { FastifyInstance } from 'fastify';
import { V1 } from './v1';

export function Application(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    fastify.register(V1, { prefix: '/v1' });
    done();
}
