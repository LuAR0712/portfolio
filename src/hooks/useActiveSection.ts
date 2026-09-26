import { useEffect, useState } from "react";

/*
 * The section currently being read: the one crossing a thin band ~40–45% down the viewport.
 * IntersectionObserver instead of a scroll listener, so there's no per-frame work.
 * Returns null above the first section (the hero) and below the last one.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        setActive(ids.find((id) => intersecting.has(id)) ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
