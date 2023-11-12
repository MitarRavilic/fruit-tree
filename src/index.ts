import fastify from 'fastify';

import { Application } from './modules';
// Rest of the dependencies are instantiated within here, unless they are specific
// to a module

const app = fastify({ logger: true });

app.register(Application, { prefix: '/api' });
// Documentation and others can be registered withi here

export { app };
