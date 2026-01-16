import { createServer, type Server } from 'http';
import { intializeApplication } from './app';
import { envConfig } from './config/env';

const PORT = Number(envConfig.PORT) || 3000;
const application = intializeApplication();

const applicationServer = createServer(application);
const initializeServer = (server: Server) => {
        server.listen(() => {
                console.log(`server running on ${PORT}`);
        });
};

process.on('SIGTERM', () => {
        applicationServer.close(() => {
                process.exit(1);
        });
});
initializeServer(applicationServer);
