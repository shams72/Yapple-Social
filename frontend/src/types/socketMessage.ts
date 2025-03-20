export type SocketMessage =
  | { type: "connect"; clientId: string }
  | { type: "text"; from: string; to: string; content: string }
  | { type: "ack"; for: string }
  | { type: "error"; reason: string }
  | { type: "message"; from: string; content: string };
