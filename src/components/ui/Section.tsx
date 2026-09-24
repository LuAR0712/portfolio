import type { ReactNode } from "react";
import { SECTION_IDS, type SectionId } from "@/lib/constants";
import { Container } from "./Container";

type SectionProps = {
  id: SectionId;
  title: string;
  children?: ReactNode;
};

// Title column on the left (4/12) and content on the right (8/12) from `lg`, stacked below.
// The index number follows document order, so reordering SECTION_IDS renumbers the page.
export function Section({ id, title, children }: SectionProps) {
  const titleId = `${id}-title`;
  const index = SECTION_IDS.indexOf(id) + 1;

  return (
    <section id={id} aria-labelledby={titleId} className="py-section">
      <Container className="grid grid-cols-12 gap-x-6 gap-y-10">
        <header className="col-span-12 flex items-baseline gap-4 border-t border-border pt-6 lg:col-span-4 lg:flex-col lg:gap-3">
          <span aria-hidden="true" className="font-mono text-sm text-muted tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <h2 id={titleId} className="text-h2">
            {title}
          </h2>
        </header>
        <div className="col-span-12 lg:col-span-8 lg:pt-6">{children}</div>
      </Container>
    </section>
  );
}
