import config from 'config';

import { app } from './src';

const port = config.get<number>('port');
const host = config.get<string>('host');

app.log.debug('Starting server...', { port, host });

(async () => {
    try {
        await app.ready();
        await app.listen({ port, host });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
})();
