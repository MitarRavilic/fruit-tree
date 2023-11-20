import fastify from 'fastify';
import { Application } from './modules';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
// Rest of the dependencies are instantiated within here, unless they are specific
// to a module

const app = fastify({ logger: true });
app.register(swagger, {
    mode: 'dynamic',
    openapi: {
        info: {
            title: 'Passionfruit API',
            description: 'API for Passionfruit',
            version: '0.1.0',
        },
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header',
                },
            },
        },
    },
});
app.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
    uiHooks: {
        onRequest: function (request, reply, next) {
            next();
        },
        preHandler: function (request, reply, next) {
            next();
        },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
});
app.register(Application, { prefix: '/api' });
// Documentation and others can be registered withi here

export { app };
