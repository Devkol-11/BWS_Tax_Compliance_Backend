import { createServer, type Server } from "http";
import { intializeApplication } from "./app";
import { envConfig } from "./config/env";

const PORT = Number(envConfig.PORT) || 3000
const application = intializeApplication()





const applicationServer = createServer(application)
const initServer = (s: Server) => {
    s.listen(() => {
        console.log(`server running on ${PORT}`)
    })
}
initServer(applicationServer)