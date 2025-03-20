import WebSocket from "ws";
import { Validator } from "../utils/Validator";
import { MessageSchema } from "../zodSchemas/MessageSchema";
import { MessageModel } from "../Models/Messages";
import { Mongoose, Schema, Types } from "mongoose";

type SimpleMessage =
  | { type: "connect"; clientId: string }
  | { type: "text"; from: string; to: string; content: string }
  | { type: "ack"; for: string }
  | { type: "error"; reason: string }
  | { type: "message"; from: string; content: string };

type messageType = "connect" | "text" | "ack" | "error" | "message";

export class WebsocketServer implements IServer {
  private static myInstance: WebsocketServer | null = null;

  private server: WebSocket.Server;
  private clients: Map<string, WebSocket[]>;
  private constructor(webSocketServer: WebSocket.Server) {
    this.server = webSocketServer;
    this.clients = new Map<string, WebSocket[]>();
  }

  static getSingletonInstance(
    webSocketServer?: WebSocket.Server
  ): WebsocketServer {
    if (!WebsocketServer.myInstance && webSocketServer) {
      WebsocketServer.myInstance = new WebsocketServer(webSocketServer);
    }
    return WebsocketServer.myInstance!;
  }

  start(): void {
    this.server.on("connection", this.clientHandler);
  }

  private sendMessage(wss: WebSocket, message: SimpleMessage) {
    if (wss.readyState && wss.OPEN) {
      wss.send(JSON.stringify(message));
    }
  }

  private onMessage = (event: WebSocket.MessageEvent) => {
    try {
      const message: SimpleMessage = JSON.parse(event.data.toString());
      const validator = new Validator(MessageSchema, message);
      console.log(message);
      validator.validate();

      const messageType = message.type;

      if (messageType == "connect") {
        const existingClients = this.clients.get(message.clientId) || [];
        const activeClients = existingClients.filter(
          (client) => client.readyState === WebSocket.OPEN
        );

        activeClients.push(event.target);
        this.clients.set(message.clientId, activeClients);
      }

      if (messageType == "text") {
        const recieverId = message.to;
        const content = message.content;
        const from = message.from;

        this.sendToClientWithId(from, recieverId, content, "message");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  public sendToClientWithId(
    from: string,
    id: string,
    message: string,
    type: messageType
  ) {
    const model = new MessageModel();
    if (type == "message") {
      model.createMessage(id, from, message).catch((err) => {
        err.message;
      });
    }

    console.log("attenping to send from ", from, " to ", id);

    const client = this.clients.get(id);
    let simpleMessage: SimpleMessage;

    if (type == "message") {
      simpleMessage = {
        type: "message",
        from: from,
        content: message,
      };
    }

    if (type == "text") {
      simpleMessage = {
        type: "text",
        from: from,
        to: id,
        content: message,
      };
    }

    for (const [id, client] of this.clients.entries()) {
      console.log(id);
    }

    if (client) {
      console.log("sending message to ", id);
      client.forEach((client) => {
        this.sendMessage(client, simpleMessage);
      });
    } else {
      console.log(client, "client is not connected");
    }
  }

  private onClose = (event: WebSocket.CloseEvent) => {
    event.target.close();

    for (const [id, client] of this.clients.entries()) {
      client.forEach((cl, index) => {
        if (cl === event.target) {
          console.log(`Removing client with id: ${id}`);
          cl.close();
          client.splice(index, 1);
        }
      });
    }
  };

  private clientHandler = (wss: WebSocket) => {
    wss.onmessage = this.onMessage;
    wss.onclose = this.onClose;
  };
}
