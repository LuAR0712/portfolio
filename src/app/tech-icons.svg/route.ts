import { getTechIcon, TECH_ICON_IDS } from "@/lib/tech-icons";

// One cached SVG sprite with every technology logo as a <symbol>. Pages reference icons with
// <use href="/tech-icons.svg#id">, so path data isn't repeated inline in the HTML and the RSC payload.
export const dynamic = "force-static";

export function GET() {
  const symbols = TECH_ICON_IDS.map(
    (id) => `<symbol id="${id}" viewBox="0 0 24 24"><path d="${getTechIcon(id).path}"/></symbol>`,
  ).join("");

  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
