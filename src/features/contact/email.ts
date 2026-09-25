import { escapeHtml } from "./escape-html";
import type { ContactMessage } from "./schema";

export type ContactEmail = {
  subject: string;
  replyTo: string;
  text: string;
  html: string;
};

// Builds the notification email. Every user value is escaped for the HTML part; single-line
// fields were already normalized by the schema, so they can't carry header-injecting newlines.
export function buildContactEmail(message: ContactMessage): ContactEmail {
  const rows: [label: string, value: string | undefined][] = [
    ["Name", message.name],
    ["Email", message.email],
    ["Company", message.company],
    ["Subject", message.subject],
  ];
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]));

  const text = [...present.map(([label, value]) => `${label}: ${value}`), "", message.message].join(
    "\n",
  );

  const html = [
    '<table cellpadding="4" style="font-family:sans-serif;font-size:14px">',
    ...present.map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    ),
    "</table>",
    `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(message.message)}</p>`,
  ].join("");

  return {
    subject: `[Portfolio] ${message.subject}`,
    replyTo: message.email,
    text,
    html,
  };
}
