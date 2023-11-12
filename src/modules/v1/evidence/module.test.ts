// We can load and test each module
// individually, without the need to load the whole application

import tap from 'tap';
import fastify from 'fastify';

import { EvidenceModule } from '.';

tap.test('EvidenceModule', (t) => {
    t.plan(4);
    t.test('GET /evidence', async (t) => {
        const app = fastify();

        app.register(EvidenceModule, { prefix: '/evidence' });

        const result = await app.inject({ method: 'GET', url: '/evidence' });

        t.equal(result.statusCode, 200);
    });

    t.test('GET /evidence/:id', { todo: true }, async () => {});
    t.test('POST /evidence', { todo: true }, async () => {});
    t.test('PATCH /evidence/:id', { todo: true }, async () => {});
});
