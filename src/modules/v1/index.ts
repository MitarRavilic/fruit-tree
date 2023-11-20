import type { FastifyInstance } from 'fastify';

import { EvidenceModule } from './evidence';
import { UsersModule } from './users';
// import fastifyMultipart from '@fastify/multipart';
export function V1(
    fastify: FastifyInstance,
    options: Record<string, unknown>,
    done: (err?: Error) => void
) {
    fastify.register(EvidenceModule, { prefix: '/evidence' });
    fastify.register(UsersModule, { prefix: '/users' });

    done();
}
