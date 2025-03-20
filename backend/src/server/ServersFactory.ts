import express, { Express } from "express";
import http from "http";
import Websocket, { WebSocket } from "ws";
import { WebsocketServer } from "./WebsockerServer";
import { HttpServer } from "./HttpsServer";
import { Database } from "../Database/Database";

export class ServersFactory {
  app!: Express;

  public init(): void {
    const database = new Database();
    database.init();

    this.app = express();
    const port = process.env.PORT || 3000;
    const server = http.createServer(this.app);
    const wss: Websocket.Server = new WebSocket.Server({ server });

    const WebSocketServer: IServer = WebsocketServer.getSingletonInstance(wss);
    WebSocketServer.start();

    const HttpSeverInstance: IServer = new HttpServer(this.app);
    HttpSeverInstance.start();

    server.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  }
}
