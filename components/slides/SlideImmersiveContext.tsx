/**
 * Whether slide shells render full-bleed (feed v2) vs card layout.
 * Location: components/slides/SlideImmersiveContext.tsx
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";

const SlideImmersiveContext = createContext(false);

export function SlideImmersiveProvider({
  immersive,
  children,
}: {
  immersive: boolean;
  children: ReactNode;
}) {
  return (
    <SlideImmersiveContext.Provider value={immersive}>{children}</SlideImmersiveContext.Provider>
  );
}

export function useSlideImmersive(): boolean {
  return useContext(SlideImmersiveContext);
}
