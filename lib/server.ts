import { createServer, type Server } from 'http';
import { intializeApplication } from './app.js';
import { envConfig } from './config/env.js';

const PORT = 5000;
const application = intializeApplication();

const applicationServer = createServer(application);
const initializeServer = (server: Server) => {
        server.listen(5000, '0.0.0.0', () => {
                console.log(`server running on PORT ${PORT}`);
        });
};

process.on('SIGTERM', () => {
        applicationServer.close(() => {
                process.exit(0);
        });
});
initializeServer(applicationServer);
