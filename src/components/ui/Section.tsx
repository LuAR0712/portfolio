import type { ReactNode } from "react";
import type { SectionId } from "@/lib/constants";
import { Container } from "./Container";

type SectionProps = {
  id: SectionId;
  index: number;
  title: string;
  children?: ReactNode;
};

export function Section({ id, index, title, children }: SectionProps) {
  const titleId = `${id}-title`;

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
