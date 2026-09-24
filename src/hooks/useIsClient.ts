import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// `false` during SSR and hydration, `true` afterwards. Avoids hydration mismatches
// for values only known on the client (e.g. the resolved theme).
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
