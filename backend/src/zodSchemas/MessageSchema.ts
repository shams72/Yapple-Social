import { z } from "zod";

export const MessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("connect"),
    clientId: z.string().min(1, "Client-ID darf nicht leer sein"),
  }),

  z.object({
    type: z.literal("text"),
    from: z.string().min(1, "Absender darf nicht leer sein"),
    to: z.string().min(1, "Empfänger darf nicht leer sein"),
    content: z.string().min(1, "Nachrichteninhalt darf nicht leer sein"),
  }),

  z.object({
    type: z.literal("ack"),
    for: z.string().min(1, "Bestätigungsgrund muss angegeben werden"),
  }),

  z.object({
    type: z.literal("error"),
    reason: z.string().min(1, "Fehlerbeschreibung darf nicht leer sein"),
  }),

  z.object({
    type: z.literal("message"),
    from: z.string().min(1, "Absender darf nicht leer sein"),
    content: z.string().min(1, "Nachrichteninhalt darf nicht leer sein"),
  }),
]);
