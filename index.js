// Sorry for not using wisp, I know bare is dumb and outdated and I promise wisp in the future.

//import needed stuff
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import http from 'node:http';
import { hostname } from "node:os";
import { createBareServer } from "@tomphttp/bare-server-node";
// wisp is being dumb
// import { createWispServer } from '@mercuryworkshop/wisp-js/server';

// const
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer('/bare/');
// define port number here
const PORT = 6969
const __dirname = process.cwd();

//file pathing & using cors and express
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use("/@", express.static(path.join(__dirname, 'public', '@')));
app.use(express.static(path.join(__dirname, 'public')));

// normal url points to html file
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/public/index.html'));
});

// bare request
server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res)
      } else {
        app(req, res)
      }
})

// bare 
server.on("upgrade", (req, socket, head) => {
    bareServer.routeRequest(req, socket, head);
});

// running!
server.on('listening', () => {
  const address = server.address();
  console.log(`Listening on port 6969.`)
})

//when stopped:
server.listen({ port: PORT, })
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
function shutdown() {
  console.log("Stopped or timed out..look in console for more information.");
  server.close();
  bareServer.close();
  process.exit(0);
}