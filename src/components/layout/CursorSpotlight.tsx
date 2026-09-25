"use client";

import { useEffect, useRef } from "react";

/*
 * A "flashlight" that follows the mouse over the page background: a soft glow and a dot grid that
 * only shows inside the light. Decorative and behind all content.
 *
 * - Mouse only (`pointer: fine`): on touch there is no cursor to follow.
 * - Off with reduced motion: it's movement tied to the pointer.
 * - No React state: pointer position goes straight to two CSS variables, at most once per frame.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!node || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      node.style.setProperty("--spot-x", `${x}px`);
      node.style.setProperty("--spot-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      node.dataset.active = "true";
      frame ||= requestAnimationFrame(paint);
    };

    const onLeave = () => {
      delete node.dataset.active;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-500 data-active:opacity-100"
    >
      <div className="absolute inset-0 spotlight-glow" />
      <div className="absolute inset-0 spotlight-dots" />
    </div>
  );
}
