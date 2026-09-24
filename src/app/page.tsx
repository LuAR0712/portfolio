// Temporary design-token preview for phase 1. Replaced by `app/[locale]/page.tsx` in phase 2.
// Labels are token identifiers (data), not user-facing copy.

const scales = ["brand", "accent", "ink"] as const;
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const semantic = ["bg", "surface", "fg", "muted", "border", "primary", "focus"] as const;
const typeScale = ["display", "h1", "h2", "h3", "lg", "base", "sm"] as const;

const typeClass: Record<(typeof typeScale)[number], string> = {
  display: "font-display text-display font-bold",
  h1: "font-display text-h1 font-bold",
  h2: "font-display text-h2 font-bold",
  h3: "font-display text-h3 font-semibold",
  lg: "text-lg",
  base: "text-base",
  sm: "text-sm",
};

export default function TokenPreview() {
  return (
    <main className="bg-grain min-h-dvh bg-mesh">
      <div className="mx-auto max-w-content space-y-section px-gutter py-section">
        <section className="space-y-6">
          {typeScale.map((token) => (
            <p key={token} className={typeClass[token]}>
              text-{token}
            </p>
          ))}
        </section>

        <section className="space-y-6">
          {scales.map((scale) => (
            <div key={scale} className="grid grid-cols-11 gap-1">
              {steps.map((step) => (
                <div key={step} className="space-y-1">
                  <div
                    className="aspect-square rounded-sm border border-border"
                    style={{ backgroundColor: `var(--color-${scale}-${step})` }}
                  />
                  <p className="font-mono text-xs text-muted">{step}</p>
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {semantic.map((token) => (
            <div key={token} className="rounded-md border border-border bg-surface p-4 shadow-soft">
              <div
                className="mb-3 h-10 rounded-sm border border-border"
                style={{ backgroundColor: `var(--color-${token})` }}
              />
              <p className="font-mono text-sm">--color-{token}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
