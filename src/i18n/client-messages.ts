import type { Messages } from "next-intl";

// Only these namespaces are sent to the browser; server components read the rest on the server.
// client-messages.test.ts fails if a "use client" component reads a namespace missing here.
export const CLIENT_NAMESPACES = ["theme", "contact.form", "nowPlaying"] as const;

export function pickClientMessages(messages: Messages): Partial<Messages> {
  return {
    theme: messages.theme,
    nowPlaying: messages.nowPlaying,
    contact: { form: messages.contact.form },
  } as Partial<Messages>;
}
