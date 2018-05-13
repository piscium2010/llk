import http from "http";
import app from "./server";
import { apiPort } from './config'

const server = http.createServer(app);
let currentApp = app;
server.listen(apiPort,'0.0.0.0');

if (module.hot) {
    module.hot.accept("./server", () => {
        reload()
    });
    module.hot.accept("./db", () => {
        reload()
    });
    module.hot.accept("./util", () => {
        reload()
    });
    module.hot.accept("./email", () => {
        reload()
    });
}

function reload() {
    console.log(`reload`,)
    server.removeListener("request", currentApp);
    server.on("request", app);
    currentApp = app;
}